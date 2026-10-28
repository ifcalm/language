export type IeltsModuleId = 'listening' | 'reading' | 'writing' | 'speaking'

export interface IeltsSense {
  pos: string
  meaning: string
}

export interface IeltsEntry {
  id: string
  word: string
  topicId: string
  /** Index into IeltsTopicSummary.groups when the topic has sub-groups. */
  group?: number
  senses: IeltsSense[]
  phoneticUk?: string
  phoneticUs?: string
  audioKey?: string
}

export interface IeltsTopicGroup {
  title: string
  entryCount: number
}

export interface IeltsTopicSummary {
  id: string
  order: number
  title: string
  entryCount: number
  groups?: IeltsTopicGroup[]
}

export interface IeltsModuleSummary {
  id: IeltsModuleId
  name: string
  nameEn: string
  description: string
  entryCount: number
  topics: IeltsTopicSummary[]
}

export interface IeltsCatalog {
  source: string
  entryCount: number
  modules: IeltsModuleSummary[]
}

export interface IeltsModuleData {
  moduleId: IeltsModuleId
  entries: IeltsEntry[]
}
