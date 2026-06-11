import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

if (existsSync('.env.local')) {
  loadEnvFile('.env.local')
}

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const JSON_OUTPUT = process.argv.includes('--json')
const STRICT = process.argv.includes('--strict')
const REQUIRE_V2 = process.argv.includes('--require-v2')
const USE_LOCAL = process.argv.includes('--local')
const USE_REMOTE = process.argv.includes('--remote')
const D1_LOCATION_FLAG = USE_REMOTE ? '--remote' : '--local'
const D1_LOCATION_LABEL = USE_REMOTE ? 'remote' : 'local'
const WRANGLER_ATTEMPTS = Number(process.env.VERB_PATH_CHECK_ATTEMPTS ?? '4')
const PAGE_SIZE = Number(process.env.VERB_PATH_CHECK_PAGE_SIZE ?? '50')
const VERB_FILTER = getArgumentValue('--verb')
const VERB_FILTERS = getArgumentValue('--verbs')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const NODE_KINDS = new Set(['action', 'core', 'modifier'])
const LINK_KINDS = new Set(['core', 'modifier'])
const BANNED_LEARNER_TERMS = [
  '及物动词',
  '不及物动词',
  '主语',
  '宾语',
  '补语',
  '定语',
  '状语',
  'svo',
  'svoc',
]

if (USE_LOCAL && USE_REMOTE) {
  throw new Error('Use either --local or --remote, not both.')
}

if (!Number.isInteger(WRANGLER_ATTEMPTS) || WRANGLER_ATTEMPTS < 1) {
  throw new Error('VERB_PATH_CHECK_ATTEMPTS must be a positive integer.')
}

if (!Number.isInteger(PAGE_SIZE) || PAGE_SIZE < 1 || PAGE_SIZE > 200) {
  throw new Error('VERB_PATH_CHECK_PAGE_SIZE must be an integer from 1 to 200.')
}

