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

const draftCoreVocabularySeedRows = `
I|我|pronoun|A1
you|你；你们|pronoun|A1
he|他|pronoun|A1
she|她|pronoun|A1
it|它；这件事|pronoun|A1
we|我们|pronoun|A1
they|他们；她们；它们|pronoun|A1
me|我（宾格）|pronoun|A1
him|他（宾格）|pronoun|A1
her|她；她的|pronoun|A1
us|我们（宾格）|pronoun|A1
them|他们（宾格）|pronoun|A1
my|我的|determiner|A1
your|你的；你们的|determiner|A1
his|他的|determiner|A1
its|它的|determiner|A1
our|我们的|determiner|A1
their|他们的|determiner|A1
this|这个|determiner|A1
that|那个；那件事|determiner|A1
these|这些|determiner|A1
those|那些|determiner|A1
the|这个；那个（定冠词）|determiner|A1
a|一个（不定冠词）|determiner|A1
an|一个（不定冠词）|determiner|A1
some|一些；某些|determiner|A1
any|任何；一些|determiner|A1
all|全部；所有|determiner|A1
every|每一个|determiner|A1
each|每个|determiner|A1
many|许多|determiner|A1
much|许多；大量|determiner|A1
few|少数；几个|determiner|A2
little|少量；小的|adjective|A1
more|更多；更|determiner|A1
most|最多；大多数|determiner|A2
other|其他的|adjective|A1
another|另一个|determiner|A2
own|自己的|adjective|A2
same|相同的|adjective|A1
different|不同的|adjective|A1
such|这样的|determiner|A2
what|什么|pronoun|A1
which|哪一个；哪个|pronoun|A1
who|谁|pronoun|A1
whom|谁（宾格）|pronoun|B1
whose|谁的|pronoun|A2
when|什么时候；当……时|conjunction|A1
where|哪里；在……的地方|conjunction|A1
why|为什么|adverb|A1
how|如何；多么|adverb|A1
and|和；并且|conjunction|A1
or|或者；否则|conjunction|A1
but|但是|conjunction|A1
because|因为|conjunction|A1
so|所以；如此|conjunction|A1
if|如果|conjunction|A1
than|比|conjunction|A1
while|当……时；然而|conjunction|A2
although|虽然|conjunction|B1
though|虽然；不过|conjunction|B1
before|在……之前|preposition|A1
after|在……之后|preposition|A1
until|直到|conjunction|A2
unless|除非|conjunction|B1
about|关于；大约|preposition|A1
above|在……上方|preposition|A1
across|穿过；在对面|preposition|A2
afterward|后来|adverb|B1
against|反对；靠着|preposition|A2
along|沿着|preposition|A2
around|围绕；大约|preposition|A1
at|在；向|preposition|A1
behind|在……后面|preposition|A1
below|在……下面|preposition|A2
beside|在……旁边|preposition|A2
between|在……之间|preposition|A1
beyond|超出；在更远处|preposition|B1
by|通过；在旁边|preposition|A1
down|向下；沿着|adverb|A1
during|在……期间|preposition|A2
for|为了；对于|preposition|A1
from|来自；从|preposition|A1
in|在……里面|preposition|A1
inside|在里面|preposition|A2
into|进入|preposition|A1
near|靠近|preposition|A1
of|……的|preposition|A1
off|离开；脱离|preposition|A1
on|在……上；开启|preposition|A1
onto|到……上|preposition|A2
out|向外；外出|adverb|A1
outside|在外面|preposition|A2
over|在……上方；超过|preposition|A1
through|穿过；通过|preposition|A2
to|到；向|preposition|A1
toward|朝向|preposition|A2
under|在……下面|preposition|A1
up|向上；起来|adverb|A1
with|和；带有|preposition|A1
without|没有|preposition|A2
can|能够；可以|modal|A1
could|能够；可能|modal|A1
may|可以；可能|modal|A2
might|可能|modal|A2
must|必须|modal|A1
should|应该|modal|A1
will|将要；愿意|modal|A1
would|会；愿意|modal|A1
shall|将；应该|modal|B1
be|是；存在|verb|A1
am|是（第一人称）|verb|A1
is|是（第三人称单数）|verb|A1
are|是（复数/第二人称）|verb|A1
was|是（过去式）|verb|A1
were|是（过去式复数）|verb|A1
been|是；存在（过去分词）|verb|A2
being|存在；正在成为|verb|A2
have|有；已经|verb|A1
has|有（第三人称单数）|verb|A1
had|有；经历过（过去式）|verb|A1
do|做；助动词|verb|A1
does|做（第三人称单数）|verb|A1
did|做了|verb|A1
done|完成的|verb|A2
get|得到；变得|verb|A1
give|给；提供|verb|A1
go|去|verb|A1
come|来|verb|A1
make|制造；使得|verb|A1
take|拿；花费；采取|verb|A1
see|看见；理解|verb|A1
look|看；显得|verb|A1
know|知道；认识|verb|A1
think|认为；思考|verb|A1
say|说|verb|A1
tell|告诉；讲述|verb|A1
ask|问；请求|verb|A1
use|使用|verb|A1
find|找到；发现|verb|A1
try|尝试|verb|A1
want|想要|verb|A1
like|喜欢；像|verb|A1
love|爱；喜欢|verb|A1
feel|感觉|verb|A1
become|变成|verb|A2
leave|离开；留下|verb|A1
put|放置|verb|A1
keep|保持；保留|verb|A1
let|允许；让|verb|A1
begin|开始|verb|A1
start|开始|verb|A1
stop|停止|verb|A1
continue|继续|verb|A2
move|移动；搬家|verb|A1
turn|转动；变成|verb|A1
show|展示；表明|verb|A1
hear|听见|verb|A1
listen|听|verb|A1
read|阅读|verb|A1
write|写|verb|A1
speak|说话|verb|A1
talk|谈话|verb|A1
call|打电话；称呼|verb|A1
meet|见面；满足|verb|A1
help|帮助|verb|A1
work|工作；运转|verb|A1
play|玩；演奏|verb|A1
study|学习；研究|verb|A1
live|生活；居住|verb|A1
stay|停留；保持|verb|A1
wait|等待|verb|A1
bring|带来|verb|A2
buy|买|verb|A1
sell|卖|verb|A2
pay|支付|verb|A1
spend|花费；度过|verb|A2
cost|花费；费用为|verb|A2
choose|选择|verb|A2
build|建造；建立|verb|A2
break|打破；休息|verb|A2
open|打开；开放|verb|A1
close|关闭；接近|verb|A1
send|发送|verb|A1
receive|收到|verb|A2
lose|失去；输掉|verb|A1
win|赢得|verb|A1
remember|记得|verb|A1
forget|忘记|verb|A1
understand|理解|verb|A1
watch|观看|verb|A1
check|检查|verb|A2
join|加入|verb|A1
visit|拜访；参观|verb|A1
travel|旅行|verb|A1
plan|计划|verb|A1
hope|希望|verb|A1
happen|发生|verb|A2
mean|意思是；意味着|verb|A1
lead|带领；导致|verb|B1
stand|站立；忍受|verb|A1
sit|坐|verb|A1
run|跑；运行|verb|A1
walk|走路|verb|A1
eat|吃|verb|A1
drink|喝|verb|A1
sleep|睡觉|verb|A1
seem|似乎|verb|A2
be able to|能够|phrase|A1
have to|不得不；必须|phrase|A1
going to|将要|phrase|A1
as well as|以及；也|phrase|B1
right now|现在；立刻|phrase|A1
of course|当然|phrase|A1
for example|例如|phrase|A1
at least|至少|phrase|A2
as soon as|一……就……|phrase|B1
in order to|为了|phrase|B1
as a result|结果；因此|phrase|B1
in front of|在……前面|phrase|A1
next to|紧挨着|phrase|A1
a lot of|许多|phrase|A1
kind of|有点；种类|phrase|A2
sort of|有点；某种|phrase|B1
good|好的|adjective|A1
bad|坏的；糟糕的|adjective|A1
great|很好的；伟大的|adjective|A1
big|大的|adjective|A1
small|小的|adjective|A1
long|长的；长时间的|adjective|A1
short|短的；矮的|adjective|A1
high|高的|adjective|A1
low|低的|adjective|A2
new|新的|adjective|A1
old|旧的；年老的|adjective|A1
young|年轻的|adjective|A1
early|早的；早地|adverb|A1
late|晚的；迟的|adverb|A1
right|正确的；右边的|adjective|A1
wrong|错误的|adjective|A1
true|真实的|adjective|A1
real|真实的|adjective|A1
full|满的；完整的|adjective|A1
empty|空的|adjective|A2
free|免费的；自由的|adjective|A1
busy|忙碌的|adjective|A1
ready|准备好的|adjective|A1
sure|确定的|adjective|A1
easy|容易的|adjective|A1
hard|困难的；硬的|adjective|A1
simple|简单的|adjective|A2
difficult|困难的|adjective|A1
fast|快的；快地|adverb|A1
slow|慢的|adjective|A1
hot|热的|adjective|A1
cold|冷的|adjective|A1
warm|温暖的|adjective|A1
cool|凉爽的；酷的|adjective|A1
happy|高兴的|adjective|A1
sad|难过的|adjective|A1
angry|生气的|adjective|A1
afraid|害怕的|adjective|A1
kind|友善的；种类|adjective|A1
friendly|友好的|adjective|A2
quiet|安静的|adjective|A1
loud|大声的|adjective|A2
clean|干净的；清洁|adjective|A1
dirty|脏的|adjective|A1
beautiful|美丽的|adjective|A1
nice|令人愉快的|adjective|A1
strong|强壮的；强烈的|adjective|A1
weak|弱的|adjective|A2
safe|安全的|adjective|A2
dangerous|危险的|adjective|A2
healthy|健康的|adjective|A2
sick|生病的|adjective|A1
rich|富有的；丰富的|adjective|A2
poor|贫穷的；差的|adjective|A1
deep|深的|adjective|A2
wide|宽的|adjective|A2
last|最后的；上一个|adjective|A1
next|下一个|adjective|A1
first|第一的；首先|adjective|A1
second|第二的|adjective|A1
best|最好的|adjective|A1
better|更好的|adjective|A1
possible|可能的|adjective|A2
personal|个人的|adjective|A2
public|公共的；公开的|adjective|A2
private|私人的|adjective|B1
local|本地的；当地的|adjective|A2
national|国家的；全国的|adjective|B1
international|国际的|adjective|B1
social|社会的；社交的|adjective|A2
special|特别的|adjective|A1
general|一般的；总体的|adjective|A2
main|主要的|adjective|A1
major|主要的；重大的|adjective|B1
basic|基础的|adjective|A2
natural|自然的|adjective|A2
human|人的；人类的|adjective|A2
physical|身体的；物理的|adjective|B1
mental|心理的；精神的|adjective|B1
financial|财务的|adjective|B1
final|最终的|adjective|A2
whole|整个的|adjective|A2
half|一半的|adjective|A1
only|唯一的；只|adverb|A1
also|也|adverb|A1
too|也；太|adverb|A1
very|非常|adverb|A1
really|真正地；非常|adverb|A1
just|只是；刚刚|adverb|A1
again|再次|adverb|A1
always|总是|adverb|A1
usually|通常|adverb|A1
often|经常|adverb|A1
sometimes|有时|adverb|A1
never|从不|adverb|A1
now|现在|adverb|A1
then|然后；那时|adverb|A1
today|今天|adverb|A1
tomorrow|明天|adverb|A1
yesterday|昨天|adverb|A1
soon|很快|adverb|A1
already|已经|adverb|A2
yet|还；仍然|adverb|A2
still|仍然|adverb|A1
almost|几乎|adverb|A2
enough|足够地；足够的|adverb|A1
perhaps|也许|adverb|A2
maybe|也许|adverb|A1
probably|很可能|adverb|A2
quite|相当；很|adverb|A2
rather|相当；宁愿|adverb|B1
together|一起|adverb|A1
alone|独自|adverb|A2
away|离开；远离|adverb|A1
back|回来；背部|adverb|A1
here|这里|adverb|A1
there|那里|adverb|A1
home|家；在家|noun|A1
person|人|noun|A1
people|人们|noun|A1
man|男人；人|noun|A1
woman|女人|noun|A1
child|孩子|noun|A1
children|孩子们|noun|A1
family|家庭；家人|noun|A1
friend|朋友|noun|A1
name|名字|noun|A1
age|年龄|noun|A1
life|生活；生命|noun|A1
world|世界|noun|A1
country|国家；乡村|noun|A1
city|城市|noun|A1
town|城镇|noun|A1
place|地方|noun|A1
room|房间；空间|noun|A1
house|房子|noun|A1
school|学校|noun|A1
class|班级；课程|noun|A1
student|学生|noun|A1
teacher|老师|noun|A1
book|书|noun|A1
page|页面；页|noun|A1
story|故事|noun|A1
word|单词；话语|noun|A1
sentence|句子|noun|A1
language|语言|noun|A1
question|问题|noun|A1
idea|想法|noun|A1
point|观点；要点|noun|A1
thing|事情；东西|noun|A1
part|部分|noun|A1
side|一边；方面|noun|A1
end|结束；末端|noun|A1
line|线；行|noun|A1
number|数字；数量|noun|A1
time|时间；次数|noun|A1
day|天；白天|noun|A1
week|周|noun|A1
month|月|noun|A1
year|年|noun|A1
hour|小时|noun|A1
minute|分钟|noun|A1
morning|早晨|noun|A1
afternoon|下午|noun|A1
evening|晚上|noun|A1
night|夜晚|noun|A1
money|钱|noun|A1
price|价格|noun|A2
job|工作|noun|A1
company|公司|noun|A2
office|办公室|noun|A1
team|团队|noun|A2
group|群体；小组|noun|A1
member|成员|noun|A2
project|项目|noun|A2
service|服务|noun|A2
business|商业；公司|noun|A2
market|市场|noun|A2
product|产品|noun|A2
customer|顾客；客户|noun|A2
user|用户|noun|A2
system|系统|noun|A2
program|程序；项目|noun|A2
computer|电脑|noun|A1
phone|电话；手机|noun|A1
internet|互联网|noun|A1
email|电子邮件|noun|A1
message|消息|noun|A1
letter|信；字母|noun|A1
form|表格；形式|noun|A2
list|列表|noun|A1
key|钥匙；关键|noun|A1
card|卡片|noun|A1
photo|照片|noun|A1
picture|图片；照片|noun|A1
video|视频|noun|A1
music|音乐|noun|A1
movie|电影|noun|A1
news|新闻|noun|A1
food|食物|noun|A1
water|水|noun|A1
coffee|咖啡|noun|A1
tea|茶|noun|A1
meal|一餐；饭|noun|A1
breakfast|早餐|noun|A1
lunch|午餐|noun|A1
dinner|晚餐|noun|A1
body|身体|noun|A1
head|头；负责人|noun|A1
face|脸|noun|A1
hand|手|noun|A1
eye|眼睛|noun|A1
ear|耳朵|noun|A1
mouth|嘴|noun|A1
heart|心；内心|noun|A2
health|健康|noun|A1
way|方式；道路|noun|A1
road|道路|noun|A1
car|汽车|noun|A1
bus|公共汽车|noun|A1
train|火车；训练|noun|A1
station|车站|noun|A1
airport|机场|noun|A1
hotel|酒店|noun|A1
restaurant|餐馆|noun|A1
shop|商店|noun|A1
`

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

const draftCoreVocabulary = draftCoreVocabularySeedRows
  .trim()
  .split('\n')
  .map((row, index): CoreVocabularyEntry => {
    const [word, meaning, partOfSpeech, level] = row.split('|') as [
      string,
      string,
      PartOfSpeech,
      VocabularyLevel,
    ]

    return {
      id: slugifyVocabularyId(word),
      word,
      meaning,
      partOfSpeech,
      level,
      priority: reviewedCoreVocabulary.length + index + 1,
      scenarios: ['daily', 'study', 'communication'],
      skills: [...coreVocabularySeedSkills],
      note: 'Core 500 扩展底稿：先用于基础识别、理解和造句训练；例句和搭配会在后续批次逐步补全。',
    }
  })

export const coreVocabulary = [
  ...reviewedCoreVocabulary,
  ...draftCoreVocabulary,
] satisfies CoreVocabularyEntry[]
