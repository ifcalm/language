export interface VerbListItem {
  id: string
  verb: string
  normalizedVerb: string
  meaningZh: string
  isPhrase: boolean
  pathCount: number
}

export interface SentenceGrowthNode {
  id: string
  text: string
  kind: 'action' | 'core' | 'modifier'
  labelZh?: string
}

export type SentenceGrowthRelationType =
  | 'actor'
  | 'target'
  | 'recipient'
  | 'content'
  | 'nested_action'
  | 'shared_actor'
  | 'ownership'
  | 'category'
  | 'quality'
  | 'frequency'
  | 'time'
  | 'place'
  | 'condition'
  | 'purpose'
  | 'reason'
  | 'manner'
  | 'degree'
  | 'scope'
  | 'result'
  | 'sequence'

export interface SentenceGrowthLink {
  id: string
  from: string
  to: string
  kind: 'core' | 'modifier'
  relationType?: SentenceGrowthRelationType
  labelZh?: string
}

export interface SentenceGrowthStep {
  stepNo: number
  label: string
  sentenceEn: string
  sentenceZh: string
  addNodeIds: string[]
  addLinkIds: string[]
  focusNodeId: string
  noteZh: string
}

export interface SentenceGrowth {
  schemaVersion: number
  rootActionId: string
  nodes: SentenceGrowthNode[]
  links: SentenceGrowthLink[]
  steps: SentenceGrowthStep[]
}

export interface VerbPath {
  id: string
  verbId: string
  verb: string
  title: string
  meaningZh: string
  coreSentenceEn: string
  coreSentenceZh: string
  fullSentenceEn: string
  fullSentenceZh: string
  scene: string
  growth: SentenceGrowth | null
}

export interface VerbDetail {
  verb: Omit<VerbListItem, 'pathCount'>
  paths: VerbPath[]
}

export interface VerbListResponse {
  items: VerbListItem[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}