function getArgumentValue(name) {
  const prefix = `${name}=`
  const inlineArgument = process.argv.find((argument) => argument.startsWith(prefix))

  if (inlineArgument) {
    return inlineArgument.slice(prefix.length).trim()
  }

  const argumentIndex = process.argv.indexOf(name)

  if (argumentIndex >= 0) {
    return process.argv[argumentIndex + 1]?.trim() ?? ''
  }

  return ''
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function normalizeWhitespace(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function normalizedLowercase(value) {
  return normalizeWhitespace(value).toLocaleLowerCase('en-US')
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function unique(values) {
  return new Set(values).size === values.length
}

function containsText(sentence, text) {
  return normalizedLowercase(sentence).includes(normalizedLowercase(text))
}

async function runWrangler(args) {
  let lastError = null

  for (let attempt = 1; attempt <= WRANGLER_ATTEMPTS; attempt += 1) {
    const result = spawnSync(NODE, [WRANGLER, ...args], {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 30 * 1024 * 1024,
      stdio: 'pipe',
    })

    if (result.status === 0) {
      return result.stdout ?? ''
    }

    lastError = new Error(
      `wrangler ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )

    if (attempt < WRANGLER_ATTEMPTS) {
      await wait(1000 * attempt)
    }
  }

  throw lastError
}

function parseWranglerJson(output) {
  const trimmed = output.trim()

  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed)
  }

  const start = output.indexOf('[\n')

  if (start !== -1) {
    return JSON.parse(output.slice(start))
  }

  throw new Error(`Could not find JSON payload in Wrangler output:\n${output}`)
}

async function query(sql) {
  const output = await runWrangler([
    'd1',
    'execute',
    DATABASE,
    D1_LOCATION_FLAG,
    '--json',
    '--command',
    sql,
  ])
  const payload = parseWranglerJson(output)

  return payload[0]?.results ?? []
}

async function assertSchema() {
  const requiredTables = ['verbs', 'verb_paths']
  const tableRows = await query(`SELECT name
FROM sqlite_master
WHERE type = 'table'
  AND name IN (${requiredTables.map(sqlString).join(', ')});`)
  const existingTables = new Set(tableRows.map((row) => row.name))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))

  if (missingTables.length > 0) {
    throw new Error(
      `Missing required tables: ${missingTables.join(', ')}. Apply D1 migrations first.`,
    )
  }

  const requiredColumns = {
    verbs: ['id', 'verb', 'normalized_verb', 'meaning_zh', 'is_phrase'],
    verb_paths: [
      'id',
      'verb_id',
      'verb',
      'title',
      'meaning_zh',
      'core_sentence_en',
      'core_sentence_zh',
      'full_sentence_en',
      'full_sentence_zh',
      'scene',
      'growth_json',
    ],
  }

  for (const [table, columns] of Object.entries(requiredColumns)) {
    const rows = await query(`PRAGMA table_info(${table});`)
    const existingColumns = new Set(rows.map((row) => row.name))
    const missingColumns = columns.filter((column) => !existingColumns.has(column))

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing ${table} columns: ${missingColumns.join(', ')}. Apply D1 migrations first.`,
      )
    }
  }
}

async function loadVerbs() {
  return query(`SELECT id, verb, normalized_verb, meaning_zh, is_phrase
FROM verbs
ORDER BY id ASC;`)
}

async function loadVerbPaths() {
  const filterSql = VERB_FILTER
    ? `WHERE p.verb_id = ${sqlString(VERB_FILTER)}
       OR p.verb = ${sqlString(VERB_FILTER)}
       OR p.id = ${sqlString(VERB_FILTER)}`
    : VERB_FILTERS.length > 0
      ? `WHERE p.verb_id IN (${[...new Set(VERB_FILTERS)].map(sqlString).join(', ')})`
      : ''
  const countRows = await query(`SELECT COUNT(*) AS total
FROM verb_paths p
${filterSql};`)
  const total = Number(countRows[0]?.total ?? 0)
  const rows = []

  for (let offset = 0; offset < total; offset += PAGE_SIZE) {
    const pageRows = await query(`SELECT
  p.id,
  p.verb_id,
  p.verb,
  p.title,
  p.meaning_zh,
  p.core_sentence_en,
  p.core_sentence_zh,
  p.full_sentence_en,
  p.full_sentence_zh,
  p.scene,
  p.growth_json
FROM verb_paths p
${filterSql}
ORDER BY p.id ASC
LIMIT ${PAGE_SIZE}
OFFSET ${offset};`)

    rows.push(...pageRows)
  }

  return { rows, total }
}

function createCollector(path) {
  const errors = []
  const warnings = []

  const add = (severity, code, message, context = {}) => {
    const issue = {
      severity,
      code,
      pathId: path?.id ?? null,
      verbId: path?.verb_id ?? null,
      message,
      ...context,
    }

    if (severity === 'error') {
      errors.push(issue)
    } else {
      warnings.push(issue)
    }
  }

  return {
    errors,
    warnings,
    error(code, message, context) {
      add('error', code, message, context)
    },
    warning(code, message, context) {
      add('warning', code, message, context)
    },
  }
}

function parseJsonField(path, field, collector) {
  const rawValue = path[field]

  if (!isNonEmptyString(rawValue)) {
    collector.error('EMPTY_JSON_FIELD', `${field} is empty.`, { field })
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch (error) {
    collector.error('INVALID_JSON', `${field} is not valid JSON: ${error.message}`, {
      field,
    })
    return null
  }
}

function validatePathFields(path, verb, collector) {
  const requiredFields = [
    'id',
    'verb_id',
    'verb',
    'title',
    'meaning_zh',
    'core_sentence_en',
    'core_sentence_zh',
    'full_sentence_en',
    'full_sentence_zh',
    'scene',
  ]

  for (const field of requiredFields) {
    if (!isNonEmptyString(path[field])) {
      collector.error('EMPTY_PATH_FIELD', `${field} must not be empty.`, { field })
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path.id ?? '')) {
    collector.error(
      'INVALID_PATH_ID',
      'id must use stable lowercase kebab-case characters.',
      { field: 'id', value: path.id },
    )
  }

  if (!verb) {
    collector.error('MISSING_VERB', `verb_id "${path.verb_id}" does not exist in verbs.`)
    return
  }

  if (path.verb !== verb.verb) {
    collector.error(
      'VERB_TEXT_MISMATCH',
      `verb_paths.verb "${path.verb}" does not match verbs.verb "${verb.verb}".`,
      { field: 'verb' },
    )
  }
}

function validateSentenceText(value, field, collector, context = {}) {
  if (!isNonEmptyString(value)) {
    collector.error('EMPTY_SENTENCE', `${field} must not be empty.`, {
      field,
      ...context,
    })
    return
  }

  if (value !== value.trim()) {
    collector.warning('SENTENCE_OUTER_WHITESPACE', `${field} has outer whitespace.`, {
      field,
      ...context,
    })
  }

  if (/ {2,}/.test(value)) {
    collector.warning('REPEATED_SPACES', `${field} contains repeated spaces.`, {
      field,
      ...context,
    })
  }

  if (!/[.!?。！？]$/.test(value.trim())) {
    collector.warning('MISSING_FINAL_PUNCTUATION', `${field} has no final punctuation.`, {
      field,
      ...context,
    })
  }
}

function validateLearnerText(value, field, collector, context = {}) {
  if (!isNonEmptyString(value)) {
    collector.error('EMPTY_LEARNER_TEXT', `${field} must not be empty.`, {
      field,
      ...context,
    })
    return
  }

  const normalizedValue = value.toLocaleLowerCase('zh-CN')

  for (const term of BANNED_LEARNER_TERMS) {
    if (normalizedValue.includes(term)) {
      collector.error(
        'BANNED_GRAMMAR_TERM',
        `${field} contains learner-facing grammar term "${term}".`,
        { field, term, ...context },
      )
    }
  }
}

function validateGrowth(path, growth, collector) {
  if (!isPlainObject(growth)) {
    collector.error('INVALID_GROWTH_JSON', 'growth_json must be an object.', {
      field: 'growth_json',
    })
    return null
  }

  const { nodes, links, steps } = growth
  const schemaVersion = growth.schema_version === 2 ? 2 : 1

  if (REQUIRE_V2 && schemaVersion !== 2) {
    collector.error(
      'LEGACY_GROWTH_SCHEMA',
      'growth_json must use schema_version 2.',
      { field: 'growth_json.schema_version' },
    )
  }

  if (!Array.isArray(nodes)) {
    collector.error('INVALID_NODES', 'growth_json.nodes must be an array.')
  }

  if (!Array.isArray(links)) {
    collector.error('INVALID_LINKS', 'growth_json.links must be an array.')
  }

  if (!Array.isArray(steps)) {
    collector.error('INVALID_GROWTH_STEPS', 'growth_json.steps must be an array.')
  }

  if (!Array.isArray(nodes) || !Array.isArray(links) || !Array.isArray(steps)) {
    return null
  }

  if (nodes.length === 0) {
    collector.error('EMPTY_NODES', 'growth_json.nodes must not be empty.')
  }

  if (steps.length === 0) {
    collector.error('EMPTY_STEPS', 'growth_json.steps must not be empty.')
  }

  const nodeIds = nodes.map((node) => node?.id).filter(isNonEmptyString)
  const linkIds = links.map((link) => link?.id).filter(isNonEmptyString)
  const nodeById = new Map()
  const linkById = new Map()

  if (!unique(nodeIds)) {
    collector.error('DUPLICATE_NODE_ID', 'growth_json contains duplicate node IDs.')
  }

  if (!unique(linkIds)) {
    collector.error('DUPLICATE_LINK_ID', 'growth_json contains duplicate link IDs.')
  }

  nodes.forEach((node, index) => {
    if (!isPlainObject(node)) {
      collector.error('INVALID_NODE', `Node ${index + 1} must be an object.`, {
        nodeIndex: index,
      })
      return
    }

    if (!isNonEmptyString(node.id)) {
      collector.error('EMPTY_NODE_ID', `Node ${index + 1} has no ID.`, {
        nodeIndex: index,
      })
    } else {
      nodeById.set(node.id, node)
    }

    if (!isNonEmptyString(node.text)) {
      collector.error('EMPTY_NODE_TEXT', `Node "${node.id ?? index + 1}" has no text.`, {
        nodeId: node.id ?? null,
      })
    }

    if (!NODE_KINDS.has(node.kind)) {
      collector.error(
        'INVALID_NODE_KIND',
        `Node "${node.id ?? index + 1}" has invalid kind "${node.kind}".`,
        { nodeId: node.id ?? null },
      )
    }

    if (schemaVersion === 2) {
      validateLearnerText(node.label_zh, 'node.label_zh', collector, {
        nodeId: node.id ?? null,
      })
    }
  })

  const actionNodes = nodes.filter((node) => node?.kind === 'action')

  if (actionNodes.length < 1) {
    collector.error(
      'ACTION_NODE_COUNT',
      'growth_json must contain at least one action node.',
    )
  }

  const rootActionId =
    schemaVersion === 2
      ? growth.root_action_id
      : actionNodes[0]?.id
  const rootActionNode = nodeById.get(rootActionId)

  if (
    !isNonEmptyString(rootActionId) ||
    !rootActionNode ||
    rootActionNode.kind !== 'action'
  ) {
    collector.error(
      'INVALID_ROOT_ACTION',
      'root_action_id must reference the main action node.',
      { field: 'growth_json.root_action_id' },
    )
  }

  if (schemaVersion === 1 && actionNodes.length !== 1) {
    collector.error(
      'LEGACY_ACTION_NODE_COUNT',
      `Legacy growth_json must contain exactly one action node; found ${actionNodes.length}.`,
    )
  }

  links.forEach((link, index) => {
    if (!isPlainObject(link)) {
      collector.error('INVALID_LINK', `Link ${index + 1} must be an object.`, {
        linkIndex: index,
      })
      return
    }

    if (!isNonEmptyString(link.id)) {
      collector.error('EMPTY_LINK_ID', `Link ${index + 1} has no ID.`, {
        linkIndex: index,
      })
    } else {
      linkById.set(link.id, link)
    }

    if (
      schemaVersion === 2 &&
      isNonEmptyString(link.from) &&
      isNonEmptyString(link.to) &&
      link.id !== `${link.from}->${link.to}`
    ) {
      collector.error(
        'INVALID_LINK_ID',
        `Link ID must be exactly "${link.from}->${link.to}".`,
        { linkId: link.id ?? null },
      )
    }

    if (!LINK_KINDS.has(link.kind)) {
      collector.error(
        'INVALID_LINK_KIND',
        `Link "${link.id ?? index + 1}" has invalid kind "${link.kind}".`,
        { linkId: link.id ?? null },
      )
    }

    if (!nodeById.has(link.from)) {
      collector.error(
        'LINK_FROM_MISSING',
        `Link "${link.id ?? index + 1}" references missing from node "${link.from}".`,
        { linkId: link.id ?? null },
      )
    }

    if (!nodeById.has(link.to)) {
      collector.error(
        'LINK_TO_MISSING',
        `Link "${link.id ?? index + 1}" references missing to node "${link.to}".`,
        { linkId: link.id ?? null },
      )
    }

    if (link.from === link.to && isNonEmptyString(link.from)) {
      collector.error(
        'SELF_LINK',
        `Link "${link.id ?? index + 1}" connects a node to itself.`,
        { linkId: link.id ?? null },
      )
    }

    if (!isNonEmptyString(link.label)) {
      collector.error(
        'EMPTY_LINK_LABEL',
        `Link "${link.id ?? index + 1}" must have a meaningful label.`,
        { linkId: link.id ?? null },
      )
    } else {
      validateLearnerText(link.label, 'link.label', collector, {
        linkId: link.id ?? null,
      })
    }

    const fromNode = nodeById.get(link.from)
    const toNode = nodeById.get(link.to)

    if (
      link.kind === 'core' &&
      (fromNode?.kind !== 'action' ||
        (toNode?.kind !== 'core' &&
          !(schemaVersion === 2 && toNode?.kind === 'action')))
    ) {
      collector.error(
        'INVALID_CORE_LINK_DIRECTION',
        `Core link "${link.id}" must point from an action node to a core or nested action node.`,
        { linkId: link.id },
      )
    }

    if (
      link.kind === 'modifier' &&
      fromNode?.kind !== 'modifier' &&
      !(schemaVersion === 2 && fromNode?.kind === 'action')
    ) {
      collector.error(
        'INVALID_MODIFIER_LINK_DIRECTION',
        `Modifier link "${link.id}" must start from a modifier or nested action event.`,
        { linkId: link.id },
      )
    }
  })

  if (schemaVersion === 2 && rootActionNode) {
    const visualChildren = new Map()

    for (const link of links) {
      if (!isPlainObject(link)) {
        continue
      }

      const parentId = link.kind === 'core' ? link.from : link.to
      const childId = link.kind === 'core' ? link.to : link.from
      const children = visualChildren.get(parentId) ?? []

      children.push(childId)
      visualChildren.set(parentId, children)
    }

    const reachableNodeIds = new Set([rootActionId])
    const queue = [rootActionId]

    while (queue.length > 0) {
      const parentId = queue.shift()

      for (const childId of visualChildren.get(parentId) ?? []) {
        if (reachableNodeIds.has(childId)) {
          continue
        }

        reachableNodeIds.add(childId)
        queue.push(childId)
      }
    }

    const unreachableNodeIds = nodes
      .map((node) => node?.id)
      .filter(
        (nodeId) =>
          isNonEmptyString(nodeId) && !reachableNodeIds.has(nodeId),
      )

    if (unreachableNodeIds.length > 0) {
      collector.error(
        'UNREACHABLE_NODES',
        `Nodes are not connected to root_action_id "${rootActionId}": ${unreachableNodeIds.join(', ')}.`,
      )
    }
  }

  const visibleNodeIds = new Set()
  const visibleLinkIds = new Set()
  const introducedNodeIds = new Set()
  const introducedLinkIds = new Set()
  let previousSentence = ''

  steps.forEach((step, index) => {
    const expectedStepNo = index + 1

    if (!isPlainObject(step)) {
      collector.error('INVALID_STEP', `Step ${expectedStepNo} must be an object.`, {
        stepNo: expectedStepNo,
      })
      return
    }

    if (step.step_no !== expectedStepNo) {
      collector.error(
        'NON_CONTIGUOUS_STEP_NUMBER',
        `Step at index ${index} must have step_no ${expectedStepNo}; found ${step.step_no}.`,
        { stepNo: step.step_no ?? null },
      )
    }

    validateLearnerText(step.label, 'step.label', collector, {
      stepNo: expectedStepNo,
    })
    validateSentenceText(step.sentence_en, 'step.sentence_en', collector, {
      stepNo: expectedStepNo,
    })
    validateSentenceText(step.sentence_zh, 'step.sentence_zh', collector, {
      stepNo: expectedStepNo,
    })
    validateLearnerText(step.note_zh, 'step.note_zh', collector, {
      stepNo: expectedStepNo,
    })

    if (!Array.isArray(step.show_nodes)) {
      collector.error('INVALID_SHOW_NODES', 'show_nodes must be an array.', {
        stepNo: expectedStepNo,
      })
    }

    if (!Array.isArray(step.show_links)) {
      collector.error('INVALID_SHOW_LINKS', 'show_links must be an array.', {
        stepNo: expectedStepNo,
      })
    }

    const showNodes = Array.isArray(step.show_nodes) ? step.show_nodes : []
    const showLinks = Array.isArray(step.show_links) ? step.show_links : []

    if (!unique(showNodes)) {
      collector.error('DUPLICATE_STEP_NODE', 'show_nodes contains duplicate IDs.', {
        stepNo: expectedStepNo,
      })
    }

    if (!unique(showLinks)) {
      collector.error('DUPLICATE_STEP_LINK', 'show_links contains duplicate IDs.', {
        stepNo: expectedStepNo,
      })
    }

    for (const nodeId of showNodes) {
      if (!nodeById.has(nodeId)) {
        collector.error(
          'STEP_NODE_MISSING',
          `Step ${expectedStepNo} references missing node "${nodeId}".`,
          { stepNo: expectedStepNo, nodeId },
        )
        continue
      }

      if (introducedNodeIds.has(nodeId)) {
        collector.error(
          'NODE_SHOWN_MORE_THAN_ONCE',
          `Node "${nodeId}" is introduced in more than one step.`,
          { stepNo: expectedStepNo, nodeId },
        )
      }

      introducedNodeIds.add(nodeId)
      visibleNodeIds.add(nodeId)

      const node = nodeById.get(nodeId)

      if (
        node?.kind === 'modifier' &&
        !containsText(step.sentence_en, node.text)
      ) {
        collector.warning(
          'NEW_NODE_TEXT_NOT_FOUND',
          `New modifier node "${node.text}" was not found verbatim in step ${expectedStepNo}.`,
          { stepNo: expectedStepNo, nodeId },
        )
      }
    }

    for (const linkId of showLinks) {
      const link = linkById.get(linkId)

      if (!link) {
        collector.error(
          'STEP_LINK_MISSING',
          `Step ${expectedStepNo} references missing link "${linkId}".`,
          { stepNo: expectedStepNo, linkId },
        )
        continue
      }

      if (introducedLinkIds.has(linkId)) {
        collector.error(
          'LINK_SHOWN_MORE_THAN_ONCE',
          `Link "${linkId}" is introduced in more than one step.`,
          { stepNo: expectedStepNo, linkId },
        )
      }

      introducedLinkIds.add(linkId)
      visibleLinkIds.add(linkId)

      if (!visibleNodeIds.has(link.from) || !visibleNodeIds.has(link.to)) {
        collector.error(
          'LINK_ENDPOINT_NOT_VISIBLE',
          `Link "${linkId}" appears before both endpoint nodes are visible.`,
          { stepNo: expectedStepNo, linkId },
        )
      }
    }

    if (!isNonEmptyString(step.focus_node) || !nodeById.has(step.focus_node)) {
      collector.error(
        'INVALID_FOCUS_NODE',
        `Step ${expectedStepNo} focus_node must reference an existing node.`,
        { stepNo: expectedStepNo, nodeId: step.focus_node ?? null },
      )
    } else if (!visibleNodeIds.has(step.focus_node)) {
      collector.error(
        'FOCUS_NODE_NOT_VISIBLE',
        `Step ${expectedStepNo} focus_node "${step.focus_node}" is not visible yet.`,
        { stepNo: expectedStepNo, nodeId: step.focus_node },
      )
    }

    if (index === 0) {
      if (normalizeWhitespace(step.label) !== '主干') {
        collector.error('FIRST_STEP_NOT_CORE', 'The first step label must be "主干".', {
          stepNo: expectedStepNo,
        })
      }

      const requiredCoreNodeIds =
        schemaVersion === 2
          ? [rootActionId].filter(isNonEmptyString)
          : nodes
              .filter((node) => node?.kind === 'action' || node?.kind === 'core')
              .map((node) => node.id)
      const missingCoreNodeIds = requiredCoreNodeIds.filter(
        (nodeId) => !showNodes.includes(nodeId),
      )

      if (missingCoreNodeIds.length > 0) {
        collector.error(
          'FIRST_STEP_MISSING_CORE_NODES',
          `The first step does not show all action/core nodes: ${missingCoreNodeIds.join(', ')}.`,
          { stepNo: expectedStepNo },
        )
      }

      const requiredCoreLinkIds =
        schemaVersion === 2
          ? []
          : links
              .filter((link) => link?.kind === 'core')
              .map((link) => link.id)
      const missingCoreLinkIds = requiredCoreLinkIds.filter(
        (linkId) => !showLinks.includes(linkId),
      )

      if (missingCoreLinkIds.length > 0) {
        collector.error(
          'FIRST_STEP_MISSING_CORE_LINKS',
          `The first step does not show all core links: ${missingCoreLinkIds.join(', ')}.`,
          { stepNo: expectedStepNo },
        )
      }
    } else {
      if (showNodes.length === 0 && showLinks.length === 0) {
        collector.error(
          'STEP_ADDS_NOTHING',
          `Step ${expectedStepNo} does not add a node or link.`,
          { stepNo: expectedStepNo },
        )
      }

      if (
        normalizeWhitespace(step.sentence_en) === normalizeWhitespace(previousSentence)
      ) {
        collector.error(
          'REPEATED_STEP_SENTENCE',
          `Step ${expectedStepNo} repeats the previous English sentence.`,
          { stepNo: expectedStepNo },
        )
      }
    }

    for (const previousModifierId of [...visibleNodeIds]) {
      const previousNode = nodeById.get(previousModifierId)

      if (
        previousNode?.kind === 'modifier' &&
        !containsText(step.sentence_en, previousNode.text)
      ) {
        collector.warning(
          'PREVIOUS_MODIFIER_TEXT_NOT_FOUND',
          `Previously introduced modifier "${previousNode.text}" was not found verbatim in step ${expectedStepNo}.`,
          { stepNo: expectedStepNo, nodeId: previousModifierId },
        )
      }
    }

    previousSentence = step.sentence_en
  })

  const hiddenNodeIds = nodes
    .map((node) => node?.id)
    .filter((nodeId) => isNonEmptyString(nodeId) && !introducedNodeIds.has(nodeId))
  const hiddenLinkIds = links
    .map((link) => link?.id)
    .filter((linkId) => isNonEmptyString(linkId) && !introducedLinkIds.has(linkId))

  if (hiddenNodeIds.length > 0) {
    collector.error(
      'UNUSED_NODES',
      `Nodes never shown by any step: ${hiddenNodeIds.join(', ')}.`,
    )
  }

  if (hiddenLinkIds.length > 0) {
    collector.error(
      'UNUSED_LINKS',
      `Links never shown by any step: ${hiddenLinkIds.join(', ')}.`,
    )
  }

  if (steps.length > 0) {
    const firstStep = steps[0]
    const lastStep = steps.at(-1)
    const summaryComparisons = [
      ['core_sentence_en', firstStep.sentence_en],
      ['core_sentence_zh', firstStep.sentence_zh],
      ['full_sentence_en', lastStep.sentence_en],
      ['full_sentence_zh', lastStep.sentence_zh],
    ]

    for (const [field, stepValue] of summaryComparisons) {
      if (normalizeWhitespace(path[field]) !== normalizeWhitespace(stepValue)) {
        collector.error(
          'PATH_SENTENCE_MISMATCH',
          `${field} does not match the corresponding growth_json step sentence.`,
          { field },
        )
      }
    }
  }

  return {
    schema_version: schemaVersion,
    root_action_id: rootActionId,
    nodes,
    links,
    steps,
  }
}

await assertSchema()

const verbs = await loadVerbs()
const verbById = new Map(verbs.map((verb) => [verb.id, verb]))
const { rows: paths, total: totalPaths } = await loadVerbPaths()
const errors = []
const warnings = []
const validPathIds = []

for (const path of paths) {
  const collector = createCollector(path)
  const verb = verbById.get(path.verb_id)

  validatePathFields(path, verb, collector)

  const growth = parseJsonField(path, 'growth_json', collector)
  if (growth) {
    validateGrowth(path, growth, collector)
  }

  errors.push(...collector.errors)
  warnings.push(...collector.warnings)

  if (collector.errors.length === 0 && (!STRICT || collector.warnings.length === 0)) {
    validPathIds.push(path.id)
  }
}

if (paths.length === 0) {
  warnings.push({
    severity: 'warning',
    code: 'NO_PATHS',
    pathId: null,
    verbId: VERB_FILTER || null,
    message: VERB_FILTER
      ? `No verb paths matched filter "${VERB_FILTER}".`
      : 'No verb paths were found.',
  })
}

const pathIdsWithErrors = new Set(
  errors.map((issue) => issue.pathId).filter(isNonEmptyString),
)
const pathIdsWithWarnings = new Set(
  warnings.map((issue) => issue.pathId).filter(isNonEmptyString),
)
const summary = {
  location: D1_LOCATION_LABEL,
  database: DATABASE,
  strict: STRICT,
  requireV2: REQUIRE_V2,
  verbFilter: VERB_FILTER || null,
  verbFilters: VERB_FILTERS,
  totalVerbs: verbs.length,
  totalPaths,
  checkedPaths: paths.length,
  validPaths: validPathIds.length,
  pathsWithErrors: pathIdsWithErrors.size,
  pathsWithWarnings: pathIdsWithWarnings.size,
  errorCount: errors.length,
  warningCount: warnings.length,
  passed: errors.length === 0 && (!STRICT || warnings.length === 0),
  errors,
  warnings,
}

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(
    `Verb path validation (${D1_LOCATION_LABEL} D1): ${summary.checkedPaths}/${summary.totalPaths} paths checked across ${summary.totalVerbs} verbs.`,
  )
  console.log(
    `Result: ${summary.errorCount} errors, ${summary.warningCount} warnings, ${summary.validPaths} valid paths${STRICT ? ' (strict mode)' : ''}.`,
  )

  if (errors.length > 0) {
    console.log('\nErrors:')
    for (const issue of errors.slice(0, 100)) {
      console.log(
        `- [${issue.code}] ${issue.pathId ?? '(no path)'}: ${issue.message}`,
      )
    }

    if (errors.length > 100) {
      console.log(`... ${errors.length - 100} more errors omitted.`)
    }
  }

  if (warnings.length > 0) {
    console.log('\nWarnings:')
    for (const issue of warnings.slice(0, 100)) {
      console.log(
        `- [${issue.code}] ${issue.pathId ?? '(no path)'}: ${issue.message}`,
      )
    }

    if (warnings.length > 100) {
      console.log(`... ${warnings.length - 100} more warnings omitted.`)
    }
  }
}

if (!summary.passed) {
  process.exitCode = 1
}
