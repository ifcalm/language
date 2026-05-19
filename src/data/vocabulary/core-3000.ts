import type {
  CoreVocabularyEntry,
  CefrStatus,
  ExampleStatus,
  GrammarStatus,
  PartOfSpeech,
  ReviewStatus,
  VocabularyLevel,
  VocabularySourceId,
  VocabularyScenario,
} from './types'

export const vocabularyLevelLabels: Record<VocabularyLevel, string> = {
  A1: 'A1 入门',
  A2: 'A2 基础',
  B1: 'B1 进阶',
  B2: 'B2 熟练',
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

export const vocabularySourceLabels: Record<VocabularySourceId, string> = {
  'manual-curation': '手工整理',
  'oxford-3000': 'Oxford 3000 参考',
  'english-vocabulary-profile': 'EVP / CEFR 待校准',
  ngsl: 'NGSL 高频参考',
  nawl: 'NAWL 学术词表参考',
}

export const cefrStatusLabels: Record<CefrStatus, string> = {
  estimated: 'CEFR 经验标注',
  'reference-checked': 'CEFR 已参考校准',
}

export const exampleStatusLabels: Record<ExampleStatus, string> = {
  original: '原创例句',
  'source-derived': '来源改写例句',
}

export const grammarStatusLabels: Record<GrammarStatus, string> = {
  'self-reviewed': '语法自检通过',
  'needs-review': '语法待复核',
}

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  draft: '草稿',
  'sample-reviewed': '样例复核',
  reviewed: '已复核',
}

