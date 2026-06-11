import { spawn, spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { loadEnvFile } from 'node:process'
import { basename, join, resolve } from 'node:path'

if (existsSync('.env.local')) {
  loadEnvFile('.env.local')
}

const ROOT = process.cwd()
const NODE = process.execPath
const WRANGLER = join(ROOT, 'node_modules/wrangler/bin/wrangler.js')
const CODEX = process.env.CODEX_CLI_PATH || '/opt/homebrew/bin/codex'
const CLAUDE = process.env.CLAUDE_CLI_PATH || '/opt/homebrew/bin/claude'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const SCHEMA = join(ROOT, 'scripts/schemas/verb-path-batch.schema.json')
const WORK_DIR = join(ROOT, '.verb-path-generation')
const OUTPUT_DIR = join(WORK_DIR, 'outputs')
const LOG_DIR = join(WORK_DIR, 'logs')
const MIGRATIONS_DIR = join(ROOT, 'migrations')
const BATCH_SIZE = readPositiveInteger('--batch-size', 20)
const CONCURRENCY = readPositiveInteger('--concurrency', 2)
const LIMIT = readPositiveInteger('--limit', Number.POSITIVE_INFINITY)
const MAX_GENERATION_ATTEMPTS = readPositiveInteger('--attempts', 4)
const PROVIDER = readArgument('--provider') || 'codex'
const MODEL =
  readArgument('--model') || (PROVIDER === 'claude' ? 'opus' : 'gpt-5.5')
const REASONING_EFFORT = readArgument('--reasoning') || 'high'
const APPLY_REMOTE = !process.argv.includes('--local-only')
const KEEP_GOING = !process.argv.includes('--stop-on-error')
const DRY_RUN = process.argv.includes('--dry-run')
const REFRESH_V2 = process.argv.includes('--refresh-v2')
const CODEX_TIMEOUT_MS = Number(
  process.env.VERB_PATH_CODEX_TIMEOUT_MS ?? 30 * 60 * 1000,
)
let databaseQueue = Promise.resolve()

const BANNED_TERMS = [
  '及物动词',
  '不及物动词',
  '主语',
  '宾语',
  '补语',
  '定语',
  '状语',
  'SVO',
  'SVOC',
]

mkdirSync(OUTPUT_DIR, { recursive: true })
mkdirSync(LOG_DIR, { recursive: true })

function readArgument(name) {
  const inline = process.argv.find((argument) => argument.startsWith(`${name}=`))

  if (inline) {
    return inline.slice(name.length + 1)
  }

  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] ?? '' : ''
}

function readPositiveInteger(name, fallback) {
  const raw = readArgument(name)

  if (!raw) {
    return fallback
  }

  const value = Number(raw)

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`)
  }

  return value
}

function wait(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds))
}

function formatDuration(milliseconds) {
  const seconds = Math.round(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`
}

function runProcess(command, args, options = {}) {
  return new Promise((resolvePromise) => {
    const startedAt = Date.now()
    const child = spawn(command, args, {
      cwd: ROOT,
      env: {
        ...process.env,
        NO_COLOR: '1',
        FORCE_COLOR: '0',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const stdout = []
    const stderr = []
    let settled = false
    let timeoutId

    const finish = (result) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeoutId)
      resolvePromise({
        ...result,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
        durationMs: Date.now() - startedAt,
      })
    }

    child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)))
    child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)))
    child.stdin.on('error', () => {
      // A process that exits early may close stdin before the prompt is written.
    })
    child.on('error', (error) => finish({ status: null, error }))
    child.on('close', (status, signal) => finish({ status, signal }))

    timeoutId = setTimeout(() => {
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 5_000).unref()
    }, options.timeout ?? CODEX_TIMEOUT_MS)
    timeoutId.unref()

    child.stdin.end(options.input ?? '')
  })
}

