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
  /** Present when stress or vowels change with part of speech (increase n./v.). */
  posPhonetics?: IeltsPosPhonetic[]
  audioKey?: string
}

export interface IeltsPosPhonetic {
  pos: string
  uk: string
  us: string
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
