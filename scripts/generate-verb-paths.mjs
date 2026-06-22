import { spawn, spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
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
const SQL_OUTPUT_DIR = join(WORK_DIR, 'sql')
const BATCH_SIZE = readPositiveInteger('--batch-size', 20)
const CONCURRENCY = readPositiveInteger('--concurrency', 2)
const LIMIT = readPositiveInteger('--limit', Number.POSITIVE_INFINITY)
const MAX_GENERATION_ATTEMPTS = readPositiveInteger('--attempts', 4)
const PROVIDER = readArgument('--provider') || 'codex'
const MODEL =
  readArgument('--model') || (PROVIDER === 'claude' ? 'opus' : 'gpt-5.5')
const REASONING_EFFORT = readArgument('--reasoning') || 'high'
const FIXTURE_FILE = readArgument('--fixture')
const APPLY_REMOTE = FIXTURE_FILE
  ? process.argv.includes('--remote')
  : !process.argv.includes('--local-only')
const KEEP_GOING = !process.argv.includes('--stop-on-error')
const DRY_RUN = process.argv.includes('--dry-run')
const REFRESH_V2 = process.argv.includes('--refresh-v2')
const FRESH_GENERATION = process.argv.includes('--fresh')
const SKIP_FINAL_VALIDATION = process.argv.includes('--skip-final-validation')
const IS_LIMITED_RUN = Number.isFinite(LIMIT)
const CODEX_TIMEOUT_MS = Number(
  process.env.VERB_PATH_CODEX_TIMEOUT_MS ?? 30 * 60 * 1000,
)
let databaseQueue = Promise.resolve()

class UsageLimitError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UsageLimitError'
  }
}

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
const RELATION_TYPES = new Set([
  'actor',
  'target',
  'recipient',
  'content',
  'nested_action',
  'shared_actor',
  'ownership',
  'category',
  'quality',
  'frequency',
  'time',
  'place',
  'condition',
  'purpose',
  'reason',
  'manner',
  'degree',
  'scope',
  'result',
  'sequence',
])

mkdirSync(OUTPUT_DIR, { recursive: true })
mkdirSync(LOG_DIR, { recursive: true })
mkdirSync(SQL_OUTPUT_DIR, { recursive: true })

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

async function queryDatabase(sql, remote) {
  const result = await runCommand(
    NODE,
    [
      WRANGLER,
      'd1',
      'execute',
      DATABASE,
      remote ? '--remote' : '--local',
      '--json',
      '--command',
      sql,
    ],
    { attempts: remote ? 5 : 2, timeout: 5 * 60 * 1000 },
  )

  return parseWranglerJson(result.stdout)[0]?.results ?? []
}

