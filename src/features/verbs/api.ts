import type {
  SentenceGrowth,
  SentenceGrowthLink,
  SentenceGrowthNode,
  SentenceGrowthStep,
  VerbDetail,
  VerbListResponse,
} from './types'

interface RawSentenceGrowthStep {
  step_no?: unknown
  stepNo?: unknown
  label?: unknown
  sentence_en?: unknown
  sentenceEn?: unknown
  sentence_zh?: unknown
  sentenceZh?: unknown
  show_nodes?: unknown
  showNodes?: unknown
  show_links?: unknown
  showLinks?: unknown
  focus_node?: unknown
  focusNode?: unknown
  note_zh?: unknown
  noteZh?: unknown
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function normalizeGrowth(value: unknown): SentenceGrowth | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const record = value as Record<string, unknown>
  const rawNodes = Array.isArray(record.nodes) ? record.nodes : []
  const rawLinks = Array.isArray(record.links) ? record.links : []
  const rawSteps = Array.isArray(record.steps) ? record.steps : []

  const nodes = rawNodes
    .map((node): SentenceGrowthNode | null => {
      if (!node || typeof node !== 'object') {
        return null
      }

      const nodeRecord = node as Record<string, unknown>
      const kind = nodeRecord.kind
      const group = nodeRecord.group

      if (kind !== 'action' && kind !== 'core' && kind !== 'modifier') {
        return null
      }

      return {
        id: readString(nodeRecord.id),
        text: readString(nodeRecord.text),
        kind,
        labelZh:
          readString(nodeRecord.label_zh) || readString(nodeRecord.labelZh),
        group:
          group === 'action' || group === 'core' || group === 'modifier'
            ? group
            : undefined,
      }
    })
    .filter((node): node is SentenceGrowthNode => Boolean(node?.id && node.text))

  const nodeIds = new Set(nodes.map((node) => node.id))

  const links = rawLinks
    .map((link): SentenceGrowthLink | null => {
      if (!link || typeof link !== 'object') {
        return null
      }

      const linkRecord = link as Record<string, unknown>
      const kind = linkRecord.kind
      const from = readString(linkRecord.from)
      const to = readString(linkRecord.to)

      if (
        (kind !== 'core' && kind !== 'modifier') ||
        !nodeIds.has(from) ||
        !nodeIds.has(to)
      ) {
        return null
      }

      return {
        id: readString(linkRecord.id) || `${from}->${to}`,
        from,
        to,
        kind,
        label: readString(linkRecord.label),
      }
    })
    .filter((link): link is SentenceGrowthLink => Boolean(link))

  const linkIds = new Set(links.map((link) => link.id))

  const steps = rawSteps
    .map((step, index): SentenceGrowthStep | null => {
      if (!step || typeof step !== 'object') {
        return null
      }

      const stepRecord = step as RawSentenceGrowthStep
      const showNodes = readStringArray(stepRecord.show_nodes ?? stepRecord.showNodes)
        .filter((nodeId) => nodeIds.has(nodeId))
      const showLinks = readStringArray(stepRecord.show_links ?? stepRecord.showLinks)
        .filter((linkId) => linkIds.has(linkId))
      const focusNode = readString(stepRecord.focus_node) || readString(stepRecord.focusNode)

      return {
        stepNo:
          typeof stepRecord.step_no === 'number'
            ? stepRecord.step_no
            : typeof stepRecord.stepNo === 'number'
              ? stepRecord.stepNo
              : index + 1,
        label: readString(stepRecord.label) || `第 ${index + 1} 步`,
        sentenceEn:
          readString(stepRecord.sentence_en) || readString(stepRecord.sentenceEn),
        sentenceZh:
          readString(stepRecord.sentence_zh) || readString(stepRecord.sentenceZh),
        showNodes,
        showLinks,
        focusNode: nodeIds.has(focusNode) ? focusNode : '',
        noteZh: readString(stepRecord.note_zh) || readString(stepRecord.noteZh),
      }
    })
    .filter((step): step is SentenceGrowthStep => Boolean(step))

  if (nodes.length === 0 || steps.length === 0) {
    return null
  }

  const fallbackRootActionId =
    nodes.find((node) => node.kind === 'action')?.id ?? ''
  const rootActionId =
    readString(record.root_action_id) ||
    readString(record.rootActionId) ||
    fallbackRootActionId

  return {
    schemaVersion:
      typeof record.schema_version === 'number'
        ? record.schema_version
        : typeof record.schemaVersion === 'number'
          ? record.schemaVersion
          : 1,
    rootActionId,
    nodes,
    links,
    steps,
  }
}

function normalizeVerbDetail(payload: VerbDetail): VerbDetail {
  return {
    ...payload,
    paths: payload.paths.map((path) => ({
      ...path,
      growth: normalizeGrowth(path.growth),
    })),
  }
}

export async function requestVerbList(
  query: string,
  signal: AbortSignal,
): Promise<VerbListResponse> {
  const params = new URLSearchParams({
    limit: '120',
    offset: '0',
  })

  const normalizedQuery = query.trim()

  if (normalizedQuery) {
    params.set('q', normalizedQuery)
  }

  const response = await fetch(`/api/verbs?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error(`Verb list API responded with ${response.status}`)
  }

  return (await response.json()) as VerbListResponse
}

export async function requestVerbDetail(
  lookup: string,
  signal: AbortSignal,
): Promise<VerbDetail> {
  const response = await fetch(`/api/verbs/${encodeURIComponent(lookup)}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Verb detail API responded with ${response.status}`)
  }

  return normalizeVerbDetail((await response.json()) as VerbDetail)
}
