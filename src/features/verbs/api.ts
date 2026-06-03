import type { VerbDetail, VerbListResponse, VerbPathStep } from './types'

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

function readString(value: unknown) {
  return typeof value === 'string' ? value : ''
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

function normalizeVerbDetail(payload: VerbDetail): VerbDetail {
  return {
    ...payload,
    paths: payload.paths.map((path) => ({
      ...path,
      steps: Array.isArray(path.steps)
        ? path.steps.map((step, index) => normalizeStep(step as RawVerbPathStep, index))
        : [],
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