async function queryRemote(sql) {
  return queryDatabase(sql, true)
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

async function loadRefreshTargets() {
  const rows = await queryRemote(`SELECT
  v.id,
  v.verb,
  v.normalized_verb,
  v.meaning_zh,
  v.is_phrase,
  p.id AS path_id
FROM verbs v
INNER JOIN verb_paths p ON p.verb_id = v.id
WHERE CASE
  WHEN json_valid(p.growth_json) = 1
    THEN COALESCE(json_extract(p.growth_json, '$.schema_version'), 0)
  ELSE 0
END <> 2
ORDER BY v.id ASC, p.id ASC;`)

  return rows.slice(0, LIMIT)
}

async function loadGenerationTargets() {
  return REFRESH_V2 ? loadRefreshTargets() : loadMissingVerbs()
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
   meaningful unit and keeps all earlier meaning. Decide the number and order of
   steps from this sentence; never begin from a standard growth sequence.
7. Do not reuse sentence frames, scenes, node boundaries, tree shapes, labels,
   step sequences, translations, or teaching notes across items merely by replacing
   verbs and nouns. Every content field must be freshly reasoned from this verb and
   this sentence. Only the JSON protocol itself is fixed.
8. Learner-facing Chinese may use 动词、主干、修饰、时间、条件、场景、方式、程度、
   原因、目的、结果、范围、对象细节. Never use 及物动词、不及物动词、主语、
   宾语、补语、定语、状语、SVO, or SVOC.
9. English must be grammatical, idiomatic, modern, concise, and logically credible.
   Chinese must be natural and match each step's exact information.
10. Set schema_version to 2. Identify every independent action or state-changing event
    as an action node. Set root_action_id to the main action that organizes the sentence.
    Never compress an embedded action, reported event, purpose action, condition action,
    or time event into a generic modifier merely to keep the tree small.
11. Give every node a short label_zh that explains its precise role in this exact
    sentence. Do not map kind or relation_type to generic Chinese labels. A label must
    answer a sentence-specific question such as who requested access, which result is
    cached, or when the configuration changed. Generate every label independently.
12. Core nodes are the essential participants or content directly brought out by an
    action. Core links go from an action node to its direct core node. A nested action
    may be the target of a core link when it is the content brought out by another action.
13. Modifier nodes contain the exact contiguous English text appearing in the step
    where they are introduced. Modifier links go from the modifier to the exact node
    it explains. A complete nested action event may also be the source of a modifier
    link when that event explains the time, reason, condition, or result of another action.
    Attach noun details to their noun node, not automatically to the root action.
14. Link IDs must be exactly "from->to". Node IDs are unique lowercase kebab-case.
    Every link has relation_type and label_zh. relation_type is the internal structural
    category; label_zh independently explains the exact relationship in natural Chinese.
    Never translate relation_type mechanically to obtain label_zh.
15. Step 1 introduces the root action and the nodes/links required by the first core
    sentence. Later steps may introduce additional core nodes, nested action nodes,
    modifiers, and their links. add_node_ids/add_link_ids contain only newly introduced
    IDs. focus_node_id is visible and normally one of the newly introduced nodes.
16. Sentences end with punctuation. Keep previously introduced text verbatim
    in later English sentences so the animation remains stable.
17. title is a short English usage phrase. meaning_zh is the specific meaning used by
    this path, not every possible dictionary meaning. scene is a short lowercase slug.
18. Be especially careful with modal verbs, linking verbs, verbs normally used with a
    fixed preposition, and phrasal verbs. Never create a structure merely to satisfy a
    template.
19. Ignore every previous verb_paths sentence and growth tree. INPUT VERBS is the only
    content source. Build the title, meaning, scene, sentences, translation, nodes,
    links, labels, relation types, steps, ordering, focus, and notes from scratch.
20. Before returning, silently list every action, every direct core relationship, every
    modifier target, every shared participant, and every event-to-event relationship.
    Then proofread grammar, collocation, translation, step continuity, and every arrow
    direction. Compare all items in this batch and rewrite any suspiciously repeated
    sentence frame, tree structure, label set, or note pattern. Accuracy and independent
    reasoning are more important than speed or visual simplicity.

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
    if (/usage limit|session limit|try again at/i.test(result.stderr ?? '')) {
      const resetMessage =
        result.stderr
          ?.split('\n')
          .find((line) => /usage limit|session limit|try again at/i.test(line))
          ?.trim() ?? 'Generation provider usage limit reached.'

      throw new UsageLimitError(resetMessage)
    }

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
    if (/usage limit|session limit|resets/i.test(result.stdout ?? '')) {
      throw new UsageLimitError('Claude generation session limit reached.')
    }

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

  if (
    response?.is_error &&
    (response?.api_error_status === 429 ||
      /usage limit|session limit|resets/i.test(response?.result ?? ''))
  ) {
    throw new UsageLimitError(
      normalizeWhitespace(response.result) ||
        'Claude generation session limit reached.',
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
  if (FRESH_GENERATION) {
    return null
  }

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
      if (!RELATION_TYPES.has(link.relation_type)) {
        errors.push(
          `${verb.id}: link "${link.id}" has invalid relation_type "${link.relation_type}".`,
        )
      }
      if (!normalizeWhitespace(link.label_zh)) {
        errors.push(`${verb.id}: link "${link.id}" needs label_zh.`)
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
      if (
        link.relation_type === 'nested_action' &&
        (fromNode?.kind !== 'action' || toNode?.kind !== 'action')
      ) {
        errors.push(
          `${verb.id}: nested_action link "${link.id}" must connect two action nodes.`,
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
      for (const nodeId of step.add_node_ids ?? []) {
        if (!nodeIds.has(nodeId)) {
          errors.push(`${verb.id}: step ${index + 1} references node "${nodeId}".`)
        }
      }
      for (const linkId of step.add_link_ids ?? []) {
        if (!linkIds.has(linkId)) {
          errors.push(`${verb.id}: step ${index + 1} references link "${linkId}".`)
        }
      }
      if (!nodeIds.has(step.focus_node_id)) {
        errors.push(
          `${verb.id}: step ${index + 1} has invalid focus_node_id "${step.focus_node_id}".`,
        )
      }
      const learnerText = `${step.label} ${step.note_zh}`
      for (const term of BANNED_TERMS) {
        if (learnerText.toLocaleLowerCase('zh-CN').includes(term.toLowerCase())) {
          errors.push(`${verb.id}: learner text contains banned term "${term}".`)
        }
      }
    })

    if (!(steps[0]?.add_node_ids ?? []).includes(item.root_action_id)) {
      errors.push(`${verb.id}: first step must introduce root_action_id.`)
    }
  }

  return errors
}

function normalizeItem(item, verb) {
  const nodes = item.nodes.map((node) => ({
    ...node,
    text: normalizeWhitespace(node.text),
    label_zh: normalizeWhitespace(node.label_zh),
  }))
  const links = item.links.map((link) => ({
    ...link,
    label_zh: normalizeWhitespace(link.label_zh),
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
      links,
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

function buildPathUpsertSql(paths, batchName) {
  const statements = []

  for (let offset = 0; offset < paths.length; offset += 10) {
    statements.push(buildInsertStatement(paths.slice(offset, offset + 10)))
  }

  return `-- Generated verb paths batch ${batchName}.
-- Generated under docs/verb-sentence-growth-standard.md.
-- Temporary execution file; the repository no longer stores SQL migrations.

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

async function syncLocalVerbMetadata(verbs) {
  if (verbs.length === 0) {
    return
  }

  const sqlFile = join(WORK_DIR, 'sync-local-verb-metadata.sql')
  const statements = verbs.map(
    (verb) => `UPDATE verbs SET
  verb = ${sqlString(verb.verb)},
  normalized_verb = ${sqlString(verb.normalized_verb)},
  meaning_zh = ${sqlString(verb.meaning_zh)},
  is_phrase = ${Number(verb.is_phrase) || 0}
WHERE id = ${sqlString(verb.id)};`,
  )

  writeFileSync(
    sqlFile,
    `-- Keep local validation metadata aligned with remote D1.\n\n${statements.join('\n\n')}\n`,
  )

  try {
    await withDatabaseLock(async () => {
      await applySql(sqlFile, false)
    })
  } finally {
    rmSync(sqlFile, { force: true })
  }

  console.log(
    `Synced ${verbs.length} local verb records with remote metadata for validation.`,
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

async function validatePaths(verbs, remote) {
  const result = await runCommand(
    NODE,
    [
      join(ROOT, 'scripts/check-verb-paths.mjs'),
      remote ? '--remote' : '--local',
      '--strict',
      '--require-v2',
      '--json',
      '--verbs',
      verbs.map((verb) => verb.id).join(','),
    ],
    {
      attempts: remote ? 3 : 1,
      timeout: remote ? 20 * 60 * 1000 : 10 * 60 * 1000,
    },
  )

  return JSON.parse(result.stdout)
}

async function applyFixture() {
  const fixturePath = resolve(ROOT, FIXTURE_FILE)

  if (!existsSync(fixturePath)) {
    throw new Error(`Fixture file not found: ${fixturePath}`)
  }

  let output

  try {
    output = JSON.parse(readFileSync(fixturePath, 'utf8'))
  } catch (error) {
    throw new Error(`Fixture is not valid JSON: ${error.message}`)
  }

  const fixtureItems = Array.isArray(output?.items) ? output.items : []
  const fixtureVerbIds = fixtureItems
    .map((item) => normalizeWhitespace(item?.verb_id))
    .filter(Boolean)

  if (fixtureVerbIds.length === 0) {
    throw new Error('Fixture must contain at least one item.')
  }

  if (new Set(fixtureVerbIds).size !== fixtureVerbIds.length) {
    throw new Error('Fixture contains duplicate verb_id values.')
  }

  const verbs = await queryDatabase(
    `SELECT
  v.id,
  v.verb,
  v.normalized_verb,
  v.meaning_zh,
  v.is_phrase,
  p.id AS path_id
FROM verbs v
LEFT JOIN verb_paths p ON p.verb_id = v.id
WHERE v.id IN (${fixtureVerbIds.map(sqlString).join(', ')})
ORDER BY v.id ASC;`,
    APPLY_REMOTE,
  )
  const loadedVerbIds = new Set(verbs.map((verb) => verb.id))
  const missingVerbIds = fixtureVerbIds.filter(
    (verbId) => !loadedVerbIds.has(verbId),
  )

  if (missingVerbIds.length > 0) {
    throw new Error(
      `Fixture verb IDs do not exist in ${APPLY_REMOTE ? 'remote' : 'local'} D1: ` +
        `${missingVerbIds.join(', ')}`,
    )
  }

  const basicErrors = validateGeneratedBatch(output, verbs)

  if (basicErrors.length > 0) {
    throw new Error(
      `Fixture structural validation failed:\n- ${basicErrors.join('\n- ')}`,
    )
  }

  const itemByVerbId = new Map(
    fixtureItems.map((item) => [item.verb_id, item]),
  )
  const paths = verbs.map((verb) =>
    normalizeItem(itemByVerbId.get(verb.id), verb),
  )
  const fixtureName = slug(basename(fixturePath).replace(/\.json$/i, ''))
  const sqlFile = join(SQL_OUTPUT_DIR, `${fixtureName || 'verb-path-fixture'}.sql`)

  writeFileSync(sqlFile, buildPathUpsertSql(paths, `fixture-${fixtureName}`))
  await applySql(sqlFile, APPLY_REMOTE)

  const summary = await validatePaths(verbs, APPLY_REMOTE)

  console.log(
    `Fixture applied to ${APPLY_REMOTE ? 'remote' : 'local'} D1: ` +
      `${summary.checkedPaths} paths, ${summary.errorCount} errors, ` +
      `${summary.warningCount} warnings.`,
  )
}

async function generateValidatedBatch(verbs, batchName, sqlFile) {
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
      writeFileSync(sqlFile, buildPathUpsertSql(paths, batchName))

      try {
        const summary = await withDatabaseLock(async () => {
          await applySql(sqlFile, false)

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

        rmSync(sqlFile, { force: true })
        previousOutput = output
        feedback = validationFeedback
        console.log(`[${batchName}] local strict validation failed; regenerating.`)
      }
    } catch (error) {
      if (error instanceof UsageLimitError) {
        throw error
      }

      feedback = [String(error.message)]
      console.error(`[${batchName}] ${error.message}`)
    }
  }

  throw new Error(
    `[${batchName}] could not produce a valid batch after ${MAX_GENERATION_ATTEMPTS} attempts.`,
  )
}

async function main() {
  if (FIXTURE_FILE) {
    await applyFixture()
    return
  }

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
    if (SKIP_FINAL_VALIDATION) {
      console.log(
        REFRESH_V2
          ? 'All verb paths already use growth_json v2.'
          : 'All verbs already have a path.',
      )
      return
    }

    console.log(
      REFRESH_V2
        ? 'All verb paths already use growth_json v2. Running final remote validation.'
        : 'All verbs already have a path. Running final remote validation.',
    )
    const summary = await validateRemote()
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  await syncLocalVerbMetadata(missingVerbs)

  console.log(
    `Starting ${missingVerbs.length} ${
      REFRESH_V2 ? 'legacy paths for v2 refresh' : 'missing verbs'
    } in batches of ${BATCH_SIZE}. ` +
      `provider=${PROVIDER}, model=${MODEL}, reasoning=${REASONING_EFFORT}, ` +
      `concurrency=${CONCURRENCY}, remote=${APPLY_REMOTE && !DRY_RUN}.`,
  )

  let completed = 0
  const failures = []
  const batches = []
  const runId = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')

  for (let offset = 0; offset < missingVerbs.length; offset += BATCH_SIZE) {
    const verbs = missingVerbs.slice(offset, offset + BATCH_SIZE)
    const batchIndex = Math.floor(offset / BATCH_SIZE) + 1
    const batchName = `batch-${String(batchIndex).padStart(3, '0')}`
    const sqlFile = join(SQL_OUTPUT_DIR, `${runId}-${batchName}-verb-paths.sql`)

    batches.push({ verbs, batchName, sqlFile })
  }

  let nextBatchIndex = 0

  const processNextBatch = async () => {
    while (nextBatchIndex < batches.length) {
      const currentIndex = nextBatchIndex
      nextBatchIndex += 1
      const { verbs, batchName, sqlFile } = batches[currentIndex]

      console.log(
        `\n[${batchName}] ${verbs[0].id} ... ${verbs.at(-1).id} (${verbs.length} verbs)`,
      )

      try {
        const paths = await generateValidatedBatch(verbs, batchName, sqlFile)

        if (DRY_RUN) {
          console.log(`[${batchName}] dry run complete; remote write skipped.`)
        } else if (APPLY_REMOTE) {
          await withDatabaseLock(async () => {
            await applySql(sqlFile, true)
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
        if (error instanceof UsageLimitError) {
          throw error
        }

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
    if (IS_LIMITED_RUN) {
      console.log(
        `\nLimited run complete: ${completed} newly generated paths were validated ` +
          'locally and written to remote D1. Historical paths were not revalidated.',
      )
      return
    }

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

    if (SKIP_FINAL_VALIDATION) {
      console.log(
        '\nAll requested paths were generated. Historical paths were not revalidated.',
      )
      return
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