async function withDatabaseLock(task) {
  const previous = databaseQueue
  let release

  databaseQueue = new Promise((resolvePromise) => {
    release = resolvePromise
  })

  await previous

  try {
    return await task()
  } finally {
    release()
  }
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function normalizeWhitespace(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

function slug(value) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase('en-US')
    .replaceAll('&', ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseWranglerJson(output) {
  const trimmed = output.trim()

  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed)
  }

  const start = output.indexOf('[\n')

  if (start >= 0) {
    return JSON.parse(output.slice(start))
  }

  throw new Error(`Could not find Wrangler JSON payload:\n${output}`)
}

async function runCommand(command, args, options = {}) {
  const attempts = options.attempts ?? 1
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = spawnSync(command, args, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: options.maxBuffer ?? 100 * 1024 * 1024,
      timeout: options.timeout ?? 10 * 60 * 1000,
      input: options.input,
      env: {
        ...process.env,
        NO_COLOR: '1',
        FORCE_COLOR: '0',
      },
      stdio: options.stdio ?? 'pipe',
    })

    if (result.status === 0) {
      return result
    }

    lastError = new Error(
      `${basename(command)} ${args.join(' ')} failed on attempt ${attempt}\n` +
        `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
    )

    if (attempt < attempts) {
      await wait(Math.min(10_000, attempt * 2_000))
    }
  }

  throw lastError
}

async function queryRemote(sql) {
  const result = await runCommand(
    NODE,
    [
      WRANGLER,
      'd1',
      'execute',
      DATABASE,
      '--remote',
      '--json',
      '--command',
      sql,
    ],
    { attempts: 5, timeout: 5 * 60 * 1000 },
  )

  return parseWranglerJson(result.stdout)[0]?.results ?? []
}

async function loadMissingVerbs() {
  const rows = await queryRemote(`SELECT
  v.id,
  v.verb,
  v.normalized_verb,
  v.meaning_zh,
  v.is_phrase
FROM verbs v
LEFT JOIN verb_paths p ON p.verb_id = v.id
WHERE p.verb_id IS NULL
ORDER BY v.id ASC;`)

  return rows.slice(0, LIMIT)
}

async function loadLegacyVerbPaths() {
  const rows = await queryRemote(`SELECT
  v.id,
  v.verb,
  v.normalized_verb,
  v.meaning_zh,
  v.is_phrase,
  p.id AS path_id,
  p.title AS path_title,
  p.meaning_zh AS path_meaning_zh,
  p.scene,
  p.growth_json
FROM verbs v
INNER JOIN verb_paths p ON p.verb_id = v.id
ORDER BY v.id ASC, p.id ASC;`)

  return rows
    .filter((row) => {
      try {
        return JSON.parse(row.growth_json)?.schema_version !== 2
      } catch {
        return true
      }
    })
    .slice(0, LIMIT)
    .map((row) => {
      let existingSteps = []

      try {
        existingSteps = JSON.parse(row.growth_json)?.steps ?? []
      } catch {
        existingSteps = []
      }

      return {
        id: row.id,
        verb: row.verb,
        normalized_verb: row.normalized_verb,
        meaning_zh: row.meaning_zh,
        is_phrase: row.is_phrase,
        path_id: row.path_id,
        existing_path: {
          title: row.path_title,
          meaning_zh: row.path_meaning_zh,
          scene: row.scene,
          steps: existingSteps.map((step) => ({
            step_no: step.step_no,
            label: step.label,
            sentence_en: step.sentence_en,
            sentence_zh: step.sentence_zh,
            note_zh: step.note_zh,
          })),
        },
      }
    })
}

async function loadGenerationTargets() {
  return REFRESH_V2 ? loadLegacyVerbPaths() : loadMissingVerbs()
}

function getNextMigrationNumber() {
  const migrationNumbers = readdirSync(MIGRATIONS_DIR)
    .map((file) => Number(file.match(/^(\d+)_/)?.[1]))
    .filter(Number.isInteger)

  return Math.max(...migrationNumbers, 0) + 1
}

function formatMigrationNumber(number) {
  return String(number).padStart(4, '0')
}

function buildPrompt(verbs, previousOutput = null, feedback = null) {
  const repairSection =
    previousOutput && feedback
      ? `
This is a repair attempt. Correct every reported issue while preserving natural,
accurate language. Return the complete corrected batch, not a patch.

VALIDATION FEEDBACK:
${JSON.stringify(feedback, null, 2)}

PREVIOUS BATCH:
${JSON.stringify(previousOutput, null, 2)}
`
      : ''

  return `You are producing publication-quality English learning data for English Orbit.
Generate exactly one sentence-growth path for every verb in INPUT VERBS.

Hard requirements:
1. Return exactly the JSON required by the supplied output schema. No prose.
2. Every requested verb_id appears exactly once; do not add or omit verbs.
3. Use the provided verb in a natural, common meaning matching its Chinese gloss.
4. Prefer a realistic developer/technical situation when natural. Use workplace or
   daily life when that produces a more authentic sentence.
5. Write original sentences. Do not quote dictionaries, books, or websites.
6. Each path has 2-10 steps. Step 1 is labeled 主干. Each later step adds one
   meaningful unit and keeps all earlier meaning.
7. Do not force every path into the same labels or number of steps.
8. Learner-facing Chinese may use 动词、主干、修饰、时间、条件、场景、方式、程度、
   原因、目的、结果、范围、对象细节. Never use 及物动词、不及物动词、主语、
   宾语、补语、定语、状语、SVO, or SVOC.
9. English must be grammatical, idiomatic, modern, concise, and logically credible.
   Chinese must be natural and match each step's exact information.
10. Set schema_version to 2. Identify every independent action or state-changing event
    as an action node. Set root_action_id to the main action that organizes the sentence.
    Never compress an embedded action, reported event, purpose action, condition action,
    or time event into a generic modifier merely to keep the tree small.
11. Give every node a short, sentence-specific label_zh such as 动作核心、嵌套动作、
    谁执行、做什么、发给谁、频率、所属、位置 / 环境、时间事件. Do not reuse one
    mechanical label set when the sentence requires a more precise description.
12. Core nodes are the essential participants or content directly brought out by an
    action. Core links go from an action node to its direct core node. A nested action
    may be the target of a core link when it is the content brought out by another action.
13. Modifier nodes contain the exact contiguous English text appearing in the step
    where they are introduced. Modifier links go from the modifier to the exact node
    it explains. A complete nested action event may also be the source of a modifier
    link when that event explains the time, reason, condition, or result of another action.
    Attach noun details to their noun node, not automatically to the root action.
14. Link IDs must be exactly "from->to". Node IDs are unique lowercase kebab-case.
15. Step 1 introduces the root action and the nodes/links required by the first core
    sentence. Later steps may introduce additional core nodes, nested action nodes,
    modifiers, and their links. show_nodes/show_links contain only newly introduced IDs.
    focus_node is visible and normally one of the newly introduced nodes.
16. Sentences end with punctuation. Keep previously introduced text verbatim
    in later English sentences so the animation remains stable.
17. title is a short English usage phrase. meaning_zh is the specific meaning used by
    this path, not every possible dictionary meaning. scene is a short lowercase slug.
18. Be especially careful with modal verbs, linking verbs, verbs normally used with a
    fixed preposition, and phrasal verbs. Never create a structure merely to satisfy a
    template.
19. If an input includes existing_path, preserve its English and Chinese step sentences
    unless they are inaccurate or ungrammatical. Re-analyze the sentence deeply and
    rebuild the node/link structure under v2 instead of casually rewriting good content.
20. Before returning, silently list every action, every direct core relationship, every
    modifier target, every shared participant, and every event-to-event relationship.
    Then proofread grammar, collocation, translation, step continuity, and every arrow
    direction. Accuracy is more important than speed or visual simplicity.

INPUT VERBS:
${JSON.stringify(verbs, null, 2)}
${repairSection}`
}

async function runCodexBatch(verbs, batchName, previousOutput, feedback, attempt) {
  const outputFile = join(OUTPUT_DIR, `${batchName}-attempt-${attempt}.json`)
  const logFile = join(LOG_DIR, `${batchName}-attempt-${attempt}.log`)
  rmSync(outputFile, { force: true })

  const prompt = buildPrompt(verbs, previousOutput, feedback)
  const result = await runProcess(
    CODEX,
    [
      'exec',
      '--ephemeral',
      '--ignore-rules',
      '--color',
      'never',
      '--sandbox',
      'read-only',
      '--cd',
      ROOT,
      '--model',
      MODEL,
      '--config',
      `model_reasoning_effort="${REASONING_EFFORT}"`,
      '--output-schema',
      SCHEMA,
      '--output-last-message',
      outputFile,
      '-',
    ],
    { timeout: CODEX_TIMEOUT_MS, input: prompt },
  )

  writeFileSync(
    logFile,
    `status=${result.status}\nerror=${result.error?.stack ?? ''}\n\nSTDOUT\n${result.stdout ?? ''}\n\nSTDERR\n${result.stderr ?? ''}`,
  )

  if (result.status !== 0 || !existsSync(outputFile)) {
    throw new Error(
      `Codex generation failed for ${batchName}, attempt ${attempt}. See ${logFile}.`,
    )
  }

  console.log(
    `[${batchName}] Codex generation finished in ${formatDuration(result.durationMs)}.`,
  )
  return JSON.parse(readFileSync(outputFile, 'utf8'))
}

async function runClaudeBatch(verbs, batchName, previousOutput, feedback, attempt) {
  const outputFile = join(OUTPUT_DIR, `${batchName}-attempt-${attempt}.json`)
  const logFile = join(LOG_DIR, `${batchName}-attempt-${attempt}.log`)
  rmSync(outputFile, { force: true })

  const prompt = buildPrompt(verbs, previousOutput, feedback)
  const schema = readFileSync(SCHEMA, 'utf8')
  const result = await runProcess(
    CLAUDE,
    [
      '-p',
      '--no-session-persistence',
      '--tools',
      'Read,Glob',
      '--model',
      MODEL,
      '--effort',
      REASONING_EFFORT,
      '--output-format',
      'json',
      '--json-schema',
      schema,
      '--max-budget-usd',
      process.env.VERB_PATH_CLAUDE_MAX_BUDGET_USD ?? '3',
    ],
    { timeout: CODEX_TIMEOUT_MS, input: prompt },
  )

  writeFileSync(
    logFile,
    `status=${result.status}\nerror=${result.error?.stack ?? ''}\n\nSTDOUT\n${result.stdout ?? ''}\n\nSTDERR\n${result.stderr ?? ''}`,
  )

  if (result.status !== 0) {
    throw new Error(
      `Claude generation failed for ${batchName}, attempt ${attempt}. See ${logFile}.`,
    )
  }

  let response

  try {
    response = JSON.parse(result.stdout)
  } catch {
    throw new Error(
      `Claude returned invalid response JSON for ${batchName}, attempt ${attempt}. See ${logFile}.`,
    )
  }

  const structuredOutput =
    response.structured_output ?? parseJsonFromModelResult(response.result)

  if (!structuredOutput) {
    throw new Error(
      `Claude returned no parseable JSON output for ${batchName}, attempt ${attempt}. See ${logFile}.`,
    )
  }

  console.log(
    `[${batchName}] Claude generation finished in ${formatDuration(result.durationMs)}.`,
  )
  writeFileSync(outputFile, JSON.stringify(structuredOutput, null, 2))
  return structuredOutput
}

function parseJsonFromModelResult(result) {
  if (typeof result !== 'string' || result.trim().length === 0) {
    return null
  }

  const fencedBlocks = [
    ...result.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi),
  ]

  for (const match of fencedBlocks) {
    try {
      return JSON.parse(match[1].trim())
    } catch {
      // Continue looking for another fenced JSON block.
    }
  }

  const firstBrace = result.indexOf('{')
  const lastBrace = result.lastIndexOf('}')

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(result.slice(firstBrace, lastBrace + 1))
    } catch {
      return null
    }
  }

  return null
}

function readClaudeLogOutput(batchName, attempt) {
  const logFile = join(LOG_DIR, `${batchName}-attempt-${attempt}.log`)

  if (!existsSync(logFile)) {
    return null
  }

  const contents = readFileSync(logFile, 'utf8')
  const stdoutStart = contents.indexOf('\nSTDOUT\n')
  const stderrStart = contents.lastIndexOf('\nSTDERR\n')

  if (stdoutStart < 0 || stderrStart <= stdoutStart) {
    return null
  }

  try {
    const response = JSON.parse(
      contents.slice(stdoutStart + '\nSTDOUT\n'.length, stderrStart).trim(),
    )
    return response.structured_output ?? parseJsonFromModelResult(response.result)
  } catch {
    return null
  }
}

function readReusableOutput(verbs, batchName, attempt, previousOutput, feedback) {
  if (attempt !== 1 || previousOutput || feedback) {
    return null
  }

  const outputFile = join(OUTPUT_DIR, `${batchName}-attempt-${attempt}.json`)

  if (existsSync(outputFile)) {
    try {
      const output = JSON.parse(readFileSync(outputFile, 'utf8'))

      if (validateGeneratedBatch(output, verbs).length === 0) {
        return output
      }
    } catch {
      // Fall through to the provider log recovery below.
    }
  }

  if (PROVIDER === 'claude') {
    const recoveredOutput = readClaudeLogOutput(batchName, attempt)

    if (
      recoveredOutput &&
      validateGeneratedBatch(recoveredOutput, verbs).length === 0
    ) {
      writeFileSync(outputFile, JSON.stringify(recoveredOutput, null, 2))
      return recoveredOutput
    }
  }

  return null
}

function validateGeneratedBatch(batch, verbs) {
  const errors = []
  const requestedIds = verbs.map((verb) => verb.id)
  const items = Array.isArray(batch?.items) ? batch.items : []
  const receivedIds = items.map((item) => item?.verb_id)

  if (items.length !== verbs.length) {
    errors.push(`Expected ${verbs.length} items, received ${items.length}.`)
  }

  for (const verbId of requestedIds) {
    if (receivedIds.filter((receivedId) => receivedId === verbId).length !== 1) {
      errors.push(`verb_id "${verbId}" must appear exactly once.`)
    }
  }

  for (const item of items) {
    const verb = verbs.find((candidate) => candidate.id === item.verb_id)

    if (!verb) {
      errors.push(`Unexpected verb_id "${item.verb_id}".`)
      continue
    }

    const nodes = Array.isArray(item.nodes) ? item.nodes : []
    const links = Array.isArray(item.links) ? item.links : []
    const steps = Array.isArray(item.steps) ? item.steps : []
    const nodeIds = new Set(nodes.map((node) => node.id))
    const nodeById = new Map(nodes.map((node) => [node.id, node]))
    const linkIds = new Set(links.map((link) => link.id))
    const actionNodes = nodes.filter((node) => node.kind === 'action')

    if (item.schema_version !== 2) {
      errors.push(`${verb.id}: schema_version must be 2.`)
    }

    if (actionNodes.length < 1) {
      errors.push(`${verb.id}: expected at least one action node.`)
    }

    if (
      !nodeIds.has(item.root_action_id) ||
      nodeById.get(item.root_action_id)?.kind !== 'action'
    ) {
      errors.push(`${verb.id}: root_action_id must reference an action node.`)
    }

    if (steps.length < 2 || steps.length > 10) {
      errors.push(`${verb.id}: expected 2-10 steps.`)
    }

    if (steps[0]?.label !== '主干') {
      errors.push(`${verb.id}: first step label must be 主干.`)
    }

    nodes.forEach((node) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.id)) {
        errors.push(`${verb.id}: invalid node id "${node.id}".`)
      }
      if (!normalizeWhitespace(node.label_zh)) {
        errors.push(`${verb.id}: node "${node.id}" needs label_zh.`)
      }
    })

    links.forEach((link) => {
      if (link.id !== `${link.from}->${link.to}`) {
        errors.push(`${verb.id}: link id must be "${link.from}->${link.to}".`)
      }
      if (!nodeIds.has(link.from) || !nodeIds.has(link.to)) {
        errors.push(`${verb.id}: link "${link.id}" has a missing endpoint.`)
      }
      const fromNode = nodeById.get(link.from)
      const toNode = nodeById.get(link.to)

      if (
        link.kind === 'core' &&
        (fromNode?.kind !== 'action' ||
          (toNode?.kind !== 'core' && toNode?.kind !== 'action'))
      ) {
        errors.push(
          `${verb.id}: core link "${link.id}" must go from an action to a core/action node.`,
        )
      }

      if (
        link.kind === 'modifier' &&
        fromNode?.kind !== 'modifier' &&
        fromNode?.kind !== 'action'
      ) {
        errors.push(
          `${verb.id}: modifier link "${link.id}" must start from a modifier or action event.`,
        )
      }
    })

    if (nodeById.get(item.root_action_id)?.kind === 'action') {
      const visualChildren = new Map()

      links.forEach((link) => {
        const parentId = link.kind === 'core' ? link.from : link.to
        const childId = link.kind === 'core' ? link.to : link.from
        const children = visualChildren.get(parentId) ?? []

        children.push(childId)
        visualChildren.set(parentId, children)
      })

      const reachableNodeIds = new Set([item.root_action_id])
      const queue = [item.root_action_id]

      while (queue.length > 0) {
        const parentId = queue.shift()

        for (const childId of visualChildren.get(parentId) ?? []) {
          if (!reachableNodeIds.has(childId)) {
            reachableNodeIds.add(childId)
            queue.push(childId)
          }
        }
      }

      const unreachableNodeIds = nodes
        .map((node) => node.id)
        .filter((nodeId) => !reachableNodeIds.has(nodeId))

      if (unreachableNodeIds.length > 0) {
        errors.push(
          `${verb.id}: nodes not connected to root_action_id: ${unreachableNodeIds.join(', ')}.`,
        )
      }
    }

    steps.forEach((step, index) => {
      if (step.step_no !== index + 1) {
        errors.push(`${verb.id}: invalid step_no at index ${index}.`)
      }
      if (!/[.!?]$/.test(normalizeWhitespace(step.sentence_en))) {
        errors.push(`${verb.id}: English step ${index + 1} lacks punctuation.`)
      }
      if (!/[。！？]$/.test(normalizeWhitespace(step.sentence_zh))) {
        errors.push(`${verb.id}: Chinese step ${index + 1} lacks punctuation.`)
      }
      for (const nodeId of step.show_nodes ?? []) {
        if (!nodeIds.has(nodeId)) {
          errors.push(`${verb.id}: step ${index + 1} references node "${nodeId}".`)
        }
      }
      for (const linkId of step.show_links ?? []) {
        if (!linkIds.has(linkId)) {
          errors.push(`${verb.id}: step ${index + 1} references link "${linkId}".`)
        }
      }
      const learnerText = `${step.label} ${step.note_zh}`
      for (const term of BANNED_TERMS) {
        if (learnerText.toLocaleLowerCase('zh-CN').includes(term.toLowerCase())) {
          errors.push(`${verb.id}: learner text contains banned term "${term}".`)
        }
      }
    })

    if (!(steps[0]?.show_nodes ?? []).includes(item.root_action_id)) {
      errors.push(`${verb.id}: first step must introduce root_action_id.`)
    }
  }

  return errors
}

function normalizeItem(item, verb) {
  const nodes = item.nodes.map((node) => ({
    ...node,
    group: node.kind,
  }))
  const steps = item.steps.map((step) => ({
    ...step,
    sentence_en: normalizeWhitespace(step.sentence_en),
    sentence_zh: normalizeWhitespace(step.sentence_zh),
    note_zh: normalizeWhitespace(step.note_zh),
  }))

  return {
    id: verb.path_id || `${verb.id}-primary`,
    verb_id: verb.id,
    verb: verb.verb,
    title: normalizeWhitespace(item.title),
    meaning_zh: normalizeWhitespace(item.meaning_zh),
    core_sentence_en: steps[0].sentence_en,
    core_sentence_zh: steps[0].sentence_zh,
    full_sentence_en: steps.at(-1).sentence_en,
    full_sentence_zh: steps.at(-1).sentence_zh,
    scene: slug(item.scene) || 'general',
    growth_json: {
      schema_version: 2,
      root_action_id: item.root_action_id,
      nodes,
      links: item.links,
      steps,
    },
  }
}

function buildInsertStatement(paths) {
  const values = paths
    .map(
      (path) => `  (
    ${sqlString(path.id)},
    ${sqlString(path.verb_id)},
    ${sqlString(path.verb)},
    ${sqlString(path.title)},
    ${sqlString(path.meaning_zh)},
    ${sqlString(path.core_sentence_en)},
    ${sqlString(path.core_sentence_zh)},
    ${sqlString(path.full_sentence_en)},
    ${sqlString(path.full_sentence_zh)},
    ${sqlString(path.scene)},
    ${sqlString(JSON.stringify(path.growth_json))}
  )`,
    )
    .join(',\n')

  return `INSERT INTO verb_paths (
  id,
  verb_id,
  verb,
  title,
  meaning_zh,
  core_sentence_en,
  core_sentence_zh,
  full_sentence_en,
  full_sentence_zh,
  scene,
  growth_json
) VALUES
${values}
ON CONFLICT(id) DO UPDATE SET
  verb_id = excluded.verb_id,
  verb = excluded.verb,
  title = excluded.title,
  meaning_zh = excluded.meaning_zh,
  core_sentence_en = excluded.core_sentence_en,
  core_sentence_zh = excluded.core_sentence_zh,
  full_sentence_en = excluded.full_sentence_en,
  full_sentence_zh = excluded.full_sentence_zh,
  scene = excluded.scene,
  growth_json = excluded.growth_json,
  updated_at = CURRENT_TIMESTAMP;`
}

function buildMigration(paths, batchName) {
  const statements = []

  for (let offset = 0; offset < paths.length; offset += 10) {
    statements.push(buildInsertStatement(paths.slice(offset, offset + 10)))
  }

  return `-- Generated verb paths batch ${batchName}.
-- Generated under docs/verb-sentence-growth-standard.md.

PRAGMA foreign_keys = ON;

${statements.join('\n\n')}
`
}

async function applySql(file, remote) {
  await runCommand(
    NODE,
    [
      WRANGLER,
      'd1',
      'execute',
      DATABASE,
      remote ? '--remote' : '--local',
      '--yes',
      '--file',
      file,
    ],
    { attempts: remote ? 8 : 2, timeout: 10 * 60 * 1000 },
  )
}

async function deleteLocalPaths(pathIds) {
  if (pathIds.length === 0) {
    return
  }

  await runCommand(
    NODE,
    [
      WRANGLER,
      'd1',
      'execute',
      DATABASE,
      '--local',
      '--command',
      `DELETE FROM verb_paths WHERE id IN (${pathIds.map(sqlString).join(', ')});`,
    ],
    { attempts: 2 },
  )
}

async function validateLocal(verbs) {
  const result = await runCommand(
    NODE,
    [
      join(ROOT, 'scripts/check-verb-paths.mjs'),
      '--local',
      '--strict',
      '--json',
      '--verbs',
      verbs.map((verb) => verb.id).join(','),
    ],
    { timeout: 10 * 60 * 1000 },
  )

  return JSON.parse(result.stdout)
}

async function validateRemote() {
  const result = await runCommand(
    NODE,
    [
      join(ROOT, 'scripts/check-verb-paths.mjs'),
      '--remote',
      '--strict',
      '--json',
    ],
    { attempts: 3, timeout: 20 * 60 * 1000 },
  )

  return JSON.parse(result.stdout)
}

async function generateValidatedBatch(verbs, batchName, migrationFile) {
  let previousOutput = null
  let feedback = null

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    console.log(
      `[${batchName}] generation attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`,
    )

    try {
      const reusableOutput = readReusableOutput(
        verbs,
        batchName,
        attempt,
        previousOutput,
        feedback,
      )
      const output =
        reusableOutput ??
        (PROVIDER === 'claude'
          ? await runClaudeBatch(
              verbs,
              batchName,
              previousOutput,
              feedback,
              attempt,
            )
          : await runCodexBatch(
              verbs,
              batchName,
              previousOutput,
              feedback,
              attempt,
            ))

      if (reusableOutput) {
        console.log(`[${batchName}] reusing previously generated structured output.`)
      }
      const basicErrors = validateGeneratedBatch(output, verbs)

      if (basicErrors.length > 0) {
        previousOutput = output
        feedback = basicErrors
        console.log(`[${batchName}] structural precheck found ${basicErrors.length} issues.`)
        continue
      }

      const itemByVerbId = new Map(output.items.map((item) => [item.verb_id, item]))
      const paths = verbs.map((verb) => normalizeItem(itemByVerbId.get(verb.id), verb))
      writeFileSync(migrationFile, buildMigration(paths, batchName))

      try {
        const summary = await withDatabaseLock(async () => {
          await applySql(migrationFile, false)

          try {
            return await validateLocal(verbs)
          } catch (error) {
            await deleteLocalPaths(paths.map((path) => path.id))
            throw error
          }
        })

        console.log(
          `[${batchName}] local strict validation: ${summary.errorCount} errors, ${summary.warningCount} warnings.`,
        )
        return paths
      } catch (error) {
        const outputText = String(error.message)
        let validationFeedback = outputText

        try {
          const jsonStart = outputText.indexOf('{')
          const parsed = JSON.parse(outputText.slice(jsonStart))
          validationFeedback = [...(parsed.errors ?? []), ...(parsed.warnings ?? [])]
        } catch {
          // Preserve the original command output when it is not clean JSON.
        }

        rmSync(migrationFile, { force: true })
        previousOutput = output
        feedback = validationFeedback
        console.log(`[${batchName}] local strict validation failed; regenerating.`)
      }
    } catch (error) {
      feedback = [String(error.message)]
      console.error(`[${batchName}] ${error.message}`)
    }
  }

  throw new Error(
    `[${batchName}] could not produce a valid batch after ${MAX_GENERATION_ATTEMPTS} attempts.`,
  )
}

async function main() {
  if (PROVIDER !== 'codex' && PROVIDER !== 'claude') {
    throw new Error('--provider must be codex or claude.')
  }

  if (PROVIDER === 'codex' && !existsSync(CODEX)) {
    throw new Error(`Codex CLI not found at ${CODEX}.`)
  }

  if (PROVIDER === 'claude' && !existsSync(CLAUDE)) {
    throw new Error(`Claude CLI not found at ${CLAUDE}.`)
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is not configured.')
  }

  const missingVerbs = await loadGenerationTargets()

  if (missingVerbs.length === 0) {
    console.log(
      REFRESH_V2
        ? 'All verb paths already use growth_json v2. Running final remote validation.'
        : 'All verbs already have a path. Running final remote validation.',
    )
    const summary = await validateRemote()
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  console.log(
    `Starting ${missingVerbs.length} ${
      REFRESH_V2 ? 'legacy paths for v2 refresh' : 'missing verbs'
    } in batches of ${BATCH_SIZE}. ` +
      `provider=${PROVIDER}, model=${MODEL}, reasoning=${REASONING_EFFORT}, ` +
      `concurrency=${CONCURRENCY}, remote=${APPLY_REMOTE && !DRY_RUN}.`,
  )

  let migrationNumber = getNextMigrationNumber()
  let completed = 0
  const failures = []
  const batches = []

  for (let offset = 0; offset < missingVerbs.length; offset += BATCH_SIZE) {
    const verbs = missingVerbs.slice(offset, offset + BATCH_SIZE)
    const batchIndex = Math.floor(offset / BATCH_SIZE) + 1
    const batchName = `batch-${String(batchIndex).padStart(3, '0')}`
    const currentMigrationNumber = migrationNumber
    migrationNumber += 1
    const migrationName =
      `${formatMigrationNumber(currentMigrationNumber)}_verb_paths_` +
      `${String(batchIndex).padStart(3, '0')}.sql`
    const migrationFile = join(MIGRATIONS_DIR, migrationName)

    batches.push({ verbs, batchName, migrationFile })
  }

  let nextBatchIndex = 0

  const processNextBatch = async () => {
    while (nextBatchIndex < batches.length) {
      const currentIndex = nextBatchIndex
      nextBatchIndex += 1
      const { verbs, batchName, migrationFile } = batches[currentIndex]

      console.log(
        `\n[${batchName}] ${verbs[0].id} ... ${verbs.at(-1).id} (${verbs.length} verbs)`,
      )

      try {
        const paths = await generateValidatedBatch(verbs, batchName, migrationFile)

        if (DRY_RUN) {
          console.log(`[${batchName}] dry run complete; remote write skipped.`)
        } else if (APPLY_REMOTE) {
          await withDatabaseLock(async () => {
            await applySql(migrationFile, true)
            const remoteRows = await queryRemote(`SELECT COUNT(*) AS total
FROM verb_paths
WHERE id IN (${paths.map((path) => sqlString(path.id)).join(', ')});`)
            const remoteCount = Number(remoteRows[0]?.total ?? 0)

            if (remoteCount !== paths.length) {
              throw new Error(
                `[${batchName}] remote count mismatch: expected ${paths.length}, got ${remoteCount}.`,
              )
            }

            console.log(`[${batchName}] applied to remote D1 (${remoteCount} paths).`)
          })
        }

        completed += verbs.length
        console.log(
          `[${batchName}] complete. Progress: ${completed}/${missingVerbs.length}.`,
        )
      } catch (error) {
        failures.push({
          batchName,
          verbIds: verbs.map((verb) => verb.id),
          error: String(error.message),
        })
        console.error(`[${batchName}] FAILED: ${error.message}`)

        if (!KEEP_GOING) {
          throw error
        }
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(CONCURRENCY, batches.length) },
      () => processNextBatch(),
    ),
  )

  if (failures.length > 0) {
    writeFileSync(
      join(WORK_DIR, 'failures.json'),
      JSON.stringify(failures, null, 2),
    )
    throw new Error(
      `${failures.length} batches failed. Re-run the command to resume missing verbs.`,
    )
  }

  if (!DRY_RUN && APPLY_REMOTE) {
    const remainingRows = await queryRemote(
      REFRESH_V2
        ? `SELECT COUNT(*) AS total
FROM verb_paths
WHERE COALESCE(json_extract(growth_json, '$.schema_version'), 0) <> 2;`
        : `SELECT COUNT(*) AS total
FROM verbs v
LEFT JOIN verb_paths p ON p.verb_id = v.id
WHERE p.verb_id IS NULL;`,
    )
    const remaining = Number(remainingRows[0]?.total ?? 0)

    if (remaining !== 0) {
      throw new Error(
        REFRESH_V2
          ? `${remaining} verb paths still do not use growth_json v2.`
          : `${remaining} verbs still have no path after generation.`,
      )
    }

    const summary = await validateRemote()
    console.log(
      `\nFinal remote validation passed: ${summary.checkedPaths} paths, ` +
        `${summary.errorCount} errors, ${summary.warningCount} warnings.`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