const reviewedCoreVocabulary = [
  {
    id: 'ability',
    word: 'ability',
    meaning: '能力；才能',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 1,
    example: 'Practice improves your ability to understand natural English.',
    collocations: ['ability to do something', 'language ability', 'develop an ability'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing', 'speaking'],
    note: '常用于描述技能、学习成果和工作能力。',
    senses: [
      {
        meaning: '能力；做某事的本领',
        partOfSpeech: 'noun',
        example: 'Practice improves your ability to understand natural English.',
        usageNote: '常接 ability to do something。',
      },
    ],
    quality: {
      sources: ['manual-curation', 'ngsl'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '已做样例级人工自检；CEFR 等级仍需后续按正式词表逐词校准。',
    },
  },
  {
    id: 'accept',
    word: 'accept',
    meaning: '接受；同意接纳',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 2,
    example: 'I accept that mistakes are part of learning.',
    collocations: ['accept an offer', 'accept a fact', 'accept responsibility'],
    scenarios: ['communication', 'thinking'],
    skills: ['listening', 'speaking', 'writing'],
    note: '比 agree 更强调“接纳现实或决定”。',
    senses: [
      {
        meaning: '接受事实、建议或责任',
        partOfSpeech: 'verb',
        example: 'I accept that mistakes are part of learning.',
        usageNote: '常接名词或 that 从句。',
      },
    ],
    quality: {
      sources: ['manual-curation'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '义项和例句已人工自检；频率和级别还未做权威源交叉校验。',
    },
  },
  {
    id: 'active',
    word: 'active',
    meaning: '积极的；活跃的',
    partOfSpeech: 'adjective',
    level: 'A2',
    priority: 3,
    example: 'Active recall helps you remember words for longer.',
    collocations: ['active learner', 'active role', 'stay active'],
    scenarios: ['study', 'daily'],
    skills: ['reading', 'speaking', 'writing'],
    note: '适合描述学习方式、生活状态和参与程度。',
    senses: [
      {
        meaning: '积极参与的；活跃的',
        partOfSpeech: 'adjective',
        example: 'Active recall helps you remember words for longer.',
        usageNote: '学习语境里常见 active recall、active learner。',
      },
    ],
    quality: {
      sources: ['manual-curation'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '例句语法已自检；后续可补充生活场景义项。',
    },
  },
  {
    id: 'address',
    word: 'address',
    meaning: '处理；地址；发表讲话',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 4,
    example: 'We need to address the problem before it becomes bigger.',
    collocations: ['address a problem', 'address an issue', 'home address'],
    scenarios: ['work', 'problem-solving'],
    skills: ['reading', 'writing', 'speaking'],
    note: '作动词时常表示“正式处理问题”。',
    senses: [
      {
        meaning: '处理；着手解决',
        partOfSpeech: 'verb',
        example: 'We need to address the problem before it becomes bigger.',
        usageNote: 'address a problem / issue 是职场和正式表达高频搭配。',
      },
      {
        meaning: '地址',
        partOfSpeech: 'noun',
        example: 'Please write your address at the top of the form.',
        usageNote: '这个名词义项和动词义项应分开训练。',
      },
    ],
    quality: {
      sources: ['manual-curation'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '已拆分 verb/noun 两个高频义项，避免单一词性误导。',
    },
  },
  {
    id: 'agree',
    word: 'agree',
    meaning: '同意；意见一致',
    partOfSpeech: 'verb',
    level: 'A1',
    priority: 5,
    example: 'I agree with your point, but I have one question.',
    collocations: ['agree with someone', 'agree on a plan', 'strongly agree'],
    scenarios: ['communication', 'work'],
    skills: ['listening', 'speaking', 'writing'],
    note: '表达观点时的基础高频词。',
    senses: [
      {
        meaning: '同意某人或某个观点',
        partOfSpeech: 'verb',
        example: 'I agree with your point, but I have one question.',
        usageNote: 'agree with someone / something；agree on a plan。',
      },
    ],
    quality: {
      sources: ['manual-curation', 'ngsl'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '基础表达已自检，适合做口语观点表达训练。',
    },
  },
  {
    id: 'allow',
    word: 'allow',
    meaning: '允许；使能够',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 6,
    example: 'This tool allows me to review vocabulary every day.',
    collocations: ['allow someone to do something', 'allow time for', 'not allowed'],
    scenarios: ['work', 'study', 'daily'],
    skills: ['reading', 'writing'],
    note: '写作中常用来连接工具、条件和结果。',
    senses: [
      {
        meaning: '允许某人做某事',
        partOfSpeech: 'verb',
        example: 'This tool allows me to review vocabulary every day.',
        usageNote: 'allow someone to do something 是核心句型。',
      },
    ],
    quality: {
      sources: ['manual-curation'],
      cefrStatus: 'estimated',
      exampleStatus: 'original',
      grammarStatus: 'self-reviewed',
      reviewStatus: 'sample-reviewed',
      lastReviewed: '2026-05-19',
      note: '例句结构已自检；后续可补充 not allowed 等生活场景。',
    },
  },
  {
    id: 'answer',
    word: 'answer',
    meaning: '回答；答案',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 7,
    example: 'Try to give a clear answer in one or two sentences.',
    collocations: ['answer a question', 'clear answer', 'short answer'],
    scenarios: ['study', 'communication'],
    skills: ['listening', 'speaking', 'writing'],
    note: '可作名词也可作动词，是口语和课堂场景基础词。',
  },
  {
    id: 'appear',
    word: 'appear',
    meaning: '出现；似乎',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 8,
    example: 'The same phrase appears several times in this article.',
    collocations: ['appear to be', 'appear in', 'suddenly appear'],
    scenarios: ['study', 'thinking'],
    skills: ['reading', 'writing'],
    note: '阅读中常见，也用于表达不确定判断。',
  },
  {
    id: 'area',
    word: 'area',
    meaning: '区域；领域；方面',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 9,
    example: 'Listening is the area I want to improve first.',
    collocations: ['in this area', 'study area', 'weak area'],
    scenarios: ['study', 'work'],
    skills: ['speaking', 'writing'],
    note: '适合描述能力板块、地理区域或专业领域。',
  },
  {
    id: 'attention',
    word: 'attention',
    meaning: '注意力；关注',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 10,
    example: 'Pay attention to how native speakers link words together.',
    collocations: ['pay attention to', 'get attention', 'full attention'],
    scenarios: ['study', 'communication'],
    skills: ['listening', 'reading', 'speaking'],
    note: '学习指令和自我复盘中非常常用。',
  },
  {
    id: 'available',
    word: 'available',
    meaning: '可用的；有空的',
    partOfSpeech: 'adjective',
    level: 'A2',
    priority: 11,
    example: 'I am available after 3 p.m. for a short call.',
    collocations: ['be available', 'available time', 'available online'],
    scenarios: ['work', 'time'],
    skills: ['listening', 'speaking', 'writing'],
    note: '职场沟通和安排时间时高频。',
  },
  {
    id: 'believe',
    word: 'believe',
    meaning: '相信；认为',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 12,
    example: 'I believe small daily practice can create real progress.',
    collocations: ['believe in', 'strongly believe', 'believe that'],
    scenarios: ['thinking', 'emotion'],
    skills: ['speaking', 'writing'],
    note: '表达观点和信念的基础动词。',
  },
  {
    id: 'benefit',
    word: 'benefit',
    meaning: '好处；受益',
    partOfSpeech: 'noun',
    level: 'B1',
    priority: 13,
    example: 'One benefit of reading aloud is better pronunciation.',
    collocations: ['main benefit', 'benefit from', 'clear benefit'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing', 'speaking'],
    note: '论述优缺点时的核心词。',
  },
  {
    id: 'change',
    word: 'change',
    meaning: '改变；变化',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 14,
    example: 'A small change in your routine can make practice easier.',
    collocations: ['make a change', 'change your mind', 'big change'],
    scenarios: ['daily', 'study', 'work'],
    skills: ['listening', 'speaking', 'writing'],
    note: '可作名词和动词，适合描述计划、习惯和状态。',
  },
  {
    id: 'clear',
    word: 'clear',
    meaning: '清楚的；明确的',
    partOfSpeech: 'adjective',
    level: 'A2',
    priority: 15,
    example: 'A clear goal makes daily study easier to follow.',
    collocations: ['clear goal', 'clear explanation', 'make it clear'],
    scenarios: ['communication', 'study', 'work'],
    skills: ['speaking', 'writing'],
    note: '表达质量和沟通效果的高频形容词。',
  },
  {
    id: 'common',
    word: 'common',
    meaning: '常见的；共同的',
    partOfSpeech: 'adjective',
    level: 'A2',
    priority: 16,
    example: 'This is a common mistake among English learners.',
    collocations: ['common mistake', 'common problem', 'common sense'],
    scenarios: ['study', 'daily'],
    skills: ['reading', 'speaking', 'writing'],
    note: '适合描述普遍现象和学习错误。',
  },
  {
    id: 'compare',
    word: 'compare',
    meaning: '比较；对比',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 17,
    example: 'Compare your answer with the example sentence.',
    collocations: ['compare A with B', 'compare notes', 'hard to compare'],
    scenarios: ['study', 'thinking'],
    skills: ['reading', 'writing'],
    note: '学习分析和写作论证常用。',
  },
  {
    id: 'complete',
    word: 'complete',
    meaning: '完成；完整的',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 18,
    example: 'Complete the four tasks before you review new words.',
    collocations: ['complete a task', 'complete list', 'complete the form'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing'],
    note: '任务、表格、计划中很常见。',
  },
  {
    id: 'consider',
    word: 'consider',
    meaning: '考虑；认为',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 19,
    example: 'Consider using easier materials when you feel tired.',
    collocations: ['consider doing', 'carefully consider', 'consider it important'],
    scenarios: ['thinking', 'problem-solving'],
    skills: ['reading', 'writing', 'speaking'],
    note: '比 think 更正式，适合建议和决策表达。',
  },
  {
    id: 'create',
    word: 'create',
    meaning: '创造；创建',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 20,
    example: 'Create one original sentence with each new word.',
    collocations: ['create a habit', 'create a plan', 'create value'],
    scenarios: ['study', 'work'],
    skills: ['speaking', 'writing'],
    note: '写作、项目和学习方法里都很高频。',
  },
  {
    id: 'decide',
    word: 'decide',
    meaning: '决定',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 21,
    example: 'Decide what you want to practice before you start.',
    collocations: ['decide to do', 'decide on', 'hard to decide'],
    scenarios: ['thinking', 'daily', 'work'],
    skills: ['speaking', 'writing'],
    note: '描述选择和计划的基础动词。',
  },
  {
    id: 'describe',
    word: 'describe',
    meaning: '描述',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 22,
    example: 'Describe your day using three new words.',
    collocations: ['describe a situation', 'describe in detail', 'briefly describe'],
    scenarios: ['communication', 'study'],
    skills: ['speaking', 'writing'],
    note: '口语练习和写作练习的核心动作。',
  },
  {
    id: 'develop',
    word: 'develop',
    meaning: '发展；培养；开发',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 23,
    example: 'You can develop confidence by speaking a little every day.',
    collocations: ['develop a habit', 'develop skills', 'develop an idea'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing', 'speaking'],
    note: '适合描述能力、产品、想法或关系的发展。',
  },
  {
    id: 'effect',
    word: 'effect',
    meaning: '影响；效果',
    partOfSpeech: 'noun',
    level: 'B1',
    priority: 24,
    example: 'Daily review has a strong effect on long-term memory.',
    collocations: ['positive effect', 'side effect', 'effect on'],
    scenarios: ['thinking', 'study'],
    skills: ['reading', 'writing'],
    note: '注意和 affect 区分：effect 多作名词。',
  },
  {
    id: 'example',
    word: 'example',
    meaning: '例子；示例',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 25,
    example: 'Can you give me another example?',
    collocations: ['for example', 'good example', 'example sentence'],
    scenarios: ['study', 'communication'],
    skills: ['listening', 'speaking', 'writing'],
    note: '解释、提问和学习笔记里的基础词。',
  },
  {
    id: 'experience',
    word: 'experience',
    meaning: '经历；经验；体验',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 26,
    example: 'Learning from real experience makes vocabulary more useful.',
    collocations: ['learning experience', 'work experience', 'personal experience'],
    scenarios: ['daily', 'work', 'study'],
    skills: ['speaking', 'writing', 'reading'],
    note: '自我介绍、职场和写作中都常见。',
  },
  {
    id: 'explain',
    word: 'explain',
    meaning: '解释；说明',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 27,
    example: 'Explain the idea in your own words.',
    collocations: ['explain why', 'explain clearly', 'explain the problem'],
    scenarios: ['communication', 'study', 'work'],
    skills: ['speaking', 'writing'],
    note: '输出训练中非常重要，比只会翻译更有价值。',
  },
  {
    id: 'focus',
    word: 'focus',
    meaning: '专注；焦点',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 28,
    example: 'Today I will focus on listening and pronunciation.',
    collocations: ['focus on', 'main focus', 'stay focused'],
    scenarios: ['study', 'work'],
    skills: ['speaking', 'writing'],
    note: '学习计划、会议和复盘中都很实用。',
  },
  {
    id: 'follow',
    word: 'follow',
    meaning: '跟随；理解；遵循',
    partOfSpeech: 'verb',
    level: 'A1',
    priority: 29,
    example: 'I can follow the conversation when people speak slowly.',
    collocations: ['follow a plan', 'follow instructions', 'follow a conversation'],
    scenarios: ['study', 'communication', 'work'],
    skills: ['listening', 'reading', 'speaking'],
    note: '听力里 “follow” 常表示“跟得上、听得懂”。',
  },
  {
    id: 'improve',
    word: 'improve',
    meaning: '提高；改善',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 30,
    example: 'I want to improve my spoken English this year.',
    collocations: ['improve skills', 'improve quickly', 'improve quality'],
    scenarios: ['study', 'work'],
    skills: ['speaking', 'writing'],
    note: '英语学习目标中最高频的动词之一。',
  },
  {
    id: 'include',
    word: 'include',
    meaning: '包括；包含',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 31,
    example: 'Your review should include one new phrase and one example.',
    collocations: ['include details', 'include examples', 'not including'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing'],
    note: '说明范围和组成时很常用。',
  },
  {
    id: 'increase',
    word: 'increase',
    meaning: '增加；增长',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 32,
    example: 'Increase your listening time slowly, not suddenly.',
    collocations: ['increase speed', 'increase confidence', 'increase by'],
    scenarios: ['study', 'work'],
    skills: ['reading', 'writing'],
    note: '数据、能力和数量变化中常用。',
  },
  {
    id: 'information',
    word: 'information',
    meaning: '信息；资料',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 33,
    example: 'Too much information can make learning harder.',
    collocations: ['useful information', 'more information', 'share information'],
    scenarios: ['study', 'work', 'communication'],
    skills: ['listening', 'reading', 'writing'],
    note: '不可数名词，不说 an information。',
  },
  {
    id: 'important',
    word: 'important',
    meaning: '重要的',
    partOfSpeech: 'adjective',
    level: 'A1',
    priority: 34,
    example: 'It is important to review words in real sentences.',
    collocations: ['important point', 'important decision', 'it is important to'],
    scenarios: ['thinking', 'study', 'work'],
    skills: ['speaking', 'writing'],
    note: '表达优先级和判断时的基础词。',
  },
  {
    id: 'issue',
    word: 'issue',
    meaning: '问题；议题',
    partOfSpeech: 'noun',
    level: 'B1',
    priority: 35,
    example: 'The main issue is that I understand words but cannot use them.',
    collocations: ['main issue', 'technical issue', 'address an issue'],
    scenarios: ['work', 'problem-solving'],
    skills: ['reading', 'speaking', 'writing'],
    note: '比 problem 更中性，职场中很常见。',
  },
  {
    id: 'learn',
    word: 'learn',
    meaning: '学习；得知',
    partOfSpeech: 'verb',
    level: 'A1',
    priority: 36,
    example: 'I learn better when I use a word in my own sentence.',
    collocations: ['learn from', 'learn how to', 'learn by doing'],
    scenarios: ['study'],
    skills: ['listening', 'speaking', 'reading', 'writing'],
    note: '整个学习系统的核心动词。',
  },
  {
    id: 'likely',
    word: 'likely',
    meaning: '可能的；很可能',
    partOfSpeech: 'adjective',
    level: 'B1',
    priority: 37,
    example: 'You are more likely to remember words you actually use.',
    collocations: ['be likely to', 'more likely', 'highly likely'],
    scenarios: ['thinking', 'work'],
    skills: ['reading', 'writing', 'speaking'],
    note: '表达概率判断时比 maybe 更正式。',
  },
  {
    id: 'manage',
    word: 'manage',
    meaning: '管理；设法做到',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 38,
    example: 'I managed to finish my speaking practice before work.',
    collocations: ['manage time', 'manage to do', 'manage a project'],
    scenarios: ['work', 'time', 'problem-solving'],
    skills: ['speaking', 'writing'],
    note: 'manage to do 表示“困难中设法完成”。',
  },
  {
    id: 'matter',
    word: 'matter',
    meaning: '事情；要紧；有关系',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 39,
    example: 'Consistency matters more than a perfect study plan.',
    collocations: ['it matters', 'no matter', 'serious matter'],
    scenarios: ['thinking', 'emotion', 'daily'],
    skills: ['listening', 'speaking', 'writing'],
    note: '作动词时很口语化，表示“重要”。',
  },
  {
    id: 'need',
    word: 'need',
    meaning: '需要；必要',
    partOfSpeech: 'verb',
    level: 'A1',
    priority: 40,
    example: 'I need a simple way to review useful words.',
    collocations: ['need to do', 'need help', 'basic need'],
    scenarios: ['daily', 'study', 'work'],
    skills: ['listening', 'speaking', 'writing'],
    note: '表达需求、计划和建议时最基础。',
  },
  {
    id: 'offer',
    word: 'offer',
    meaning: '提供；提议；报价',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 41,
    example: 'This lesson offers three ways to practice the same word.',
    collocations: ['offer help', 'offer advice', 'job offer'],
    scenarios: ['work', 'communication'],
    skills: ['reading', 'speaking', 'writing'],
    note: '职场邮件和服务说明中很常见。',
  },
  {
    id: 'practice',
    word: 'practice',
    meaning: '练习；实践',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 42,
    example: 'Daily practice turns passive vocabulary into active vocabulary.',
    collocations: ['daily practice', 'speaking practice', 'practice makes perfect'],
    scenarios: ['study'],
    skills: ['listening', 'speaking', 'reading', 'writing'],
    note: '既是名词也是动词，是学习产品的核心词。',
  },
  {
    id: 'prepare',
    word: 'prepare',
    meaning: '准备',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 43,
    example: 'Prepare two sentences before you start speaking.',
    collocations: ['prepare for', 'prepare a list', 'well prepared'],
    scenarios: ['study', 'work', 'time'],
    skills: ['speaking', 'writing'],
    note: '适合连接学习计划和实际输出。',
  },
  {
    id: 'problem',
    word: 'problem',
    meaning: '问题；难题',
    partOfSpeech: 'noun',
    level: 'A1',
    priority: 44,
    example: 'My biggest problem is that I forget words quickly.',
    collocations: ['solve a problem', 'common problem', 'big problem'],
    scenarios: ['problem-solving', 'study', 'work'],
    skills: ['speaking', 'writing'],
    note: '描述困难和需求时非常基础。',
  },
  {
    id: 'process',
    word: 'process',
    meaning: '过程；流程；处理',
    partOfSpeech: 'noun',
    level: 'B1',
    priority: 45,
    example: 'Vocabulary learning is a process, not a one-time task.',
    collocations: ['learning process', 'step-by-step process', 'process data'],
    scenarios: ['study', 'work', 'thinking'],
    skills: ['reading', 'writing'],
    note: '适合描述系统、流程和成长路径。',
  },
  {
    id: 'provide',
    word: 'provide',
    meaning: '提供；供给',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 46,
    example: 'The app provides examples for each core word.',
    collocations: ['provide support', 'provide information', 'provide examples'],
    scenarios: ['work', 'study'],
    skills: ['reading', 'writing'],
    note: '比 give 更正式，常用于说明功能和服务。',
  },
  {
    id: 'reason',
    word: 'reason',
    meaning: '原因；理由；理性思考',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 47,
    example: 'The reason I review aloud is to train pronunciation too.',
    collocations: ['main reason', 'reason for', 'for this reason'],
    scenarios: ['thinking', 'communication'],
    skills: ['speaking', 'writing'],
    note: '解释观点和做因果表达时必备。',
  },
  {
    id: 'require',
    word: 'require',
    meaning: '需要；要求',
    partOfSpeech: 'verb',
    level: 'B1',
    priority: 48,
    example: 'Real progress requires regular review and active use.',
    collocations: ['require effort', 'require time', 'required course'],
    scenarios: ['work', 'study'],
    skills: ['reading', 'writing'],
    note: '比 need 更正式，适合规则、条件和说明。',
  },
  {
    id: 'result',
    word: 'result',
    meaning: '结果；成果',
    partOfSpeech: 'noun',
    level: 'A2',
    priority: 49,
    example: 'The result of daily review is better recall.',
    collocations: ['as a result', 'good result', 'result of'],
    scenarios: ['study', 'work', 'thinking'],
    skills: ['reading', 'writing', 'speaking'],
    note: '适合总结、复盘和因果表达。',
  },
  {
    id: 'support',
    word: 'support',
    meaning: '支持；支撑；帮助',
    partOfSpeech: 'verb',
    level: 'A2',
    priority: 50,
    example: 'Good examples support your memory and help you speak naturally.',
    collocations: ['support a plan', 'support learning', 'customer support'],
    scenarios: ['work', 'study', 'communication'],
    skills: ['reading', 'speaking', 'writing'],
    note: '可作动词和名词，常用于工作、学习和服务场景。',
  },
] satisfies CoreVocabularyEntry[]

interface VocabularySeedRow {
  source: VocabularySourceId
  rank: number
  word: string
  pronunciation: string
  partOfSpeech: PartOfSpeech
  meaning: string
}

const sourceVocabularySeedRows = `
ngsl|1|the|/ði/|determiner|这
ngsl|2|be|/bi/|verb|是
ngsl|3|and|/ænd/|conjunction|和
ngsl|4|of|/ɑv/|preposition|...的
ngsl|5|to|/tu/|preposition|向；朝
ngsl|6|a|/ə/|determiner|一
ngsl|7|in|/ɪn/|preposition|在...里面
ngsl|8|have|/hæv/|modal|拥有
ngsl|9|it|/ɪt/|pronoun|它
ngsl|10|you|/ju/|pronoun|你
ngsl|11|he|/hi/|pronoun|他
ngsl|12|for|/fɔr/|preposition|为了
ngsl|13|they|/ðeɪ/|pronoun|他们
ngsl|14|not|/nɒt/|adverb|不是
ngsl|15|that|/ðæt/|pronoun|那个
ngsl|16|we|/wi/|pronoun|我们
ngsl|17|on|/ɑn/|preposition|在...之上
ngsl|18|with|/wɪð/|preposition|和...在一起
ngsl|19|this|/ðɪs/|pronoun|这个
ngsl|20|I|/aɪ/|pronoun|我
ngsl|21|do|/du/|verb|做
ngsl|22|as|/æz/|preposition|像
ngsl|23|at|/æt/|preposition|在
ngsl|24|she|/ʃi/|pronoun|她
ngsl|25|but|/bʌt/|conjunction|但是
ngsl|26|from|/frɑm/|preposition|从...开始
ngsl|27|by|/baɪ/|preposition|靠近；在...身边
ngsl|28|will|/wɪl/|modal|将
ngsl|29|or|/ɔr/|conjunction|或者
ngsl|30|say|/seɪ/|verb|说
ngsl|31|go|/goʊ/|verb|走
ngsl|32|so|/soʊ/|conjunction|所以
ngsl|33|all|/ɔl/|adverb|完全；所有
ngsl|34|if|/ɪf/|conjunction|如果
ngsl|35|one|/wʌn/|number|一
ngsl|36|would|/wʊd/|modal|将会
ngsl|37|about|/əˈbaʊt/|preposition|关于
ngsl|38|can|/kæn/|modal|能够
ngsl|39|which|/wɪtʃ/|adjective|哪个
ngsl|40|there|/ðɛər/|adverb|那里
ngsl|41|know|/noʊ/|verb|知道
ngsl|42|more|/mɔr/|adjective|更多的
ngsl|43|get|/gɛt/|verb|得到
ngsl|44|who|/hu/|pronoun|谁
ngsl|45|like|/laɪk/|verb|喜欢
ngsl|46|when|/wɛn/|noun|什么时候
ngsl|47|think|/θɪŋk/|verb|认为；想
ngsl|48|make|/meɪk/|verb|制作
ngsl|49|time|/taɪm/|noun|时间
ngsl|50|see|/si/|verb|看
ngsl|51|what|/wʌt/|adverb|什么
ngsl|52|up|/ʌp/|preposition|向上
ngsl|53|some|/sʌm/|determiner|一些
ngsl|54|other|/ˈʌð.ər/|adjective|别的
ngsl|55|out|/aʊt/|preposition|从...里面出去
ngsl|56|good|/gʊd/|adjective|好的
ngsl|57|people|/ˈpi.pəl/|noun|人；人们
ngsl|58|year|/jɪə/|noun|年
ngsl|59|take|/teɪk/|verb|拿；取
ngsl|60|no|/noʊ/|adverb|不
ngsl|61|well|/wɛl/|adverb|很好地
ngsl|62|because|/bɪˈkɔz/|conjunction|因为
ngsl|63|very|/ˈvɛr.i/|adverb|非常；很
ngsl|64|just|/dʒʌst/|adverb|只是；刚刚
ngsl|65|come|/kʌm/|verb|来
ngsl|66|could|/kʊd/|modal|可以
ngsl|67|work|/wɜrk/|noun|工作
ngsl|68|use|/jus/|verb|使用
ngsl|69|than|/ðæn/|conjunction|比
ngsl|70|now|/naʊ/|adverb|现在
ngsl|71|then|/ðɛn/|adverb|那时
ngsl|72|also|/ˈɑl.səʊ/|adverb|也;同样
ngsl|73|into|/ˈɪn.tu/|preposition|到...里面
ngsl|74|only|/ˈoʊn.li/|adverb|唯一的；仅有的
ngsl|75|look|/lʊk/|verb|看
ngsl|76|want|/wɑnt/|verb|想要
ngsl|77|give|/gɪv/|verb|给
ngsl|78|first|/fɜrst/|adjective|第一的
ngsl|79|new|/nu/|adjective|新的
ngsl|80|way|/weɪ/|noun|方法
ngsl|81|find|/faɪnd/|verb|寻找
ngsl|82|over|/ˈoʊ.vər/|preposition|在...上面；穿越；多于；在...另一边
ngsl|83|any|/ˈɛn.i/|adjective|任何
ngsl|84|after|/ˈæf.tər/|adverb|后来；在后面
ngsl|85|day|/deɪ/|noun|一天
ngsl|86|where|/wɛər/|noun|地点
ngsl|87|thing|/θɪŋ/|noun|事情
ngsl|88|most|/moʊst/|pronoun|几乎所有
ngsl|89|should|/ʃʊd/|modal|应该
ngsl|90|need|/nid/|verb|需要
ngsl|91|much|/mʌtʃ/|pronoun|许多；大量
ngsl|92|right|/raɪt/|adjective|右边的
ngsl|93|how|/haʊ/|adverb|如何
ngsl|94|back|/bæk/|adjective|背后的；后面的；过去的
ngsl|95|mean|/min/|verb|也许
ngsl|96|even|/ˈi.vən/|adverb|即使；甚至
ngsl|97|may|/meɪ/|modal|可能
ngsl|98|here|/hɪər/|adverb|在这里
ngsl|99|many|/ˈmɛn.i/|adjective|许多的
ngsl|100|such|/sʌtʃ/|adjective|这样的；如此的
ngsl|101|last|/læst/|adjective|最近的；最后的
ngsl|102|child|/tʃaɪld/|noun|小孩（2岁到15岁之间）
ngsl|103|tell|/tɛl/|verb|告诉
ngsl|104|really|/ˈrɪə.li/|adverb|很
ngsl|105|call|/kɔl/|verb|呼叫
ngsl|106|before|/bɪˈfɔr/|adverb|在...之前
ngsl|107|company|/ˈkʌm.pə.ni/|noun|公司
ngsl|108|through|/θru/|adjective|通过
ngsl|109|down|/daʊn/|preposition|向下
ngsl|110|show|/ʃoʊ/|verb|展示
ngsl|111|life|/laɪf/|noun|生命
ngsl|112|man|/mæn/|noun|男人
ngsl|113|change|/tʃeɪndʒ/|verb|改变
ngsl|114|place|/pleɪs/|verb|放置
ngsl|115|long|/lɔŋ/|adjective|长的
ngsl|116|between|/bɪˈtwin/|preposition|两者之间
ngsl|117|feel|/fil/|verb|感觉
ngsl|118|too|/tu/|adverb|也
ngsl|119|still|/stɪl/|adverb|仍然；还
ngsl|120|problem|/ˈprɑb.ləm/|noun|问题
ngsl|121|write|/raɪt/|verb|写
ngsl|122|same|/seɪm/|adjective|相同的；无变化的
ngsl|123|lot|/lɑt/|noun|大量；许多
ngsl|124|great|/greɪt/|adjective|极好的；美妙的；伟大的
ngsl|125|try|/traɪ/|verb|努力；尝试
ngsl|126|leave|/liv/|verb|离开
ngsl|127|number|/ˈnʌm.bər/|noun|数字
ngsl|128|both|/boʊθ/|determiner|两者
ngsl|129|own|/oʊn/|determiner|属于自己的
ngsl|130|part|/pɑrt/|noun|部分
ngsl|131|point|/pɔɪnt/|verb|指向
ngsl|132|little|/ˈlɪt.l/|adjective|小的
ngsl|133|help|/hɛlp/|verb|帮助
ngsl|134|ask|/æsk/|verb|问
ngsl|135|meet|/mit/|verb|遇见
ngsl|136|start|/stɑrt/|noun|开始
ngsl|137|talk|/tɔk/|verb|谈话
ngsl|138|something|/ˈsʌmˌθɪŋ/|pronoun|某事
ngsl|139|put|/pʊt/|verb|放；安置
ngsl|140|another|/əˈnʌð.ər/|determiner|另一个；别的
ngsl|141|become|/bɪˈkʌm/|verb|开始变得；成为
ngsl|142|interest|/ˈɪn.tər.ɪst/|verb|兴趣
ngsl|143|country|/ˈkʌn.tri/|noun|国家
ngsl|144|old|/oʊld/|adjective|陈旧的；年老的
ngsl|145|each|/itʃ/|determiner|每个
ngsl|146|school|/skul/|noun|学校
ngsl|147|late|/leɪt/|adjective|晚的
ngsl|148|high|/haɪ/|adjective|高的
ngsl|149|different|/ˈdɪf.ər.ənt/|adjective|不同的
ngsl|150|off|/ɑf/|adjective|离开
ngsl|151|next|/nɛkst/|adjective|下一个的
ngsl|152|end|/ɛnd/|noun|终止；结束
ngsl|153|live|/lɪv/|verb|生活
ngsl|154|why|/waɪ/|adverb|为什么
ngsl|155|while|/waɪl/|conjunction|当...的时候；同时
ngsl|156|world|/wɜrld/|noun|世界
ngsl|157|week|/wik/|noun|星期；周
ngsl|158|play|/pleɪ/|verb|玩
ngsl|159|might|/maɪt/|modal|可能
ngsl|160|must|/mʌst/|modal|必须
ngsl|161|home|/hoʊm/|noun|家庭
ngsl|162|never|/ˈnɛv.ər/|adverb|从未；决不
ngsl|163|include|/ɪnˈklud/|verb|包含；包括
ngsl|164|course|/kɔrs/|noun|过程
ngsl|165|house|/haʊs/|noun|房屋；住宅
ngsl|166|report|/rɪˈpɔrt/|noun|报告
ngsl|167|group|/grup/|noun|组；团体
ngsl|168|case|/keɪs/|noun|案件
ngsl|169|woman|/ˈwʊm.ən/|noun|女人
ngsl|170|around|/əˈraʊnd/|adverb|围绕
ngsl|171|book|/bʊk/|noun|书
ngsl|172|family|/ˈfæm.ə.li/|noun|家庭
ngsl|173|seem|/sim/|verb|似乎
ngsl|174|let|/lɛt/|verb|让；允许
ngsl|175|again|/əˈgɛn/|adverb|再一次；又
ngsl|176|kind|/kaɪnd/|noun|种类
ngsl|177|keep|/kip/|verb|保持
ngsl|178|hear|/hɪər/|verb|听
ngsl|179|system|/ˈsɪs.təm/|noun|体系；制度
ngsl|180|every|/ˈɛv.ri/|determiner|每一个
ngsl|181|question|/ˈkwɛs.tʃən/|verb|提问
ngsl|182|during|/ˈdʊər.ɪŋ/|preposition|在...期间
ngsl|183|always|/ˈɑl.weɪz/|adverb|总是；常常
ngsl|184|big|/bɪg/|adjective|大的
ngsl|185|set|/sɛt/|noun|一套
ngsl|186|small|/smɔl/|adjective|小的
ngsl|187|study|/ˈstʌd.i/|verb|学习
ngsl|188|follow|/ˈfɑl.oʊ/|verb|跟随；遵循
ngsl|189|begin|/bɪˈgɪn/|verb|开始变得；成为
ngsl|190|important|/ɪm.ˈpɔr.tənt/|adjective|重要的
ngsl|191|since|/sɪns/|preposition|自从
ngsl|192|run|/rʌn/|verb|跑步
ngsl|193|under|/ˈʌn.dər/|adjective|较低的
ngsl|194|turn|/tɜrn/|verb|转动
ngsl|195|few|/fju/|adjective|很少的；几个
ngsl|196|bring|/brɪŋ/|verb|带来
ngsl|197|early|/ˈɜr.li/|adjective|早期的
ngsl|198|hand|/hænd/|noun|手
ngsl|199|state|/steɪt/|noun|州
ngsl|200|move|/muv/|verb|移动
ngsl|201|money|/ˈmʌn.i/|noun|金钱
ngsl|202|fact|/fækt/|noun|事实
ngsl|203|however|/haʊˈɛv.ər/|conjunction|然而；但是
ngsl|204|area|/ˈɛər.i.ə/|noun|地区；领域
ngsl|205|provide|/prəˈvaɪd/|verb|准备；提供
ngsl|206|name|/neɪm/|noun|姓名
ngsl|207|read|/rid/|verb|阅读
ngsl|208|friend|/frɛnd/|noun|朋友
ngsl|209|month|/mʌnθ/|noun|月
ngsl|210|large|/lɑrdʒ/|adjective|大的
ngsl|211|business|/ˈbɪz.nɪs/|noun|生意
ngsl|212|without|/wɪðˈaʊt/|preposition|没有
ngsl|213|information|/ˌɪn.fərˈmeɪ.ʃən/|noun|信息
ngsl|214|open|/ˈoʊ.pən/|adjective|打开
ngsl|215|order|/ˈɔr.dər/|verb|订购
ngsl|216|government|/ˈgʌv.ərn.mənt/|noun|政府
ngsl|217|word|/wɜrd/|noun|单词
ngsl|218|issue|/ˈɪʃ.u/|noun|重要议题
ngsl|219|market|/ˈmɑr.kɪt/|noun|市场
ngsl|220|pay|/peɪ/|verb|支付
ngsl|221|build|/bɪld/|verb|建筑
ngsl|222|hold|/hoʊld/|verb|抓住
ngsl|223|service|/ˈsɜr.vɪs/|verb|维修
ngsl|224|against|/əˈgɛnst/|preposition|与...相反；反对
ngsl|225|believe|/bɪˈliv/|verb|相信
ngsl|226|second|/ˈsɛk.ənd/|adjective|第二的；次要的
ngsl|227|though|/ðoʊ/|adverb|尽管
ngsl|228|yes|/jɛs/|interjection|是的
ngsl|229|love|/lʌv/|verb|爱
ngsl|230|increase|/ɪnˈkris/|verb|增长
ngsl|231|job|/dʒɑb/|noun|工作
ngsl|232|plan|/plæn/|verb|计划
ngsl|233|result|/rɪˈzʌlt/|verb|结果
ngsl|234|away|/əˈweɪ/|adverb|不在；远离；在另一方向
ngsl|235|example|/ɪɡˈzæm.pəl/|noun|例子
ngsl|236|happen|/ˈhæp.ən/|verb|发生
ngsl|237|offer|/ˈɑ.fər/|verb|提供
ngsl|238|young|/jʌŋ/|adjective|幼小的；未成熟的
ngsl|239|close|/kloʊz/|adverb|接近地；不远地
ngsl|240|program|/ˈproʊ.græm/|noun|计划；程序
ngsl|241|lead|/lid/|verb|带领
ngsl|242|buy|/baɪ/|verb|购买
ngsl|243|understand|/ˌʌn.dərˈstænd/|verb|理解
ngsl|244|thank|/θæŋk/|verb|谢谢
ngsl|245|far|/fɑr/|adjective|远的
ngsl|246|today|/təˈdeɪ/|adverb|在今日；当今
ngsl|247|hour|/ˈaʊ.ər/|noun|小时
ngsl|248|student|/ˈstu.dənt/|noun|学生
ngsl|249|face|/feɪs/|noun|脸
ngsl|250|hope|/hoʊp/|noun|希望
ngsl|251|idea|/aɪˈdi.ə/|noun|主意；想法；意见；信念
ngsl|252|cost|/kɔst/|noun|成本
ngsl|253|less|/lɛs/|adjective|较少的
ngsl|254|room|/rum/|noun|房间
ngsl|255|until|/ʌnˈtɪl/|conjunction|直到
ngsl|256|reason|/ˈri.zən/|noun|理由
ngsl|257|form|/fɔrm/|noun|形式
ngsl|258|spend|/spɛnd/|verb|花费
ngsl|259|head|/hɛd/|noun|头
ngsl|260|car|/kɑr/|noun|车
ngsl|261|learn|/lɜrn/|verb|学习
ngsl|262|level|/ˈlɛv.əl/|verb|使平坦
ngsl|263|person|/ˈpɜr.sən/|noun|人
ngsl|264|experience|/ɪkˈspɪər.i.əns/|noun|经验
ngsl|265|once|/wʌns/|adverb|一次
ngsl|266|member|/ˈmɛm.bər/|noun|成员
ngsl|267|enough|/ɪˈnʌf/|adjective|充足的
ngsl|268|bad|/bæd/|adjective|不好的；坏的
ngsl|269|city|/ˈsɪt.i/|noun|城市
ngsl|270|night|/naɪt/|noun|夜晚
ngsl|271|able|/ˈeɪ.bəl/|adjective|能够的
ngsl|272|support|/səˈpɔrt/|verb|支持
ngsl|273|whether|/ˈwɛð.ər/|conjunction|是否
ngsl|274|line|/laɪn/|noun|线
ngsl|275|present|/ˈprɛz.ənt/|noun|礼物
ngsl|276|side|/saɪd/|noun|一边
ngsl|277|quite|/kwaɪt/|adverb|很；相当地
ngsl|278|although|/ɔlˈðoʊ/|conjunction|虽然；尽管
ngsl|279|sure|/ʃʊə/|adjective|确信的
ngsl|280|term|/tɜrm/|noun|学期
ngsl|281|least|/list/|adverb|最小；最少
ngsl|282|age|/eɪdʒ/|noun|年龄
ngsl|283|low|/loʊ/|adjective|低的；近底部的
ngsl|284|speak|/spik/|verb|讲话；发言
ngsl|285|within|/wɪðˈɪn/|adverb|在..（空间，时间或范围）之内
ngsl|286|process|/ˈprɑs.ɛs/|verb|加工；处理
ngsl|287|public|/ˈpʌb.lɪk/|adjective|公总的
ngsl|288|often|/ˈɑf.(t)ən/|adverb|经常
ngsl|289|train|/treɪn/|noun|火车
ngsl|290|possible|/ˈpɑs.ə.bəl/|adjective|可能的
ngsl|291|actually|/ˈæk.tʃu.ə.li/|adverb|实际上
ngsl|292|rather|/ˈræð.ər/|adverb|或多或少地；相当地；稍微
ngsl|293|view|/vju/|noun|视野
ngsl|294|together|/təˈgɛð.ər/|adverb|在一起
ngsl|295|consider|/kənˈsɪd.ər/|verb|考虑
ngsl|296|price|/praɪs/|verb|价格
ngsl|297|parent|/ˈpɛər.ənt/|noun|父母
ngsl|298|hard|/hɑrd/|adjective|硬的；坚固的
ngsl|299|party|/ˈpɑr.ti/|noun|派对
ngsl|300|local|/ˈloʊ.kəl/|adjective|当地的
ngsl|301|control|/kənˈtroʊl/|verb|控制
ngsl|302|already|/ɔlˈrɛd.i/|adverb|已经
ngsl|303|concern|/kənˈsɜrn/|noun|担心；忧虑
ngsl|304|product|/ˈprɑd.əkt/|noun|产品
ngsl|305|lose|/luz/|verb|失去
ngsl|306|story|/ˈstɔr.i/|noun|故事
ngsl|307|almost|/ˈɑl.məʊst/|adverb|几乎；差不多
ngsl|308|continue|/kənˈtɪn.ju/|verb|继续
ngsl|309|stand|/stænd/|verb|站立
ngsl|310|whole|/hoʊl/|adjective|整体的；所有的
ngsl|311|yet|/jɛt/|adverb|还；即刻
ngsl|312|rate|/reɪt/|noun|速度；比率
ngsl|313|care|/kɛər/|verb|关心
ngsl|314|expect|/ɪkˈspɛkt/|verb|期望
ngsl|315|effect|/ɪˈfɛkt/|noun|影响；效果
ngsl|316|sort|/sɔrt/|noun|种类；类别
ngsl|317|ever|/ˈɛv.ər/|adverb|任何时候；永远
ngsl|318|anything|/ˈɛn.iˌθɪŋ/|pronoun|任何事物
ngsl|319|cause|/kɔz/|verb|使发生；造成
ngsl|320|fall|/fɔl/|noun|落下
ngsl|321|deal|/dil/|verb|发（牌）；分配
ngsl|322|water|/ˈwɔ.tər/|noun|水
ngsl|323|send|/sɛnd/|verb|发送；寄
ngsl|324|allow|/əˈlaʊ/|verb|允许
ngsl|325|soon|/sun/|adverb|不久
ngsl|326|watch|/wɑtʃ/|verb|观看
ngsl|327|base|/beɪs/|noun|基础
ngsl|328|probably|/ˈprɑb.ə.bli/|adverb|可能地
ngsl|329|suggest|/səgˈdʒɛst/|verb|建议
ngsl|330|past|/pæst/|noun|过去
ngsl|331|power|/ˈpaʊ.ər/|noun|力量
ngsl|332|test|/tɛst/|noun|测验
ngsl|333|visit|/ˈvɪz.ɪt/|verb|参观
ngsl|334|center|/ˈsɛn.tər/|noun|中心
ngsl|335|grow|/groʊ/|verb|发展；生长
ngsl|336|nothing|/ˈnʌθ.ɪŋ/|pronoun|没有什么
ngsl|337|return|/rɪˈtɜrn/|verb|返回
ngsl|338|mother|/ˈmʌð.ər/|noun|母亲
ngsl|339|walk|/wɔk/|verb|走路
ngsl|340|matter|/ˈmæt.ər/|noun|事情；问题
ngsl|341|mind|/maɪnd/|noun|理智；头脑
ngsl|342|value|/ˈvæl.ju/|verb|估价
ngsl|343|office|/ˈɑ.fɪs/|noun|办公室
ngsl|344|record|/ˈrɛk.ərd/|noun|记录
ngsl|345|stay|/steɪ/|verb|暂住
ngsl|346|force|/fɔrs/|verb|强迫
ngsl|347|stop|/stɑp/|verb|停止
ngsl|348|several|/ˈsɛv.ər.əl/|determiner|一些
ngsl|349|light|/laɪt/|adjective|轻的
ngsl|350|develop|/dɪˈvɛl.əp/|verb|发展
ngsl|351|remember|/rɪˈmɛm.bər/|verb|回想起；记得
ngsl|352|bit|/bɪt/|noun|一点
ngsl|353|share|/ʃɛər/|noun|股份
ngsl|354|real|/ril/|adjective|真实的;实在的
ngsl|355|answer|/ˈæn.sər/|noun|回答；答案
ngsl|356|sit|/sɪt/|verb|坐
ngsl|357|figure|/ˈfɪɡ.jər/|verb|计算
ngsl|358|letter|/ˈlɛt.ər/|noun|信件
ngsl|359|decide|/dɪˈsaɪd/|verb|决定
ngsl|360|language|/ˈlæŋ.gwɪdʒ/|noun|语言
ngsl|361|subject|/ˈsʌb.dʒɪkt/|noun|主题；话题
ngsl|362|class|/klæs/|noun|社会等级；阶级
ngsl|363|development|/dɪˈvɛl.əp.mənt/|noun|开发
ngsl|364|town|/taʊn/|noun|镇
ngsl|365|half|/hæf/|noun|一半
ngsl|366|minute|/ˈmɪn.ɪt/|noun|分钟
ngsl|367|food|/fud/|noun|食物
ngsl|368|break|/breɪk/|verb|打破
ngsl|369|clear|/klɪər/|adjective|清楚的；明确的；明显的
ngsl|370|future|/ˈfju.tʃər/|noun|将来
ngsl|371|either|/ˈi.ðər/|adjective|(两者之中)任何一个的
ngsl|372|ago|/əˈgoʊ/|adverb|以前
ngsl|373|per|/pɜr/|preposition|每
ngsl|374|remain|/rɪˈmeɪn/|verb|剩下；保持
ngsl|375|top|/tɒp/|noun|顶端
ngsl|376|among|/əˈmʌŋ/|preposition|在...之中；相互间
ngsl|377|win|/wɪn/|verb|赢
ngsl|378|color|/ˈkʌl.ər/|noun|颜色
ngsl|379|involve|/ɪnˈvɑlv/|verb|涉及
ngsl|380|reach|/ritʃ/|verb|达到
ngsl|381|social|/ˈsoʊ.ʃəl/|adjective|社会的
ngsl|382|period|/ˈpɪər.i.əd/|noun|时期
ngsl|383|across|/əˈkrɑs/|adverb|从...一边到另一边
ngsl|384|note|/noʊt/|verb|笔记
ngsl|385|history|/ˈhɪs.tə.ri/|noun|历史
ngsl|386|create|/kriˈeɪt/|verb|创造
ngsl|387|drive|/draɪv/|verb|驾驶
ngsl|388|along|/əˈlɔŋ/|preposition|沿着
ngsl|389|type|/taɪp/|noun|类型
ngsl|390|sound|/saʊnd/|noun|声音
ngsl|391|eye|/aɪ/|noun|眼睛
ngsl|392|music|/ˈmju.zɪk/|noun|音乐
ngsl|393|game|/geɪm/|noun|游戏
ngsl|394|political|/pəˈlɪt.ɪ.kəl/|adjective|政治的
ngsl|395|free|/fri/|adjective|免费的
ngsl|396|receive|/rɪˈsiv/|verb|收到
ngsl|397|moment|/ˈmoʊ.mənt/|noun|片刻
ngsl|398|sale|/seɪl/|noun|出售；销售额
ngsl|399|policy|/ˈpɑl.ə.si/|noun|政策
ngsl|400|further|/ˈfɜr.ðər/|adjective|进一步的；附加的
ngsl|401|body|/ˈbɑd.i/|noun|身体
ngsl|402|require|/rɪˈkwaɪər/|verb|要求
ngsl|403|wait|/weɪt/|verb|等待
ngsl|404|general|/ˈdʒɛn.ər.əl/|adjective|一般的；普通的
ngsl|405|appear|/əˈpɪər/|verb|出现
ngsl|406|toward|/təˈwɔrd/|adverb|朝着
ngsl|407|team|/tim/|noun|团队
ngsl|408|easy|/ˈi.zi/|adjective|容易的
ngsl|409|individual|/ˌɪn.dəˈvɪdʒ.u.əl/|noun|个人
ngsl|410|full|/fʊl/|adjective|满的
ngsl|411|black|/blæk/|adjective|黑色的
ngsl|412|sense|/sɛns/|verb|感觉到
ngsl|413|perhaps|/pərˈhæps/|adverb|也许；可能
ngsl|414|add|/æd/|verb|添加；相加
ngsl|415|rule|/rul/|noun|规则
ngsl|416|pass|/pæs/|verb|经过
ngsl|417|produce|/prəˈdus/|verb|生产
ngsl|418|sell|/sɛl/|verb|卖
ngsl|419|short|/ʃɔrt/|noun|短
ngsl|420|agree|/əˈgri/|verb|同意
ngsl|421|law|/lɔ/|noun|法律
ngsl|422|everything|/ˈɛv.riˌθɪŋ/|pronoun|所有事
ngsl|423|research|/rɪˈsɜrtʃ/|verb|研究
ngsl|424|cover|/ˈkʌv.ər/|noun|遮盖物
ngsl|425|paper|/ˈpeɪ.pər/|noun|纸
ngsl|426|position|/pəˈzɪʃ.ən/|noun|位置
ngsl|427|near|/nɪər/|adjective|（距离）近的
ngsl|428|human|/ˈhju.mən/|noun|人，人类
ngsl|429|computer|/kəmˈpju.tər/|noun|计算机
ngsl|430|situation|/ˌsɪtʃ.uˈeɪ.ʃən/|noun|情况；处境；位置
ngsl|431|staff|/stæf/|noun|职员
ngsl|432|activity|/ækˈtɪv.ɪ.ti/|noun|活动
ngsl|433|film|/fɪlm/|noun|电影
ngsl|434|morning|/ˈmɔr.nɪŋ/|noun|早晨
ngsl|435|war|/wɔr/|noun|战争
ngsl|436|account|/əˈkaʊnt/|noun|账户
ngsl|437|shop|/ʃɑp/|noun|商店
ngsl|438|major|/ˈmeɪ.dʒər/|adjective|主要的；重要的
ngsl|439|someone|/ˈsʌmˌwʌn/|pronoun|某人
ngsl|440|above|/əˈbʌv/|adverb|在较高处
ngsl|441|design|/dɪˈzaɪn/|verb|设计
ngsl|442|event|/ɪˈvɛnt/|noun|事件
ngsl|443|special|/ˈspɛʃ.əl/|adjective|特别的；重要的
ngsl|444|sometimes|/ˈsʌmˌtaɪmz/|adverb|有时；间或
ngsl|445|condition|/kənˈdɪ.ʃən/|noun|条件
ngsl|446|carry|/ˈkær.i/|verb|拿；搬运
ngsl|447|choose|/tʃuz/|verb|选择
ngsl|448|father|/ˈfɑ.ðər/|noun|父亲
ngsl|449|decision|/dɪˈsɪʒ.ən/|noun|决定
ngsl|450|table|/ˈteɪ.bəl/|noun|桌子
ngsl|451|certain|/ˈsɜr.tn/|adjective|肯定的
ngsl|452|forward|/ˈfɔr.wərd/|adverb|向前
ngsl|453|main|/meɪn/|adjective|主要的；重要的
ngsl|454|die|/daɪ/|verb|死
ngsl|455|bear|/bɛər/|noun|熊
ngsl|456|cut|/kʌt/|verb|切；割
ngsl|457|describe|/dɪˈskraɪb/|verb|描述
ngsl|458|himself|/hɪmˈsɛlf/|pronoun|他自己
ngsl|459|available|/əˈveɪ.lə.bəl/|adjective|有空的；可获得的
ngsl|460|especially|/ɪˈspɛʃ.ə.li/|adverb|特别地;尤其
ngsl|461|strong|/strɔŋ/, /strɑŋ/|adjective|强壮的;坚强的
ngsl|462|rise|/raɪz/|verb|上升
ngsl|463|girl|/gɜrl/|noun|女孩
ngsl|464|maybe|/ˈmeɪ.bi/|adverb|可能
ngsl|465|community|/kəˈmju.nɪ.ti/|noun|社区；团体
ngsl|466|else|/ɛls/|adverb|否则；不然
ngsl|467|particular|/pərˈtɪk.jə.lər/|adjective|特指的
ngsl|468|role|/roʊl/|noun|角色
ngsl|469|join|/dʒɔɪn/|verb|参加；结合
ngsl|470|difficult|/ˈdɪf.ɪˌkʌlt/|adjective|困难的
ngsl|471|please|/pliz/|adverb|请
ngsl|472|detail|/dɪˈteɪl/|noun|细节
ngsl|473|difference|/ˈdɪf.ər.əns/|noun|不同；差异
ngsl|474|action|/ˈæk.ʃən/|noun|行动
ngsl|475|health|/hɛlθ/|noun|健康
ngsl|476|eat|/it/|verb|吃
ngsl|477|step|/stɛp/|noun|脚步
ngsl|478|true|/tru/|adjective|如实的；真正的；确实的
ngsl|479|phone|/foʊn/|verb|打电话
ngsl|480|themselves|/ðəmˈsɛlvz/|pronoun|他们自己
ngsl|481|draw|/drɔ/|verb|画画
ngsl|482|white|/waɪt/|adjective|白色的
ngsl|483|date|/deɪt/|noun|日期
ngsl|484|practice|/ˈpræk.tɪs/|verb|练习
ngsl|485|model|/ˈmɑd.l/|noun|模型；模范
ngsl|486|raise|/reɪz/|verb|增加；提高
ngsl|487|customer|/ˈkʌs.tə.mər/|noun|顾客
ngsl|488|front|/frʌnt/|adjective|前面的；正面的
ngsl|489|explain|/ɪkˈspleɪn/|verb|说明；解释
ngsl|490|door|/dɔr/|noun|门
ngsl|491|outside|/ˈaʊt.saɪd/|noun|外部
ngsl|492|behind|/bɪˈhaɪnd/|adverb|在后面
ngsl|493|economic|/ˌɛk.əˈnɑm.ɪk/|adjective|经济的
ngsl|494|site|/saɪt/|noun|地点；位置
ngsl|495|approach|/əˈproʊtʃ/|verb|接近
ngsl|496|teacher|/ˈti.tʃər/|noun|老师；教师
ngsl|497|land|/lænd/|noun|土地;地面
ngsl|498|charge|/tʃɑrdʒ/|verb|收费
ngsl|499|finally|/ˈfaɪ.nə.li/|adverb|最后
ngsl|500|sign|/saɪn/|noun|签名
ngsl|501|claim|/kleɪm/|verb|声称
ngsl|502|relationship|/rɪˈleɪ.ʃənˌʃɪp/|noun|关系
ngsl|503|travel|/ˈtræv.əl/|verb|旅行
ngsl|504|enjoy|/ɛnˈdʒɔɪ/|verb|享受
ngsl|505|death|/dɛθ/|noun|死亡
ngsl|506|nice|/naɪs/|adjective|美好的
ngsl|507|amount|/əˈmaʊnt/|noun|数量
ngsl|508|improve|/ɪmˈpruv/|verb|改善；提高
ngsl|509|picture|/ˈpɪk.tʃər/|noun|图画；照片
ngsl|510|boy|/bɔɪ/|noun|男孩
ngsl|511|regard|/rɪˈgɑrd/|verb|注意
ngsl|512|organization|/ˌɑ.ɡə.naɪˈzeɪ.ʃən/|noun|组织
ngsl|513|happy|/ˈhæp.i/|adjective|高兴的;快乐的
ngsl|514|couple|/ˈkʌp.əl/|noun|一对；两人；两件事
ngsl|515|act|/ækt/|verb|表演
ngsl|516|range|/reɪndʒ/|noun|范围
ngsl|517|quality|/ˈkwɑ.lɪ.ti/|noun|质量
ngsl|518|project|/ˈprə.dʒɛkt/|noun|项目
ngsl|519|round|/raʊnd/|adjective|圆的
ngsl|520|opportunity|/ˌɑp.ərˈtu.nɪ.ti/|noun|机会
ngsl|521|road|/roʊd/|noun|道路
ngsl|522|accord|/əˈkɔrd/|noun|协议
ngsl|523|list|/lɪst/|noun|列表；名单
ngsl|524|wish|/wɪʃ/|verb|希望；盼望
ngsl|525|therefore|/ˈðɛərˌfɔr/|adverb|因此
ngsl|526|wear|/wɛər/|verb|穿（衣服，鞋）；戴（眼镜）
ngsl|527|fund|/fʌnd/|noun|基金
ngsl|528|rest|/rɛst/|noun|休息
ngsl|529|kid|/kɪd/|noun|孩子
ngsl|530|industry|/ˈɪn.də.stri/|noun|产业
ngsl|531|education|/ˌɛdʒ.ʊˈkeɪ.ʃən/|noun|教育
ngsl|532|measure|/ˈmɛʒ.ər/|verb|测量
ngsl|533|kill|/kɪl/|verb|杀死
ngsl|534|serve|/sɜrv/|verb|服务
ngsl|535|likely|/ˈlaɪk.li/|adjective|可能的
ngsl|536|certainly|/ˈsɜr.tn.li/|adverb|当然
ngsl|537|national|/ˈnæ.ʃə.nl/|adjective|国家的
ngsl|538|itself|/ɪtˈsɛlf/|pronoun|它自己
ngsl|539|teach|/titʃ/|verb|教
ngsl|540|field|/fild/|noun|田；地；旷野
ngsl|541|security|/sɪˈkjʊər.ɪ.ti/|noun|安保措施
ngsl|542|air|/ɛər/|noun|空气
ngsl|543|benefit|/ˈbɛn.ə.fɪt/|noun|好处;利益
ngsl|544|trade|/treɪd/|verb|贸易；交易
ngsl|545|risk|/rɪsk/|verb|风险；危险
ngsl|546|news|/nuz/|noun|新闻
ngsl|547|standard|/ˈstæn.dərd/|adjective|标准的
ngsl|548|vote|/voʊt/|verb|投票
ngsl|549|percent|/pərˈsɛnt/|noun|百分比
ngsl|550|focus|/ˈfoʊ.kəs/|noun|焦点
ngsl|551|stage|/steɪdʒ/|noun|舞台
ngsl|552|space|/speɪs/|noun|空间
ngsl|553|instead|/ɪnˈstɛd/|adverb|代替
ngsl|554|realize|/ˈri.əˌlaɪz/|verb|意识到;理解
ngsl|555|usually|/ˈju.ʒu.ə.li/|adverb|通常地
ngsl|556|data|/ˈdæt.ə/|noun|数据
ngsl|557|single|/ˈsɪŋ.gəl/|adjective|仅有一个的;单一的
ngsl|558|address|/ˈæd.rɛs/|noun|地址
ngsl|559|performance|/pərˈfɔr.məns/|noun|表演
ngsl|560|chance|/tʃæns/|noun|机会
ngsl|561|accept|/ækˈsɛpt/|verb|接受
ngsl|562|society|/səˈsaɪ.ɪ.ti/|noun|社会
ngsl|563|technology|/tɛkˈnɑl.ə.dʒi/|noun|技术
ngsl|564|mention|/ˈmɛn.ʃən/|verb|提及
ngsl|565|choice|/tʃɔɪs/|noun|选择
ngsl|566|save|/seɪv/|verb|救
ngsl|567|common|/ˈkɒm.ən/|adjective|常见的；普通的
ngsl|568|culture|/ˈkʌl.tʃər/|noun|文化
ngsl|569|total|/ˈtoʊt.l/|noun|总数
ngsl|570|demand|/dɪˈmænd/|verb|需求
ngsl|571|material|/məˈtɪər.i.əl/|noun|材料
ngsl|572|limit|/ˈlɪm.ɪt/|noun|限度
ngsl|573|listen|/ˈlɪs.ən/|verb|听
ngsl|574|due|/dju/|adjective|到期的
ngsl|575|wrong|/rɑŋ/|adjective|错误的；不正确的
ngsl|576|foot|/fʊt/|noun|脚
ngsl|577|effort|/ˈɛf.ərt/|noun|努力
ngsl|578|attention|/əˈtɛn.ʃən/|noun|注意力
ngsl|579|upon|/əˈpɑn/|preposition|在...之上
ngsl|580|check|/tʃɛk/|verb|检查
ngsl|581|complete|/kəmˈplit/|verb|完成
ngsl|582|lie|/laɪ/|verb|撒谎
ngsl|583|pick|/pɪk/|verb|挑选；选择
ngsl|584|reduce|/rɪˈdus/|verb|减少
ngsl|585|personal|/ˈpɜr.sə.nl/|adjective|个人的；私人的
ngsl|586|ground|/graʊnd/|verb|地面
ngsl|587|animal|/ˈæn.ɪ.məl/|noun|动物
ngsl|588|arrive|/əˈraɪv/|verb|到达
ngsl|589|patient|/ˈpeɪ.ʃənt/|adjective|有耐心的
ngsl|590|current|/ˈkʌ.rənt/|adjective|目前的
ngsl|591|century|/ˈsɛn.tʃə.ri/|noun|世纪
ngsl|592|evidence|/ˈɛv.ɪ.dəns/|noun|证据
ngsl|593|exist|/ɪgˈzɪst/|verb|存在;生存
ngsl|594|similar|/ˈsɪm.ə.lər/|adjective|相似的
ngsl|595|fight|/faɪt/|noun|打架
ngsl|596|leader|/ˈli.dər/|noun|领导
ngsl|597|fine|/faɪn/|adjective|好的；可接受的
ngsl|598|street|/strit/|noun|街道
ngsl|599|former|/ˈfɔr.mər/|determiner|从前的
ngsl|600|contact|/ˈkɑn.tækt/|verb|联系
ngsl|601|particularly|/pərˈtɪk.jə.lər.li/|adverb|特别地;尤其
ngsl|602|wife|/waɪf/|noun|妻子
ngsl|603|sport|/spɔrt/|noun|运动
ngsl|604|prepare|/prɪˈpɛər/|verb|准备
ngsl|605|discuss|/dɪsˈkʌs/|verb|讨论
ngsl|606|response|/rɪˈspɒns/|noun|回复
ngsl|607|voice|/vɔɪs/|noun|声音
ngsl|608|piece|/pis/|noun|片；块
ngsl|609|finish|/ˈfɪn.ɪʃ/|noun|结束
ngsl|610|suppose|/səˈpoʊz/|verb|假设；猜想
ngsl|611|apply|/əˈplaɪ/|verb|申请
ngsl|612|president|/ˈprɛz.ɪ.dənt/|noun|总统;董事长
ngsl|613|fire|/ˈfaɪ.ər/|noun|火
ngsl|614|compare|/kəmˈpɛər/|verb|比较
ngsl|615|court|/kɔrt/|noun|球场
ngsl|616|police|/pəˈlis/|noun|警察
ngsl|617|store|/stɔr/|noun|商店
ngsl|618|poor|/pʊər/|adjective|贫穷的
ngsl|619|knowledge|/ˈnɑl.ɪdʒ/|noun|只是
ngsl|620|laugh|/lɑf/|verb|笑
ngsl|621|arm|/ɑrm/|noun|手臂
ngsl|622|heart|/hɑrt/|noun|心脏
ngsl|623|source|/sɔrs/|noun|资源
ngsl|624|employee|/ɛmˈplɔɪ.i/|noun|员工
ngsl|625|manage|/ˈmæn.ɪdʒ/|verb|管理
ngsl|626|simply|/ˈsɪm.pli/|adverb|简单地
ngsl|627|bank|/bæŋk/|noun|银行
ngsl|628|firm|/fɜrm/|adjective|牢固的
ngsl|629|cell|/sɛl/|noun|手机
ngsl|630|article|/ˈɑr.tɪ.kəl/|noun|文章
ngsl|631|fast|/fæst/|adjective|快速的
ngsl|632|attack|/əˈtæk/|verb|攻击
ngsl|633|foreign|/ˈfɔr.ɪn/|adjective|外国的
ngsl|634|surprise|/sərˈpraɪz/|verb|使惊奇
ngsl|635|feature|/ˈfi.tʃər/|noun|特色；特征
ngsl|636|factor|/ˈfæk.tər/|noun|因素
ngsl|637|pretty|/ˈprɪt.i/|adjective|漂亮的
ngsl|638|recently|/ˈri.sənt.li/|adverb|最近
ngsl|639|affect|/əˈfɛkt/|verb|影响
ngsl|640|drop|/drɒp/|verb|掉落
ngsl|641|recent|/ˈri.sənt/|adjective|最近的
ngsl|642|relate|/rɪˈleɪt/|verb|把...联系起来
ngsl|643|official|/əˈfɪʃ.əl/|adjective|官方的；正式的
ngsl|644|financial|/faɪˈnæn.ʃəl/|adjective|金融的
ngsl|645|miss|/mɪs/|verb|错过
ngsl|646|art|/ɑrt/|noun|艺术
ngsl|647|campaign|/kæmˈpeɪn/|verb|参加竞选
ngsl|648|private|/ˈpraɪ.vɪt/|adjective|私人的
ngsl|649|pause|/pɑz/|verb|暂停
ngsl|650|everyone|/ˈɛv.riˌwʌn/|pronoun|每个人
ngsl|651|forget|/fərˈgɛt/|verb|忘记
ngsl|652|page|/peɪdʒ/|noun|页
ngsl|653|worry|/ˈwʌr.i/|verb|担心
ngsl|654|summer|/ˈsʌm.ər/|noun|夏季
ngsl|655|drink|/drɪŋk/|verb|喝
ngsl|656|opinion|/əˈpɪn.jən/|noun|观点；意见
ngsl|657|park|/pɑrk/|verb|公园
ngsl|658|represent|/ˌrɛp.rɪˈzɛnt/|verb|代表
ngsl|659|key|/ki/|noun|钥匙
ngsl|660|inside|/ˌɪnˈsaɪd/|adjective|在...里
ngsl|661|manager|/ˈmæn.ɪ.dʒər/|noun|经理
ngsl|662|international|/ˌɪn.tərˈnæʃ.ə.nl/|adjective|国际的
ngsl|663|contain|/kənˈteɪn/|verb|包含
ngsl|664|notice|/ˈnoʊ.tɪs/|verb|注意；察觉
ngsl|665|wonder|/ˈwʌn.dər/|noun|惊讶；惊奇
ngsl|666|nature|/ˈneɪ.tʃər/|noun|自然j界
ngsl|667|structure|/ˈstrʌk.tʃər/|noun|建筑物;结构
ngsl|668|section|/ˈsɛk.ʃən/|noun|部分；章节
ngsl|669|myself|/maɪˈsɛlf/|pronoun|我自己
ngsl|670|exactly|/ɪgˈzækt.li/|adverb|恰好地；精确地
ngsl|671|plant|/plænt/|noun|植物
ngsl|672|paint|/peɪnt/|verb|涂漆
ngsl|673|worker|/ˈwɜr.kər/|noun|工人
ngsl|674|press|/prɛs/|verb|按；压
ngsl|675|whatever|/wʌtˈɛ.vər/|determiner|任何事物
ngsl|676|necessary|/ˈnɛs.əˌsɛr.i/|adjective|必要的
ngsl|677|region|/ˈri.dʒən/|noun|地区；地域
ngsl|678|growth|/groʊθ/|noun|成长
ngsl|679|evening|/ˈiv.nɪŋ/|noun|傍晚
ngsl|680|influence|/ˈɪn.flu.əns/|verb|影响
ngsl|681|respect|/rɪˈspɛkt/|verb|尊重
ngsl|682|various|/ˈvɛər.i.əs/|adjective|各种各样的;多方面的
ngsl|683|catch|/kætʃ/|verb|抓住
ngsl|684|thus|/ðʌs/|adverb|因此
ngsl|685|skill|/skɪl/|noun|技能
ngsl|686|attempt|/əˈtɛmpt/|verb|尝试;试图
ngsl|687|son|/sʌn/|noun|儿子
ngsl|688|simple|/ˈsɪm.pəl/|adjective|简单的；容易的
ngsl|689|medium|/ˈmi.di.əm/|noun|中等的
ngsl|690|average|/ˈæv.ər.ɪdʒ/|adjective|平均的
ngsl|691|stock|/stɑk/|noun|股票
ngsl|692|management|/ˈmæn.ɪdʒ.mənt/|noun|管理
ngsl|693|character|/ˈkær.ɪk.tər/|noun|性格；品质
ngsl|694|bed|/bɛd/|noun|床
ngsl|695|hit|/hɪt/|verb|打；击
ngsl|696|establish|/ɪˈstæb.lɪʃ/|verb|创立；建立
ngsl|697|indeed|/ɪnˈdid/|adverb|的确
ngsl|698|final|/ˈfaɪn.l/|adjective|最后的
ngsl|699|economy|/ɪˈkɑn.ə.mi/|noun|经济
ngsl|700|fit|/fɪt/|adjective|合适的；恰当的
ngsl|701|guy|/gaɪ/|noun|家伙；男人
ngsl|702|function|/ˈfʌŋk.ʃən/|noun|功能
ngsl|703|yesterday|/ˈjɛs.tərˌdeɪ/|noun|昨天
ngsl|704|image|/ˈɪm.ɪdʒ/|noun|图片
ngsl|705|size|/saɪz/|noun|尺寸
ngsl|706|behavior|/bɪˈheɪv.jər/|noun|行为
ngsl|707|addition|/əˈdɪʃ.ən/|noun|添加；添加物
ngsl|708|determine|/dɪˈtɜr.mɪn/|verb|决定;下决心
ngsl|709|station|/ˈsteɪ.ʃən/|noun|车站
ngsl|710|population|/ˌpɑp.jəˈleɪ.ʃən/|noun|人口
ngsl|711|fail|/feɪl/|verb|失败
ngsl|712|environment|/ɛnˈvaɪ.rən.mənt/|noun|环境
ngsl|713|production|/prəˈdʌk.ʃən/|noun|生产
ngsl|714|contract|/ˈkɑn.trækt/|noun|合同
ngsl|715|player|/ˈpleɪ.ər/|noun|运动员
ngsl|716|comment|/ˈkɒm.ɛnt/|noun|评论
ngsl|717|enter|/ˈɛn.tər/|verb|进入
ngsl|718|occur|/əˈkɜr/|verb|发生
ngsl|719|alone|/əˈloʊn/|adverb|独自地
ngsl|720|significant|/sɪgˈnɪf.ɪ.kənt/|adjective|有意义的
ngsl|721|drug|/drʌg/|noun|药物
ngsl|722|wall|/wɔl/|noun|墙壁
ngsl|723|series|/ˈsɪər.iz/|noun|系列
ngsl|724|direct|/dɪˈrɛkt/|verb|指挥；导演
ngsl|725|success|/səkˈsɛs/|noun|成功
ngsl|726|tomorrow|/təˈmɔr.oʊ/|adverb|明天
ngsl|727|director|/dɪˈrɛk.tər/|noun|导演
ngsl|728|clearly|/ˈklɪər.li/|adverb|清楚地
ngsl|729|lack|/læk/|verb|缺少
ngsl|730|review|/rɪˈvju/|verb|审查
ngsl|731|depend|/dɪˈpɛnd/|verb|依赖
ngsl|732|race|/reɪs/|noun|竞赛
ngsl|733|recognize|/ˈrɛk.əgˌnaɪz/|verb|认出
ngsl|734|window|/ˈwɪn.doʊ/|noun|窗户
ngsl|735|purpose|/ˈpɜr.pəs/|noun|目的
ngsl|736|department|/dɪˈpɑrt.mənt/|noun|部门
ngsl|737|gain|/geɪn/|verb|获得
ngsl|738|tree|/tri/|noun|树
ngsl|739|college|/ˈkɑl.ɪdʒ/|noun|学院；大学
ngsl|740|argue|/ˈɑr.gju/|verb|争论
ngsl|741|board|/bɔrd/|noun|板
ngsl|742|holiday|/ˈhɑ.lɪˌdeɪ/|noun|假日
ngsl|743|mark|/mɑrk/|verb|标记
ngsl|744|church|/tʃɜrtʃ/|noun|教堂
ngsl|745|machine|/məˈʃin/|noun|机器
ngsl|746|achieve|/əˈtʃiv/|verb|到达
ngsl|747|item|/ˈaɪ.təm/|noun|项目
ngsl|748|prove|/pruv/|verb|证明
ngsl|749|cent|/sɛnt/|noun|分
ngsl|750|season|/ˈsi.zən/|noun|季节
ngsl|751|floor|/flɔr/|noun|地板
ngsl|752|stuff|/stʌf/|noun|东西
ngsl|753|wide|/waɪd/|adjective|宽的
ngsl|754|anyone|/ˈɛn.iˌwʌn/|pronoun|任何人
ngsl|755|method|/ˈmɛθ.əd/|noun|方法
ngsl|756|analysis|/əˈnæl.ə.sɪs/|noun|分析
ngsl|757|election|/ɪˈlɛk.ʃən/|noun|选举
ngsl|758|military|/ˈmɪl.ɪˌtɛr.i/|noun|军事
ngsl|759|hotel|/hoʊˈtɛl/|noun|酒店；宾馆
ngsl|760|club|/klʌb/|noun|俱乐部
ngsl|761|below|/bɪˈloʊ/|adverb|在下面
ngsl|762|movie|/ˈmu.vi/|noun|电影
ngsl|763|doctor|/ˈdɑk.tər/|noun|医生
ngsl|764|discussion|/dɪˈskʌʃ.ən/|noun|讨论
ngsl|765|sorry|/ˈsɔr.i/|interjection|对不起
ngsl|766|challenge|/ˈtʃæl.ɪndʒ/|noun|挑战
ngsl|767|nation|/ˈneɪ.ʃən/|noun|国家
ngsl|768|nearly|/ˈnɪər.li/|adverb|几乎
ngsl|769|statement|/ˈsteɪt.mənt/|noun|声明
ngsl|770|link|/lɪŋk/|verb|连接
ngsl|771|despite|/dɪˈspaɪt/|preposition|即使；尽管
ngsl|772|introduce|/ˌɪn.trəˈdus/|verb|介绍
ngsl|773|advantage|/ædˈvæn.tɪdʒ/|noun|优势
ngsl|774|ready|/ˈrɛd.i/|adjective|准备就绪的
ngsl|775|marry|/ˈmær.i/|verb|结婚
ngsl|776|strike|/straɪk/|verb|击；打
ngsl|777|mile|/maɪl/|noun|英里（1.6千米）
ngsl|778|seek|/sik/|verb|寻找
ngsl|779|ability|/əˈbɪl.ɪ.ti/|noun|能力
ngsl|780|unit|/ˈju.nɪt/|noun|单元；单独的事物或人
ngsl|781|card|/kɑrd/|noun|卡片
ngsl|782|hospital|/ˈhɑs.pɪ.tl/|noun|医院
ngsl|783|quickly|/ˈkwɪk.li/|adverb|迅速地
ngsl|784|interview|/ˈɪn.tərˌvju/|verb|采访；面试
ngsl|785|agreement|/əˈgri.mənt/|noun|协议
ngsl|786|release|/rɪˈlis/|verb|释放
ngsl|787|tax|/tæks/|noun|税
ngsl|788|solution|/səˈlu.ʃən/|noun|解决方案
ngsl|789|capital|/ˈkæp.ɪ.təl/|adjective|重大的
ngsl|790|popular|/ˈpɑp.jə.lər/|adjective|受欢迎的
ngsl|791|specific|/spəˈsɪf.ɪk/|adjective|具体的
ngsl|792|beautiful|/ˈbju.tə.fəl/|adjective|美丽的
ngsl|793|fear|/fɪər/|noun|恐惧
ngsl|794|aim|/eɪm/|noun|瞄准
ngsl|795|television|/ˈtɛl.əˌvɪʒ.ən/|noun|电视机
ngsl|796|serious|/ˈsɪər.i.əs/|adjective|严肃的；重要的;认真的
ngsl|797|target|/ˈtɑr.gɪt/|noun|目标
ngsl|798|degree|/dɪˈgri/|noun|度数
ngsl|799|pull|/pʊl/|verb|拉
ngsl|800|red|/rɛd/|adjective|红色的
ngsl|801|husband|/ˈhʌz.bənd/|noun|丈夫
ngsl|802|access|/ˈæk.sɛs/|noun|通道
ngsl|803|movement|/ˈmuv.mənt/|noun|运动；移动
ngsl|804|treat|/trit/|verb|对待
ngsl|805|identify|/aɪˈdɛn.tɪ.faɪ/|verb|识别
ngsl|806|loss|/lɑs/|noun|亏损；丧失
ngsl|807|shall|/ʃæl/|modal|将要
ngsl|808|modern|/ˈmɑd.ərn/|adjective|现代的
ngsl|809|pressure|/ˈprɛʃ.ər/|noun|压力
ngsl|810|bus|/bʌs/|noun|公共汽车；巴士
ngsl|811|treatment|/ˈtrit.mənt/|noun|治疗；对待
ngsl|812|conference|/ˈkɑn.fər.əns/|noun|会议
ngsl|813|yourself|/jɔrˈsɛlf/|pronoun|你自己
ngsl|814|supply|/səˈplaɪ/|verb|供应；供给
ngsl|815|village|/ˈvɪl.ɪdʒ/|noun|村庄
ngsl|816|worth|/wɜrθ/|noun|值得
ngsl|817|natural|/ˈnætʃ.ər.əl/|adjective|自然的
ngsl|818|express|/ɪkˈsprɛs/|verb|表达
ngsl|819|indicate|/ˈɪn.dɪˌkeɪt/|verb|表明；指出
ngsl|820|attend|/əˈtɛnd/|verb|参加；出席
ngsl|821|brother|/ˈbrʌð.ər/|noun|兄弟
ngsl|822|investment|/ɪnˈvɛst.mənt/|noun|投资
ngsl|823|score|/skɔr/|verb|得分
ngsl|824|organize|/ˈɔr.gəˌnaɪz/|verb|组织
ngsl|825|trip|/trɪp/|noun|旅行
ngsl|826|beyond|/bɪˈjɑnd/|adverb|在(或向)更远处;超...之外
ngsl|827|sleep|/slip/|verb|睡觉
ngsl|828|fish|/fɪʃ/|noun|鱼
ngsl|829|promise|/ˈprɑm.ɪs/|verb|承诺；答应
ngsl|830|potential|/pəˈtɛn.ʃəl/|adjective|有潜力的；潜在的
ngsl|831|energy|/ˈɛn.ər.dʒi/|noun|能源
ngsl|832|trouble|/ˈtrʌb.əl/|noun|麻烦；困难
ngsl|833|relation|/rɪˈleɪ.ʃən/|noun|关系
ngsl|834|touch|/tʌtʃ/|verb|触摸
ngsl|835|file|/faɪl/|verb|文件
ngsl|836|middle|/ˈmɪd.əl/|noun|中间
ngsl|837|bar|/bɑr/|verb|酒吧
ngsl|838|suffer|/ˈsʌf.ər/|verb|战略
ngsl|839|strategy|/ˈstræt.ɪ.dʒi/|noun|战略
ngsl|840|deep|/dip/|adjective|深的
ngsl|841|except|/ɪkˈsɛpt/|preposition|除...之外（用于所言不包括的人或事物前）
ngsl|842|clean|/klin/|adjective|干净的
ngsl|843|tend|/tɛnd/|verb|倾向
ngsl|844|advance|/ædˈvæns/|verb|前进
ngsl|845|fill|/fɪl/|verb|使充满
ngsl|846|star|/stɑr/|noun|星星
ngsl|847|network|/ˈnɛtˌwɜrk/|noun|网状系统
ngsl|848|generally|/ˈdʒɛn.ər.ə.li/|adverb|通常地；普遍地；一般地
ngsl|849|operation|/ˌɒp.əˈreɪ.ʃən/|noun|操作；运转
ngsl|850|match|/mætʃ/|noun|比赛
ngsl|851|avoid|/əˈvɔɪd/|verb|避免
ngsl|852|seat|/sit/|noun|座位
ngsl|853|throw|/θroʊ/|verb|扔
ngsl|854|task|/tæsk/|noun|任务
ngsl|855|normal|/ˈnɔr.məl/|adjective|正常的；标准的
ngsl|856|goal|/goʊl/|noun|目标
ngsl|857|associate|/əˈsəʊ.ʃiˌeɪt/|noun|合伙人
ngsl|858|blue|/blu/|adjective|蓝色的
ngsl|859|positive|/ˈpɑz.ɪ.tɪv/|adjective|积极的；正面的
ngsl|860|option|/ˈɑp.ʃən/|noun|选项；选择
ngsl|861|box|/bɑks/|noun|盒子
ngsl|862|huge|/hjudʒ/|adjective|巨大的
ngsl|863|message|/ˈmɛs.ɪdʒ/|noun|信息
ngsl|864|instance|/ˈɪn.stəns/|noun|例子；实例
ngsl|865|style|/staɪl/|noun|风格；央视
ngsl|866|refer|/rɪˈfɜr/|verb|提及
ngsl|867|cold|/koʊld/|adjective|寒冷的
ngsl|868|push|/pʊʃ/|verb|推
ngsl|869|quarter|/ˈkwɔr.tər/|noun|四分之一
ngsl|870|assume|/əˈsum/|verb|假设
ngsl|871|baby|/ˈbeɪ.bi/|noun|婴儿
ngsl|872|successful|/səkˈsɛs.fəl/|adjective|成功的
ngsl|873|sing|/sɪŋ/|verb|唱歌
ngsl|874|doubt|/daʊt/|noun|疑问；不确定
ngsl|875|competition|/ˌkɑm.pɪˈtɪʃ.ən/|noun|竞赛
ngsl|876|theory|/ˈθɪə.ri/|noun|理论
ngsl|877|propose|/prəˈpoʊz/|verb|提议
ngsl|878|reference|/ˈrɛf.ər.əns/|verb|引用
ngsl|879|argument|/ˈɑr.gjə.mənt/|noun|争论
ngsl|880|adult|/ˈæd.ʌlt/|noun|成人
ngsl|881|fly|/flaɪ/|verb|飞
ngsl|882|document|/ˈdɑk.jʊ.mənt/|noun|文档
ngsl|883|pattern|/ˈpæt.ərn/|noun|模式；图案
ngsl|884|application|/ˌæp.lɪˈkeɪ.ʃən/|noun|申请
ngsl|885|hot|/hɑt/|adjective|热的
ngsl|886|obviously|/ˈɑb.vɪ.əs.lɪ/|adverb|明显地
ngsl|887|unclear|/ʌn.klɪər/|adjective|不清楚的；不易了解的
ngsl|888|bill|/bɪl/|noun|账单
ngsl|889|search|/sɜrtʃ/|verb|搜索
ngsl|890|separate|/ˈsɛp.əˌreɪt/|verb|使分开；分割
ngsl|891|central|/ˈsɛn.trəl/|adjective|中心的
ngsl|892|career|/kəˈrɪər/|noun|职业
ngsl|893|anyway|/ˈɛn.iˌweɪ/|adverb|无论如何；反正
ngsl|894|speech|/spitʃ/|noun|演讲；讲话
ngsl|895|dog|/dɔg/|noun|狗
ngsl|896|officer|/ˈɔ.fə.sər/|noun|官员
ngsl|897|throughout|/θruˈaʊt/|preposition|始终
ngsl|898|oil|/ɔɪl/|noun|石油
ngsl|899|dress|/drɛs/|noun|连衣裙
ngsl|900|profit|/ˈprɑf.ɪt/|verb|利润
ngsl|901|guess|/gɛs/|verb|猜测
ngsl|902|fun|/fʌn/|adjective|有趣的；享乐的
ngsl|903|protect|/prəˈtɛkt/|verb|保护
ngsl|904|resource|/rɪˈsɔrs/|noun|资源
ngsl|905|science|/ˈsaɪ.əns/|noun|科学
ngsl|906|disease|/dɪˈziz/|noun|疾病
ngsl|907|balance|/ˈbæl.əns/|verb|保持平衡
ngsl|908|damage|/ˈdæm.ɪdʒ/|noun|（有形的）损坏
ngsl|909|basis|/ˈbeɪ.sɪs/|noun|基准；基础
ngsl|910|author|/ˈɔ.θər/|noun|作者
ngsl|911|basic|/ˈbeɪ.sɪk/|adjective|基础的；初级的
ngsl|912|encourage|/ɛnˈkɜr.ɪdʒ/|verb|鼓励
ngsl|913|hair|/hɛər/|noun|头发
ngsl|914|male|/meɪl/|adjective|男性的
ngsl|915|operate|/ˈɑp.əˌreɪt/|verb|操作;运转
ngsl|916|reflect|/rɪˈflɛkt/|verb|反射（声，光等）
ngsl|917|exercise|/ˈɛk.sərˌsaɪz/|noun|锻炼
ngsl|918|useful|/ˈjus.fəl/|adjective|有用的
ngsl|919|restaurant|/ˈrɛs.təˌrɑnt/|noun|餐馆
ngsl|920|income|/ˈɪn.kʌm/|noun|收入
ngsl|921|property|/ˈprɑp.ər.ti/|noun|财产
ngsl|922|previous|/ˈpri.vi.əs/|adjective|上一次的；以前的
ngsl|923|dark|/dɑrk/|adjective|黑暗的；深色的
ngsl|924|imagine|/ɪˈmædʒ.ɪn/|verb|想象
ngsl|925|okay|/ˈoʊˈkeɪ/|interjection|好的
ngsl|926|earn|/ɜrn/|verb|赚
ngsl|927|daughter|/ˈdɔ.tər/|noun|女儿
ngsl|928|post|/poʊst/|verb|邮寄
ngsl|929|newspaper|/ˈnuzˌpeɪ.pər/|noun|报纸
ngsl|930|define|/dɪˈfaɪn/|verb|下定义
ngsl|931|conclusion|/kənˈklu.ʒən/|noun|结论
ngsl|932|clock|/klɒk/|noun|钟
ngsl|933|everybody|/ˈɛv.riˌbɑ.di/|pronoun|每个人；大家
ngsl|934|weekend|/ˈwikˌɛnd/|noun|周末
ngsl|935|perform|/pərˈfɔrm/|verb|表演
ngsl|936|professional|/prəˈfɛʃ.ə.nl/|adjective|职业的；专业的
ngsl|937|mine|/maɪn/|pronoun|我的
ngsl|938|debate|/dɪˈbeɪt/|noun|辩论
ngsl|939|memory|/ˈmɛm.ə.ri/|noun|记忆
ngsl|940|green|/grin/|noun|绿色
ngsl|941|song|/sɔŋ/|noun|歌曲
ngsl|942|object|/əbˈdʒɛkt/|verb|反对
ngsl|943|maintain|/meɪnˈteɪn/|verb|维持；保持
ngsl|944|credit|/ˈkrɛd.ɪt/|noun|信用
ngsl|945|ring|/rɪŋ/|noun|环状物；铃声
ngsl|946|discover|/dɪˈskʌv.ər/|verb|发现
ngsl|947|dead|/dɛd/|adjective|死的
ngsl|948|afternoon|/ˌæf.tərˈnun/|noun|下午
ngsl|949|prefer|/prɪˈfɜr/|verb|更喜欢
ngsl|950|extend|/ɪkˈstɛnd/|verb|延长
ngsl|951|possibility|/ˌpɑs.əˈbɪl.ɪ.ti/|noun|可能性
ngsl|952|direction|/dɪˈrɛk.ʃən/|noun|方向
ngsl|953|facility|/fəˈsɪl.ɪ.ti/|noun|设施
ngsl|954|variety|/vəˈraɪ.ɪ.ti/|noun|多样性
ngsl|955|daily|/ˈdeɪ.li/|adverb|日常的
ngsl|956|clothes|/kloʊðz/|noun|衣服
ngsl|957|screen|/skrin/|noun|荧幕
ngsl|958|track|/træk/|verb|跟踪
ngsl|959|dance|/dæns/|verb|舞蹈
ngsl|960|completely|/kəmˈplit.li/|adverb|完全地
ngsl|961|female|/ˈfi.meɪl/|adjective|女性
ngsl|962|responsibility|/rɪˌspɑn.səˈbɪl.ɪ.ti/|noun|责任
ngsl|963|original|/əˈrɪdʒ.ə.nl/|adjective|起初的；原来的
ngsl|964|sister|/ˈsɪs.tər/|noun|姐妹
ngsl|965|rock|/rɑk/|noun|岩石
ngsl|966|dream|/drim/|noun|梦
ngsl|967|nor|/nɔr/|conjunction|也不；也没有
ngsl|968|university|/ˌju.nəˈvɜr.sɪ.ti/|noun|大学
ngsl|969|easily|/ˈi.zə.li/|adverb|容易地
ngsl|970|agency|/ˈeɪ.dʒən.si/|noun|代理
ngsl|971|dollar|/ˈdɑ.lər/|noun|美元
ngsl|972|garden|/ˈgɑr.dn/|noun|花园
ngsl|973|fix|/fɪks/|verb|固定
ngsl|974|ahead|/əˈhɛd/|adverb|在前面；朝前面
ngsl|975|cross|/krɑs/|verb|交叉
ngsl|976|yeah|/jɛə/|interjection|是的
ngsl|977|candidate|/ˈkæn.dɪ.deɪt/|noun|候选人
ngsl|978|weight|/weɪt/|noun|重量
ngsl|979|legal|/ˈli.gəl/|adjective|合法的;法律的
ngsl|980|proposal|/prəˈpoʊ.zəl/|noun|提议
ngsl|981|version|/ˈvɜr.ʒən/|noun|版本
ngsl|982|conversation|/ˌkɑn.vərˈseɪ.ʃən/|noun|会话；交谈
ngsl|983|somebody|/ˈsʌmˌbə.di/|pronoun|某人
ngsl|984|pound|/paʊnd/|noun|磅
ngsl|985|magazine|/ˌmæg.əˈzin/|noun|杂志
ngsl|986|shape|/ʃeɪp/|noun|形状
ngsl|987|sea|/si/|noun|海洋
ngsl|988|immediately|/ɪˈmi.di.ɪt.li/|adverb|立即地
ngsl|989|welcome|/ˈwɛl.kəm/|noun|欢迎
ngsl|990|smile|/smaɪl/|verb|微笑
ngsl|991|communication|/kəˌmju.nɪˈkeɪ.ʃən/|noun|交流；通信
ngsl|992|agent|/ˈeɪ.dʒənt/|noun|代理人
ngsl|993|traditional|/trəˈdɪʃ.ə.nəl/|adjective|传统的
ngsl|994|replace|/rɪˈpleɪs/|verb|代替
ngsl|995|judge|/dʒʌdʒ/|verb|审判；裁决
ngsl|996|herself|/hərˈsɛlf/|pronoun|她自己
ngsl|997|suddenly|/ˈsʌdənlɪ/|adverb|突然地
ngsl|998|generation|/ˌdʒɛn.əˈreɪ.ʃən/|noun|一代人
ngsl|999|estimate|/ˈɛs.tə.mɪt/|noun|估计；估价
ngsl|1000|favorite|/ˈfeɪv.rɪt/|adjective|最喜欢的
ngsl|1001|difficulty|/ˈdɪf.ɪˌkʌl.ti/|noun|困难
ngsl|1002|purchase|/ˈpɜr.tʃəs/|verb|购买
ngsl|1003|shoot|/ʃut/|verb|射击
ngsl|1004|announce|/əˈnaʊns/|verb|宣布
ngsl|1005|unless|/ʌnˈlɛs, ən-/|conjunction|除非
ngsl|1006|independent|/ˌɪn.dɪˈpɛn.dənt/|adjective|独立的
ngsl|1007|recommend|/ˌrɛk.əˈmɛnd/|verb|推荐
ngsl|1008|survey|/sərˈveɪ/|verb|民意调查
ngsl|1009|majority|/məˈdʒɑr.ɪ.ti/|noun|多数
ngsl|1010|stick|/stɪk/|noun|枝条；棍
ngsl|1011|request|/rɪˈkwɛst/|verb|要求
ngsl|1012|rich|/rɪtʃ/|adjective|富有的；富饶的
ngsl|1013|wind|/wɪnd/|noun|风
ngsl|1014|none|/nʌn/|pronoun|没有一个；毫无
ngsl|1015|exchange|/ɪksˈtʃeɪndʒ/|verb|交换
ngsl|1016|budget|/ˈbʌdʒ.ɪt/|noun|预算
ngsl|1017|famous|/ˈfeɪ.məs/|adjective|著名的；出名的
ngsl|1018|blood|/blʌd/|noun|血液
ngsl|1019|appropriate|/əˈprəʊ.pri.ɪt/|adjective|适当的
ngsl|1020|block|/blɑk/|verb|阻塞
ngsl|1021|warm|/wɔrm/|adjective|暖和的
ngsl|1022|count|/kaʊnt/|verb|数数
ngsl|1023|scene|/sin/|noun|场景
ngsl|1024|writer|/ˈraɪ.tər/|noun|作者
ngsl|1025|content|/ˈkɑn.tɛnt/|noun|内容
ngsl|1026|prevent|/prɪˈvɛnt/|verb|阻止
ngsl|1027|safe|/seɪf/|adjective|安全的
ngsl|1028|invite|/ɪnˈvaɪt/|verb|邀请
ngsl|1029|mix|/mɪks/|verb|混合
ngsl|1030|element|/ˈɛl.ə.mənt/|noun|要素；元素
ngsl|1031|effective|/ɪˈfɛk.tɪv/|adjective|有效的
ngsl|1032|correct|/kəˈrɛkt/|adjective|正确的
ngsl|1033|medical|/ˈmɛd.ɪ.kəl/|adjective|医疗的
ngsl|1034|admit|/ədˈmɪt/|verb|承认
ngsl|1035|beat|/bit/|verb|击败
ngsl|1036|telephone|/ˈtɛl.əˌfoʊn/|noun|电话机
ngsl|1037|copy|/ˈkɑp.i/|verb|复制
ngsl|1038|committee|/kəˈmɪt.i/|noun|委员会
ngsl|1039|aware|/əˈwɛər/|adjective|意识到的
ngsl|1040|advice|/ædˈvaɪs/|noun|建议
ngsl|1041|handle|/ˈhæn.dl/|verb|处理
ngsl|1042|glass|/glæs/|noun|玻璃
ngsl|1043|trial|/ˈtraɪəl/|noun|试验；审讯
ngsl|1044|stress|/strɛs/|verb|强调；使紧张
ngsl|1045|radio|/ˈreɪ.diˌoʊ/|noun|无线电
ngsl|1046|administration|/ædˌmɪn.əˈstreɪ.ʃən/|noun|管理；行政
ngsl|1047|complex|/ˈkɑm.plɛks/|adjective|复杂的
ngsl|1048|text|/tɛkst/|noun|正文；文档
ngsl|1049|context|/ˈkɑn.tɛkst/|noun|上下文；语境
ngsl|1050|ride|/raɪd/|verb|骑
ngsl|1051|directly|/dɪˈrɛkt.li/|adverb|直接地
ngsl|1052|heavy|/ˈhɛv.i/|adjective|重的
ngsl|1053|remove|/rɪˈmuv/|verb|去除
ngsl|1054|conduct|/kənˈdʌkt/|verb|实施；引导；指挥
ngsl|1055|equipment|/ɪˈkwɪp.mənt/|noun|设备
ngsl|1056|otherwise|/ˈʌð.ərˌwaɪz/|adverb|否则；不然
ngsl|1057|title|/ˈtaɪ.təl/|noun|主题
ngsl|1058|extra|/ˈɛk.strə/|adjective|额外的
ngsl|1059|executive|/ɪgˈzɛk.jə.tɪv/|noun|行政人员
ngsl|1060|chair|/tʃɛər/|noun|椅子
ngsl|1061|expensive|/ɪkˈspɛn.sɪv/|adjective|昂贵的
ngsl|1062|sample|/ˈsæm.pəl/|verb|样品
ngsl|1063|sex|/sɛks/|noun|性别
ngsl|1064|deliver|/dɪˈlɪv.ər/|verb|传送
ngsl|1065|video|/ˈvɪd.iˌoʊ/|noun|视频；录像
ngsl|1066|connection|/kəˈnɛk.ʃən/|noun|连接；关联
ngsl|1067|primary|/ˈpraɪ.mɛr.i/|adjective|主要的；初级的；基本的
ngsl|1068|weather|/ˈwɛð.ər/|noun|天气
ngsl|1069|collect|/kəˈlɛkt/|verb|收集
ngsl|1070|inform|/ɪnˈfɔrm/|verb|通知
ngsl|1071|principle|/ˈprɪn.sə.pəl/|noun|原则
ngsl|1072|straight|/streɪt/|adjective|直的
ngsl|1073|appeal|/əˈpil/|verb|上诉;申诉
ngsl|1074|highly|/ˈhaɪ.li/|adverb|高度地；非常
ngsl|1075|trust|/trʌst/|verb|信任
ngsl|1076|wonderful|/ˈwʌn.dər.fəl/|adjective|精彩的
ngsl|1077|flat|/flæt/|adjective|平坦的
ngsl|1078|absolutely|/ˌæb.səˈlut.li/|adverb|绝对地
ngsl|1079|flow|/floʊ/|verb|流动
ngsl|1080|fair|/fɛər/|adjective|公平的
ngsl|1081|additional|/əˈdɪʃ.ə.nl/|adjective|附加的
ngsl|1082|responsible|/rɪˈspɑn.sə.bəl/|adjective|负责的
ngsl|1083|farm|/fɑrm/|noun|农场
ngsl|1084|collection|/kəˈlɛk.ʃən/|noun|收藏
ngsl|1085|hang|/hæŋ/|verb|悬挂
ngsl|1086|negative|/ˈnɛg.ə.tɪv/|adjective|消极的;负面的
ngsl|1087|band|/bænd/|noun|乐队
ngsl|1088|relative|/ˈrɛl.ə.tɪv/|noun|相对的
ngsl|1089|tour|/tʊər/|noun|游览
ngsl|1090|alternative|/ɔlˈtɜr.nə.tɪv/|noun|可替代的选择
ngsl|1091|software|/ˈsɔftˌwɛər/|noun|软件
ngsl|1092|pair|/pɛər/|noun|一对；一双
ngsl|1093|ship|/ʃɪp/|noun|(大)船
ngsl|1094|attitude|/ˈæt.ɪˌtud/|noun|态度
ngsl|1095|cheap|/tʃip/|adjective|便宜的
ngsl|1096|double|/ˈdʌb.əl/|preposition|双倍的
ngsl|1097|leg|/lɛg/|noun|腿
ngsl|1098|observe|/əbˈzɜrv/|verb|观察
ngsl|1099|sentence|/ˈsɛn.təns/|noun|句子
ngsl|1100|print|/prɪnt/|verb|打印
ngsl|1101|progress|/prəˈgrɛs/|verb|进步；进展
ngsl|1102|truth|/truθ/|noun|真相
ngsl|1103|nobody|/ˈnoʊˌbɑd.i/|pronoun|没有人；谁也不
ngsl|1104|examine|/ɪgˈzæm.ɪn/|verb|检查
ngsl|1105|lay|/leɪ/|verb|放置
ngsl|1106|speed|/spid/|noun|速度
ngsl|1107|politics|/ˈpɒl.ɪ.tɪks/|noun|政治
ngsl|1108|reply|/rɪˈplaɪ/|noun|回复
ngsl|1109|display|/dɪˈspleɪ/|verb|展示;陈列
ngsl|1110|transfer|/ˈtræns.fər/|verb|转移
ngsl|1111|perfect|/ˈpɜr.fɪkt/|adjective|完美的
ngsl|1112|slightly|/ˈslaɪtlɪ/|adverb|轻微的
ngsl|1113|overall|/ˈoʊ.vərˌɔl/|adjective|全面的；总体的
ngsl|1114|intend|/ɪnˈtɛnd/|verb|打算
ngsl|1115|user|/ˈju.zər/|noun|用户
ngsl|1116|respond|/rɪˈspɑnd/|verb|回应
ngsl|1117|dinner|/ˈdɪn.ər/|noun|晚餐
ngsl|1118|slow|/sloʊ/|adjective|缓慢的
ngsl|1119|regular|/ˈrɛg.jə.lər/|adjective|定期的；有规律的
ngsl|1120|physical|/ˈfɪz.ɪ.kəl/|adjective|身体的
ngsl|1121|apart|/əˈpɑrt/|adverb|分开地
ngsl|1122|suit|/sut/|verb|适合
ngsl|1123|federal|/ˈfɛd.ər.əl/|adjective|联邦的
ngsl|1124|reveal|/rɪˈvil/|verb|揭露
ngsl|1125|percentage|/pərˈsɛn.tɪdʒ/|noun|百分比
ngsl|1126|peace|/pis/|noun|和平
ngsl|1127|status|/ˈsteɪ.təs/|noun|地位
ngsl|1128|crime|/kraɪm/|noun|罪行
ngsl|1129|decline|/dɪˈklaɪn/|verb|谢绝
ngsl|1130|decade|/ˈdɛk.eɪd/|noun|十年
ngsl|1131|launch|/lɑntʃ/|verb|发射
ngsl|1132|warn|/wɔrn/|verb|警告
ngsl|1133|consumer|/kənˈsu.mər/|noun|消费者
ngsl|1134|favor|/ˈfeɪ.vər/|noun|善意行为
ngsl|1135|dry|/draɪ/|adjective|干的
ngsl|1136|partner|/ˈpɑrt.nər/|noun|合伙人
ngsl|1137|institution|/ˌɪn.stɪˈtu.ʃən/|noun|机构
ngsl|1138|spot|/spɑt/|noun|地点
ngsl|1139|horse|/hɔrs/|noun|马
ngsl|1140|eventually|/ɪˈvɛn.tʃu.ə.li/|adverb|最终
ngsl|1141|heat|/hit/|verb|加热
ngsl|1142|excite|/ɪkˈsaɪt/|verb|使兴奋
ngsl|1143|reader|/ˈri.dər/|noun|读者
ngsl|1144|importance|/ɪmˈpɔr.tns/|noun|重要性
ngsl|1145|distance|/ˈdɪs.təns/|noun|距离
ngsl|1146|guide|/gaɪd/|verb|引导；带领
ngsl|1147|grant|/grɑnt/|verb|授予
ngsl|1148|taxi|/ˈtæk.si/|noun|出租车
ngsl|1149|feed|/fid/|verb|喂食
ngsl|1150|pain|/peɪn/|noun|疼痛
ngsl|1151|sector|/ˈsɛk.tər/|noun|部门
ngsl|1152|mistake|/mɪˈsteɪk/|noun|错误
ngsl|1153|ensure|/ɛnˈʃʊər/|verb|确保
ngsl|1154|satisfy|/ˈsæt.ɪsˌfaɪ/|verb|使满意
ngsl|1155|chief|/tʃif/|adjective|最高领导人
ngsl|1156|cool|/kul/|adjective|凉的
ngsl|1157|expert|/ˈɛk.spərt/|noun|专家
ngsl|1158|wave|/weɪv/|verb|挥手
ngsl|1159|south|/saʊθ/|noun|南方
ngsl|1160|labor|/ˈleɪ.bər/|verb|劳动
ngsl|1161|surface|/ˈsɜr.fɪs/|adjective|表面的
ngsl|1162|library|/ˈlaɪˌbrə.ri/|noun|图书馆
ngsl|1163|excellent|/ˈɛk.sə.lənt/|adjective|杰出的
ngsl|1164|edge|/ɛdʒ/|noun|边缘
ngsl|1165|camp|/kæmp/|noun|营地
ngsl|1166|audience|/ˈɔ.di.əns/|noun|观众；听众
ngsl|1167|lift|/lɪft/|verb|举起
ngsl|1168|procedure|/prəˈsi.dʒər/|noun|程序
ngsl|1169|e-mail|/ˈiˌmeɪl/|noun|电子邮件
ngsl|1170|global|/ˈgloʊ.bəl/|adjective|全球的
ngsl|1171|struggle|/ˈstrʌg.əl/|verb|奋斗；挣扎
ngsl|1172|advertise|/ˈæd.vərˌtaɪz/|verb|做广告
ngsl|1173|select|/sɪˈlɛkt/|verb|选择
ngsl|1174|surround|/səˈraʊnd/|verb|围绕
ngsl|1175|extent|/ɪkˈstɛnt/|noun|程度；范围
ngsl|1176|river|/ˈrɪv.ər/|noun|河
ngsl|1177|annual|/ˈæn.ju.əl/|adjective|年度的；每年的
ngsl|1178|fully|/ˈfʊl.li/|adverb|完全地；充分地
ngsl|1179|contrast|/ˈkɑn.træst/|verb|对比;对照
ngsl|1180|roll|/roʊl/|verb|滚动；卷
ngsl|1181|reality|/riˈæl.ɪ.ti/|noun|现实
ngsl|1182|photograph|/ˈfoʊ.təˌgræf/|noun|照片
ngsl|1183|artist|/ˈɑr.tɪst/|noun|艺术家
ngsl|1184|conflict|/kənˈflɪkt/|verb|冲突;矛盾
ngsl|1185|entire|/ɛnˈtaɪər/|adjective|全部的；整体的
ngsl|1186|presence|/ˈprɛz.əns/|noun|在场；出现
ngsl|1187|crowd|/kraʊd/|noun|人群
ngsl|1188|corner|/ˈkɔr.nər/|noun|角，角落
ngsl|1189|gas|/gæs/|noun|气体；汽油
ngsl|1190|shift|/ʃɪft/|verb|转换
ngsl|1191|net|/nɛt/|noun|网状物
ngsl|1192|category|/ˈkæt.ɪˌgɔr.i/|noun|种类
ngsl|1193|secretary|/ˈsɛk.rɪˌtɛr.i/|noun|秘书
ngsl|1194|defense|/dɪˈfɛns/|noun|防卫
ngsl|1195|quick|/kwɪk/|adjective|快速的
ngsl|1196|cook|/kʊk/|verb|烹饪
ngsl|1197|spread|/sprɛd/|verb|传播
ngsl|1198|nuclear|/ˈnu.kli.ər/|adjective|原子能的；核能的
ngsl|1199|scale|/skeɪl/|noun|规模
ngsl|1200|driver|/ˈdraɪ.vər/|noun|司机
ngsl|1201|ball|/bɑl/|noun|球
ngsl|1202|cry|/kraɪ/|verb|哭
ngsl|1203|introduction|/ˌɪn.trəˈdʌk.ʃən/|noun|介绍
ngsl|1204|requirement|/rɪˈkwaɪər.mənt/|noun|必要条件；必需品
ngsl|1205|north|/nɔrθ/|noun|北方
ngsl|1206|confirm|/kənˈfɜrm/|verb|确认
ngsl|1207|senior|/ˈsin.jər/|adjective|高级的
ngsl|1208|photo|/ˈfoʊ.toʊ/|noun|照片
ngsl|1209|refuse|/rɪˈfjuz/|verb|拒绝
ngsl|1210|transport|/trænsˈpɔrt/|verb|运输
ngsl|1211|emerge|/ɪˈmɜrdʒ/|verb|浮现；显露
ngsl|1212|map|/mæp/|noun|地图
ngsl|1213|concept|/ˈkɑn.sɛpt/|noun|概念
ngsl|1214|island|/ˈaɪ.lənd/|noun|岛
ngsl|1215|reform|/rɪˈfɔrm/|verb|改革
ngsl|1216|neither|/ˈni.ðər/|adjective|（两者）都不的
ngsl|1217|football|/ˈfʊtˌbɑl/|noun|足球
ngsl|1218|survive|/sərˈvaɪv/|verb|幸存
ngsl|1219|flight|/flaɪt/|noun|航班；飞行
ngsl|1220|left|/lɛft/|noun|左边
ngsl|1221|solve|/sɑlv/|verb|解放
ngsl|1222|neighbor|/ˈneɪ.bər/|noun|邻居
ngsl|1223|background|/ˈbæk.ɡraʊnd/|noun|背景
ngsl|1224|technique|/tɛkˈnik/|noun|技术
ngsl|1225|traffic|/ˈtræf.ɪk/|noun|交通
ngsl|1226|improvement|/ɪmˈpruv.mənt/|noun|改进；改善
ngsl|1227|tool|/tul/|noun|工具
ngsl|1228|consequence|/ˈkɑn.sɪˌkwɛns/|noun|结果；后果
ngsl|1229|circumstance|/ˈsɜr.kəmˌstæns/|noun|条件；环境
ngsl|1230|smoke|/smoʊk/|verb|吸烟
ngsl|1231|reaction|/riˈæk.ʃən/|noun|反应
ngsl|1232|rain|/reɪn/|noun|雨
ngsl|1233|busy|/ˈbɪz.i/|adjective|忙碌的
ngsl|1234|lesson|/ˈlɛs.ən/|noun|课程；教训
ngsl|1235|brain|/breɪn/|noun|脑
ngsl|1236|mass|/mæs/|noun|大量；团，堆
ngsl|1237|funny|/ˈfʌn.i/|adjective|有趣的
ngsl|1238|contribute|/kənˈtrɪb.jut/|verb|贡献
ngsl|1239|failure|/ˈfeɪl.jər/|noun|失败
ngsl|1240|schedule|/ˈskɛdʒ.ul/|verb|安排
ngsl|1241|speaker|/ˈspi.kər/|noun|扬声器
ngsl|1242|bottom|/ˈbɒt.əm/|noun|底部
ngsl|1243|adopt|/əˈdɑpt/|verb|采用；收养
ngsl|1244|combine|/kəmˈbaɪn/|verb|结合
ngsl|1245|mountain|/ˈmaʊn.tn/|noun|山
ngsl|1246|waste|/weɪst/|verb|浪费
ngsl|1247|hide|/haɪd/|verb|隐藏
ngsl|1248|marriage|/ˈmær.ɪdʒ/|noun|婚姻
ngsl|1249|ticket|/ˈtɪk.ɪt/|noun|票
ngsl|1250|meal|/mil/|noun|一餐
ngsl|1251|colleague|/ˈkɑl.iɡ/|noun|同事
ngsl|1252|bag|/bæg/|noun|包；袋
ngsl|1253|repeat|/rɪˈpit/|verb|重复
ngsl|1254|equal|/ˈi.kwəl/|adjective|相等的
ngsl|1255|expression|/ɪkˈsprɛʃ.ən/|noun|表达
ngsl|1256|plus|/plʌs/|preposition|加；和
ngsl|1257|extremely|/ɪkˈstrim.li/|adverb|极其
ngsl|1258|owner|/ˈoʊ.nər/|noun|所有者
ngsl|1259|plane|/pleɪn/|noun|飞机
ngsl|1260|commercial|/kəˈmɜr.ʃəl/|noun|商业广告
ngsl|1261|lady|/ˈleɪ.di/|noun|女士
ngsl|1262|duty|/ˈdu.ti/|noun|职责
ngsl|1263|strength|/strɛŋkθ/|noun|强度；力量
ngsl|1264|connect|/kəˈnɛkt/|verb|连接
ngsl|1265|cultural|/ˈkʌl.tʃər.əl/|adjective|文化的
ngsl|1266|arrange|/əˈreɪndʒ/|verb|安排
ngsl|1267|scheme|/skim/|noun|计划；方案
ngsl|1268|payment|/ˈpeɪ.mənt/|noun|付款
ngsl|1269|unfortunately|/ʌnˈfɔr.tʃə.nɪt.li/|adverb|不幸地；遗憾地
ngsl|1270|brief|/brif/|adjective|简明的
ngsl|1271|bird|/bɜrd/|noun|鸟
ngsl|1272|demonstrate|/ˈdɛm.ənˌstreɪt/|verb|证明
ngsl|1273|contribution|/ˌkɑn.trəˈbju.ʃən/|noun|贡献
ngsl|1274|appreciate|/əˈpri.ʃiˌeɪt/|verb|欣赏
ngsl|1275|chapter|/ˈtʃæp.tər/|noun|章节
ngsl|1276|secret|/ˈsi.krɪt/|adjective|秘密
ngsl|1277|apparently|/əˈpɛər.ənt.li/|adverb|显然地
ngsl|1278|novel|/ˈnɑv.əl/|noun|小说
ngsl|1279|union|/ˈjun.jən/|noun|协会；联盟
ngsl|1280|burn|/bɜrn/|verb|燃烧；烧毁
ngsl|1281|trend|/trɛnd/|noun|倾向；趋势
ngsl|1282|initial|/ɪˈnɪʃ.əl/|adjective|最初的
ngsl|1283|pleasure|/ˈplɛʒ.ər/|noun|快乐；乐趣
ngsl|1284|suggestion|/səgˈdʒɛs.tʃən/|noun|建议
ngsl|1285|critical|/ˈkrɪt.ɪ.kəl/|adjective|批判的；极重要的
ngsl|1286|gather|/ˈgæð.ər/|verb|聚集
ngsl|1287|mostly|/ˈmoʊst.li/|adverb|主要地
ngsl|1288|earth|/ɜrθ/|noun|地球
ngsl|1289|pop|/pɑp/|verb|(使)爆裂
ngsl|1290|essential|/əˈsɛn.ʃəl/|adjective|必要的
ngsl|1291|desire|/dɪˈzaɪər/|verb|渴望
ngsl|1292|promote|/prəˈmoʊt/|verb|促进；推销
ngsl|1293|currently|/ˈkɜr.ənt.li/|adverb|目前
ngsl|1294|employ|/ɛmˈplɔɪ/|verb|雇用
ngsl|1295|path|/pæθ/|noun|小路；路径
ngsl|1296|topic|/ˈtɑp.ɪk/|noun|话题；主题
ngsl|1297|beach|/bitʃ/|noun|海滩
ngsl|1298|attract|/əˈtrækt/|verb|吸引
ngsl|1299|engage|/ɛnˈgeɪdʒ/|verb|从事；与...建立亲密关系
ngsl|1300|powerful|/ˈpaʊ.ər.fəl/|adjective|强大的
ngsl|1301|flower|/ˈflaʊ.ər/|noun|花
ngsl|1302|crisis|/ˈkraɪ.sɪs/|noun|危机
ngsl|1303|settle|/ˈsɛt.l/|verb|定居
ngsl|1304|boat|/boʊt/|noun|小船
ngsl|1305|aid|/eɪd/|verb|援助
ngsl|1306|fan|/fæn/|noun|风扇
ngsl|1307|kitchen|/ˈkɪtʃ.ən/|noun|厨房
ngsl|1308|twice|/twaɪs/|adverb|两次
ngsl|1309|fresh|/frɛʃ/|adjective|新鲜的
ngsl|1310|delay|/dɪˈleɪ/|verb|延迟
ngsl|1311|safety|/ˈseɪf.ti/|noun|安全
ngsl|1312|engineer|/ˌɛn.dʒəˈnɪər/|noun|工程师
ngsl|1313|quiet|/ˈkwaɪ.ɪt/|adjective|轻声的；安静的
ngsl|1314|insurance|/ɪnˈʃʊər.əns/|noun|保险
ngsl|1315|nurse|/nɜrs/|noun|护士
ngsl|1316|divide|/dɪˈvaɪd/|verb|使分开
ngsl|1317|length|/lɛŋkθ/|noun|长度
ngsl|1318|investigation|/ɪnˌvɛs.tɪˈgeɪ.ʃən/|noun|调查
ngsl|1319|package|/ˈpæk.ɪdʒ/|noun|包裹
ngsl|1320|somewhere|/ˈsʌmˌwɛər/|adverb|在某处
ngsl|1321|expand|/ɪkˈspænd/|verb|扩张
ngsl|1322|commit|/kəˈmɪt/|verb|犯罪
ngsl|1323|obvious|/ˈɑb.vi.əs/|adjective|明显的;易理解的
ngsl|1324|jump|/dʒʌmp/|verb|跳
ngsl|1325|weapon|/ˈwɛp.ən/|noun|武器
ngsl|1326|relatively|/ˈrɛl.ə.tɪv.li/|adverb|相对地
ngsl|1327|host|/hoʊst/|noun|东道主；主人；主持人
ngsl|1328|winter|/ˈwɪn.tər/|noun|冬季
ngsl|1329|district|/ˈdɪs.trɪkt/|noun|区域
ngsl|1330|broad|/brɑd/|adjective|宽阔的；...宽
ngsl|1331|tire|/ˈtaɪ.ər/|verb|（使）疲劳
ngsl|1332|spring|/sprɪŋ/|noun|春季
ngsl|1333|spirit|/ˈspɪr.ɪt/|noun|精神
ngsl|1334|lunch|/lʌntʃ/|noun|午餐
ngsl|1335|actual|/ˈæk.tʃu.əl/|adjective|真实的；实际的
ngsl|1336|pool|/pul/|noun|水塘
ngsl|1337|battle|/ˈbæ.təl/|noun|战争
ngsl|1338|tradition|/trəˈdɪ.ʃən/|noun|传统
ngsl|1339|cash|/kæʃ/|noun|现金
ngsl|1340|hardly|/ˈhɑrd.li/|adverb|几乎不
ngsl|1341|award|/əˈwɔrd/|verb|奖
ngsl|1342|coach|/koʊtʃ/|noun|教练
ngsl|1343|experiment|/ɪkˈspɛr.ɪ.mənt/|noun|实验
ngsl|1344|consideration|/kənˌsɪd.əˈreɪ.ʃən/|noun|考虑
ngsl|1345|strange|/streɪndʒ/|adjective|奇怪的
ngsl|1346|code|/koʊd/|noun|密码
ngsl|1347|possibly|/ˈpɑs.ə.bli/|adverb|可能地
ngsl|1348|threat|/θrɛt/|noun|威胁
ngsl|1349|accident|/ˈæk.sə.dənt/|noun|事故
ngsl|1350|impossible|/ɪmˈpɑs.ə.bəl/|adjective|不可能的
ngsl|1351|revenue|/ˈrɛv.ənˌju/|noun|收入
ngsl|1352|enable|/ɛnˈeɪ.bəl/|verb|使能够
ngsl|1353|afraid|/əˈfreɪd/|adjective|害怕的
ngsl|1354|active|/ˈæk.tɪv/|adjective|积极的
ngsl|1355|conclude|/kənˈklud/|verb|结束；作结论
ngsl|1356|religious|/rɪˈlɪdʒ.əs/|adjective|宗教信仰的
ngsl|1357|cancer|/ˈkæn.sər/|noun|癌症
ngsl|1358|convince|/kənˈvɪns/|verb|说服;使确信
ngsl|1359|vary|/ˈvɛər.i/|verb|使变化
ngsl|1360|environmental|/ɛnˌvaɪ.rənˈmən.tl/|adjective|自然环境的
ngsl|1361|sun|/sʌn/|noun|太阳
ngsl|1362|healthy|/ˈhɛl.θi/|adjective|健康的
ngsl|1363|blow|/bloʊ/|verb|吹
ngsl|1364|volume|/ˈvɑl.jum/|noun|音量
ngsl|1365|location|/loʊˈkeɪ.ʃən/|noun|地点;位置
ngsl|1366|invest|/ɪnˈvɛst/|verb|投资
ngsl|1367|proceed|/prəˈsid/|verb|继续；接着做
ngsl|1368|wash|/wɑʃ/|verb|洗
ngsl|1369|actor|/ˈæk.tər/|noun|演员
ngsl|1370|glad|/glæd/|adjective|高兴的
ngsl|1371|tape|/teɪp/|verb|用胶带粘住
ngsl|1372|whereas|/wɛərˈæz/|conjunction|然而
ngsl|1373|opposite|/ˈɑp.ə.zɪt/|adjective|对面的
ngsl|1374|stone|/stoʊn/|noun|石头
ngsl|1375|sum|/sʌm/|noun|总和
ngsl|1376|murder|/ˈmɜr.dər/|noun|谋杀
ngsl|1377|monitor|/ˈmɑn.ɪ.tər/|noun|监视器
ngsl|1378|soldier|/ˈsoʊl.dʒər/|noun|士兵
ngsl|1379|finance|/ˈfaɪ.næns/|noun|金融
ngsl|1380|hate|/heɪt/|verb|憎恨
ngsl|1381|egg|/ɛg/|noun|蛋
ngsl|1382|concert|/ˈkɑn.sɜrt/|noun|音乐会
ngsl|1383|shock|/ʃɒk/|noun|震惊
ngsl|1384|comfortable|/ˈkʌm.fər.tə.bəl/|adjective|舒服的，自在的
ngsl|1385|usual|/ˈju.ʒu.əl/|adjective|经常的
ngsl|1386|carefully|/ˈkɛər.fə.li/|adverb|小心地
ngsl|1387|pack|/pæk/|verb|打包
ngsl|1388|recall|/rɪˈkɔl/|verb|回忆起
ngsl|1389|wine|/waɪn/|noun|葡萄据
ngsl|1390|camera|/ˈkæm.ər.ə/|noun|相机
ngsl|1391|swim|/swɪm/|verb|游泳
ngsl|1392|manufacture|/ˌmæn.jəˈfæk.tʃər/|verb|生产；制造
ngsl|1393|theater|/ˈθi.ə.tər/|noun|剧院
ngsl|1394|cycle|/ˈsaɪ.kəl/|noun|周期
ngsl|1395|coffee|/ˈkɔ.fi/|noun|咖啡
ngsl|1396|totally|/ˈtoʊt.əl.i/|adverb|完全地
ngsl|1397|museum|/mjuˈzi.əm/|noun|博物馆
ngsl|1398|visitor|/ˈvɪz.ɪ.tər/|noun|参观者
ngsl|1399|freedom|/ˈfri.dəm/|noun|自由
ngsl|1400|construction|/kənˈstrʌk.ʃən/|noun|建设
ngsl|1401|dear|/dɪr/|adjective|亲爱的
ngsl|1402|objective|/əbˈdʒɛk.tɪv/|noun|目的；目标
ngsl|1403|moreover|/mɔrˈoʊ.vər/|adverb|才外
ngsl|1404|onto|ˈɔn.tu/|preposition|朝...之上
ngsl|1405|historical|/hɪˈstɔr.ɪ.kəl/|adjective|历史的
ngsl|1406|oppose|/əˈpoʊz/|verb|反对
ngsl|1407|branch|/brɑntʃ/|noun|树枝；分支机构
ngsl|1408|vehicle|/ˈvi.ɪ.kəl/|noun|车辆
ngsl|1409|scientist|/ˈsaɪ.ən.tɪst/|noun|科学家
ngsl|1410|route|/rut/|noun|路线
ngsl|1411|bind|/baɪnd/|verb|绑定；使结合
ngsl|1412|belong|/bɪˈlɑŋ/|verb|属于
ngsl|1413|taste|/teɪst/|noun|味道
ngsl|1414|tonight|/təˈnaɪt/|adverb|今晚
ngsl|1415|fashion|/ˈfæ.ʃən/|noun|时尚
ngsl|1416|danger|/ˈdeɪn.dʒər/|noun|危险
ngsl|1417|bomb|/bɑm/|noun|炸弹
ngsl|1418|army|/ˈɑr.mi/|noun|军队
ngsl|1419|dangerous|/ˈdeɪn.dʒər.əs/|adjective|危险的
ngsl|1420|decrease|/dɪˈkris/|verb|减少
ngsl|1421|hurt|/hɜrt/|verb|伤害；受伤；使 疼痛
ngsl|1422|council|/ˈkaʊn.səl/|noun|委员会
ngsl|1423|editor|/ˈɛd.ɪ.tər/|noun|编辑
ngsl|1424|normally|/ˈnɔr.mə.li/|adverb|正常地；通常地
ngsl|1425|sight|/saɪt/|noun|视力
ngsl|1426|generate|/ˈdʒɛn.əˌreɪt/|verb|生成
ngsl|1427|gift|/gɪft/|noun|礼物
ngsl|1428|delivery|/dɪˈlɪv.ə.ri/|noun|交付；递送
ngsl|1429|deny|/dɪˈnaɪ/|verb|否定
ngsl|1430|guest|/gɛst/|noun|客人
ngsl|1431|anybody|/ˈɛn.iˌbɑd.i/|pronoun|任何人
ngsl|1432|bedroom|/ˈbɛdˌrum/|noun|卧室
ngsl|1433|quote|/kwoʊt/|verb|引用
ngsl|1434|climb|/klaɪm/|verb|爬
ngsl|1435|basically|/ˈbeɪ.sɪk.li/|adverb|大体上；基本上
ngsl|1436|violence|/ˈvaɪ.ə.ləns/|noun|暴力
ngsl|1437|minister|/ˈmɪn.ə.stər/|noun|部长；大臣
ngsl|1438|mainly|/ˈmeɪn.li/|adverb|主要地
ngsl|1439|mouth|/maʊθ/|noun|口；嘴
ngsl|1440|noise|/nɔɪz/|noun|噪音
ngsl|1441|manner|/ˈmæn.ər/|noun|方式
ngsl|1442|gun|/gʌn/|noun|枪
ngsl|1443|square|/skwɛər/|noun|正方形
ngsl|1444|occasion|/əˈkeɪ.ʒən/|noun|时机
ngsl|1445|familiar|/fəˈmɪl.jər/|adjective|熟悉的
ngsl|1446|ignore|/ɪgˈnɔr/|verb|忽视
ngsl|1447|destroy|/dɪˈstrɔɪ/|verb|破坏
ngsl|1448|affair|/əˈfɛər/|noun|事件；（尤指不正当）私事
ngsl|1449|civil|/ˈsɪv.əl/|adjective|公民的
ngsl|1450|locate|/ˈloʊ.keɪt/|verb|定位
ngsl|1451|citizen|/ˈsɪt.ə.zən/|noun|公民；居民
ngsl|1452|temperature|/ˈtɛm.pər.əˌtʃər/|noun|温度
ngsl|1453|gold|/goʊld/|noun|黄金
ngsl|1454|domestic|/dəˈmɛs.tɪk/|adjective|国内的
ngsl|1455|load|/loʊd/|noun|负荷；装载量
ngsl|1456|belief|/bɪˈlif/|noun|相信；信仰
ngsl|1457|troop|/trup/|noun|部队；队伍
ngsl|1458|technical|/ˈtɛk.nɪ.kəl/|adjective|技术的
ngsl|1459|remind|/rɪˈmaɪnd/|verb|提醒；使想起
ngsl|1460|arrangement|/əˈreɪndʒ.mənt/|noun|安排；约定
ngsl|1461|skin|/skɪn/|noun|皮肤
ngsl|1462|prison|/ˈprɪz.ən/|noun|监狱
ngsl|1463|switch|/swɪtʃ/|verb|（动词）转换；（名词）开关
ngsl|1464|acquire|/əˈkwaɪər/|verb|获得
ngsl|1465|corporate|/ˈkɔr.pər.ət/|adjective|企业的
ngsl|1466|fairly|/ˈfɛər.li/|adverb|相当地
ngsl|1467|wood|/wʊd/|noun|木材
ngsl|1468|participate|/pɑrˈtɪs.əˌpeɪt/|verb|参加
ngsl|1469|tough|/tʌf/|adjective|艰难的
ngsl|1470|tear|/tɪər/|verb|1.（动词）撕裂；2.（名词）眼泪
ngsl|1471|representative|/ˌrɛp.rɪˈzɛn.tə.tɪv/|noun|代表
ngsl|1472|capacity|/kəˈpæs.ɪ.ti/|noun|容量
ngsl|1473|border|/ˈbɔr.dər/|noun|边境
ngsl|1474|shake|/ʃeɪk/|verb|摇
ngsl|1475|assessment|/əˈsɛs.mənt/|noun|看法；评价
ngsl|1476|shoe|/ʃu/|noun|鞋子
ngsl|1477|ought|/ɑt/|modal|应该
ngsl|1478|ad|/æd/|noun|广告
ngsl|1479|fee|/fi/|noun|费用
ngsl|1480|hall|/hɔl/|noun|大厅
ngsl|1481|regulation|/ˌrɛg.jəˈleɪ.ʃən/|noun|章程；规则
ngsl|1482|escape|/ɪˈskeɪp/|verb|逃脱
ngsl|1483|studio|/ˈstu.diˌoʊ/|noun|工作室
ngsl|1484|proper|/ˈprɑp.ər/|adjective|适当的
ngsl|1485|relax|/rɪˈlæks/|verb|放松
ngsl|1486|tourist|/ˈtʊər.ɪst/|noun|游客
ngsl|1487|component|/kəmˈpoʊ.nənt/|noun|零件；组成部分
ngsl|1488|afford|/əˈfɔrd/|verb|买得起
ngsl|1489|lawyer|/ˈlɔ.jər/|noun|律师
ngsl|1490|suspect|/səˈspɛkt/|verb|怀疑
ngsl|1491|cup|/kʌp/|noun|杯子
ngsl|1492|description|/dɪˈskrɪp.ʃən/|noun|描述
ngsl|1493|confidence|/ˈkɑn.fɪ.dəns/|noun|信心
ngsl|1494|industrial|/ɪnˈdʌs.tri.əl/|adjective|工业的
ngsl|1495|complain|/kəmˈpleɪn/|verb|抱怨
ngsl|1496|perspective|/pərˈspɛk.tɪv/|noun|观点；态度
ngsl|1497|error|/ˈɛr.ər/|noun|错误；过失
ngsl|1498|arrest|/əˈrɛst/|verb|逮捕
ngsl|1499|assess|/əˈsɛs/|verb|评估
ngsl|1500|register|/ˈrɛdʒ.ə.stər/|verb|登记;注册
ngsl|1501|asset|/ˈæ.sɛt/|noun|资产
ngsl|1502|signal|/ˈsɪg.nl/|noun|信号
ngsl|1503|finger|/ˈfɪŋ.gər/|noun|手指
ngsl|1504|relevant|/ˈrɛl.ə.vənt/|adjective|相关的
ngsl|1505|explore|/ɪkˈsplɔr/|verb|探索；勘探
ngsl|1506|leadership|/ˈli.dərˌʃɪp/|noun|领导力
ngsl|1507|commitment|/kəˈmɪt.mənt/|noun|承诺
ngsl|1508|wake|/weɪk/|verb|醒来；醒
ngsl|1509|necessarily|/ˌnɛs.əˈsɛər.ə.li/|adverb|必要地
ngsl|1510|bright|/braɪt/|adjective|明亮的
ngsl|1511|frame|/freɪm/|noun|（名词）1.框架；2.帧，画面（动词）1.做边框；2.做伪证
ngsl|1512|slowly|/ˈsloʊ.li/|adverb|慢慢地
ngsl|1513|bond|/bɑnd/|verb|纽带；联合
ngsl|1514|hire|/haɪ.ər/|verb|聘用；雇用
ngsl|1515|hole|/hoʊl/|noun|洞；孔；穴
ngsl|1516|tie|/taɪ/|verb|打结；系
ngsl|1517|internal|/ɪnˈtɜr.nəl/|adjective|内部的；里面的
ngsl|1518|chain|/tʃeɪn/|noun|一系列（人或事）
ngsl|1519|literature|/ˈlɪt.ər.ə.tʃər/|noun|文学；文献
ngsl|1520|victim|/ˈvɪk.tɪm/|noun|受害者
ngsl|1521|threaten|/ˈθrɛt.n/|verb|威胁
ngsl|1522|division|/dɪˈvɪʒ.ən/|noun|分开；部门
ngsl|1523|secure|/sɪˈkjʊər/|verb|保护；使安全
ngsl|1524|amaze|/əˈmeɪz/|verb|使惊奇
ngsl|1525|device|/dɪˈvaɪs/|noun|装置；设备
ngsl|1526|birth|/bɜrθ/|noun|出生
ngsl|1527|forest|/ˈfɑr.ɪst/|noun|森林
ngsl|1528|label|/ˈleɪ.bəl/|noun|标签
ngsl|1529|root|/rut/|noun|根
ngsl|1530|factory|/ˈfæk.tə.ri/|noun|工厂
ngsl|1531|expense|/ɪkˈspɛns/|noun|费用
ngsl|1532|channel|/ˈtʃæn.əl/|noun|1.航道；海峡；2.途径；渠道
ngsl|1533|investigate|/ɪnˈvɛs.tɪˌgeɪt/|verb|调查；研究
ngsl|1534|recommendation|/ˌrɛk.ə.mɛnˈdeɪ.ʃən/|noun|推荐
ngsl|1535|rank|/ræŋk/|verb|排列
ngsl|1536|typical|/ˈtɪp.ɪ.kəl/|adjective|典型的；平常的；一贯的
ngsl|1537|west|/wɛst/|noun|西方
ngsl|1538|friendly|/ˈfrɛnd.li/|adverb|友好地
ngsl|1539|resident|/ˈrɛz.ɪ.dənt/|noun|居民
ngsl|1540|provision|/prəˈvɪʒ.ən/|noun|1.给养，供应品；2.规定，条款
ngsl|1541|concentrate|/ˈkɑn.sənˌtreɪt/|verb|集中（注意力）
ngsl|1542|plenty|/ˈplɛn.ti/|pronoun|大量；充足
ngsl|1543|export|/ɪkˈspɔrt/|verb|出口
ngsl|1544|entirely|/ɛnˈtaɪər.li/|adverb|全部地；完全地
ngsl|1545|strongly|/ˈstrɔŋ.li/|adverb|强烈地
ngsl|1546|bridge|/brɪdʒ/|noun|桥
ngsl|1547|consist|/kənˈsɪst/|verb|包括；由...组成
ngsl|1548|graduate|/ˈgrædʒ.uˌeɪt/|verb|（动词）毕业；（名词）大学毕业生
ngsl|1549|brand|/brænd/|noun|品牌
ngsl|1550|moral|/ˈmɔr.əl/|adjective|道德的；品行端正的
ngsl|1551|insist|/ɪnˈsɪst/|verb|坚持
ngsl|1552|combination|/ˌkɑm.bəˈneɪ.ʃən/|noun|混合体
ngsl|1553|abuse|/əˈbjuz/|verb|虐待
ngsl|1554|ice|/aɪs/|noun|冰
ngsl|1555|principal|/ˈprɪn.sə.pəl/|adjective|1.最重要的，主要的；2.校长
ngsl|1556|master|/ˈmæs.tər/|adjective|1.主宰者；2.能手，大师
ngsl|1557|definitely|/ˈdɛf.ə.nɪt.li/|adverb|肯定地；没问题
ngsl|1558|session|/ˈsɛʃ.ən/|noun|期间；会议；会期
ngsl|1559|grade|/greɪd/|noun|年级
ngsl|1560|nevertheless|/ˌnɛv.ər.ðəˈlɛs/|adverb|尽管如此；但是
ngsl|1561|predict|/prɪˈdɪkt/|verb|预测
ngsl|1562|previously|/ˈpri.vi.əs.li/|adverb|先前
ngsl|1563|protection|/prə.tɛk.ʃən/|noun|保护;防卫
ngsl|1564|largely|/ˈlɑrdʒ.li/|adverb|大部分；主要地
ngsl|1565|wed|/wɛd/|verb|结婚
ngsl|1566|rent|/rɛnt/|verb|租借
ngsl|1567|shot|/ʃɑt/|verb|开枪；射击
ngsl|1568|appearance|/əˈpɪər.əns/|noun|外貌
ngsl|1569|reasonable|/ˈri.zə.nə.bəl/|adjective|合理的；合适的
ngsl|1570|guarantee|/ˌgær.ənˈti/|verb|保证
ngsl|1571|till|/tɪl/|conjunction|直到
ngsl|1572|theme|/θim/|noun|主题
ngsl|1573|judgment|/ˈdʒʌdʒ.mənt/|noun|判断
ngsl|1574|odd|/ɑd/|adjective|古怪的；不寻常的
ngsl|1575|approve|/əˈpruv/|verb|赞成；通过
ngsl|1576|loan|/loʊn/|noun|贷款】
ngsl|1577|definition|/ˌdɛf.əˈnɪʃ.ən/|noun|定义
ngsl|1578|elect|/ɪˈlɛkt/|verb|选举
ngsl|1579|atmosphere|/ˈæt.məsˌfɪər/|noun|大气层；氛围
ngsl|1580|farmer|/ˈfɑr.mər/|noun|农场主；农民
ngsl|1581|comparison|/kəmˈpær.ə.sən/|noun|比较
ngsl|1582|characteristic|/ˌkær.ɪk.təˈrɪs.tɪk/|adjective|特有的；典型的
ngsl|1583|license|/ˈlaɪ.səns/|noun|执照；许可证
ngsl|1584|rely|/rɪˈlaɪ/|verb|依靠
ngsl|1585|narrow|/ˈnær.oʊ/|adjective|狭窄的
ngsl|1586|succeed|/səkˈsid/|verb|成功;达到目的
ngsl|1587|identity|/aɪ.dɛn.tɪ.tɪ/|noun|身份
ngsl|1588|desk|/dɛsk/|noun|桌子
ngsl|1589|permit|/pərˈmɪt/|verb|允许；许可
ngsl|1590|seriously|/ˈsɪər.i.əs.li/|adverb|认真地；严重地
ngsl|1591|wild|/waɪld/|adjective|野生的;自然生长的
ngsl|1592|empty|/ˈɛmp.ti/|adjective|空的
ngsl|1593|commission|/kəˈmɪʃ.ən/|noun|委员会
ngsl|1594|unique|/juˈnik/|adjective|独特的；唯一的
ngsl|1595|association|/əˌsoʊ.siˈeɪ.ʃən/|noun|协会
ngsl|1596|instrument|/ˈɪn.strə.mənt/|noun|乐器
ngsl|1597|investor|/ɪnˈvɛst/|noun|投资者
ngsl|1598|practical|/ˈpræk.tɪ.kəl/|adjective|实际的;实用的
ngsl|1599|tea|/ti/|noun|茶；茶叶
ngsl|1600|lovely|/ˈlʌv.li/|adjective|美丽的；有吸引力的
ngsl|1601|soft|/sɑft/|adjective|柔软的
ngsl|1602|row|/ˈrəʊ/|noun|一行；一列
ngsl|1603|youth|/juθ/|noun|年轻；青年
ngsl|1604|lock|/lɒk/|verb|锁住
ngsl|1605|fuel|/ˈfju.əl/|noun|燃料
ngsl|1606|expectation|/ˌɛk.spɛkˈteɪ.ʃən/|noun|预期；期望
ngsl|1607|employment|/ɛmˈplɔɪ.mənt/|noun|雇用；工作
ngsl|1608|celebrate|/ˈsɛl.əˌbreɪt/|verb|庆祝（事件或节日），过（生日）
ngsl|1609|sexual|/ˈsɛk.ʃu.əl/|adjective|性的；两性的
ngsl|1610|shoulder|/ˈʃoʊl.dər/|noun|肩膀
ngsl|1611|breath|/brɛθ/|noun|气息
ngsl|1612|increasingly|/ɪnˈkri.sɪŋ.li/|adverb|越来越多地，渐增地
ngsl|1613|import|/ɪmˈpɔrt/|verb|进口
ngsl|1614|bottle|/ˈbɑ.təl/|noun|瓶子
ngsl|1615|ourselves|/aʊərˈsɛlvz/|pronoun|我们自己
ngsl|1616|sheet|/ʃit/|noun|被单
ngsl|1617|engine|/ˈɛn.dʒən/|noun|发动机，引擎
ngsl|1618|cast|/kæst/|verb|投；扔；抛；掷
ngsl|1619|notion|/ˈnoʊ.ʃən/|noun|意图；看法
ngsl|1620|conservative|/kənˈsɜr.və.tɪv/|adjective|保守的，守旧的
ngsl|1621|journey|/ˈdʒɜr.ni/|noun|行程；旅行
ngsl|1622|opposition|/ˌɒp.əˈzɪʃ.ən/|noun|反对
ngsl|1623|relief|/rɪˈlif/|noun|缓解；轻松
ngsl|1624|debt|/dɛt/|noun|欠款；债务
ngsl|1625|honor|/ˈɑn.ər/|noun|敬意
ngsl|1626|outcome|/ˈaʊtˌkʌm/|noun|结果，结局
ngsl|1627|blame|/bleɪm/|verb|责备；责怪
ngsl|1628|explanation|/ˌɛk.spləˈneɪ.ʃən/|noun|解释，说明
ngsl|1629|arise|/əˈraɪz/|verb|产生；发生
ngsl|1630|musical|/ˈmju.zɪ.kəl/|noun|音乐的
ngsl|1631|recover|/rɪˈkʌv.ər/|verb|恢复（健康）；挽回
ngsl|1632|dad|/dæd/|noun|爸爸
ngsl|1633|stretch|/strɛtʃ/|verb|拉长，撑大
ngsl|1634|declare|/dɪ.ˈklɛər/|verb|宣布，声明
ngsl|1635|retire|/rɪˈtaɪ.ər/|verb|退休
ngsl|1636|tiny|/ˈtaɪ.ni/|adjective|极小的
ngsl|1637|careful|/ˈkɛər.fəl/|adjective|小心的
ngsl|1638|suitable|/ˈsu.tə.bəl/|adjective|合适的，适当的
ngsl|1639|native|/ˈneɪ.tɪv/|noun|本地人
ngsl|1640|fruit|/frut/|noun|水果
ngsl|1641|analyze|/ˈæn.ə.laɪz/|verb|分析
ngsl|1642|witness|/ˈwɪt.nɪs/|noun|目击者
ngsl|1643|mail|/meɪl/|noun|信件，邮包，邮件
ngsl|1644|terrible|/ˈtɛr.ə.bəl/|adjective|糟透的；可怕的
ngsl|1645|researcher|/rɪˈsɜr.tʃər/|noun|研究员
ngsl|1646|ordinary|/ˈɔr.dnˌɛr.i/|adjective|平常的，普通的，一般的
ngsl|1647|selection|/sɪˈlɛk.ʃən/|noun|挑选
ngsl|1648|anywhere|/ˈɛn.iˌwɛər/|adverb|在任何地方（用于疑问句，否定句）
ngsl|1649|mental|/ˈmɛn.tl/|adjective|精神上的，思想上的
ngsl|1650|participant|/pɑrˈtɪs.ə.pənt/|noun|参加者, 参与者
ngsl|1651|vision|/ˈvɪʒ.ən/|noun|视力
ngsl|1652|personality|/ˌpɜr.səˈnæl.ɪ.ti/|noun|人格；个性
ngsl|1653|specifically|/spɪˈsɪf.ɪk.li/|adverb|特别地，特地
ngsl|1654|fat|/fæt/|noun|脂肪
ngsl|1655|entry|/ˈɛn.tri/|noun|进入
ngsl|1656|fellow|/ˈfɛl.oʊ/|noun|伙伴，同伙
ngsl|1657|chemical|/ˈkɛm.ɪ.kəl/|noun|化学的
ngsl|1658|capture|/ˈkæp.tʃər/|verb|捕获
ngsl|1659|tip|/tɪp/|noun|指点，末梢
ngsl|1660|discount|/ˈdɪs.kaʊnt/|noun|折扣
ngsl|1661|peak|/pik/|noun|顶点，顶峰，峰值
ngsl|1662|chairman|/ˈtʃɛər.mən/|noun|主席
ngsl|1663|proportion|/prəˈpɔr.ʃən/|noun|比例
ngsl|1664|ear|/ɪər/|noun|耳朵
ngsl|1665|disappear|/ˌdɪs.əˈpɪər/|verb|消失
ngsl|1666|shout|/ʃaʊt/|verb|喊叫
ngsl|1667|yard|/jɑrd/|noun|院子，庭院
ngsl|1668|constant|/ˈkɑn.stənt/|adjective|连续发生的，不断的
ngsl|1669|significantly|/sɪgˈnɪf.ɪ.kənt.li/|adverb|重要的，显著的
ngsl|1670|hill|/hɪl/|noun|小山
ngsl|1671|considerable|/kənˈsɪd.ər.ə.bəl/|adjective|相当大（或多）的；重大的
ngsl|1672|instruction|/ɪnˈstrʌk.ʃən/|noun|用法说明
ngsl|1673|intelligence|/ɪnˈtɛl.ɪ.dʒəns/|noun|智力，才智
ngsl|1674|ideal|/aɪˈdi.əl/|adjective|完美的，理想的
ngsl|1675|folk|/fəʊk/|adjective|普通平民的
ngsl|1676|surely|/ˈʃɜr.li/|adverb|确实地，一定地
ngsl|1677|guard|/gɑrd/|verb|守卫
ngsl|1678|cat|/kæt/|noun|猫
ngsl|1679|somewhat|/ˈsʌmˌwʌt/|adverb|有点，稍微
ngsl|1680|kiss|/kɪs/|verb|亲吻
ngsl|1681|presentation|/ˌprɛz.ənˈteɪ.ʃən/|noun|陈述
ngsl|1682|joint|/dʒɔɪnt/|noun|1.（n）结点，关节；2.（adj）联合的，与他人合作的
ngsl|1683|compete|/kəmˈpit/|verb|竞争，比赛
ngsl|1684|poll|/poʊl/|noun|民意测验
ngsl|1685|weak|/wik/|adjective|（能力）弱的，虚弱的，易破的
ngsl|1686|faith|/feɪθ/|noun|信念
ngsl|1687|reduction|/rɪˈdʌk.ʃən/|noun|减少，缩减
ngsl|1688|reserve|/rɪˈzɜrv/|verb|1.（v）预订；2.（n）储备
ngsl|1689|complaint|/kəmˈpleɪnt/|noun|抱怨
ngsl|1690|bore|/bɔr/|verb|使厌倦
ngsl|1691|mission|/ˈmɪʃ.ən/|noun|使命，任务
ngsl|1692|somehow|/ˈsʌmˌhaʊ/|adverb|不知怎的
ngsl|1693|tone|/təʊn/|noun|音调
ngsl|1694|neighborhood|/ˈneɪ.bərˌhʊd/|noun|居住地区
ngsl|1695|passenger|/ˈpæs.ən.dʒər/|noun|乘客
ngsl|1696|justice|/ˈdʒʌs.tɪs/|noun|正义，公平
ngsl|1697|phase|/feɪz/|noun|阶段
ngsl|1698|thin|/ˈθɪn/|adjective|薄的，瘦的
ngsl|1699|rush|/rʌʃ/|verb|仓促行事
ngsl|1700|formal|/ˈfɔr.məl/|adjective|正式的
ngsl|1701|religion|/rɪˈlɪdʒ.ən/|noun|宗教信仰
ngsl|1702|employer|/ɛmˈplɔɪ.ər/|noun|雇主, 老板
ngsl|1703|reject|/rɪˈdʒɛkt/|verb|拒绝
ngsl|1704|latter|/ˈlæt.ər/|adjective|后者的，最后的
ngsl|1705|plate|/pleɪt/|noun|盘子，碟子
ngsl|1706|ban|/bæn/|verb|禁止
ngsl|1707|steal|/stil/|verb|偷
ngsl|1708|protest|/ˈproʊ.tɛst/|verb|抗议
ngsl|1709|index|/ˈɪn.dɛks/|noun|索引
ngsl|1710|sad|/sæd/|adjective|伤心的，悲伤的
ngsl|1711|frequently|/ˈfri.kwənt.li/|adverb|经常地，频繁地
ngsl|1712|circle|/ˈsɜr.kəl/|noun|圆圈
ngsl|1713|helpful|/ˈhɛlp.fəl/|adjective|有用的
ngsl|1714|command|/kəˈmɑnd/|verb|命令，指挥
ngsl|1715|attractive|/əˈtræk.tɪv/|adjective|有吸引力的
ngsl|1716|sick|/sɪk/|adjective|有病的，不舒服的
ngsl|1717|impression|/ɪmˈprɛʃ.ən/|noun|影响，印象
ngsl|1718|unable|/ʌnˈeɪ.bəl/|adjective|不能的，不会的
ngsl|1719|joke|/dʒəʊk/|verb|开玩笑
ngsl|1720|sky|/skaɪ/|noun|天空
ngsl|1721|column|/ˈkɑl.əm/|noun|支柱，列
ngsl|1722|electronic|/ˌɛl.ɛkˈtrɑn.ɪk/|adjective|电子的
ngsl|1723|impose|/ɪmˈpoʊz/|verb|把...强加于
ngsl|1724|criminal|/ˈkrɪm.ə.nl/|adjective|犯罪的；（n）罪犯
ngsl|1725|besides|/bəˈsaɪdz/|preposition|除...之外（还）
ngsl|1726|properly|/ˈprɑp.ər.li/|adverb|适当地
ngsl|1727|ancient|/ˈeɪn.ʃənt/|adjective|年老的，年代久远的
ngsl|1728|coast|/kəʊst/|noun|海岸
ngsl|1729|ill|/ɪl/|adjective|有病的
ngsl|1730|kick|/kɪk/|verb|踢
ngsl|1731|closely|/ˈkloʊs.lɪ/|adverb|接近地
ngsl|1732|multiple|/ˈmʌl.tə.pəl/|adjective|多个的
ngsl|1733|yield|/jild/|verb|让出
ngsl|1734|via|/ˈvaɪ.ə/|preposition|经由，通过
ngsl|1735|legislation|/ˌlɛdʒ.ɪsˈleɪ.ʃən/|noun|立法
ngsl|1736|county|/ˈkaʊn.ti/|noun|县，郡
ngsl|1737|unlike|/ʌnˈlaɪk/|adjective|不同的
ngsl|1738|mobile|/ˈmoʊ.bil/|adjective|可移动的
ngsl|1739|assistant|/əˈsɪs.tənt/|noun|助手，助理
ngsl|1740|implement|/ˈɪm.pləˌmɛnt/|verb|实施，执行；（n）工具
ngsl|1741|chart|/tʃɑrt/|noun|图，图表
ngsl|1742|attach|/əˈtætʃ/|verb|连接，使附着
ngsl|1743|hell|/hɛl/|noun|地狱
ngsl|1744|everywhere|/ˈɛv.riˌwɛər/|adverb|到处，各处
ngsl|1745|advise|/ædˈvaɪz/|verb|劝告，忠告
ngsl|1746|household|/ˈhaʊsˌhoʊld/|noun|家庭，一家人
ngsl|1747|acknowledge|/ækˈnɑl.ɪdʒ/|verb|承认，确认
ngsl|1748|reward|/rɪˈwɔrd/|verb|奖赏
ngsl|1749|east|/ist/|noun|东，东方
ngsl|1750|hat|/hæt/|noun|帽子
ngsl|1751|academic|/ˌæk.əˈdɛm.ɪk/|adjective|学院的，学术的；（n）学者，大学教师
ngsl|1752|voter|/ˈvoʊ.tər/|noun|投票人
ngsl|1753|meanwhile|/ˈminˌwaɪl/|adverb|与此同时
ngsl|1754|furthermore|/ˈfɜr.ðərˌmɔr/|adverb|而且，此外
ngsl|1755|accuse|/əˈkjuz/|verb|指控，控告
ngsl|1756|scientific|/ˌsaɪ.ənˈtɪf.ɪk/|adjective|科学的
ngsl|1757|wage|/weɪdʒ/|noun|工资；报酬
ngsl|1758|absence|/ˈæb.səns/|noun|缺席
ngsl|1759|construct|/kənˈstrʌkt/|verb|建造，构筑
ngsl|1760|remark|/rɪˈmɑrk/|verb|评论
ngsl|1761|medicine|/ˈmɛd.ə.sɪn/|noun|药物；医学
ngsl|1762|professor|/prəˈfɛs.ər/|noun|教授
ngsl|1763|rare|/rɛər/|adjective|罕见的
ngsl|1764|intention|/ɪnˈtɛn.ʃən/|noun|意图，目的，打算
ngsl|1765|dozen|/ˈdʌz.ən/|noun|一打，十二个
ngsl|1766|settlement|/ˈsɛt.l.mənt/|noun|解决，和解
ngsl|1767|gap|/ɡæp/|noun|间隔，间隙
ngsl|1768|widely|/ˈwaɪd.li/|adverb|广泛地
ngsl|1769|minimum|/ˈmɪn.ə.məm/|noun|最低值，最小量
ngsl|1770|northern|/ˈnɔr.ðərn/|adjective|在北方的；向北方的
ngsl|1771|estate|/ɪˈsteɪt/|noun|地产，私有土地
ngsl|1772|equally|/ˈi.kwə.li/|adverb|相等地，同样
ngsl|1773|expose|/ɪkˈspoʊz/|verb|暴露，揭露
ngsl|1774|alive|/əˈlaɪv/|adjective|活着的；在世的
ngsl|1775|shut|/ʃʌt/|verb|关闭
ngsl|1776|victory|/ˈvɪk.tə.ri/|noun|胜利
ngsl|1777|resolve|/rɪˈzɑlv/|verb|解决
ngsl|1778|critic|/ˈkrɪt.ɪk/|noun|评论家
ngsl|1779|variable|/ˈvɛər.i.ə.bəl/|adjective|可变的
ngsl|1780|enormous|/ɪˈnɔr.məs/|adjective|巨大的
ngsl|1781|sweet|/swit/|adjective|甜的；含糖的
ngsl|1782|permanent|/ˈpɜr.mə.nənt/|adjective|永久的，长期不变的
ngsl|1783|emotion|/ɪˈmoʊ.ʃən/|noun|情感
ngsl|1784|pursue|/pərˈsu/|verb|追随；追求
ngsl|1785|tall|/tɔl/|adjective|高的
ngsl|1786|urge|/ɜrdʒ/|verb|力劝
ngsl|1787|enemy|/ˈɛn.ə.mi/|noun|敌人
ngsl|1788|appoint|/əˈpɔɪnt/|verb|委派，任命
ngsl|1789|milk|/mɪlk/|noun|牛奶
ngsl|1790|talent|/ˈtæl.ənt/|noun|天才
ngsl|1791|smell|/smɛl/|verb|闻，嗅
ngsl|1792|prior|/ˈpraɪ.ər/|adjective|在先的；优先的
ngsl|1793|priority|/praɪˈɔr.ɪ.ti/|noun|优先
ngsl|1794|online|/ˈɑnˌlaɪn/|adjective|在线的
ngsl|1795|phrase|/freɪz/|noun|短语；词组
ngsl|1796|pilot|/ˈpaɪ.lət/|noun|（飞机，宇宙飞船或船舶的）驾驶员
ngsl|1797|stable|/ˈsteɪ.bəl/|adjective|稳定的；持久的
ngsl|1798|merely|/ˈmɪər.li/|adverb|仅仅，只不过
ngsl|1799|resolution|/ˌrɛz.əˈlu.ʃən/|noun|决议
ngsl|1800|communicate|/kəˈmju.nɪˌkeɪt/|verb|交流
ngsl|1801|injury|/ˈɪn.dʒə.ri/|noun|(身体上或精神上的)伤害
ngsl|1802|vast|/væst/|adjective|广阔的；大量的
ngsl|1803|exhibition|/ˌɛk.səˈbɪʃ.ən/|noun|展览
ngsl|1804|producer|/prəˈdu.sər/|noun|制造商，生产者
ngsl|1805|regional|/ˈri.dʒə.nl/|adjective|区域的
ngsl|1806|immediate|/ɪˈmi.di.ɪt/|adjective|即刻的；直接的
ngsl|1807|incident|/ˈɪn.sɪ.dənt/|noun|小事，事件
ngsl|1808|childhood|/ˈtʃaɪld.hʊd/|noun|童年
ngsl|1809|draft|/dræft/|noun|草稿，草案
ngsl|1810|slip|/slɪp/|verb|滑跤
ngsl|1811|accompany|/əˈkʌm.pə.ni/|verb|陪伴
ngsl|1812|politician|/ˌpɑl.ɪˈtɪʃ.ən/|noun|政治家
ngsl|1813|angry|/ˈæŋ.gri/|adjective|生气的，愤怒的
ngsl|1814|knock|/nɑk/|verb|敲
ngsl|1815|seed|/sid/|noun|种子；开端
ngsl|1816|salary|/ˈsæl.ə.ri/|noun|薪水
ngsl|1817|illustrate|/ˈɪl.əˌstreɪt/|verb|阐明
ngsl|1818|imply|/ɪmˈplaɪ/|verb|暗示
ngsl|1819|breakfast|/ˈbrɛk.fəst/|noun|早餐
ngsl|1820|temporary|/ˈtɛm.pəˌrɛr.i/|adjective|暂时的；短暂的
ngsl|1821|liberal|/ˈlɪb.ər.əl/|adjective|开明的；自由主义的
ngsl|1822|lake|/leɪk/|noun|湖
ngsl|1823|qualify|/ˈkwɑl.əˌfaɪ/|verb|使胜任
ngsl|1824|competitive|/kəmˈpɛt.ɪ.tɪv/|adjective|竞争的
ngsl|1825|truly|/ˈtru.li/|adverb|真实地
ngsl|1826|hi|/ˈhaɪ̯/|interjection|嘿，喂
ngsl|1827|yellow|/ˈjɛl.oʊ/|adjective|黄色的
ngsl|1828|habit|/ˈhæb.ɪt/|noun|习惯
ngsl|1829|disk|/dɪsk/|noun|圆盘
ngsl|1830|core|/kɔr/|noun|果心；核心
ngsl|1831|emotional|/ɪˈmoʊ.ʃə.nl/|adjective|情绪的
ngsl|1832|aircraft|/ˈɛərˌkræft/|noun|飞机
ngsl|1833|self|/sɛf/|noun|自我，本性
ngsl|1834|metal|/ˈmɛt.l/|noun|金属
ngsl|1835|existence|/ɪgˈzɪs.təns/|noun|存在
ngsl|1836|bone|/ˈboʊn/|noun|骨头
ngsl|1837|panel|/ˈpæn.l/|noun|镶板；专门小组
ngsl|1838|prime|/praɪ̯m/|adjective|主要的，最好的
ngsl|1839|appointment|/əˈpɔɪnt.mənt/|noun|约会，约定
ngsl|1840|emphasize|/ˈɛm.fəˌsaɪz/|verb|强调
ngsl|1841|maximum|/ˈmæk.sə.məm/|noun|最大值
ngsl|1842|effectively|/ɪˈfɛk.tɪv.li/|adverb|有效地
ngsl|1843|elsewhere|/ˈɛls.wɛər/|adverb|在别处
ngsl|1844|bother|/ˈbɑð.ər/|verb|打扰
ngsl|1845|initiative|/ɪˈnɪʃ.ə.tɪv/|noun|主动权
ngsl|1846|sharp|/ʃɑrp/|adjective|锋利的，尖的
ngsl|1847|diet|/ˈdaɪ.ət/|verb|日常饮食
ngsl|1848|motion|/ˈmoʊ.ʃən/|noun|动，移动
ngsl|1849|gray|/greɪ/|adjective|灰色的
ngsl|1850|plastic|/ˈplæs.tɪk/|noun|塑料
ngsl|1851|complicate|/ˈkɑm.plɪˌkeɪt/|verb|使复杂化
ngsl|1852|discipline|/ˈdɪs.ə.plɪn/|noun|训练，磨练
ngsl|1853|disappoint|/ˌdɪs.əˈpɔɪnt/|verb|使失望
ngsl|1854|boss|/bɑs/|noun|老板，上司
ngsl|1855|assumption|/əˈsʌmp.ʃən/|noun|假定
ngsl|1856|freeze|/friz/|verb|冻结，凝固
ngsl|1857|extreme|/ɪkˈstrim/|adjective|极大的
ngsl|1858|passage|/ˈpæs.ɪdʒ/|noun|通道，过道
ngsl|1859|reputation|/ˌrɛp.jəˈteɪ.ʃən/|noun|名声
ngsl|1860|forth|/fɔrθ/|adverb|往外；向前
ngsl|1861|negotiation|/nɪˌgoʊ.ʃiˈeɪ.ʃən/|noun|谈判
ngsl|1862|mechanism|/ˈmɛk.əˌnɪz.əm/|noun|机械装置
ngsl|1863|coat|/koʊt/|noun|外套
ngsl|1864|democracy|/dɪˈmɑk.rə.si/|noun|民主主义
ngsl|1865|pocket|/ˈpɑk.ɪt/|noun|口袋
ngsl|1866|lucky|/ˈlʌ.ki/|adjective|幸运的，吉祥的
ngsl|1867|crash|/kræʃ/|verb|撞毁
ngsl|1868|observation|/ˌɑb.zərˈvɛɪ.ʃən/|noun|观察
ngsl|1869|meat|/mit/|noun|肉
ngsl|1870|concentration|/ˌkɑn.sənˈtreɪ.ʃən/|noun|专注
ngsl|1871|implication|/ˌɪm.pləˈkeɪ.ʃən/|noun|含义；暗指
ngsl|1872|deserve|/dɪˈzɜrv/|verb|应得，值得
ngsl|1873|unusual|/ʌnˈju.ʒu.əl/|adjective|异常的
ngsl|1874|defend|/dɪˈfɛnd/|verb|防御，保卫
ngsl|1875|classic|/ˈklæs.ɪk/|noun|经典
ngsl|1876|king|/kiŋ/|noun|君主，国王
ngsl|1877|interaction|/ˌɪn.tərˈæk.ʃən/|noun|相互作用
ngsl|1878|repair|/rɪˈpɛər/|verb|修理
ngsl|1879|collapse|/kəˈlæps/|verb|使倒塌，使瓦解
ngsl|1880|borrow|/ˈbɑr.əʊ/|verb|借用
ngsl|1881|fundamental|/ˌfʌn.dəˈmɛn.təl/|adjective|主要的
ngsl|1882|dish|/dɪʃ/|noun|碟子，盘子
ngsl|1883|abroad|/əˈbrɔd/|adverb|到国外，在国外
ngsl|1884|soul|/səʊl/|noun|灵魂
ngsl|1885|capable|/ˈkeɪ.pə.bəl/|adjective|有能力的
ngsl|1886|defeat|/dɪˈfit/|verb|击败，战胜
ngsl|1887|presidential|/ˌprɛz.ɪˈdɛn.ʃəl/|adjective|总统的
ngsl|1888|perfectly|/ˈpɜr.fɪkt.li/|adverb|完美地；绝对正确地
ngsl|1889|enhance|/ɛnˈhæns/|verb|提高，增进
ngsl|1890|proud|/praʊd/|adjective|骄傲的
ngsl|1891|emergency|/ɪˈmɜr.dʒən.si/|noun|紧急情况
ngsl|1892|educational|/ˌɛdʒ.ʊˈkeɪ.ʃə.nl/|adjective|教育的
ngsl|1893|distinguish|/dɪˈstɪŋ.gwɪʃ/|verb|辨别出，区分
ngsl|1894|substantial|/səbˈstæn.ʃəl/|adjective|大量的，可观的
ngsl|1895|nearby|/ˈnɪərˈbaɪ/|adjective|附近的
ngsl|1896|manufacturer|/mæn.jʊ.fæk.tʃər.ər/|noun|制造商；制造厂
ngsl|1897|slide|/slaɪd/|verb|滑行
ngsl|1898|valuable|/ˈvæl.ju.ə.bəl/|adjective|值钱的
ngsl|1899|personally|/ˈpɜr.sə.nl.i/|adverb|亲自地；个别地
ngsl|1900|breast|/brɛst/|noun|胸部
ngsl|1901|cope|/kəʊp/|verb|（成功地）应付，处理
ngsl|1902|approximately|/əˈprɑk.sə.mɪt.li/|adverb|大概地；接近地；近似地
ngsl|1903|accommodation|/əˌkɑm.əˈdeɪ.ʃən/|noun|住宿
ngsl|1904|highlight|/ˈhaɪˌlaɪt/|noun|最重要或最有趣的部分
ngsl|1905|reporter|/rɪˈpɔr.tər/|noun|记者，新闻广播员
ngsl|1906|climate|/ˈklaɪ.mɪt/|noun|气候
ngsl|1907|shirt|/ʃɜrt/|noun|衬衫
ngsl|1908|exception|/ɪkˈsɛp.ʃən/|noun|例外
ngsl|1909|corporation|/ˌkɔr.pəˈreɪ.ʃən/|noun|法人团体；公司
ngsl|1910|chip|/tʃɪp/|noun|碎片，薄片
ngsl|1911|winner|/ˈwɪn.ər/|noun|获胜者；优胜者
ngsl|1912|encounter|/ɛnˈkaʊn.tər/|verb|意外地遇到；遭遇
ngsl|1913|brown|/braʊn/|adjective|棕色的
ngsl|1914|breathe|/brið/|verb|呼吸
ngsl|1915|excuse|/ɪkˈskjuz/|verb|藉口
ngsl|1916|partly|/ˈpɑrt.li/|adverb|部分地
ngsl|1917|tennis|/ˈtɛn.ɪs/|noun|网球运动
ngsl|1918|urban|/ˈɜr.bən/|adjective|城市的
ngsl|1919|confuse|/kənˈfjuz/|verb|使困惑
ngsl|1920|southern|/ˈsʌð.ərn/|adjective|南方的
ngsl|1921|output|/ˈaʊtˌpʊt/|noun|产量
ngsl|1922|beauty|/ˈbju.ti/|noun|美
ngsl|1923|massive|/ˈmæs.ɪv/|adjective|大量的，巨大的，厚实的
ngsl|1924|install|/ɪnˈstɔl/|verb|安装
ngsl|1925|calculate|/ˈkæl.kjʊ,lɛɪt/|verb|计算
ngsl|1926|mouse|/maʊs/|noun|老鼠
ngsl|1927|mathematics|/ˌmæθ.əˈmæt.ɪks/|noun|数学
ngsl|1928|upper|/ˈʌp.ər/|adjective|较高的
ngsl|1929|creation|/kriˈeɪ.ʃən/|noun|创造
ngsl|1930|occupy|/ˈɑk.jəˌpaɪ/|verb|占用，占有
ngsl|1931|outline|/ˈaʊtˌlaɪn/|noun|大纲；概要
ngsl|1932|sufficient|/səˈfɪʃ.ənt/|adjective|足够的
ngsl|1933|update|/ˈʌp.deɪt/|verb|更新
ngsl|1934|luck|/lʌk/|noun|运气（好运）
ngsl|1935|preserve|/prɪˈzɜrv/|verb|保持原状
ngsl|1936|split|/splɪt/|verb|劈开；撕裂
ngsl|1937|swing|/ˈswɪŋ/|verb|摇摆
ngsl|1938|illness|/ˈɪl.nəs/|noun|疾病
ngsl|1939|journalist|/ˈdʒɜr.nl.ɪst/|noun|新闻记者
ngsl|1940|sudden|/ˈsʌd.n/|adjective|突然的；意外的
ngsl|1941|advertisement|/əd.vər.tɪs.mənt/|noun|广告
ngsl|1942|consistent|/kənˈsɪs.tənt/|adjective|一贯的，一致的
ngsl|1943|originally|/əˈrɪdʒ.ə.nl.i/|adverb|起初；原来
ngsl|1944|aside|/əˈsaɪd/|adverb|在旁边；离开；
ngsl|1945|comfort|/ˈkʌm.fərt/|noun|安慰
ngsl|1946|secondly|/ˈsɛk.ənd.li/|adverb|第二，其次
ngsl|1947|severe|/səˈvɪər/|adjective|严重的；严肃的
ngsl|1948|gene|/dʒin/|noun|基因
ngsl|1949|prospect|/ˈprɑs.pɛkt/|noun|预期；前景
ngsl|1950|snow|/snəʊ/|noun|雪
ngsl|1951|plot|/plɑt/|noun|密谋
ngsl|1952|neck|/nɛk/|noun|颈项，脖子
ngsl|1953|criteria|/kraɪˈtɪər.i.ə/|noun|标准；准则
ngsl|1954|primarily|/praɪˈmɛr.ə.li/|adverb|首要地，主要地
ngsl|1955|integrate|/ˈɪn.tɪˌgreɪt/|verb|使结合，合并
ngsl|1956|criticism|/ˈkrɪt.əˌsɪz.əm/|noun|批评
ngsl|1957|convention|/kənˈvɛn.ʃən/|noun|大会
ngsl|1958|bet|/ˈbɛt/|verb|打赌
ngsl|1959|retain|/rɪˈteɪn/|verb|保留，保持
ngsl|1960|sequence|/ˈsi.kwəns/|noun|次序，顺序
ngsl|1961|plain|/pleɪn/|adjective|简易的，明显的，清晰的
ngsl|1962|volunteer|/ˌvɑl.ənˈtɪər/|noun|志愿者
ngsl|1963|rural|/ˈrʊər.əl/|adjective|农村的
ngsl|1964|calm|/kɑm/|adjective|平静的；镇静的
ngsl|1965|abandon|/əˈbæn.dən/|verb|离弃；抛弃
ngsl|1966|examination|/ɪgˌzæm.əˈneɪ.ʃən/|noun|检查；考试
ngsl|1967|silence|/ˈsaɪ.ləns/|noun|寂静，无声
ngsl|1968|rapidly|/ˈræp.ɪd.li/|adverb|迅速地
ngsl|1969|efficient|/ɪˈfɪʃ.ənt/|adjective|有效的
ngsl|1970|revolution|/ˌrɛv.əˈlu.ʃən/|noun|革命
ngsl|1971|delight|/dɪˈlaɪt/|noun|高兴；愉悦
ngsl|1972|spell|/spɛl/|verb|拼写
ngsl|1973|premise|/ˈprɛm.ɪs/|noun|假定，前提
ngsl|1974|lean|/lin/|verb|使倾斜，依靠；（adj）瘦的
ngsl|1975|dramatic|/drəˈmæt.ɪk/|adjective|突然的；极其的
ngsl|1976|differ|/ˈdɪ.fər/|verb|使不同
ngsl|1977|grateful|/ˈgreɪt.fəl/|adjective|感激的
ngsl|1978|protein|/ˈproʊ.tin/|noun|蛋白质
ngsl|1979|bike|/baɪk/|noun|自行车
ngsl|1980|distribute|/dɪˈstrɪb.jut/|verb|分发，分配
ngsl|1981|intellectual|/ˌɪn.tlˈɛk.tʃu.əl/|noun|智力
ngsl|1982|derive|/dɪˈraɪv/|verb|引申出，衍生出
ngsl|1983|crucial|/ˈkru.ʃəl/|adjective|至关重要的
ngsl|1984|unemployment|/ˌʌn.ɛmˈplɔɪ.mənt/|noun|失业
ngsl|1985|wheel|/wil/|noun|车轮
ngsl|1986|crop|/krɑp/|noun|庄稼（例如:玉米，大米）
ngsl|1987|minority|/maɪˈnɔr.ɪ.ti/|noun|少数；少数派
ngsl|1988|origin|/ˈɔr.ɪ.dʒɪn/|noun|起源
ngsl|1989|interpretation|/ɪnˌtɜr.prɪˈteɪ.ʃən/|noun|解释；说明
ngsl|1990|gentleman|/ˈdʒɛn.tl.mən/|noun|绅士
ngsl|1991|drama|/ˈdrɑ.mə/|noun|戏剧
ngsl|1992|landscape|/ˈlændˌskeɪp/|noun|风景；地貌
ngsl|1993|educate|/ˈɛdʒ.ʊˌkeɪt/|verb|教育
ngsl|1994|toy|/tɔɪ/|noun|玩具
ngsl|1995|fault|/fɔlt/|noun|缺点；错误；过失
ngsl|1996|exhibit|/ɪgˈzɪb.ɪt/|verb|展览
ngsl|1997|minor|/ˈmaɪ.nər/|adjective|较小的；次要的
ngsl|1998|hunt|/hʌnt/|verb|狩猎
ngsl|1999|storm|/stɔrm/|noun|风暴
ngsl|2000|thick|/θɪk/|adjective|厚的
ngsl|2001|achievement|/əˈtʃiv.mənt/|noun|成就
ngsl|2002|negotiate|/nɪˈgoʊ.ʃiˌeɪt/|verb|协商
ngsl|2003|dominate|/ˈdɑm.əˌneɪt/|verb|支配；施加决定性影响于
ngsl|2004|supplier|/səˈplaɪ/|noun|供应商
ngsl|2005|prize|/praɪz/|noun|奖品；奖赏
ngsl|2006|typically|/ˈtɪp.ɪ.kli/|adverb|一般地；通常
ngsl|2007|peer|/pɪər/|noun|同等地位的人
ngsl|2008|pension|/ˈpɛn.ʃən/|noun|退休金
ngsl|2009|wing|/wɪŋ/|noun|翅膀
ngsl|2010|acquisition|/ˌæk.wɪˈzɪʃ.ən/|noun|取得，获得
ngsl|2011|laughter|/ˈlɑf.tər/|noun|笑；笑声
ngsl|2012|deeply|/ˈdip.li/|adverb|深刻地；强烈地
ngsl|2013|recognition|/ˌrɛk.əgˈnɪʃ.ən/|noun|认可
ngsl|2014|electricity|/ɪ.lɛkˈtrɪs.ɪ.ti/|noun|电
ngsl|2015|assistance|/əˈsɪs.təns/|noun|帮助，援助
ngsl|2016|roof|/ruf/|noun|盖，顶
ngsl|2017|retirement|/rɪˈtaɪər.mənt/|noun|退休
ngsl|2018|respectively|/rɪˈspɛk.tɪv.li/|adverb|各自地，分别地
ngsl|2019|variation|/ˌvɛər.iˈeɪ.ʃən/|noun|变化
ngsl|2020|ultimately|/ˈʌl.tɪ.mət.lɪ/|adverb|最后；终于
ngsl|2021|proof|/pruf/|noun|证据
ngsl|2022|soil|/sɔɪl/|noun|土壤
ngsl|2023|smart|/smɑrt/|adjective|聪明的；智能的
ngsl|2024|layer|/ˈleɪ.ər/|noun|层
ngsl|2025|upset|/ʌpˈsɛt/|adjective|苦恼的，担忧的，生气的
ngsl|2026|tooth|/tuθ/|noun|牙齿
ngsl|2027|representation|/ˌrɛp.rɪ.zɛnˈteɪ.ʃən/|noun|代表
ngsl|2028|preparation|/ˌprɛp.əˈreɪ.ʃən/|noun|准备
ngsl|2029|dispute|/dɪsˈpjut/|noun|争论
ngsl|2030|agenda|/əˈdʒɛn.də/|noun|议程
ngsl|2031|emphasis|/ˈɛm.fə.sɪs/|noun|强调
ngsl|2032|edition|/ɪˈdɪ.ʃən/|noun|版本
ngsl|2033|silver|/ˈsɪl.vər/|noun|银
ngsl|2034|entertainment|/ˌɛn.tərˈteɪn.mənt/|noun|娱乐
ngsl|2035|honest|/ˈɑn.ɪst/|adjective|好的；诚实的
ngsl|2036|undertake|/ˌʌn.dərˈteɪk/|verb|着手做；试图
ngsl|2037|retail|/ˈri.teɪl/|adjective|零售
ngsl|2038|wire|/ˈwaɪ.ər/|noun|金属丝
ngsl|2039|unlikely|/ʌnˈlaɪk.li/|adverb|不大可能的，不大可靠的
ngsl|2040|gay|/gɛɪ/|noun|同性恋者
ngsl|2041|publication|/ˌpʌb.lɪˈkeɪ.ʃən/|noun|出版物
ngsl|2042|slight|/slaɪt/|adjective|少量的
ngsl|2043|unknown|/ʌnˈnoʊn/|noun|未知的；不著名的
ngsl|2044|framework|/ˈfreɪmˌwɜrk/|noun|框架，结构
ngsl|2045|zone|/zoʊn/|noun|地区
ngsl|2046|restrict|/rɪˈstrɪkt/|verb|限制
ngsl|2047|trace|/treɪs/|verb|追踪，追溯
ngsl|2048|inch|/ɪntʃ/|noun|英寸；1/12英尺(2.54厘米)
ngsl|2049|equivalent|/ˌi.kwəˈveɪ.lənt/|adjective|等值的；相等的；等同的
ngsl|2050|solid|/ˈsɑl.ɪd/|adjective|（形容词）结实的，牢固的/（名词）固体
ngsl|2051|enterprise|/ˈɛn.tərˌpraɪz/|noun|事业，企业】
ngsl|2052|elderly|/ˈɛl.dər.li/|adjective|老年的
ngsl|2053|owe|/əʊ/|verb|欠钱
ngsl|2054|governor|/ˈgʌv.ər.nər/|noun|州长，长官，领导者
ngsl|2055|uniform|/ˈju.nɪˌfɔrm/|noun|制服
ngsl|2056|port|/pɔrt/|noun|港口，口岸
ngsl|2057|pitch|/pɪtʃ/|noun|1.音高；2.投球；3.推销的话；4.沥青
ngsl|2058|arrival|/əˈraɪ.vəl/|noun|到达
ngsl|2059|contemporary|/kənˈtɛm.pəˌrɛr.i/|adjective|同一时代的
ngsl|2060|gate|/gɛɪt/|noun|门
ngsl|2061|ease|/iz/|noun|安逸，舒适
ngsl|2062|beer|/bɪər/|noun|啤酒
ngsl|2063|specialist|/ˈspɛ.ʃə.lɪst/|noun|专家
ngsl|2064|assure|/əˈʃɜr/|verb|确保
ngsl|2065|profile|/ˈproʊ.faɪl/|noun|概述
ngsl|2066|mood|/mud/|noun|情绪；心情
ngsl|2067|episode|/ˈɛp.əˌsoʊd/|noun|插曲，片段，一集
ngsl|2068|crack|/kræk/|verb|使破裂
ngsl|2069|numerous|/ˈnu.mər.əs/|adjective|许多的
ngsl|2070|submit|/səbˈmɪt/|verb|服从
ngsl|2071|symptom|/ˈsɪmp.təm/|noun|症状
ngsl|2072|virtually|/ˈvɜr.tʃu.ə.li/|adverb|几乎
ngsl|2073|era|/ˈɪə.rə/|noun|时代
ngsl|2074|coverage|/ˈkʌv.ər.ɪdʒ/|noun|新闻报道
ngsl|2075|tension|/ˈtɛn.ʃən/|noun|紧张
ngsl|2076|cable|/ˈkeɪ.bəl/|noun|电缆
ngsl|2077|sensitive|/ˈsɛn.sɪ.tɪv/|adjective|敏感的
ngsl|2078|nervous|/ˈnɜr.vəs/|adjective|紧张的
ngsl|2079|input|/ˈɪnˌpʊt/|verb|输入
ngsl|2080|isolate|/ˈaɪ.səˌleɪt/|verb|隔离
ngsl|2081|prisoner|/ˈprɪz.ə.nər/|noun|囚犯
ngsl|2082|eliminate|/ɪˈlɪm.əˌneɪt/|verb|清除；排除
ngsl|2083|tight|/taɪt/|adjective|牢固的；紧的
ngsl|2084|wet|/wɛt/|adjective|湿的；未干的
ngsl|2085|secondary|/ˈsɛk.ənˌdɛr.i/|adjective|次要的
ngsl|2086|welfare|/ˈwɛlˌfɛər/|noun|福利
ngsl|2087|recruit|/rɪˈkrut/|verb|招募
ngsl|2088|exclude|/ɪkˈsklud/|verb|防止...进入
ngsl|2089|string|/strɪŋ/|noun|细绳
ngsl|2090|cloud|/klaʊd/|noun|云
ngsl|2091|persuade|/pərˈsweɪd/|verb|说服
ngsl|2092|inspire|/ɪnˈspaɪ.ər/|verb|启发
ngsl|2093|grand|/ɡrænd/|adjective|宏伟的
ngsl|2094|hence|/ˈhɛns/|adverb|因此，今后
ngsl|2095|crew|/kru/|noun|全体人员（例如船员）
ngsl|2096|phenomenon|/fɪˈnɑm.əˌnən/|noun|现象
ngsl|2097|pupil|/ˈpju.pəl/|noun|小学生，未成年人
ngsl|2098|false|/fɔls/|adjective|不真实的，假的
ngsl|2099|assist|/əˈsɪst/|verb|协助
ngsl|2100|restore|/rɪˈstɔr/|verb|恢复
ngsl|2101|formula|/ˈfɔr.mjə.lə/|noun|公式
ngsl|2102|alter|/ˈɑl.tər/|verb|改变
ngsl|2103|perceive|/pərˈsiv/|verb|感知
ngsl|2104|routine|/ruˈtin/|noun|常规
ngsl|2105|sink|/sɪŋk/|verb|下沉
ngsl|2106|stare|/stɛər/|verb|凝视
ngsl|2107|anymore|/ˌɛn.iˈmɔr/|adverb|不再
ngsl|2108|hero|/ˈhɪə.rəʊ/|noun|英雄
ngsl|2109|supporter|/səˈpɔr.tər/|noun|支持者
ngsl|2110|convert|/kənˈvɜrt/|verb|转换
ngsl|2111|steady|/ˈstɛd.i/|adjective|稳定的
ngsl|2112|meter|/ˈmi.tər/|noun|米（等于1厘米或大约39英寸）
ngsl|2113|truck|/trʌk/|noun|卡车
ngsl|2114|nose|/nəʊz/|noun|鼻子
ngsl|2115|beside|/bɪˈsaɪd/|preposition|在旁边
ngsl|2116|sail|/seɪl/|verb|航行
ngsl|2117|disaster|/dɪˈzæs.tər/|noun|灾难
ngsl|2118|pace|/peɪs/|noun|步速，步法
ngsl|2119|heavily|/ˈhɛv.ə.li/|adverb|沉重地；大量地
ngsl|2120|devote|/dɪˈvoʊt/|verb|致力于
ngsl|2121|terrorist|/ˈtɛr.ər.ɪst/|noun|恐怖分子
ngsl|2122|justify|/ˈdʒʌs.təˌfaɪ/|verb|证明...正确
ngsl|2123|vital|/ˈvaɪt.əl/|adjective|至关重要的
ngsl|2124|fascinate|/ˈfæs.ɪˌneɪt/|verb|入迷；深深吸引
ngsl|2125|external|/ɪkˈstɜr.nl/|adjective|外部的
ngsl|2126|spare|/spɛər/|adjective|额外的；多余的
ngsl|2127|whenever|/wɛnˈɛv.ər/|adverb|无论何时；每当
ngsl|2128|depression|/dɪˈprɛ.ʃən/|noun|抑郁；沮丧
ngsl|2129|guilty|/ˈgɪl.ti/|adjective|内疚的；有罪的
ngsl|2130|underlie|/ˌʌn.dərˈlaɪ/|verb|位于...之下
ngsl|2131|mom|/mɑm/|noun|妈妈
ngsl|2132|distinction|/dɪˈstɪŋk.ʃən/|noun|区别
ngsl|2133|satisfaction|/ˌsæt.ɪsˈfæk.ʃən/|noun|满足
ngsl|2134|incorporate|/ɪnˈkɔr.pəˌreɪt/|verb|包含
ngsl|2135|pour|/pɔr/|verb|倒，倾泻
ngsl|2136|sweep|/swip/|verb|打扫
ngsl|2137|obligation|/ˌɑb.ləˈɡeɪ.ʃən/|noun|义务，职责
ngsl|2138|sir|/sɜr/|noun|先生，阁下
ngsl|2139|evaluate|/ɪˈvæl.juˌeɪt/|verb|评估
ngsl|2140|anger|/ˈæŋ.gər/|verb|激怒
ngsl|2141|pub|/pʌb/|noun|酒吧
ngsl|2142|perception|/pərˈsɛp.ʃən/|noun|认知能力
ngsl|2143|naturally|/ˈnætʃ.ər.ə.li/|adverb|自然地
ngsl|2144|currency|/ˈkʌr.ən.si/|noun|货币
ngsl|2145|database|/ˈdeɪ.təˌbeɪs/|noun|数据库
ngsl|2146|initially|/ɪˈnɪʃ.ə.li/|adverb|最初
ngsl|2147|territory|/ˈtɛr.ɪˌtɔr.i/|noun|领土
ngsl|2148|stream|/strim/|noun|小溪
ngsl|2149|rarely|/ˈrɛər.li/|adverb|很少地；罕见
ngsl|2150|height|/haɪt/|noun|高度
ngsl|2151|apparent|/əˈpɛər.ənt/|adjective|明显的
ngsl|2152|western|/ˈwɛs.tərn/|adjective|西方的
ngsl|2153|expansion|/ɪkˈspæn.ʃən/|noun|扩张
ngsl|2154|constantly|/ˈkɑn.stənt.li/|adverb|不断地
ngsl|2155|muscle|/ˈmʌs.əl/|noun|肌肉
ngsl|2156|scare|/skɛər/|verb|惊吓
ngsl|2157|badly|/ˈbæd.li/|adverb|严重地；未令人满意地
ngsl|2158|everyday|/ˈɛv.riˌdeɪ/|adjective|每天的，日常的
ngsl|2159|boundary|/ˈbaʊn.də.ri/|noun|边界
ngsl|2160|ratio|/ˈreɪ.ʃiˌəʊ/|noun|比率，比例
ngsl|2161|essay|/ˈɛs.eɪ/|noun|短文，论文
ngsl|2162|scream|/skrim/|verb|尖叫
ngsl|2163|withdraw|/wɪðˈdrɑ/|verb|撤回，提款
ngsl|2164|pollution|/pəˈlu.ʃən/|noun|污染
ngsl|2165|disorder|/dɪsˈɔr.dər/|noun|混乱
ngsl|2166|furniture|/ˈfɜr.nɪ.tʃər/|noun|家具
ngsl|2167|symbol|/ˈsɪm.bəl/|noun|象征，标识
ngsl|2168|apartment|/əˈpɑrt.mənt/|noun|公寓
ngsl|2169|demonstration|/ˌdɛm.ənˈstreɪ.ʃən/|noun|示范
ngsl|2170|analyst|/ˈæ.nə.lɪst/|noun|分析师
ngsl|2171|platform|/ˈplæt.fɔrm/|noun|站台
ngsl|2172|steel|/stil/|noun|钢
ngsl|2173|cake|/keɪk/|noun|蛋糕
ngsl|2174|transform|/trænsˈfɔrm/|verb|使转变
ngsl|2175|wound|/wund/|noun|伤口
ngsl|2176|restriction|/rɪˈstrɪk.ʃən/|noun|限制
ngsl|2177|foundation|/faʊnˈdeɪ.ʃən/|noun|基础
ngsl|2178|designer|/dɪˈzaɪ.nər/|noun|设计师
ngsl|2179|strain|/streɪn/|noun|张力，负担
ngsl|2180|innovation|/ˌɪn.əˈveɪ.ʃən/|noun|创新
ngsl|2181|album|/ˈæl.bəm/|noun|相簿
ngsl|2182|singer|/ˈsɪŋ.ər/|noun|歌手
ngsl|2183|trail|/treɪl/|noun|踪迹
ngsl|2184|trap|/træp/|noun|陷阱
ngsl|2185|loose|/lus/|adjective|不牢固的，宽松的
ngsl|2186|extension|/ɪkˈstɛn.ʃən/|noun|延期
ngsl|2187|wealth|/wɛlθ/|noun|财富
ngsl|2188|gradually|/ˈgrædʒ.u.ə.li/|adverb|逐渐地
ngsl|2189|tank|/tæŋk/|noun|坦克
ngsl|2190|evil|/ˈi.vəl/|adjective|邪恶的，有害的
ngsl|2191|remarkable|/rɪˈmɑr.kə.bəl/|adjective|卓越的，值得注意的
ngsl|2192|tune|/tjun/|noun|曲调
ngsl|2193|grass|/græs/|noun|草
ngsl|2194|invitation|/ˌɪn.vɪˈteɪ.ʃən/|noun|邀请
ngsl|2195|transition|/trænˈsɪ.ʒən/|noun|过渡
ngsl|2196|frighten|/ˈfraɪt.ən/|verb|吓唬
ngsl|2197|bid|/bɪd/|verb|出价
ngsl|2198|breed|/brid/|verb|繁殖，培育
ngsl|2199|extraordinary|/ˌɛkˈstrɔr.dənˌɛr.i/|adjective|超乎寻常的，特别的，非凡的
ngsl|2200|brilliant|/ˈbrɪl.jənt/|adjective|杰出的，有才气的
ngsl|2201|adviser|/ædˈvaɪ.zər/|noun|顾问
ngsl|2202|stem|/stɛm/|noun|茎
ngsl|2203|reverse|/rɪˈvɜrs/|verb|颠倒
ngsl|2204|mode|/məʊd/|noun|模式
ngsl|2205|mirror|/ˈmɪr.ər/|noun|镜子
ngsl|2206|awful|/ˈɑ.fʊl/|adjective|极坏的；可怕的；糟糕的
ngsl|2207|pose|/poʊz/|verb|姿势
ngsl|2208|adjust|/əˈdʒʌst/|verb|调整
ngsl|2209|creative|/kriˈeɪ.tɪv/|adjective|有创造力的
ngsl|2210|nowadays|/ˈnaʊ.əˌdeɪz/|adverb|现今；时下
ngsl|2211|poem|/ˈpoʊ.əm/|noun|诗
ngsl|2212|agricultural|/ˈæg.rɪˌkʌl.tʃər/|adjective|农业的
ngsl|2213|competitor|/kəmˈpɛt.ɪ.tər/|noun|竞争者
ngsl|2214|alcohol|/ˈæl.kəˌhɔl/|noun|酒精
ngsl|2215|festival|/ˈfɛs.tə.vəl/|noun|节日
ngsl|2216|vegetable|/ˈvɛdʒ.tə.bəl/|noun|蔬菜
ngsl|2217|van|/væn/|noun|货车
ngsl|2218|confident|/ˈkɒn.fɪ.dənt/|adjective|自信的
ngsl|2219|planet|/ˈplæn.ɪt/|noun|行星
ngsl|2220|curve|/kɜrv/|noun|曲线
ngsl|2221|knee|/ni/|noun|膝盖
ngsl|2222|overcome|/ˌoʊ.vərˈkʌm/|verb|克服
ngsl|2223|web|/wɛb/|noun|（蜘蛛）网；网络
ngsl|2224|depth|/dɛpθ/|noun|深度
ngsl|2225|entrance|/ˈɛn.trəns/|noun|入口
ngsl|2226|log|/lɑɡ/|noun|原木
ngsl|2227|giant|/ˈdʒaɪ.ənt/|adjective|巨大的
ngsl|2228|god|/ɡɑd/|noun|神
ngsl|2229|portion|/ˈpɔr.ʃən/|noun|一部分
ngsl|2230|substance|/ˈsʌb.stəns/|noun|物质
ngsl|2231|extensive|/ɪkˈstɛn.sɪv/|adjective|广泛的；大量的
ngsl|2232|interpret|/ɪnˈtɜr.prɪt/|verb|口译
ngsl|2233|independence|/ˌɪn.dɪˈpɛn.dəns/|noun|独立
ngsl|2234|sugar|/ˈʃʊ.gər/|noun|糖
ngsl|2235|inner|/ˈɪn.ər/|adjective|内部的
ngsl|2236|harm|/hɑrm/|verb|伤害，损害，危害
ngsl|2237|consult|/kənˈsʌlt/|verb|咨询
ngsl|2238|pink|/pɪŋk/|adjective|粉红色的
ngsl|2239|shadow|/ˈʃæd.oʊ/|noun|影子
ngsl|2240|strip|/strɪp/|verb|剥去，除去
ngsl|2241|smooth|/smuð/|adjective|光滑的；平坦的
ngsl|2242|intervention|/ˌɪn.tərˈvɛn.ʃən/|noun|干涉
ngsl|2243|impress|/ɪmˈprɛs/|verb|给...留下深刻印象
ngsl|2244|exam|/ɪgˈzæm/|noun|考试
ngsl|2245|vice|/vaɪs/|noun|邪恶
ngsl|2246|radical|/ˈræd.ɪ.kəl/|adjective|全新的；根本的
ngsl|2247|similarly|/ˈsɪm.ə.lər.li/|adverb|相似地
ngsl|2248|behave|/bɪˈheɪv/|verb|表现；举止端正
ngsl|2249|loud|/laʊd/|adjective|大声的
ngsl|2250|dimension|/daɪˈmɛn.ʃən/|noun|尺寸
ngsl|2251|subsequent|/ˈsʌb.sɪ.kwənt/|adjective|随后的
ngsl|2252|infection|/ˌɪnˈfɛk.ʃən/|noun|感染
ngsl|2253|jacket|/ˈdʒæk.ɪt/|noun|短上衣
ngsl|2254|efficiency|/ɪˈfɪʃ.ən.si/|noun|效率
ngsl|2255|dirty|/ˈdɜr.ti/|adjective|脏的
ngsl|2256|statistic|/stəˈtɪs.tɪk/|noun|统计
ngsl|2257|regularly|/ˈrɛg.jə.lər.li/|adverb|按时地；有规律地
ngsl|2258|resort|/rɪˈzɔrt/|noun|度假胜地
ngsl|2259|iron|/ˈaɪ.ərn/|noun|铁
ngsl|2260|broadcast|/ˈbrɔdˌkæst/|verb|播送
ngsl|2261|membership|/ˈmɛm.bərˌʃɪp/|noun|会员
ngsl|2262|bread|/brɛd/|noun|面包
ngsl|2263|blind|/blaɪnd/|adjective|盲目的；瞎的
ngsl|2264|pure|/pjʊər/|adjective|纯的
ngsl|2265|bloody|/ˈblʌ.di/|adjective|血腥的；流血的
ngsl|2266|ally|/ˈæl.aɪ/|noun|盟友
ngsl|2267|quantity|/ˈkwɒn.tɪ.ti/|noun|数量
ngsl|2268|bend|/bɛnd/|verb|使弯曲
ngsl|2269|mature|/məˈtʊər/|adjective|成熟的
ngsl|2270|briefly|/ˈbrif.li/|adverb|短暂地；简短地
ngsl|2271|alarm|/əˈlɑrm/|noun|警报
ngsl|2272|disturb|/dɪˈstɜrb/|verb|打扰
ngsl|2273|sustain|/səˈsteɪn/|verb|支撑；维持
ngsl|2274|flood|/flʌd/|noun|洪水
ngsl|2275|poverty|/ˈpɑv.ər.ti/|noun|贫穷
ngsl|2276|crazy|/ˈkreɪ.zi/|adjective|疯狂的
ngsl|2277|cite|/saɪt/|verb|引用
ngsl|2278|newly|/ˈnu.li/|adverb|最近的；新近的
ngsl|2279|parallel|/ˈpær.əˌlɛl/|adjective|平行的；类似的
ngsl|2280|gender|/ˈdʒɛn.dər/|noun|性别
ngsl|2281|sponsor|/ˈspɑn.sər/|verb|赞助
ngsl|2282|boot|/but/|noun|靴子
ngsl|2283|accurate|/ˈæk.jər.ɪt/|adjective|精确的；准确无误的
ngsl|2284|dealer|/ˈdi.lər/|noun|经销商
ngsl|2285|button|/ˈbʌt.ən/|noun|纽扣
ngsl|2286|burden|/ˈbɜr.dən/|verb|使担负
ngsl|2287|desert|/ˈdɛz.ərt/|noun|沙漠
ngsl|2288|mate|/meɪt/|noun|同伴，伙伴
ngsl|2289|occasionally|/əˈkeɪ.ʒə.nəl.i/|adverb|偶尔地；有时地
ngsl|2290|shareholder|/ˈʃɛərˌhoʊl.dər/|noun|股东
ngsl|2291|bowl|/bəʊl/|noun|碗
ngsl|2292|discovery|/dɪsˈkʌv.ə.ri/|noun|发现
ngsl|2293|resistance|/rɪˈzɪs.təns/|noun|反对
ngsl|2294|bath|/bæθ/|noun|沐浴
ngsl|2295|frequency|/ˈfri.kwən.si/|noun|频率
ngsl|2296|criticize|/ˈkrɪt.əˌsaɪz/|verb|批评
ngsl|2297|tap|/tæp/|verb|轻敲
ngsl|2298|philosophy|/fɪˈlɑs.ə.fi/|noun|哲学
ngsl|2299|lip|/lɪp/|noun|嘴唇
ngsl|2300|attribute|/ˈæ.trəˌbjut/|noun|属性；特征
ngsl|2301|apologize|/əˈpɑl.əˌdʒaɪz/|verb|道歉
ngsl|2302|approval|/əˈpru.vəl/|noun|认可
ngsl|2303|grab|/ɡræb/|verb|抓
ngsl|2304|entitle|/ɛnˈtaɪt.l/|verb|赋予权利
ngsl|2305|lend|/lɛnd/|verb|借给
ngsl|2306|involvement|/ɪnˈvɑlv.mənt/|noun|牵连；参与
ngsl|2307|exposure|/ɪkˈspoʊ.ʒər/|noun|暴露；面临
ngsl|2308|conventional|/kənˈvɛn.ʃə.nəl/|adjective|依照惯例的；传统的
ngsl|2309|digital|/ˈdɪ.dʒɪ.təl/|adjective|数字的；数码的
ngsl|2310|translate|/trænzˈleɪt/|verb|翻译
ngsl|2311|edit|/ˈɛd.ɪt/|verb|编辑
ngsl|2312|formation|/fɔrˈmeɪ.ʃən/|noun|形成，组成；编队
ngsl|2313|deposit|/dɪˈpɑz.ɪt/|noun|订金；存款
ngsl|2314|pleasant|/ˈplɛz.ənt/|adjective|令人愉快的
ngsl|2315|overseas|/ˌoʊ.vərˈsiz/|adverb|在海外
ngsl|2316|advocate|/ˈæd.vəˌkeɪt/|verb|拥护；主张
ngsl|2317|establishment|/ɪˈstæb.lɪʃ.mənt/|noun|组织，机构，企业
ngsl|2318|summary|/ˈsʌm.ə.ri/|noun|总结；概要
ngsl|2319|rough|/rʌf/|adjective|粗糙的，粗野的，粗暴的
ngsl|2320|pen|/pɛn/|noun|钢笔
ngsl|2321|recovery|/rɪˈkʌ.və.ri/|noun|恢复
ngsl|2322|seal|/sil/|verb|密封
ngsl|2323|tube|/tjub/|noun|管子
ngsl|2324|tower|/ˈtaʊ.ər/|noun|塔
ngsl|2325|characterize|/ˈkær.ɪk.təˌraɪz/|verb|描绘...的特征
ngsl|2326|specify|/ˈspɛs.əˌfaɪ/|verb|具体说明
ngsl|2327|exact|/ɪgˈzækt/|adjective|准确的，精确的，精密的
ngsl|2328|spin|/spɪn/|verb|旋转
ngsl|2329|operator|/ˈɑp.əˌreɪ.tər/|noun|操作员
ngsl|2330|infant|/ˈɪn.fənt/|noun|婴儿
ngsl|2331|dig|/dɪɡ/|verb|挖
ngsl|2332|drag|/dræɡ/|verb|拖曳
ngsl|2333|mount|/maʊnt/|verb|组织开展；准备
ngsl|2334|wrap|/ræp/|verb|包；裹
ngsl|2335|anticipate|/ænˈtɪs.əˌpeɪt/|verb|期盼，期望
ngsl|2336|dependent|/dɪˈpɛn.dənt/|adjective|依靠的
ngsl|2337|specialize|/ˈspɛ.ʃəˌlaɪz/|verb|专门从事；专攻
ngsl|2338|angle|/ˈæŋ.gəl/|noun|角
ngsl|2339|chicken|/ˈtʃɪk.ən/|noun|鸡
ngsl|2340|anxiety|/æŋˈzaɪ.ə.tɪ/|noun|焦虑；担心
ngsl|2341|virus|/ˈvaɪ.rəs/|noun|病毒
ngsl|2342|precisely|/prɪˈsaɪs.lɪ/|adverb|精确地；恰好地
ngsl|2343|rival|/ˈraɪ.vəl/|adjective|竞争对手
ngsl|2344|offense|/əˈfɛns/|noun|触犯；冒犯
ngsl|2345|detect|/dɪˈtɛkt/|verb|发现；探测
ngsl|2346|teenager|/ˈtinˌeɪ.dʒər/|noun|(13岁至19岁之间的)青少年
ngsl|2347|admire|/ædˈmaɪər/|verb|钦佩；仰慕
ngsl|2348|moderate|/ˈmɑd.ər.ɪt/|adjective|适中的
ngsl|2349|surgery|/ˈsɜr.dʒə.ri/|noun|外科手术
ngsl|2350|musician|/mjuˈzɪʃ.ən/|noun|音乐家
ngsl|2351|significance|/sɪgˈnɪf.ɪ.kəns/|noun|意义；重要性
ngsl|2352|shower|/ˈʃaʊ.ər/|noun|沐浴
ngsl|2353|illegal|/ɪˈli.gəl/|adjective|非法的
ngsl|2354|charity|/ˈtʃær.ɪ.ti/|noun|慈善机构
ngsl|2355|universal|/ˌju.nəˈvɜr.səl/|adjective|普遍的
ngsl|2356|cigarette|/ˈsɪg.əˌrɛt/|noun|香烟
ngsl|2357|constitute|/ˈkɑn.stɪˌtut/|verb|组成，构成
ngsl|2358|adequate|/ˈæd.ə.kwɪt/|adjective|足够的；充足的
ngsl|2359|consultant|/kənˈsʌl.tənt/|noun|顾问
ngsl|2360|historian|/hɪˈstɔr.i.ən/|noun|历史学家
ngsl|2361|cousin|/ˈkʌ.zən/|noun|堂兄弟姐妹；表兄弟姐妹
ngsl|2362|visual|/ˈvɪʒ.u.əl/|adjective|视觉的
ngsl|2363|stupid|/ˈstu.pɪd/|adjective|愚蠢的;笨的
ngsl|2364|keen|/kin/|adjective|热切的
ngsl|2365|ethnic|/ˈɛθ.nɪk/|adjective|种族的
ngsl|2366|twin|/twɪn/|noun|双胞胎
ngsl|2367|clinical|/ˈklɪn.ɪ.kəl/|adjective|临床的
ngsl|2368|eastern|/ˈi.stərn/|adjective|东方的
ngsl|2369|forecast|/ˈfɔrˌkæst/|noun|（天气等）预测，预报
ngsl|2370|segment|/ˈsɛg.mənt/|noun|部分，片段
ngsl|2371|custom|/ˈkʌs.təm/|noun|风俗
ngsl|2372|adapt|/əˈdæpt/|verb|使适应
ngsl|2373|sand|/sænd/|noun|沙子
ngsl|2374|cap|/kæp/|noun|帽子
ngsl|2375|prompt|/prɑmpt/|adjective|迅速的；及时的
ngsl|2376|charm|/tʃɑrm/|noun|魅力；吸引力
ngsl|2377|react|/riˈækt/|verb|反应
ngsl|2378|lecture|/ˈlɛk.tʃər/|noun|演讲
ngsl|2379|venture|/ˈvɛn.tʃər/|noun|冒险
ngsl|2380|compound|/ˈkɑm.paʊnd/|noun|混合物
ngsl|2381|rescue|/ˈrɛs.kju/|verb|救援
ngsl|2382|mess|/mɛs/|noun|混乱，脏乱
ngsl|2383|preference|/ˈprɛf.ər.əns/|noun|偏爱
ngsl|2384|comprehensive|/ˌkɑm.prɪˈhɛn.sɪv/|adjective|综合的;广泛的
ngsl|2385|incentive|/ɪnˈsɛn.tɪv/|noun|激励
ngsl|2386|league|/lig/|noun|联盟
ngsl|2387|dialog|/ˈdaɪ.əˌlɔg/|noun|对话
ngsl|2388|cream|/krim/|noun|奶油
ngsl|2389|rapid|/ˈræp.ɪd/|adjective|快速的
ngsl|2390|cancel|/ˈkæn.səl/|verb|取消
ngsl|2391|regret|/rɪˈgrɛt/|verb|后悔
ngsl|2392|dismiss|/dɪsˈmɪs/|verb|开除
ngsl|2393|margin|/ˈmɑr.dʒɪn/|noun|边缘
ngsl|2394|beneath|/bɪˈniθ/|preposition|在下方
ngsl|2395|opponent|/əˈpoʊ.nənt/|noun|对手
ngsl|2396|resist|/rɪˈzɪst/|verb|抵抗
ngsl|2397|capability|/ˌkeɪ.pəˈbɪl.ɪ.ti/|noun|才能；能力
ngsl|2398|absolute|/ˈæb.səˌlut/|adjective|绝对的;完全的
ngsl|2399|correspond|/ˌkɔr.əˈspɑnd/|verb|相一致
ngsl|2400|stroke|/strəʊk/|verb|轻抚
ngsl|2401|dare|/dɛər/|verb|胆敢
ngsl|2402|barrier|/ˈbær.i.ər/|noun|障碍物
ngsl|2403|rid|/ˈrɪd/|verb|使摆脱
ngsl|2404|divorce|/dɪˈvɔrs/|noun|离婚
ngsl|2405|ruin|/ˈru.ɪn/|verb|毁灭；破坏
ngsl|2406|bury|/ˈbɛr.i/|verb|埋葬
ngsl|2407|counsel|/ˈkaʊn.səl/|verb|提供专业咨询
ngsl|2408|tendency|/ˈtɛn.dən.si/|noun|倾向，趋势
ngsl|2409|frequent|/ˈfri.kwənt/|adjective|频繁的
ngsl|2410|motor|/ˈmoʊ.tər/|noun|发动机
ngsl|2411|survival|/sərˈvaɪ.vəl/|noun|幸存
ngsl|2412|counter|/ˈkaʊn.tər/|noun|柜台
ngsl|2413|possess|/pəˈzɛs/|verb|拥有；具有
ngsl|2414|permission|/pərˈmɪʃ.ən/|noun|允许；许可
ngsl|2415|valley|/ˈvæl.i/|noun|山谷
ngsl|2416|float|/fləʊt/|verb|浮动；漂浮
ngsl|2417|mad|/ˈmæd/|adjective|很生气的；特别喜欢；疯狂的
ngsl|2418|greatly|/ˈgreɪt.li/|adverb|非常
ngsl|2419|visible|/ˈvɪz.ə.bəl/|adjective|可见的；明显的
ngsl|2420|electric|/ɪˈlɛk.trɪk/|adjective|电的
ngsl|2421|impressive|/ɪmˈprɛs.ɪv/|adjective|感人的；令人钦佩的
ngsl|2422|evolution|/ˌɛv.əˈlu.ʃən/|noun|进化；演变
ngsl|2423|awareness|/əˈwɛər.nɪs/|noun|认知；意识
ngsl|2424|violent|/ˈvaɪ.ə.lənt/|adjective|暴力的；猛烈的
ngsl|2425|slave|/sleɪv/|noun|奴隶
ngsl|2426|wealthy|/ˈwɛl.θi/|adjective|财富
ngsl|2427|architecture|/ˈɑr.kɪˌtɛk.tʃər/|noun|建筑学
ngsl|2428|acceptable|/ækˈsɛp.tə.bəl/|adjective|令人满意的；认同的
ngsl|2429|journal|/ˈdʒɜr.nəl/|noun|日志；刊物
ngsl|2430|coal|/kəʊl/|noun|煤
ngsl|2431|measurement|/ˈmɛʒ.ər.mənt/|noun|测量
ngsl|2432|random|/ˈræn.dəm/|adjective|随机的
ngsl|2433|successfully|/səkˈsɛs.fəl/|adverb|成功地
ngsl|2434|depress|/dɪˈprɛs/|verb|使沮丧；使跌价
ngsl|2435|illustration|/ˌɪl.əˈstreɪ.ʃən/|noun|插图
ngsl|2436|burst|/bərst/|verb|爆发出
ngsl|2437|privilege|/ˈprɪv.lɪdʒ/|noun|特权
ngsl|2438|buyer|/ˈbaɪ.ər/|noun|买主
ngsl|2439|mutual|/ˈmju.tʃu.əl/|adjective|共同的；相互的
ngsl|2440|rail|/reɪl/|noun|铁轨；横杆
ngsl|2441|motivate|/ˈmoʊ.təˌveɪt/|verb|激励
ngsl|2442|laboratory|/ˈlæb.rəˌtɔr.i/|noun|实验室
ngsl|2443|mortgage|/ˈmɔr.gɪdʒ/|noun|抵押货款
ngsl|2444|promotion|/prəˈmoʊ.ʃən/|noun|晋升
ngsl|2445|passion|/ˈpæʃ.ən/|noun|激情；热情
ngsl|2446|champion|/ˈtʃæm.pi.ən/|noun|冠军
ngsl|2447|fulfill|/fʊlˈfɪl/|verb|实现；履行
ngsl|2448|dust|/dʌst/|noun|灰尘
ngsl|2449|dedicate|/ˈdɛd.ɪˌkeɪt/|verb|奉献；致力
ngsl|2450|roughly|/ˈrʌf.li/|adverb|粗略地；粗鲁地
ngsl|2451|skirt|/skɜrt/|noun|裙子
ngsl|2452|province|/ˈprɑv.ɪns/|noun|省
ngsl|2453|march|/mɑrtʃ/|verb|前进
ngsl|2454|evaluation|/ɪˌvæl.juˈeɪ.ʃən/|noun|评估
ngsl|2455|compromise|/ˈkɑm.prəˌmaɪz/|verb|妥协
ngsl|2456|accomplish|/əˈkɑm.plɪʃ/|verb|完成；实现
ngsl|2457|weakness|/ˈwik.nɪs/|noun|弱点
ngsl|2458|announcement|/əˈnaʊns.mɛnt/|noun|公告；通知
ngsl|2459|salt|/sɔlt/|noun|盐
ngsl|2460|glance|/glɑns/|verb|瞥一眼
ngsl|2461|opera|/ˈɑp.ər.ə/|noun|歌剧
ngsl|2462|contest|/ˈkɑn.tɛst/|noun|竞赛
ngsl|2463|brush|/brʌʃ/|noun|刷子
ngsl|2464|embarrass|/ɛmˈbær.əs/|verb|使尴尬
ngsl|2465|gallery|/ˈgæl.ə.ri/|noun|画廊
ngsl|2466|genetic|/dʒəˈnɛt.ɪk/|adjective|遗传的
ngsl|2467|aggressive|/əˈgrɛs.ɪv/|adjective|侵略性的
ngsl|2468|chest|/tʃɛst/|noun|胸部
ngsl|2469|format|/ˈfɔr.mæt/|noun|格式；设计；总体安排
ngsl|2470|literary|/ˈlɪt.əˌrɛr.i/|adjective|文学的
ngsl|2471|govern|/ˈgʌv.ərn/|verb|统治；治理
ngsl|2472|embrace|/ɛmˈbreɪs/|verb|拥抱
ngsl|2473|praise|/preɪz/|verb|赞扬
ngsl|2474|silent|/ˈsaɪ.lənt/|adjective|不说话的；无声的
ngsl|2475|pump|/pʌmp/|verb|用泵抽运
ngsl|2476|publisher|/ˈpʌb.lɪ.ʃər/|noun|出版商
ngsl|2477|celebration|/ˌsɛl.əˈbreɪ.ʃən/|noun|庆典
ngsl|2478|golf|/gɑlf/|noun|高尔夫球运动
ngsl|2479|compensation|/ˌkɑm.pənˈseɪ.ʃən/|noun|赔偿
ngsl|2480|classical|/ˈklæs.ɪ.kəl/|adjective|古典的
ngsl|2481|weigh|/weɪ/|verb|称重
ngsl|2482|versus|/ˈvɜr.səs/|preposition|与...相对
ngsl|2483|deficit|/ˈdɛf.ə.sɪt/|noun|赤字
ngsl|2484|modify|/ˈmɑd.əˌfaɪ/|verb|修改
ngsl|2485|flash|/flæʃ/|noun|闪光
ngsl|2486|friendship|/ˈfrɛnd.ʃɪp/|noun|友谊
ngsl|2487|profession|/prəˈfɛʃ.ən/|noun|职业
ngsl|2488|literally|/ˈlɪt.ər.ə.li/|adverb|字面上；确实地
ngsl|2489|equation|/ɪˈkweɪ.ʒən/|noun|等式
ngsl|2490|gesture|/ˈdʒɛs.tʃər/|noun|姿势
ngsl|2491|entertain|/ˌɛn.tərˈteɪn/|verb|招待
ngsl|2492|fantastic|/fænˈtæs.tɪk/|adjective|极好的
ngsl|2493|assign|/əˈsaɪn/|verb|分配；布置
ngsl|2494|inflation|/ɪnˈfleɪ.ʃən/|noun|通货膨胀
ngsl|2495|historic|/hɪˈstɔr.ɪk/|adjective|有历史意义的
ngsl|2496|injure|/ˈɪn.dʒər/|verb|受伤
ngsl|2497|remote|/rɪˈmoʊt/|adjective|遥远的
ngsl|2498|therapy|/ˈθɛr.ə.pi/|noun|治疗；疗法
ngsl|2499|orange|/ˈɔr.ɪndʒ/|adjective|橙色
ngsl|2500|twist|/twɪst/|verb|扭转
ngsl|2501|personnel|/ˌpɜr.səˈnɛl/|noun|全体人员
ngsl|2502|imagination|/ɪˌmædʒ.əˈneɪ.ʃən/|noun|想象力
ngsl|2503|disagree|/ˌdɪs.əˈgri/|verb|不同意
ngsl|2504|throat|/ˈθrəʊt/|noun|喉咙
ngsl|2505|insight|/ˈɪnˌsaɪt/|noun|洞察力
ngsl|2506|tackle|/ˈtæk.əl/|verb|解决；处理
ngsl|2507|forever|/fɔrˈɛv.ər/|adverb|永远地
ngsl|2508|exceed|/ɪkˈsid/|verb|超过
ngsl|2509|expenditure|/ɪkˈspɛn.dɪ.tʃər/|noun|支出；花费
ngsl|2510|joy|/dʒɔɪ/|noun|快乐；喜悦
ngsl|2511|pregnant|/ˈprɛg.nənt/|adjective|怀孕的
ngsl|2512|reliable|/rɪˈlaɪ.ə.bəl/|adjective|可信赖的；可靠的
ngsl|2513|gear|/gɪər/|noun|工具；衣着；齿轮
ngsl|2514|click|/klɪk/|noun|点击
ngsl|2515|poet|/ˈpoʊ.ɪt/|noun|诗人
ngsl|2516|fortune|/ˈfɔr.tʃən/|noun|运气
ngsl|2517|ceremony|/ˈsɛr.əˌmoʊ.ni/|noun|典礼；仪式
ngsl|2518|pile|/paɪl/|noun|摞；堆
ngsl|2519|pig|/ˈpɪɡ/|noun|猪
ngsl|2520|mixture|/ˈmɪks.tʃər/|noun|混合物
ngsl|2521|automatically|/ˌɔ.təˈmæt.ɪk.li/|adverb|自动地
ngsl|2522|scholar|/ˈskɑl.ər/|noun|学者
ngsl|2523|psychological|/ˌsaɪ.kəˈlɑdʒ.ɪ.kəl/|adjective|心理的
ngsl|2524|dramatically|/drəˈmæt.ɪk.li/|adverb|显著地；剧烈地
ngsl|2525|stake|/steɪk/|verb|桩
ngsl|2526|creature|/ˈkri.tʃər/|noun|生物
ngsl|2527|partnership|/ˈpɑrt.nərˌʃɪp/|noun|合作
ngsl|2528|participation|/pɑrˌtɪs.əˈpeɪ.ʃən/|noun|参与
ngsl|2529|clause|/klɔz/|noun|条款
ngsl|2530|penalty|/ˈpɛn.l.ti/|noun|处罚
ngsl|2531|chamber|/ˈtʃeɪm.bər/|noun|室
ngsl|2532|fancy|/ˈfæn.si/|adjective|复杂的；昂贵的
ngsl|2533|poetry|/ˈpoʊ.ɪ.tri/|noun|诗
ngsl|2534|chat|/tʃæt/|verb|聊天
ngsl|2535|clothing|/ˈkloʊ.ðɪŋ/|noun|衣服
ngsl|2536|evolve|/ɪˈvɑlv/|verb|逐渐演变；进化
ngsl|2537|sake|/seɪk/|noun|目的；利益
ngsl|2538|shelf|/ʃɛlf/|noun|架子；搁板
ngsl|2539|boost|/bust/|verb|促进
ngsl|2540|tail|/teɪl/|noun|尾巴
ngsl|2541|possession|/pəˈzɛʃ.ən/|noun|拥有
ngsl|2542|abortion|/əˈbɔr.ʃən/|noun|流产
ngsl|2543|curious|/ˈkjʊər.i.əs/|adjective|好奇的
ngsl|2544|wooden|/ˈwʊd.ən/|adjective|木制的
ngsl|2545|boom|/bum/|verb|隆隆作响
ngsl|2546|tale|/teɪl/|noun|故事；传说
ngsl|2547|democratic|/ˌdɛm.əˈkræt.ɪk/|adjective|民主的
ngsl|2548|maintenance|/ˈmeɪn.tə.nəns/|noun|维护
ngsl|2549|consequently|/ˈkɑn.sɪˌkwɛnt.li/|adverb|因此；结果
ngsl|2550|pot|/pɑt/|noun|锅
ngsl|2551|cow|/kaʊ/|noun|奶牛
ngsl|2552|strengthen|/ˈstrɛŋ.θən/|verb|加强
ngsl|2553|whilst|/waɪlst/|conjunction|当...的时候；同时
ngsl|2554|constraint|/kənˈstreɪnt/|noun|限制；约束
ngsl|2555|fold|/ˈfəʊld/|verb|折叠
ngsl|2556|bin|/bɪn/|noun|容器
ngsl|2557|undergo|/ˌʌn.dərˈgoʊ/|verb|经历（不快的事情）
ngsl|2558|potentially|/pəˈtɛn.ʃə.li/|adverb|潜在地
ngsl|2559|scope|/ˈskəʊp/|noun|范围
ngsl|2560|pretend|/prɪˈtɛnd/|verb|佯装
ngsl|2561|diversity|/daɪˈvɜr.sɪ.ti/|noun|差异；多样性
ngsl|2562|allege|/əˈlɛdʒ/|verb|声称
ngsl|2563|pride|/praɪd/|noun|自尊心
ngsl|2564|intense|/ɪnˈtɛns/|adjective|强烈的；非常的
ngsl|2565|inquiry|/ˈɪn.kwə.ri/|noun|质询
ngsl|2566|resign|/rɪˈzaɪn/|verb|辞职
ngsl|2567|craft|/kræft/|verb|（用手工）精心制作
ngsl|2568|strict|/strɪkt/|adjective|严格的
ngsl|2569|concrete|/ˈkɑn.krit/|noun|混凝土
ngsl|2570|shell|/ʃɛl/|noun|壳
ngsl|2571|damn|/dæm/|verb|谴责
ngsl|2572|distinct|/dɪˈstɪŋkt/|adjective|有区别的
ngsl|2573|humor|/ˈhju.mər/|noun|幽默
ngsl|2574|limitation|/ˌlɪm.ɪˈteɪ.ʃən/|noun|限制；限度
ngsl|2575|indication|/ˌɪn.dɪˈkeɪ.ʃən/|noun|迹象
ngsl|2576|stability|/stəˈbɪl.ɪ.ti/|noun|稳定性
ngsl|2577|wise|/waɪz/|adjective|博学的；高明的
ngsl|2578|neglect|/nɪˈglɛkt/|verb|疏于照顾
ngsl|2579|compose|/kəmˈpoʊz/|verb|构成；组成
ngsl|2580|jail|/dʒeɪl/|noun|监狱
ngsl|2581|shelter|/ˈʃɛl.tər/|noun|避难所
ngsl|2582|mere|/mɪər/|adjective|仅仅的
ngsl|2583|carbon|/ˈkɑr.bən/|noun|碳（C）
ngsl|2584|regulate|/ˈrɛg.jəˌleɪt/|verb|规定;控制
ngsl|2585|cheese|/tʃiz/|noun|奶酪
ngsl|2586|trigger|/ˈtrɪg.ər/|verb|触发
ngsl|2587|pipe|/paɪp/|noun|管道
ngsl|2588|destruction|/dɪˈstrʌk.ʃən/|noun|摧毁
ngsl|2589|guitar|/gɪˈtɑr/|noun|吉他
ngsl|2590|flag|/flæɡ/|noun|旗帜
ngsl|2591|piano|/piˈæn.oʊ/|noun|钢琴
ngsl|2592|magic|/ˈmædʒ.ɪk/|noun|魔法
ngsl|2593|mystery|/ˈmɪs.tə.ri/|noun|神秘
ngsl|2594|ski|/ski/|noun|滑雪橇
ngsl|2595|whisper|/ˈwɪs.pər/|verb|耳语
ngsl|2596|rear|/rɪər/|adjective|后方的
ngsl|2597|menu|/ˈmɛn.ju/|noun|菜单
ngsl|2598|species|/ˈspi.siz/|noun|物种
ngsl|2599|moon|/mun/|noun|月亮
ngsl|2600|presumably|/prɪˈzu.mə.bli/|adverb|大概；想必
ngsl|2601|bless|/blɛs/|verb|祝福
ngsl|2602|airline|/ˈɛərˌlaɪn/|noun|航空公司
ngsl|2603|amendment|/əˈmɛnd.mənt/|noun|改良；修正；改善
ngsl|2604|grandmother|/ˈgrændˌmʌð.ər/|noun|祖母；外祖母
ngsl|2605|jury|/ˈdʒʊər.i/|noun|陪审团
ngsl|2606|cooperation|/koʊˌɑp.əˈreɪ.ʃən/|noun|合作
ngsl|2607|civilian|/sɪˈvɪl.jən/|noun|平民；百姓
ngsl|2608|composition|/ˌkɑm.pəˈzɪʃ.ən/|noun|创作
ngsl|2609|coin|/kɔɪn/|noun|硬币
ngsl|2610|regardless|/rɪˈgɑrd.lɪs/|adjective|不管的；不顾的
ngsl|2611|scan|/skæn/|verb|扫描
ngsl|2612|bunch|/bʌntʃ/|noun|串；群
ngsl|2613|racial|/ˈreɪ.ʃəl/|adjective|种族的
ngsl|2614|greet|/grit/|verb|打招呼；迎接
ngsl|2615|hopefully|/ˈhoʊp.fə.li/|adverb|有希望地
ngsl|2616|sanction|/ˈsæŋk.ʃən/|noun|制裁
ngsl|2617|trick|/trɪk/|verb|欺骗
ngsl|2618|paragraph|/ˈpɛr.əˌɡræf/|noun|段落
ngsl|2619|maker|/ˈmeɪ.kər/|noun|生产者；制造商
ngsl|2620|chocolate|/ˈtʃɔ.kə.lɪt/|noun|巧克力
ngsl|2621|stimulate|/ˈstɪm.jəˌleɪt/|verb|刺激
ngsl|2622|belt|/bɛlt/|noun|腰带
ngsl|2623|potato|/pəˈteɪ.toʊ/|noun|土豆；马铃薯
ngsl|2624|narrative|/ˈnær.ə.tɪv/|noun|叙事
ngsl|2625|tissue|/ˈtɪʃ.u/|noun|纸巾
ngsl|2626|barely|/ˈbɛər.li/|adverb|几乎不
ngsl|2627|invent|/ɪnˈvɛnt/|verb|发明
ngsl|2628|tourism|/ˈtʊər.ɪz.əm/|noun|旅游
ngsl|2629|pro|/prəʊ/|noun|职业运动员
ngsl|2630|stair|/stɛər/|noun|楼梯
ngsl|2631|hesitate|/ˈhɛz.ɪˌteɪt/|verb|犹豫
ngsl|2632|shine|/ʃaɪn/|verb|动机；诱因
ngsl|2633|motivation|/ˌmoʊ.təˈveɪ.ʃən/|noun|动机；诱因
ngsl|2634|romantic|/roʊˈmæn.tɪk/|adjective|浪漫的
ngsl|2635|firmly|/ˈfɜrm.li/|adverb|坚决地；坚固地
ngsl|2636|interior|/ɪnˈtɪ.ri.ər/|adjective|内部的
ngsl|2637|stomach|/ˈstʌm.ək/|noun|胃
ngsl|2638|nowhere|/ˈnoʊˌwɛər/|adverb|无处；任何地方
ngsl|2639|pray|/preɪ/|verb|祈祷
ngsl|2640|championship|/ˈtʃæm.pi.ənˌʃɪp/|noun|锦标赛
ngsl|2641|servant|/ˈsɜr.vənt/|noun|仆人；佣人
ngsl|2642|immigrant|/ˈɪm.ɪ.grənt/|noun|移民
ngsl|2643|excess|/ˈɛk.sɛs/|noun|超额
ngsl|2644|complexity|/kəmˈplɛk.sɪ.ti/|noun|复杂性
ngsl|2645|liability|/ˌlaɪ.əˈbɪl.ɪ.ti/|noun|责任；债务
ngsl|2646|surprisingly|/sərˈpraɪ.zɪŋ.li/|adverb|出其不意地
ngsl|2647|extract|/ˈɛk.strækt/|verb|提取
ngsl|2648|implementation|/ˌɪm.plə.mənˈteɪ.ʃən/|noun|实施；履行
ngsl|2649|bias|/ˈbaɪ.əs/|noun|偏见
ngsl|2650|differently|/ˈdɪf.ər.ənt.li/|adverb|不同地
ngsl|2651|catalog|/ˈkæt.lˌɔg/|noun|目录
ngsl|2652|continuous|/kənˈtɪn.ju.əs/|adjective|连续的
ngsl|2653|golden|/ˈgoʊl.dən/|adjective|金制的
ngsl|2654|stamp|/stæmp/|noun|邮票
ngsl|2655|guideline|/ˈgaɪdˌlaɪn/|noun|指导方针；指导原则
ngsl|2656|envelope|/ˈɛn.vəˌloʊp/|noun|信封
ngsl|2657|knife|/naɪf/|noun|刀；匕首
ngsl|2658|biological|/ˌbaɪ.əˈlɑdʒ.ɪ.kəl/|adjective|生物学的
ngsl|2659|consume|/kənˈsum/|verb|消费
ngsl|2660|luxury|/ˈlʌk.ʃə.ri/|noun|奢华
ngsl|2661|weekly|/ˈwik.li/|adverb|每周的
ngsl|2662|wherever|/wɛərˈɛv.ər/|adverb|无论何处
ngsl|2663|bite|/baɪt/|verb|咬
ngsl|2664|printer|/ˈprɪn.tər/|noun|打印机
ngsl|2665|firstly|/ˈfɜrst.li/|adverb|首先；第一
ngsl|2666|anxious|/ˈæŋk.ʃəs/|adjective|焦虑的；担忧的
ngsl|2667|adventure|/ædˈvɛn.tʃər/|noun|冒险
ngsl|2668|fence|/fɛns/|noun|栅栏
ngsl|2669|exhaust|/ɪɡˈzɑst/|verb|耗尽
ngsl|2670|attraction|/əˈtræk.ʃən/|noun|景点
ngsl|2671|ocean|/ˈoʊ.ʃən/|noun|海洋
ngsl|2672|quietly|/ˈkwaɪ.ɪt.li/|adverb|悄悄地
ngsl|2673|castle|/ˈkæ.səl/|noun|城堡
ngsl|2674|veteran|/ˈvɛt.ər.ən/|noun|富有经验的人
ngsl|2675|reflection|/rɪˈflɛk.ʃən/|noun|反射
ngsl|2676|nerve|/nɜrv/|noun|神经
ngsl|2677|determination|/dɪˌtɜr.məˈneɪ.ʃən/|noun|决心
ngsl|2678|altogether|/ˈɔl.təˌgɛð.ər/|adverb|总共
ngsl|2679|fiction|/ˈfɪk.ʃən/|noun|小说
ngsl|2680|carpet|/ˈkɑr.pɪt/|noun|地毯
ngsl|2681|cluster|/ˈklʌs.tər/|verb|群聚
ngsl|2682|confusion|/kənˈfju.ʒən/|noun|困惑
ngsl|2683|hurry|/ˈhʌr.i/|verb|赶快
ngsl|2684|logic|/ˈlɑdʒ.ɪk/|noun|思维方式
ngsl|2685|controversial|/ˌkɑn.trəˈvɜr.ʃəl/|adjective|有争议的
ngsl|2686|raw|/rɔ/|adjective|未经加工的
ngsl|2687|grammar|/ˈgræm.ər/|noun|语法
ngsl|2688|revise|/rɪˈvaɪz/|verb|修改
ngsl|2689|hint|/hɪnt/|noun|暗示
ngsl|2690|hook|/hʊk/|noun|钩子
ngsl|2691|bell|/bɛl/|noun|铃
ngsl|2692|liquid|/ˈlɪk.wɪd/|noun|液体
ngsl|2693|panic|/ˈpæn.ɪk/|noun|恐慌
ngsl|2694|uncle|/ˈʌŋ.kəl/|noun|叔伯父；舅父；姑父；姨父
ngsl|2695|rice|/raɪs/|noun|大米
ngsl|2696|slope|/sloʊp/|noun|斜坡
ngsl|2697|happiness|/ˈhæp.i.nɪs/|noun|幸福
ngsl|2698|genuine|/ˈdʒɛn.ju.ɪn/|adjective|真正的
ngsl|2699|vessel|/ˈvɛs.əl/|noun|容器，器皿
ngsl|2700|verb|/vɜrb/|noun|动词
ngsl|2701|reckon|/ˈrɛk.ən/|verb|估计
ngsl|2702|silly|/ˈsɪl.i/|adverb|愚蠢的
ngsl|2703|transportation|/ˌtræns.pərˈteɪ.ʃən/|noun|运输
ngsl|2704|harbor|/ˈhɑr.bər/|noun|港口
ngsl|2705|comedy|/ˈkɑm.ə.di/|noun|喜剧
ngsl|2706|chase|/tʃeɪs/|verb|追赶
ngsl|2707|storage|/ˈstɔr.ɪdʒ/|noun|仓库
ngsl|2708|universe|/ˈju.nəˌvɜrs/|noun|宇宙
ngsl|2709|horrible|/ˈhɔr.ə.bəl/|adjective|可怕的
ngsl|2710|sheep|/ʃip/|noun|羊
ngsl|2711|lover|/ˈlʌv.ər/|noun|情人
ngsl|2712|rat|/ræt/|noun|老鼠
ngsl|2713|portrait|/ˈpɔr.trɪt/|noun|肖像
ngsl|2714|innocent|/ˈɪn.ə.sənt/|adjective|无辜的
ngsl|2715|substitute|/ˈsʌb.stɪˌtut/|noun|替代者
ngsl|2716|supplement|/ˈsʌp.lə.mənt/|noun|补充
ngsl|2717|adjustment|/əˈdʒʌst.mənt/|noun|调整
ngsl|2718|reasonably|/ˈri.zən.ə.bli/|adverb|合理的
ngsl|2719|filter|/ˈfɪl.tər/|noun|过滤器
ngsl|2720|flexible|/ˈflɛk.sə.bəl/|adjective|灵活的；易弯曲的
ngsl|2721|abstract|/ˈæb.strækt/|adjective|抽象的
ngsl|2722|tent|/tɛnt/|noun|帐篷
ngsl|2723|precise|/prɪˈsaɪs/|adjective|准确的；细致的
ngsl|2724|distant|/ˈdɪs.tənt/|adjective|遥远的
ngsl|2725|stranger|/ˈstreɪn.dʒər/|noun|陌生人
ngsl|2726|shade|/ʃeɪd/|noun|阴影
ngsl|2727|grain|/greɪn/|noun|粮食
ngsl|2728|situate|/ˈsɪtʃ.uˌeɪt/|verb|使处于
ngsl|2729|summarize|/ˈsʌm.əˌraɪz/|verb|作总结
ngsl|2730|leap|/lip/|verb|跳跃
ngsl|2731|snap|/snæp/|verb|折断
ngsl|2732|probability|/ˌprɑb.əˈbɪl.ɪ.ti/|noun|可能性
ngsl|2733|leather|/ˈlɛð.ər/|noun|皮革
ngsl|2734|uncertainty|/ʌnˈsɜr.tn.ti/|noun|不确定
ngsl|2735|swear|/swɛər/|verb|发誓
ngsl|2736|refugee|/ˌrɛf.jʊˈdʒi/|noun|难民
ngsl|2737|shore|/ʃɔr/|noun|岸
ngsl|2738|monthly|/ˈmʌnθ.li/|adverb|每月地
ngsl|2739|comprise|/kəmˈpraɪz/|verb|包含；由...组成
ngsl|2740|stir|/stɜr/|verb|搅拌
ngsl|2741|excitement|/ɪkˈsaɪt.mənt/|noun|激动；兴奋
ngsl|2742|sigh|/saɪ/|verb|叹气
ngsl|2743|pregnancy|/ˈprɛg.nən.si/|noun|怀孕
ngsl|2744|experimental|/ɪkˌspɛr.əˈmɛn.təl/|adjective|饰演的
ngsl|2745|institutional|/ˌɪn.stɪˈtu.ʃən.əl/|adjective|机构的
ngsl|2746|slice|/slaɪs/|noun|薄片
ngsl|2747|wander|/ˈwɑn.dər/|verb|漫步
ngsl|2748|empire|/ˈɛm.paɪər/|noun|帝国
ngsl|2749|subsequently|/ˈsʌb.sɪ.kwənt.li/|adverb|随后
ngsl|2750|gentle|/ˈdʒɛn.təl/|adjective|温和的；温柔的
ngsl|2751|attendance|/əˈtɛn.dəns/|noun|出席
ngsl|2752|ownership|/ˈoʊ.nərˌʃɪp/|noun|所有权
ngsl|2753|qualification|/ˌkwɑl.ə.fɪˈkeɪ.ʃən/|noun|资质
ngsl|2754|suspend|/səˈspɛnd/|verb|暂缓；中止
ngsl|2755|functional|/ˈfʌŋk.ʃə.nəl/|adjective|实用的；功能的
ngsl|2756|voluntary|/ˈvɑl.ənˌtɛr.i/|adjective|自发的；自愿的
ngsl|2757|pale|/peɪl/|adjective|苍白的
ngsl|2758|stain|/steɪn/|verb|沾污
ngsl|2759|athlete|/ˈæθ.lit/|noun|运动员
ngsl|2760|organic|/ɔrˈgæn.ɪk/|adjective|有机的
ngsl|2761|tongue|/tʌŋ/|noun|舌头
ngsl|2762|server|/ˈsɜr.vər/|noun|侍者；服务器
ngsl|2763|structural|/ˈstrʌk.tʃər.əl/|adjective|结构的；建筑的
ngsl|2764|website|/ˈwɛbˌsaɪt/|noun|网站
ngsl|2765|fool|/ful/|noun|傻子
ngsl|2766|alongside|/əˈlɔŋˈsaɪd/|preposition|沿着
ngsl|2767|unite|/juˈnaɪt/|verb|团结
ngsl|2768|gently|/ˈdʒɛnt.li/|adverb|轻轻地；柔和地；温柔地
ngsl|2769|compute|/kəmˈpjut/|verb|计算
ngsl|2770|wipe|/waɪp/|verb|擦拭
ngsl|2771|weird|/wɪərd/|adjective|奇怪的
ngsl|2772|gaze|/geɪz/|noun|凝视
ngsl|2773|fade|/feɪd/|verb|褪色
ngsl|2774|cough|/kɑf/|verb|咳嗽
ngsl|2775|hypothesis|/haɪˈpɑθ.ə.sɪs/|noun|假设
ngsl|2776|royal|/ˈrɔɪ.əl/|adjective|皇家的
ngsl|2777|theoretical|/ˌθi.əˈrɛt.ɪ.kəl/|adjective|理论上的
ngsl|2778|curtain|/ˈkɜr.tən/|noun|窗帘
ngsl|2779|mayor|/ˈmeɪ.ər/|noun|市长
ngsl|2780|darkness|/ˈdɑrk.nɪs/|noun|黑暗
ngsl|2781|aunt|/ɑnt/|noun|婶母；伯母；姑妈；姨妈，舅妈
ngsl|2782|tournament|/ˈtʊər.nə.mənt/|noun|锦标赛
ngsl|2783|registration|/ˌrɛdʒ.əˈstreɪ.ʃən/|noun|登记；注册
ngsl|2784|fragment|/ˈfræg.mənt/|noun|碎片
ngsl|2785|listener|/ˈlɪs.ə.nər/|noun|听着
ngsl|2786|immigration|/ˌɪm.ɪˈgreɪ.ʃən/|noun|移民
ngsl|2787|tender|/ˈtɛn.dər/|adjective|柔软的
ngsl|2788|density|/ˈdɛn.sɪ.ti/|noun|密度
ngsl|2789|ugly|/ˈʌg.li/|adjective|丑陋的
ngsl|2790|module|/ˈmɑdʒ.ul/|noun|单元；模块
ngsl|2791|faithfully|/ˈfeɪθ.fə.li/|adverb|忠实的
ngsl|2792|autumn|/ˈɔ.təm/|noun|秋天
ngsl|2793|cheek|/tʃik/|noun|脸颊
ngsl|2794|attachment|/əˈtætʃ.mənt/|noun|依恋
ngsl|2795|holder|/ˈhoʊl.dər/|noun|持有人
ngsl|2796|solar|/ˈsoʊ.lər/|adjective|太阳的；太阳能的
ngsl|2797|grin|/ɡrɪn/|verb|咧嘴笑
ngsl|2798|rose|/rəʊz/|noun|玫瑰
ngsl|2799|noun|/naʊn/|noun|名词
ngsl|2800|fortunate|/ˈfɔr.tʃə.nɪt/|adjective|幸运
ngsl|2801|alright|/ɔlˈraɪt/|adverb|好吧
ngsl|2802|lazy|/ˈleɪ.zi/|adjective|懒惰的
ngsl|2803|hello|/hɛˈloʊ/|interjection|你好
ngsl|2804|hunger|/ˈhʌŋ.gər/|noun|饥饿
ngsl|2805|insure|/ɪnˈʃʊər/|verb|投保
ngsl|2806|ashamed|/əˈʃeɪmd/|adjective|羞愧的
ngsl|2807|found|/faʊnd/|verb|创办
ngsl|2808|blog|/blɑɡ/|noun|博客
ngsl|2809|thirst|/θɜrst/|noun|渴
nawl|1|repertoire|/ˈrɛp.ərˌtwɑr/|noun|a collection of skills or accomplishments.
nawl|2|obtain|/əbˈteɪn/|verb|to get
nawl|3|distribution|/ˌdɪs.trəˈbju.ʃən/|noun|the way that something is spread out over a particular area or group
nawl|4|parameter|/pəˈræm.ɪ.tər/|noun|a characteristic or constant factor, a limit
nawl|5|aspect|/ˈæs.pɛkt/|noun|a quality, part, or element
nawl|6|dynamic|/daɪˈnæ.mɪk/|adjective|always active or changing; in physics: a force related to motion
nawl|7|impact|/ˈɪm.pækt/|noun|a striking effect or result (v.) to hit with force
nawl|8|domain|/doʊˈmeɪn/|noun|a field of action, thought or influence; an area of knowledge
nawl|9|publish|/ˈpʌb.lɪʃ/|verb|to print in a book, journal or online
nawl|10|denote|/dɪˈnoʊt/|verb|be a name or symbol for something
nawl|11|authority|/əˈθɔr.ɪ.ti/|noun|people in power; an expert whose views are accepted by most.
nawl|12|semantic|/sɪˈmæn.tɪk/|adjective|the different meanings of words
nawl|13|par|/pɑr/|noun|the usual amount
nawl|14|ion|/ˈaɪ.ɒn/|noun|a charged atom
nawl|15|matrix|/ˈmeɪ.trɪks/|noun|a substance, situation, or environment in which something has its origin - in math: an arrangement of numbers in rows and columns
nawl|16|linear|/ˈlɪn.i.ər/|adjective|made of lines
nawl|17|cognitive|/ˈkɒg.nɪ.tɪv/|adjective|the process of knowing and remembering
nawl|18|graph|/græf,.grɑf/|noun|a diagram that shows how variables are related.
nawl|19|correlation|/ˌkɔr.əˈleɪ.ʃən/|noun|a measure of the relationship between two variables
nawl|20|linguistic|/lɪŋˈgwɪs.tɪk/|adjective|belonging to language
nawl|21|acid|/ˈæs.ɪd/|noun|a substance that tastes sour, reacts with metals and carbonates, and turns blue litmus red. e.g. lemon juice
nawl|22|induce|/ɪn.djus/|verb|to cause, to persuade
nawl|23|velocity|/vəˈlɒs.ɪ.ti/|noun|speed in a given direction
nawl|24|interval|/ˈɪn.tər.vəl/|noun|the distance between two points, numbers or times
nawl|25|discourse|/ˈdɪs.kɔrs/|noun|talk, conversation
nawl|26|finite|/ˈfaɪ.naɪt/|adjective|having limits; lasting for a limited time
nawl|27|stimulus|/stɪmyələs/|noun|something that makes a change.
nawl|28|vector|/ˈvɛk.tər/|noun|a quantity that has both size and direction.
nawl|29|electron|/ɪˈlɛk.trɒn/|noun|a negatively charged particle
nawl|30|receptor|/rɪˈsɛp.tər/|noun|a device that receives information
nawl|31|theorem|/ˈθɪər.əm/|noun|a statement that can be proved
nawl|32|algorithm|/ˈæl.gəˌrɪð.əm/|noun|a logical rule or procedure that guarantees solving a problem
nawl|33|fluid|/ˈflu.ɪd/|noun|a material that can easily flow. e.g. water
nawl|34|developmental|/dɪˈvɛl.əp.mənt/|adjective|concerning the development or growth of a thing or person
nawl|35|bound|/baʊnd/|verb|to go to a specified place; to jump
nawl|36|molecular|/məˈlɛk.jə.lər/|adjective|about or caused by combined atoms
nawl|37|transformation|/ˌtræns.fərˈmeɪ.ʃən/|noun|a change
nawl|38|spatial|/ˈspeɪ.ʃəl/|adjective|about space
nawl|39|coefficient|/ˌkoʊ.əˈfɪʃ.ənt/|noun|a number multiplied by a variable in a mathematical expression
nawl|40|translation|/trænzleɪʃən/|noun|changing from one form to another. e.g. changing from one language to another
nawl|41|membrane|/ˈmɛm.breɪn/|noun|a thin covering of tissue
nawl|42|neuron|/ˈnʊər.ɒn/|noun|a nerve cell; the basic building block of the nervous system.
nawl|43|simulation|/ˌsɪm.jəˈleɪ.ʃən/|noun|a copy; a method that is used to study and analyze the characteristics of the real world
nawl|44|lexical|/ˈlɛk.sɪ.kəl/|adjective|about words
nawl|45|regime|/rəˈʒim/|noun|a system of management; a form of government
nawl|46|variance|/ˈvɛər.i.əns/|noun|the amount of difference; a statistic that measures the variability of a distribution.
nawl|47|molecule|/ˈmɒl.əˌkjul/|noun|two or more atoms chemically combined
nawl|48|marker|/ˈmɑr.kər/|noun|something that is easy to recognize or identify
nawl|49|empirical|/ɛmˈpɪr.ɪ.kəl/|adjective|based on observation or experiment
nawl|50|robot|/ˈroʊ.bɒt/|noun|a mechanical creature that acts like a human
nawl|51|statistical|/stəˈtɪs.tɪ.kəl/|adjective|about numbers that represents information
nawl|52|vowel|/ˈvaʊ.əl/|noun|a speech sound; a, e , i, o, u and sometimes y
nawl|53|equilibrium|/ˌi.kwəˈlɪb.ri.əm/|noun|a state of balance
nawl|54|intensity|/ɪnˈtɛn.sɪ.ti/|noun|great energy, strength, concentration; in physics: Intensity = Power/Unit of area
nawl|55|regression|/rɪˈgrɛʃ.ən/|noun|going back; in statistics: a type of correlational procedure that focuses on predicting the values of an outcome based on its correlation with another variable.
nawl|56|diagnosis|/ˌdaɪ.əgˈnoʊ.sɪs/|noun|a decision made by an expert based on the results of an examination
nawl|57|identification|/ɪˌdɛn.tɪ.fɪˈkeɪ.ʃən/|noun|the state of being identified; something that identifies a person
nawl|58|node|/noʊd/|noun|an intersection or junction point in a network; a part on a plant where a new leaf grows
nawl|59|partial|/pɑrʃəl/|adjective|not complete; favoring one side over another
nawl|60|correlate|/ˈkɔr.əˌleɪt/|verb|to show the relationship between two items or events.
nawl|61|mortality|/mɔrˈtæl.ɪ.ti/|noun|the quality or state of being human and being able to die
nawl|62|antibody|/ˈæn.tɪˌbɒd.i/|noun|a defense provided by the body against disease
nawl|63|temporal|/ˈtɛm.pər.əl/|adjective|concerning time
nawl|64|particle|/ˈpɑr.tɪ.kəl/|noun|a very small piece of something
nawl|65|duration|/dʊˈreɪ.ʃən/|noun|the length of time that something lasts
nawl|66|behavioral|/bɪˈheɪv.jər.əl/|adjective|concerning the way someone acts
nawl|67|consumption|/kənsʌmpʃən/|noun|how much is spent on things; the process of eating and drinking
nawl|68|bilingual|/baɪˈlɪŋ.gwəl/|noun|a person who speaks two languages
nawl|69|sensitivity|/ˌsɛn.sɪˈtɪv.ɪ.ti/|noun|being sensitive; in physiology: the ability of an organism or part of an organism to react to stimuli; in electronics: the ability of a radio device to react to incoming signals
nawl|70|similarity|/sˌɪməlɛrəti/|noun|the degree to which people or things are the same
nawl|71|optimal|/ˈɒp.tə.məl/|adjective|best
nawl|72|explicit|/ɪkˈsplɪs.ɪt/|adjective|definite, clearly stated
nawl|73|mutation|/mjuˈteɪ.ʃən/|noun|a change; in genetics: any event that changes genetic structure
nawl|74|colonial|/kəˈloʊ.ni.əl/|adjective|concerning living in a colony
nawl|75|spectrum|/ˈspɛk.trəm/|noun|the wavelengths of colors from red to violet
nawl|76|phonological|/ˌfoʊn.lˈɒdʒ.ɪ.kəl/|adjective|concerning sound
nawl|77|nucleus|/ˈnu.kli.əs/|noun|control center of a cell
nawl|78|onset|/ɑn.sɛt/|noun|the beginning
nawl|79|integration|/ˌɪn.tɪˈgreɪ.ʃən/|noun|bringing things together into a whole
nawl|80|dominant|/ˈdɒm.ə.nənt/|adjective|strongest
nawl|81|pathway|/ˈpæθˌweɪ/|noun|a route; in biochemistry: a sequence of reactions
nawl|82|coordinate|/koʊˈɔr.dnˌeɪt/|verb|to bring order and organization to something; (n.) in maths: any of the magnitudes that serve to define the position of a point or line by reference to a fixed figure or system of lines.
nawl|83|calculation|/kˌælkyəleɪʃən/|noun|the answer to a sum; the act of calculating
nawl|84|precede|/prɪˈsid/|verb|to go before
nawl|85|subset|/ˈsʌbˌsɛt/|noun|a small set that is part of a larger set
nawl|86|syntactic|/sɪnˈtæk.tɪk/|adjective|grammatical
nawl|87|orientation|/ˌɔr.i.ənˈteɪ.ʃən/|noun|the ability to locate oneself in one's environment with reference to time, place, and people
nawl|88|proposition|/ˌprɒp.əˈzɪʃ.ən/|noun|an idea; a suggestion
nawl|89|inequality|/ˌɪn.ɪˈkwɒl.ɪ.ti/|noun|not the same; in maths: a statement that compares two quantities using < , >, =,=, or ?
nawl|90|identical|/aɪˈdɛn.tɪ.kəl/|adjective|the same in every way
nawl|91|prevalence|/ˈprɛv.ə.ləns/|noun|widespread, common, general
nawl|92|differential|/ˌdɪf.əˈrɛn.ʃəl/|adjective|difference; diversity
nawl|93|generalize|/ˈdʒɛn.ər.əˌlaɪz/|verb|to make a common idea or conclusion from facts
nawl|94|beam|/bim/|noun|a long piece of metal or wood; a line of light or energy
nawl|95|pulse|/pʌls/|noun|beat of the heart
nawl|96|norm|/nɔrm/|noun|an established standard of performance or behavior
nawl|97|trait|/treɪt/|noun|a characteristic
nawl|98|prediction|/prɪˈdɪk.ʃən/|noun|a statement of what will happen next
nawl|99|correspondence|/ˌkɔr.əˈspɒn.dəns/|noun|communication by writing; a similarity
nawl|100|essentially|/ɪˈsɛnʃəlɪ/|adverb|basically, primarily
nawl|101|syllable|/ˈsɪl.ə.bəl/|noun|a unit of speech
nawl|102|chromosome|/ˈkroʊ.məˌsoʊm/|noun|cell structures that carry the genetic material that is copied and passed to the next generation.
nawl|103|infect|/ɪnˈfɛkt/|verb|to give someone a disease
nawl|104|magnetic|/mægˈnɛt.ɪk/|adjective|having the properties of a magnet, being able to attract.
nawl|105|configuration|/kənˌfɪg.jəˈreɪ.ʃən/|noun|a shape or outline; a method of arrangement
nawl|106|numerical|/nuˈmɛr.ɪ.kəl/|adjective|includes numbers
nawl|107|namely|/ˈneɪm.li/|adverb|that is to say, specifically
nawl|108|intermediate|/ˌɪn.tərˈmi.di.ɪt/|adjective|between
nawl|109|transmission|/trænsmɪʃən/|noun|an electronic signal that has been sent by radio waves; a force that has been transferred from one machine to another
nawl|110|dose|/doʊs/|noun|an amount of medicine to be taken at any one time
nawl|111|occurrence|/əkɜəns/|noun|something that happens, an event
nawl|112|maternal|/məˈtɜr.nl/|adjective|having to do with being a mother
nawl|113|axis|/ˈæk.sɪs/|noun|a line about which a rotating body, such as the earth, turns.
nawl|114|rational|/ˈræʃ.ə.nl/|adjective|sensible; based on facts
nawl|115|locus|/ˈloʊ.kəs/|noun|a place or location; in genetics: the location of a gene on a chromosome
nawl|116|elite|/ɪˈlit/|noun|superior; (n.) a superior group of people
nawl|117|approximation|/əˌprɒk.səˈmeɪ.ʃən/|noun|almost, but not exactly; more or less
nawl|118|thesis|/ˈθi.sɪs/|noun|a long essay; a position taken in an argument supported by a set of reasons
nawl|119|sin|/sɪn/|noun|a bad act; (v.) to do something bad
nawl|120|classification|/ˌklæs.ə.fɪˈkeɪ.ʃən/|noun|objects or people put into categories with shared characteristics.
nawl|121|threshold|/ˈθrɛʃ.oʊld/|noun|a level or point at which something would start or stop happening
nawl|122|syndrome|/ˈsɪn.droʊm/|noun|a group of signs and symptoms that accompany a disease
nawl|123|comparative|/kəmˈpær.ə.tɪv/|adjective|similar to
nawl|124|activate|/æktəvˌeɪt/|verb|to make something to start working
nawl|125|adolescent|/ˌæd.lˈɛs.ənt/|noun|12-18 years old
nawl|126|vocabulary|/voʊˈkæb.jəˌlɛr.i/|noun|the words that a person knows
nawl|127|utterance|/ˈʌt.ər.əns/|noun|something that is said
nawl|128|encode|/ɛnˈkoʊd/|verb|to change a message or information into code
nawl|129|facilitate|/fəsɪlətˌeɪt/|verb|to make easier
nawl|130|incidence|/ˈɪn.sɪ.dəns/|noun|the rate that something happens
nawl|131|induction|/ˌɪnˈdʌk.ʃən/|noun|bringing about, or causing
nawl|132|trajectory|/trəˈdʒɛk.tə.ri/|noun|the path followed by an object moving through space
nawl|133|manuscript|/ˈmæn.jəˌskrɪpt/|noun|a document, a piece of writing
nawl|134|commonly|/ˈkɒm.ən.li/|adverb|usually
nawl|135|grammatical|/grəˈmæt.ɪ.kəl/|adjective|concerning grammatical rules
nawl|136|accuracy|/ækyɜəsi/|noun|correctness or precision
nawl|137|amplitude|/ˈæm.plɪˌtud/|noun|the breadth, width or largeness of something; in electronics: the maximum deviation of an alternating current from its average value.
nawl|138|adaptation|/ˌæd.əpˈteɪ.ʃən/|noun|the process of changing
nawl|139|cortex|/ˈkɔr.tɛks/|noun|the outer part of an organ or structure
nawl|140|minimal|/ˈmɪn.ə.məl/|adjective|the smallest possible
nawl|141|systematic|/ˌsɪs.təˈmæt.ɪk/|adjective|having a system or plan
nawl|142|horizontal|/ˌhɔr.əˈzɒn.tl/|adjective|flat or level
nawl|143|synthesis|/ˈsɪn.θə.sɪs/|noun|building something complex from simple parts
nawl|144|projection|/prəˈdʒɛk.ʃən/|noun|a part that sticks out; an image on a screen; a prediction
nawl|145|diameter|/daɪˈæm.ɪ.tər/|noun|the distance across the center of an object
nawl|146|cone|/koʊn/|noun|a 3D shape with a circular base; a part of the eye
nawl|147|dependence|/dɪpɛndəns/|noun|the need of someone or something
nawl|148|organism|/ˈɔr.gəˌnɪz.əm/|noun|a living thing
nawl|149|emergence|/ɪˈmɜr.dʒəns/|noun|the process of emerging/coming out
nawl|150|overlap|/ˌoʊ.vərˈlæp/|verb|to cover something else
nawl|151|substitution|/ˌsʌbstɪˈtjuːʃən/|noun|a person or thing acting or serving in place of another; (v.) to put (a person or thing) in the place of another.
nawl|152|explicitly|/ɪkˈsplɪs.ɪt.li/|adverb|very clear; nothing hidden
nawl|153|evident|/ɛvədənt/|adjective|plain, clear
nawl|154|conceptual|/kənˈsɛp.tʃu.əl/|adjective|characterized by concepts or the forming of concepts
nawl|155|detection|/dɪˈtɛk.ʃən/|noun|the act of discovering something
nawl|156|interact|/ˌɪn.tərˈækt/|verb|to talk and do things with other people
nawl|157|neural|/ˈnʊər.əl/|adjective|about the nerves or nervous system
nawl|158|chronic|/krɑnɪk/|adjective|over a long time; serious
nawl|159|integral|/ɪntəgrəl/|adjective|part of something
nawl|160|enzyme|/ˈɛn.zaɪm/|noun|a protein made by cells
nawl|161|conception|/kənˈsɛp.ʃən/|noun|an idea or notion; the first stage in pregnancy
nawl|163|ideology|/ˌaɪ.diˈɒl.ə.dʒi/|noun|a set of beliefs by groups or individuals
nawl|164|sperm|/spɜrm/|noun|male sex cell
nawl|165|quantitative|/ˈkwɒn.tɪˌteɪ.tɪv/|adjective|the describing or measuring of quantity.
nawl|166|sphere|/sfɪər/|noun|a round 3D object. e.g. a ball
nawl|167|instability|/ˌɪn.stəˈbɪl.ɪ.ti/|noun|not stable; changeable
nawl|168|mediate|/ˈmi.diˌeɪt/|verb|to bring about an agreement between persons or groups, act as a helper
nawl|169|specification|/ˌspɛs.ə.fɪˈkeɪ.ʃən/|noun|a detailed description of the design and materials used to make something.
nawl|170|classify|/klæsəfˌaɪ/|verb|arrange or order by classes or categories
nawl|171|physician|/fəzɪʃən/|noun|a medical doctor
nawl|172|computation|/ˌkɒm.pjʊˈteɪ.ʃən/|noun|a calculation; a method of computing
nawl|173|oral|/ˈɔr.əl/|adjective|by mouth
nawl|174|mid|/mɪd/|adjective|at (or near) the middle point
nawl|175|indicator|/ɪndəkˌeɪtɜ/|noun|an instrument that shows conditions in a machine, such as temperature, speed, pressure; in chemistry: a compound that changes color in the presence of an acid or a base
nawl|176|variant|/ˈvɛər.i.ənt/|noun|differing, especially from something of the same general kind.
nawl|177|evolutionary|/ˌɛv.əˈlu.ʃəˌnɛr.i/|adjective|concerning evolution
nawl|178|feedback|/ˈfidˌbæk/|noun|a response to a message; information about a person's behavior
nawl|179|collective|/kəˈlɛk.tɪv/|adjective|formed by collection; (n.) an organisation
nawl|180|arbitrary|/ˈɑr.bɪˌtrɛr.i/|adjective|unsupported
nawl|181|fraction|/ˈfræk.ʃən/|noun|a part of a whole.
nawl|182|estimation|/ˌɛs.təˈmeɪ.ʃən/|noun|a rough calculation; an opinion
nawl|183|nonlinear|/nɒnˈlɪnɪə/|adjective|not in a line
nawl|184|deviation|/ˌdi.viˈeɪ.ʃən/|noun|not standard or normal; in statistics: the difference between one of a set of values and some fixed value, usually the mean of the set.
nawl|185|compact|/kəmˈpækt/|adjective|packed together; closely united; small
nawl|186|diagram|/daɪəgrˌæm/|noun|a drawing intended to explain how something works
nawl|187|tropical|/trɑpɪkəl/|adjective|hot and humid; near to the equator
nawl|188|morphology|/mɔrˈfɒl.ə.dʒi/|noun|the study of the forms and structures of plants, animals and words
nawl|189|thereby|/ðɛɚ.baɪ/|adverb|by that means; because of that
nawl|190|syntax|/ˈsɪn.tæks/|noun|the study of a system, such as the system of words in a sentence
nawl|191|defect|/ˈdi.fɛkt/|noun|a problem; a fault
nawl|192|separation|/ˌsɛp.əˈreɪ.ʃən/|noun|a line that seperates; a point of parting; a gap
`

const sourceVocabularyRows = sourceVocabularySeedRows
  .trim()
  .split('\n')
  .map((row): VocabularySeedRow => {
    const [source, rank, word, pronunciation, partOfSpeech, meaning] = row.split('|') as [
      VocabularySourceId,
      string,
      string,
      string,
      PartOfSpeech,
      string,
    ]

    return {
      source,
      rank: Number(rank),
      word,
      pronunciation,
      partOfSpeech,
      meaning,
    }
  })

const coreVocabularySeedSkills = [
  'listening',
  'speaking',
  'reading',
  'writing',
] as const

const slugifyVocabularyId = (word: string) =>
  word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const getVocabularyLevel = (source: VocabularySourceId, rank: number): VocabularyLevel => {
  if (source === 'nawl') {
    return 'B2'
  }

  if (rank <= 800) {
    return 'A1'
  }

  if (rank <= 1800) {
    return 'A2'
  }

  return 'B1'
}

const getVocabularyScenarios = (
  source: VocabularySourceId,
  partOfSpeech: PartOfSpeech,
): VocabularyScenario[] => {
  if (source === 'nawl') {
    return ['study', 'work', 'thinking']
  }

  if (
    ['preposition', 'conjunction', 'determiner', 'pronoun', 'modal'].includes(
      partOfSpeech,
    )
  ) {
    return ['daily', 'communication']
  }

  if (['noun', 'verb', 'adjective', 'adverb'].includes(partOfSpeech)) {
    return ['daily', 'study', 'communication']
  }

  return ['study', 'communication']
}

const reviewedVocabularyIds = new Set(
  reviewedCoreVocabulary.map((item) => slugifyVocabularyId(item.word)),
)

const sourceCoreVocabulary = sourceVocabularyRows
  .filter((row) => !reviewedVocabularyIds.has(slugifyVocabularyId(row.word)))
  .map((row, index): CoreVocabularyEntry => {
    const sourceLabel = row.source === 'ngsl' ? 'NGSL 1.2' : 'NAWL'

    return {
      id: slugifyVocabularyId(row.word),
      word: row.word,
      meaning: row.meaning,
      partOfSpeech: row.partOfSpeech,
      level: getVocabularyLevel(row.source, row.rank),
      priority: reviewedCoreVocabulary.length + index + 1,
      pronunciation: row.pronunciation,
      source: row.source,
      sourceRank: row.rank,
      scenarios: getVocabularyScenarios(row.source, row.partOfSpeech),
      skills: [...coreVocabularySeedSkills],
      note: `${sourceLabel} 词表底稿：先用于基础识别、理解和检索；例句、搭配和中文精修会在后续批次逐步补全。`,
    }
  })

export const coreVocabulary = [
  ...reviewedCoreVocabulary,
  ...sourceCoreVocabulary,
] satisfies CoreVocabularyEntry[]
