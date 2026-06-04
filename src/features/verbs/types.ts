export interface VerbListItem {
  id: string
  verb: string
  normalizedVerb: string
  meaningZh: string
  isPhrase: boolean
  pathCount: number
}

export interface VerbSegment {
  text: string
  kind: 'core' | 'modifier' | 'punctuation'
}

export interface SentenceGrowthNode {
  id: string
  text: string
  kind: 'action' | 'core' | 'modifier'
  group?: 'action' | 'core' | 'modifier'
}

export interface SentenceGrowthLink {
  id: string
  from: string
  to: string
  kind: 'core' | 'modifier'
  label: string
}

export interface SentenceGrowthStep {
  stepNo: number
  label: string
  sentenceEn: string
  sentenceZh: string
  showNodes: string[]
  showLinks: string[]
  focusNode: string
  noteZh: string
}

export interface SentenceGrowth {
  nodes: SentenceGrowthNode[]
  links: SentenceGrowthLink[]
  steps: SentenceGrowthStep[]
}

export interface VerbPathStep {
  stepNo: number
  label: string
  sentenceEn: string
  sentenceZh: string
  focusText: string
  noteZh: string
  segments: VerbSegment[]
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
  steps: VerbPathStep[]
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
