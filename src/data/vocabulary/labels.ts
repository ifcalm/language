import type {
  PartOfSpeech,
  VocabularyFrequencyBand,
  VocabularyLevel,
  VocabularyScenario,
} from './types'

export const vocabularyLevelLabels: Record<VocabularyLevel, string> = {
  A1: 'A1 入门',
  A2: 'A2 基础',
  B1: 'B1 进阶',
  B2: 'B2 熟练',
}

export const vocabularyFrequencyBandLabels: Record<VocabularyFrequencyBand, string> = {
  'top-100': '高频 100',
  'top-500': '日常 500',
  'top-1000': '核心 1000',
  'top-3000': '完整 3000',
}

export const partOfSpeechLabels: Record<PartOfSpeech, string> = {
  noun: '名词',
  verb: '动词',
  adjective: '形容词',
  adverb: '副词',
  phrase: '短语',
  pronoun: '代词',
  preposition: '介词',
  conjunction: '连词',
  determiner: '限定词',
  modal: '情态动词',
  interjection: '感叹词',
  number: '数词',
}

export const scenarioLabels: Record<VocabularyScenario, string> = {
  daily: '日常生活',
  study: '学习成长',
  work: '工作职场',
  communication: '沟通表达',
  thinking: '思考判断',
  emotion: '情绪感受',
  time: '时间安排',
  'problem-solving': '问题解决',
}
