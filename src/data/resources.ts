export type Skill =
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'grammar'
  | 'vocabulary'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ResourceFormat =
  | 'podcast'
  | 'video'
  | 'article'
  | 'book'
  | 'tool'
  | 'course'
  | 'practice'

export interface LearningResource {
  id: string
  title: string
  url: string
  skill: Skill
  difficulty: Difficulty
  format: ResourceFormat
  minutes: number
  summary: string
  tags: string[]
  hasTranscript?: boolean
  featured?: boolean
}

export const resources: LearningResource[] = [
  {
    id: 'bbc-6-minute-english',
    title: '6 Minute English',
    url: 'http://www.bbc.co.uk/programmes/p02pc9tn/episodes/downloads',
    skill: 'listening',
    difficulty: 'beginner',
    format: 'podcast',
    minutes: 6,
    summary: '短时长、主题明确，适合建立每日听力习惯。',
    tags: ['daily', 'bbc', 'short-form'],
    hasTranscript: true,
    featured: true,
  },
  {
    id: 'esl-podcasts',
    title: 'ESL Podcasts',
    url: 'https://www.eslpod.com/',
    skill: 'listening',
    difficulty: 'beginner',
    format: 'podcast',
    minutes: 15,
    summary: '语速友好，适合从可理解输入开始。',
    tags: ['beginner', 'conversation'],
  },
  {
    id: 'culips',
    title: 'Culips Podcast',
    url: 'https://esl.culips.com/',
    skill: 'listening',
    difficulty: 'intermediate',
    format: 'podcast',
    minutes: 20,
    summary: '自然会话素材，适合从“听懂”过渡到“听习惯”。',
    tags: ['conversation', 'daily-life'],
    hasTranscript: true,
    featured: true,
  },
  {
    id: 'hard-fork',
    title: 'Hard Fork',
    url: 'https://open.spotify.com/show/44fllCS2FTFr2x2kjP9xeT',
    skill: 'listening',
    difficulty: 'advanced',
    format: 'podcast',
    minutes: 35,
    summary: '科技话题更新快，适合进阶泛听与行业词汇积累。',
    tags: ['technology', 'news'],
    featured: true,
  },
  {
    id: 'rachels-english',
    title: "Rachel's English",
    url: 'https://www.youtube.com/user/rachelsenglish',
    skill: 'speaking',
    difficulty: 'intermediate',
    format: 'video',
    minutes: 15,
    summary: '系统练习发音、重音和连读，适合跟读模仿。',
    tags: ['pronunciation', 'shadowing'],
    featured: true,
  },
  {
    id: 'talkenglish',
    title: 'TalkEnglish',
    url: 'https://www.talkenglish.com/',
    skill: 'speaking',
    difficulty: 'beginner',
    format: 'practice',
    minutes: 15,
    summary: '提供现成话题和句型，适合开口热身。',
    tags: ['conversation', 'practice'],
  },
  {
    id: 'elsa-speak',
    title: 'ELSA Speak',
    url: 'https://www.elsaspeak.com/',
    skill: 'speaking',
    difficulty: 'intermediate',
    format: 'tool',
    minutes: 15,
    summary: '用于发音反馈和弱项定位。',
    tags: ['pronunciation', 'feedback'],
  },
  {
    id: 'engoo-daily-news',
    title: 'Engoo Daily News',
    url: 'https://engoo.com/app/daily-news',
    skill: 'reading',
    difficulty: 'intermediate',
    format: 'article',
    minutes: 20,
    summary: '文章分级清晰，适合每日阅读和表达积累。',
    tags: ['news', 'daily'],
    featured: true,
  },
  {
    id: 'breaking-news-english',
    title: 'Breaking News English',
    url: 'http://www.breakingnewsenglish.com/',
    skill: 'reading',
    difficulty: 'beginner',
    format: 'article',
    minutes: 20,
    summary: '同一主题配多级材料，适合阅读与听力联动。',
    tags: ['graded', 'news'],
  },
  {
    id: 'animal-farm',
    title: 'Animal Farm',
    url: 'https://www.goodreads.com/book/show/170448.Animal_Farm',
    skill: 'reading',
    difficulty: 'intermediate',
    format: 'book',
    minutes: 25,
    summary: '篇幅短、语言相对直接，适合建立英文原著阅读信心。',
    tags: ['book', 'fiction'],
    featured: true,
  },
  {
    id: 'harry-potter',
    title: 'Harry Potter Series',
    url: 'https://a.co/d/9vYXQ2B',
    skill: 'reading',
    difficulty: 'intermediate',
    format: 'book',
    minutes: 30,
    summary: '兴趣驱动强，适合长期泛读。',
    tags: ['book', 'fiction'],
  },
  {
    id: 'write-and-improve',
    title: 'Write & Improve',
    url: 'https://writeandimprove.com/',
    skill: 'writing',
    difficulty: 'intermediate',
    format: 'practice',
    minutes: 20,
    summary: '适合做短文练习并获得即时反馈。',
    tags: ['feedback', 'practice'],
    featured: true,
  },
  {
    id: '750-words',
    title: '750 Words',
    url: 'https://750words.com/',
    skill: 'writing',
    difficulty: 'intermediate',
    format: 'tool',
    minutes: 20,
    summary: '适合建立持续写作习惯。',
    tags: ['journal', 'habit'],
  },
  {
    id: 'hemingway-editor',
    title: 'Hemingway Editor',
    url: 'http://www.hemingwayapp.com/',
    skill: 'writing',
    difficulty: 'advanced',
    format: 'tool',
    minutes: 10,
    summary: '用于检查句子是否过长、表达是否清晰。',
    tags: ['clarity', 'editing'],
  },
  {
    id: 'english-grammar-in-use',
    title: 'English Grammar in Use',
    url: 'https://www.cambridge.org/us/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/english-grammar-use-5th-edition',
    skill: 'grammar',
    difficulty: 'intermediate',
    format: 'book',
    minutes: 20,
    summary: '最适合作为语法查漏补缺的主干教材。',
    tags: ['reference', 'core'],
    featured: true,
  },
  {
    id: 'english-club-grammar',
    title: 'English Club Grammar',
    url: 'https://www.englishclub.com/grammar/',
    skill: 'grammar',
    difficulty: 'beginner',
    format: 'course',
    minutes: 15,
    summary: '解释直接，适合快速回顾语法概念。',
    tags: ['reference', 'practice'],
  },
  {
    id: 'anki',
    title: 'Anki',
    url: 'https://apps.ankiweb.net/',
    skill: 'vocabulary',
    difficulty: 'beginner',
    format: 'tool',
    minutes: 10,
    summary: '用间隔重复沉淀词汇，是长期词汇系统的基础设施。',
    tags: ['spaced-repetition', 'review'],
    featured: true,
  },
  {
    id: 'oxford-learners-dictionaries',
    title: "Oxford Learner's Dictionaries",
    url: 'https://www.oxfordlearnersdictionaries.com/',
    skill: 'vocabulary',
    difficulty: 'beginner',
    format: 'tool',
    minutes: 10,
    summary: '释义、例句和发音都对学习者友好。',
    tags: ['dictionary', 'examples'],
  },
  {
    id: 'youglish',
    title: 'YouGlish',
    url: 'https://youglish.com/',
    skill: 'vocabulary',
    difficulty: 'intermediate',
    format: 'tool',
    minutes: 10,
    summary: '适合在真实语境里确认发音和搭配。',
    tags: ['pronunciation', 'context'],
  },
  {
    id: 'playphrase',
    title: 'PlayPhrase',
    url: 'https://playphrase.me/',
    skill: 'vocabulary',
    difficulty: 'intermediate',
    format: 'tool',
    minutes: 10,
    summary: '通过影视片段理解短语的真实用法。',
    tags: ['phrases', 'context'],
  },
  {
    id: 'cnn-10',
    title: 'CNN 10',
    url: 'http://edition.cnn.com/cnn10',
    skill: 'listening',
    difficulty: 'intermediate',
    format: 'video',
    minutes: 10,
    summary: '新闻主题鲜明，适合每日听力和时事词汇。',
    tags: ['news', 'video'],
  },
  {
    id: 'learn-english-with-tv-series',
    title: 'Learn English With TV Series',
    url: 'https://www.youtube.com/@LearnEnglishWithTVSeries',
    skill: 'listening',
    difficulty: 'intermediate',
    format: 'video',
    minutes: 20,
    summary: '用影视材料解释自然表达，适合沉浸式输入。',
    tags: ['video', 'phrases'],
  },
  {
    id: 'today-i-found-out',
    title: 'Today I Found Out',
    url: 'http://www.todayifoundout.com/',
    skill: 'reading',
    difficulty: 'advanced',
    format: 'article',
    minutes: 20,
    summary: '主题有趣，适合进阶阅读和知识型输入。',
    tags: ['articles', 'curiosity'],
  },
  {
    id: 'thoughtco-writing',
    title: "ThoughtCo's ESL Writing Exercises",
    url: 'https://www.thoughtco.com/esl-writing-skills-4133091',
    skill: 'writing',
    difficulty: 'beginner',
    format: 'practice',
    minutes: 15,
    summary: '适合在需要提示时快速找到写作练习。',
    tags: ['prompts', 'practice'],
  },
]

export const skillLabels: Record<Skill, string> = {
  listening: '听力',
  speaking: '口语',
  reading: '阅读',
  writing: '写作',
  grammar: '语法',
  vocabulary: '词汇',
}

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
}

export const formatLabels: Record<ResourceFormat, string> = {
  podcast: '播客',
  video: '视频',
  article: '文章',
  book: '书籍',
  tool: '工具',
  course: '课程',
  practice: '练习',
}
