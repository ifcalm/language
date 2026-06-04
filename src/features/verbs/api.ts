import type {
  SentenceGrowth,
  SentenceGrowthLink,
  SentenceGrowthNode,
  SentenceGrowthStep,
  VerbDetail,
  VerbListResponse,
  VerbPathStep,
} from './types'

interface RawVerbPathStep {
  step_no?: unknown
  stepNo?: unknown
  label?: unknown
  sentence_en?: unknown
  sentenceEn?: unknown
  sentence_zh?: unknown
  sentenceZh?: unknown
  focus_text?: unknown
  focusText?: unknown
  note_zh?: unknown
  noteZh?: unknown
  segments?: unknown
}

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

function normalizeStep(step: RawVerbPathStep, index: number): VerbPathStep {
  const rawSegments = Array.isArray(step.segments) ? step.segments : []

  return {
    stepNo:
      typeof step.step_no === 'number'
        ? step.step_no
        : typeof step.stepNo === 'number'
          ? step.stepNo
          : index + 1,
    label: readString(step.label) || `第 ${index + 1} 步`,
    sentenceEn: readString(step.sentence_en) || readString(step.sentenceEn),
    sentenceZh: readString(step.sentence_zh) || readString(step.sentenceZh),
    focusText: readString(step.focus_text) || readString(step.focusText),
    noteZh: readString(step.note_zh) || readString(step.noteZh),
    segments: rawSegments
      .map((segment) => {
        if (!segment || typeof segment !== 'object') {
          return null
        }

        const record = segment as Record<string, unknown>
        const kind = record.kind

        if (kind !== 'core' && kind !== 'modifier' && kind !== 'punctuation') {
          return null
        }

        return {
          text: readString(record.text),
          kind,
        }
      })
      .filter((segment): segment is VerbPathStep['segments'][number] =>
        Boolean(segment?.text),
      ),
  }
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

  return {
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
      steps: Array.isArray(path.steps)
        ? path.steps.map((step, index) => normalizeStep(step as RawVerbPathStep, index))
        : [],
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
