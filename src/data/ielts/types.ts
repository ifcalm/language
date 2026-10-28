export type IeltsModuleId = 'listening' | 'reading' | 'writing' | 'speaking'

export interface IeltsSense {
  pos: string
  meaning: string
}

export interface IeltsEntry {
  id: string
  word: string
  topicId: string
  senses: IeltsSense[]
  phoneticUk?: string
  phoneticUs?: string
  audioKey?: string
}

export interface IeltsTopicSummary {
  id: string
  order: number
  title: string
  entryCount: number
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
