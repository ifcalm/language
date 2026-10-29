export type IeltsModuleId = 'listening' | 'reading' | 'writing' | 'speaking'

export interface IeltsSense {
  pos: string
  meaning: string
}

export interface IeltsEntry {
  id: string
  word: string
  /** American spelling when it differs (analyse -> analyze), used by search. */
  spellingUs?: string
  topicId: string
  /** Index into IeltsTopicSummary.groups when the topic has sub-groups. */
  group?: number
  senses: IeltsSense[]
  phoneticUk?: string
  phoneticUs?: string
  /** Present when stress or vowels change with part of speech (increase n./v.). */
  posPhonetics?: IeltsPosPhonetic[]
  /** IELTS audio exists at ielts/pronunciations/v1/{uk|us}/{id}.m4a. */
  audio?: boolean
  /** Legacy: reused COCA audio key, only until IELTS audio is uploaded. */
  audioKey?: string
}

export interface IeltsPosPhonetic {
  pos: string
  uk: string
  us: string
  /** Audio exists at ielts/pronunciations/v1/{uk|us}/{id}-{pos}.m4a. */
  audio?: boolean
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
