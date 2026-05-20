import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  difficultyLabels,
  formatLabels,
  resources,
  skillLabels,
  type Difficulty,
  type LearningResource,
  type Skill,
} from './data/resources'
import { speakingPrompts, writingPrompts } from './data/prompts'
import {
  partOfSpeechLabels,
  vocabularyFrequencyBandLabels,
  vocabularyLevelLabels,
  type CoreVocabularyEntry,
  type PartOfSpeech,
  type VocabularyFrequencyBand,
  type VocabularyLevel,
  type VocabularyPronunciation,
} from './data/vocabulary'
import {
  defaultState,
  normalizeAppState,
  type AppState,
  type DailyLog,
  type GoalId,
  type StudyProfile,
  type VocabularyItem,
} from './shared/study'

type ViewId = 'today' | 'vocabulary' | 'library' | 'review'
type VocabularyFrequencyFilter = VocabularyFrequencyBand | 'all'

interface DailyTask {
  id: string
  skill: Skill
  title: string
  description: string
  duration: number
  resource?: LearningResource
}

const STORAGE_KEY = 'english-orbit-state-v1'
const VOCABULARY_VISIBLE_LIMIT = 240
const CORE_VOCABULARY_TOTAL = 3000

const vocabularyFrequencyOptions: Array<{
  value: VocabularyFrequencyFilter
  label: string
}> = [
  { value: 'top-100', label: vocabularyFrequencyBandLabels['top-100'] },
  { value: 'top-500', label: vocabularyFrequencyBandLabels['top-500'] },
  { value: 'top-1000', label: vocabularyFrequencyBandLabels['top-1000'] },
  { value: 'all', label: '全部 3000' },
]

interface VocabularyApiItem {
  id: string
  word: string
  meaning: string
  meaningZh: string
  definitionEn: string
  partOfSpeech: PartOfSpeech
  level: VocabularyLevel
  priority: number
  frequencyRank: number | null
  frequencyBand: VocabularyFrequencyBand | null
  note: string
  pronunciations?: VocabularyPronunciation[]
}

interface VocabularyApiResponse {
  items: VocabularyApiItem[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

const mapApiVocabularyItem = (item: VocabularyApiItem): CoreVocabularyEntry => ({
  id: item.id,
  word: item.word,
  meaning: item.meaning,
  partOfSpeech: item.partOfSpeech,
  level: item.level,
  priority: item.priority,
  frequencyRank: item.frequencyRank ?? undefined,
  frequencyBand: item.frequencyBand ?? undefined,
  learningPriority: item.priority,
  scenarios: [],
  skills: ['listening', 'speaking', 'reading', 'writing'],
  note: item.note,
  pronunciations: item.pronunciations ?? [],
})

function getPronunciationLabel(pronunciation: VocabularyPronunciation) {
  if (pronunciation.accent === 'us') {
    return 'US'
  }

  if (pronunciation.accent === 'uk') {
    return 'UK'
  }

  return pronunciation.accent.toUpperCase()
}

const goals: Record<
  GoalId,
  {
    label: string
    description: string
    weights: Record<'listening' | 'speaking' | 'reading' | 'writing', number>
  }
> = {
  balanced: {
    label: '均衡提升',
    description: '听说读写都推进，适合作为长期主线。',
    weights: { listening: 0.25, speaking: 0.25, reading: 0.25, writing: 0.25 },
  },
  conversation: {
    label: '流利表达',
    description: '把更多时间给听力与口语，优先解决“能说出来”。',
    weights: { listening: 0.3, speaking: 0.4, reading: 0.15, writing: 0.15 },
  },
  career: {
    label: '工作英语',
    description: '偏向阅读、写作与清晰表达，适合职场场景。',
    weights: { listening: 0.2, speaking: 0.2, reading: 0.25, writing: 0.35 },
  },
  exam: {
    label: '考试备考',
    description: '强调阅读与写作，同时维持输入能力。',
    weights: { listening: 0.2, speaking: 0.15, reading: 0.35, writing: 0.3 },
  },
}

const coreSkills: Array<'listening' | 'speaking' | 'reading' | 'writing'> = [
  'listening',
  'speaking',
  'reading',
  'writing',
]

function getDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getReadableDate(date = new Date()) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

function loadState(): AppState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    return defaultState
  }

  try {
    return normalizeAppState(JSON.parse(saved)) ?? defaultState
  } catch {
    return defaultState
  }
}

function getDaySeed(dateKey: string) {
  return dateKey
    .split('-')
    .join('')
    .split('')
    .reduce((total, digit) => total + Number(digit), 0)
}

function pickResource(skill: Skill, level: Difficulty, seed: number) {
  const matchingLevel = resources.filter(
    (resource) => resource.skill === skill && resource.difficulty === level,
  )
  const fallback = resources.filter((resource) => resource.skill === skill)
  const pool = matchingLevel.length > 0 ? matchingLevel : fallback

  return pool[seed % pool.length]
}

function allocateMinutes(totalMinutes: number, goal: GoalId) {
  const weights = goals[goal].weights
  const allocation = coreSkills.map((skill) => ({
    skill,
    duration: Math.max(5, Math.round(totalMinutes * weights[skill])),
  }))

  const currentTotal = allocation.reduce((total, item) => total + item.duration, 0)
  const delta = totalMinutes - currentTotal
  allocation[allocation.length - 1].duration += delta

  return allocation
}

function buildDailyPlan(profile: StudyProfile, dateKey: string): DailyTask[] {
  const seed = getDaySeed(dateKey)
  const allocation = allocateMinutes(profile.minutesPerDay, profile.goal)
  const speakingPrompt = speakingPrompts[seed % speakingPrompts.length]
  const writingPrompt = writingPrompts[seed % writingPrompts.length]

  return allocation.map(({ skill, duration }) => {
    if (skill === 'speaking') {
      const resource = pickResource(skill, profile.level, seed + 1)
      return {
        id: `${dateKey}-speaking`,
        skill,
        title: '开口输出',
        description: speakingPrompt,
        duration,
        resource,
      }
    }

    if (skill === 'writing') {
      const resource = pickResource(skill, profile.level, seed + 2)
      return {
        id: `${dateKey}-writing`,
        skill,
        title: '短写作',
        description: writingPrompt,
        duration,
        resource,
      }
    }

    const resource = pickResource(skill, profile.level, seed + duration)
    return {
      id: `${dateKey}-${skill}`,
      skill,
      title: skill === 'listening' ? '输入训练' : '阅读训练',
      description:
        skill === 'listening'
          ? `用 ${resource.title} 做一轮精听或泛听，至少记下 2 个表达。`
          : `阅读 ${resource.title}，写出 3 句摘要或摘录。`,
      duration,
      resource,
    }
  })
}

function getLastSevenDays(date = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(date)
    next.setDate(date.getDate() - index)
    return getDateKey(next)
  })
}

function calculateStreak(logs: Record<string, DailyLog>, date = new Date()) {
  let streak = 0
  const cursor = new Date(date)

  while (true) {
    const log = logs[getDateKey(cursor)]
    if (!log || log.completedTaskIds.length === 0) {
      break
    }

    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function formatSkillSummary(tasks: DailyTask[]) {
  return tasks
    .map((task) => `${skillLabels[task.skill]} ${task.duration}m`)
    .join(' · ')
}

function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [view, setView] = useState<ViewId>('today')
  const [resourceSkill, setResourceSkill] = useState<Skill | 'all'>('all')
  const [resourceLevel, setResourceLevel] = useState<Difficulty | 'all'>('all')
  const [vocabularyFrequency, setVocabularyFrequency] =
    useState<VocabularyFrequencyFilter>('top-500')
  const [vocabularyLevel, setVocabularyLevel] = useState<VocabularyLevel | 'all'>(
    'all',
  )
  const [vocabularyPart, setVocabularyPart] = useState<PartOfSpeech | 'all'>(
    'all',
  )
  const [query, setQuery] = useState('')
  const [vocabularyQuery, setVocabularyQuery] = useState('')
  const [apiVocabulary, setApiVocabulary] = useState<CoreVocabularyEntry[]>([])
  const [apiVocabularyTotal, setApiVocabularyTotal] = useState(0)
  const [isVocabularyLoading, setIsVocabularyLoading] = useState(false)
  const [vocabularyApiError, setVocabularyApiError] = useState('')
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')

  const todayKey = getDateKey()
  const dailyPlan = useMemo(
    () => buildDailyPlan(state.profile, todayKey),
    [state.profile, todayKey],
  )
  const todayLog = state.logs[todayKey] ?? {
    completedTaskIds: [],
    reflection: '',
    minutesLogged: 0,
  }
  const completedCount = todayLog.completedTaskIds.length
  const completionRate = Math.round((completedCount / dailyPlan.length) * 100)
  const featuredResources = resources.filter((resource) => resource.featured)
  const recentDays = getLastSevenDays()
  const weeklyLogs = recentDays
    .map((dateKey) => state.logs[dateKey])
    .filter(Boolean)
  const weeklyTaskCount = weeklyLogs.reduce(
    (total, log) => total + log.completedTaskIds.length,
    0,
  )
  const weeklyMinutes = weeklyLogs.reduce(
    (total, log) => total + log.minutesLogged,
    0,
  )
  const streak = calculateStreak(state.logs)
  const filteredResources = resources.filter((resource) => {
    const matchesSkill = resourceSkill === 'all' || resource.skill === resourceSkill
    const matchesLevel =
      resourceLevel === 'all' || resource.difficulty === resourceLevel
    const normalizedQuery = query.trim().toLowerCase()
    const matchesQuery =
      normalizedQuery.length === 0 ||
      resource.title.toLowerCase().includes(normalizedQuery) ||
      resource.summary.toLowerCase().includes(normalizedQuery) ||
      resource.tags.some((tag) => tag.includes(normalizedQuery))

    return matchesSkill && matchesLevel && matchesQuery
  })
  const visibleCoreVocabulary = apiVocabulary
  const vocabularyResultCount = apiVocabularyTotal
  const hiddenVocabularyCount = Math.max(
    0,
    vocabularyResultCount - visibleCoreVocabulary.length,
  )
  const vocabularyTotalCount = Math.max(CORE_VOCABULARY_TOTAL, apiVocabularyTotal)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchVocabulary() {
      setIsVocabularyLoading(true)
      setVocabularyApiError('')

      const params = new URLSearchParams({
        band: vocabularyFrequency === 'all' ? 'top-3000' : vocabularyFrequency,
        limit: String(VOCABULARY_VISIBLE_LIMIT),
        offset: '0',
      })

      const normalizedQuery = vocabularyQuery.trim()

      if (normalizedQuery) {
        params.set('q', normalizedQuery)
      }

      if (vocabularyLevel !== 'all') {
        params.set('level', vocabularyLevel)
      }

      if (vocabularyPart !== 'all') {
        params.set('partOfSpeech', vocabularyPart)
      }

      try {
        const response = await fetch(`/api/vocabulary?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Vocabulary API responded with ${response.status}`)
        }

        const payload = (await response.json()) as VocabularyApiResponse

        setApiVocabulary(payload.items.map(mapApiVocabularyItem))
        setApiVocabularyTotal(payload.pagination.total)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setApiVocabulary([])
        setApiVocabularyTotal(0)
        setVocabularyApiError(
          error instanceof Error ? error.message : 'Vocabulary API unavailable',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsVocabularyLoading(false)
        }
      }
    }

    fetchVocabulary()

    return () => controller.abort()
  }, [vocabularyFrequency, vocabularyLevel, vocabularyPart, vocabularyQuery])

  function updateProfile<Key extends keyof StudyProfile>(
    key: Key,
    value: StudyProfile[Key],
  ) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
  }

  function toggleTask(task: DailyTask) {
    setState((current) => {
      const existingLog = current.logs[todayKey] ?? {
        completedTaskIds: [],
        reflection: '',
        minutesLogged: 0,
      }
      const isCompleted = existingLog.completedTaskIds.includes(task.id)
      const completedTaskIds = isCompleted
        ? existingLog.completedTaskIds.filter((taskId) => taskId !== task.id)
        : [...existingLog.completedTaskIds, task.id]
      const minutesLogged = dailyPlan
        .filter((item) => completedTaskIds.includes(item.id))
        .reduce((total, item) => total + item.duration, 0)

      return {
        ...current,
        logs: {
          ...current.logs,
          [todayKey]: {
            ...existingLog,
            completedTaskIds,
            minutesLogged,
          },
        },
      }
    })
  }

  function updateReflection(value: string) {
    setState((current) => ({
      ...current,
      logs: {
        ...current.logs,
        [todayKey]: {
          ...(current.logs[todayKey] ?? {
            completedTaskIds: [],
            reflection: '',
            minutesLogged: 0,
          }),
          reflection: value,
        },
      },
    }))
  }

  function addVocabularyItem() {
    if (!word.trim() || !meaning.trim()) {
      return
    }

    const nextItem: VocabularyItem = {
      id: crypto.randomUUID(),
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim(),
      createdAt: todayKey,
    }

    setState((current) => ({
      ...current,
      vocabulary: [nextItem, ...current.vocabulary],
    }))
    setWord('')
    setMeaning('')
    setExample('')
  }

  function removeVocabularyItem(id: string) {
    setState((current) => ({
      ...current,
      vocabulary: current.vocabulary.filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">EO</span>
          <div>
            <p>English Orbit</p>
            <strong>英语成长台</strong>
          </div>
        </div>

        <nav aria-label="主导航">
          <button
            type="button"
            className={view === 'today' ? 'active' : ''}
            onClick={() => setView('today')}
          >
            今天
          </button>
          <button
            type="button"
            className={view === 'library' ? 'active' : ''}
            onClick={() => setView('library')}
          >
            资源库
          </button>
          <button
            type="button"
            className={view === 'vocabulary' ? 'active' : ''}
            onClick={() => setView('vocabulary')}
          >
            核心词库
          </button>
          <button
            type="button"
            className={view === 'review' ? 'active' : ''}
            onClick={() => setView('review')}
          >
            复盘
          </button>
        </nav>

        <section className="sidebar-card">
          <span>本周状态</span>
          <strong>{weeklyMinutes} 分钟</strong>
          <p>{weeklyTaskCount} 个任务已完成</p>
        </section>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <p>{getReadableDate()}</p>
            <h1>你好，{state.profile.name}</h1>
          </div>
          <div className="header-meta">
            <span>{goals[state.profile.goal].label}</span>
            <strong>{difficultyLabels[state.profile.level]}</strong>
          </div>
        </header>

        {view === 'today' && (
          <>
            <section className="hero-grid">
              <article className="panel overview-card">
                <span>今日计划</span>
                <h2>{formatSkillSummary(dailyPlan)}</h2>
                <p>{goals[state.profile.goal].description}</p>
                <div className="progress-track" aria-label="今日完成度">
                  <span style={{ width: `${completionRate}%` }} />
                </div>
                <footer>
                  <strong>{completionRate}%</strong>
                  <small>
                    {completedCount}/{dailyPlan.length} 已完成
                  </small>
                </footer>
              </article>

              <article className="panel profile-card">
                <div className="section-heading">
                  <h2>学习配置</h2>
                  <span>可随时调整</span>
                </div>
                <label>
                  称呼
                  <input
                    value={state.profile.name}
                    onChange={(event) => updateProfile('name', event.target.value)}
                  />
                </label>
                <label>
                  目标
                  <select
                    value={state.profile.goal}
                    onChange={(event) =>
                      updateProfile('goal', event.target.value as GoalId)
                    }
                  >
                    {Object.entries(goals).map(([goalId, goal]) => (
                      <option key={goalId} value={goalId}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  当前水平
                  <select
                    value={state.profile.level}
                    onChange={(event) =>
                      updateProfile('level', event.target.value as Difficulty)
                    }
                  >
                    {Object.entries(difficultyLabels).map(([level, label]) => (
                      <option key={level} value={level}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  每日时长
                  <input
                    type="number"
                    min={20}
                    max={120}
                    step={10}
                    value={state.profile.minutesPerDay}
                    onChange={(event) =>
                      updateProfile(
                        'minutesPerDay',
                        Math.max(20, Math.min(120, Number(event.target.value))),
                      )
                    }
                  />
                </label>
              </article>
            </section>

            <section className="task-section">
              <div className="section-heading">
                <h2>今天先把这四件事做完</h2>
                <span>主链路：输入 → 输出 → 记录</span>
              </div>
              <div className="task-grid">
                {dailyPlan.map((task) => {
                  const isCompleted = todayLog.completedTaskIds.includes(task.id)

                  return (
                    <article
                      key={task.id}
                      className={`panel task-card ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="task-topline">
                        <span>{skillLabels[task.skill]}</span>
                        <strong>{task.duration} 分钟</strong>
                      </div>
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      {task.resource && (
                        <a href={task.resource.url} target="_blank" rel="noreferrer">
                          打开 {task.resource.title}
                        </a>
                      )}
                      <button type="button" onClick={() => toggleTask(task)}>
                        {isCompleted ? '已完成，点此撤销' : '标记完成'}
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="split-grid">
              <article className="panel">
                <div className="section-heading">
                  <h2>今日复盘</h2>
                  <span>留下一句话就够</span>
                </div>
                <textarea
                  placeholder="今天哪个表达最值得记住？哪里还卡住？"
                  value={todayLog.reflection}
                  onChange={(event) => updateReflection(event.target.value)}
                />
              </article>

              <article className="panel">
                <div className="section-heading">
                  <h2>快速记词</h2>
                  <span>{state.vocabulary.length} 个已收藏</span>
                </div>
                <div className="vocab-form">
                  <input
                    placeholder="word / phrase"
                    value={word}
                    onChange={(event) => setWord(event.target.value)}
                  />
                  <input
                    placeholder="中文释义"
                    value={meaning}
                    onChange={(event) => setMeaning(event.target.value)}
                  />
                  <input
                    placeholder="例句（可选）"
                    value={example}
                    onChange={(event) => setExample(event.target.value)}
                  />
                  <button type="button" onClick={addVocabularyItem}>
                    收藏
                  </button>
                </div>
              </article>
            </section>
          </>
        )}

        {view === 'vocabulary' && (
          <>
            <section className="panel vocabulary-hero">
              <div>
                <span>Core 3000 · 第一版底稿</span>
                <h2>先从最常用、最能复用的词开始</h2>
                <p>
                  这批词不是为了“背完列表”，而是作为后续听、说、读、写训练的基础材料：
                  默认按通用英语出现频率排序，可从高频 100、日常 500、核心 1000
                  逐层推进。
                </p>
              </div>
              <div className="vocabulary-stats">
                <strong>{vocabularyTotalCount}</strong>
                <span>个核心词</span>
              </div>
            </section>

            <section className="panel vocabulary-toolbar">
              <div className="section-heading">
                <h2>核心词库</h2>
                <span>{vocabularyResultCount} 个匹配结果</span>
              </div>
              <div className="filters vocabulary-filters">
                <input
                  placeholder="搜索单词、中文释义或英文释义"
                  value={vocabularyQuery}
                  onChange={(event) => setVocabularyQuery(event.target.value)}
                />
                <select
                  value={vocabularyFrequency}
                  onChange={(event) =>
                    setVocabularyFrequency(
                      event.target.value as VocabularyFrequencyFilter,
                    )
                  }
                >
                  {vocabularyFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={vocabularyLevel}
                  onChange={(event) =>
                    setVocabularyLevel(event.target.value as VocabularyLevel | 'all')
                  }
                >
                  <option value="all">全部级别</option>
                  {Object.entries(vocabularyLevelLabels).map(([level, label]) => (
                    <option key={level} value={level}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={vocabularyPart}
                  onChange={(event) =>
                    setVocabularyPart(event.target.value as PartOfSpeech | 'all')
                  }
                >
                  <option value="all">全部词性</option>
                  {Object.entries(partOfSpeechLabels).map(([part, label]) => (
                    <option key={part} value={part}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {(isVocabularyLoading || vocabularyApiError) && (
              <section className="panel vocabulary-source-note">
                {isVocabularyLoading && '正在从数据库读取词库…'}
                {!isVocabularyLoading &&
                  vocabularyApiError &&
                  '数据库词库暂不可用，请稍后再试。'}
              </section>
            )}

            <section className="vocabulary-grid">
              {visibleCoreVocabulary.map((item) => (
                <article key={item.id} className="panel vocabulary-card">
                  <header>
                    <div>
                      <span>#{String(item.priority).padStart(2, '0')}</span>
                      <h3>{item.word}</h3>
                    </div>
                    <strong>{vocabularyLevelLabels[item.level]}</strong>
                  </header>
                  <p className="vocabulary-meaning">{item.meaning}</p>
                  {item.pronunciations && item.pronunciations.length > 0 && (
                    <div
                      className="pronunciation-list"
                      aria-label={`${item.word} 读音`}
                    >
                      {item.pronunciations.map((pronunciation) => (
                        <button
                          key={`${item.id}-${pronunciation.accent}`}
                          type="button"
                          title={`${item.word} ${pronunciation.locale} 读音`}
                          onClick={() => {
                            const audio = new Audio(pronunciation.audioUrl)
                            void audio.play()
                          }}
                        >
                          {getPronunciationLabel(pronunciation)}
                        </button>
                      ))}
                    </div>
                  )}
                  {item.example && (
                    <p className="vocabulary-example">{item.example}</p>
                  )}
                  <div className="resource-meta">
                    <span>{partOfSpeechLabels[item.partOfSpeech]}</span>
                  </div>
                  {item.senses && (
                    <div className="sense-list">
                      <strong>义项拆分</strong>
                      {item.senses.map((sense) => (
                        <div key={`${sense.partOfSpeech}-${sense.meaning}`}>
                          <span>{partOfSpeechLabels[sense.partOfSpeech]}</span>
                          <p>{sense.meaning}</p>
                          <small>{sense.example}</small>
                          {sense.usageNote && <em>{sense.usageNote}</em>}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.collocations && item.collocations.length > 0 && (
                    <div className="collocation-list">
                      {item.collocations.map((collocation) => (
                        <span key={collocation}>{collocation}</span>
                      ))}
                    </div>
                  )}
                  <footer>
                    <small>{item.note}</small>
                    <button
                      type="button"
                      onClick={() => {
                        setWord(item.word)
                        setMeaning(item.meaning)
                        setExample(item.example ?? '')
                        setView('today')
                      }}
                    >
                      加到今日记词
                    </button>
                  </footer>
                </article>
              ))}
            </section>

            {hiddenVocabularyCount > 0 && (
              <section className="panel vocabulary-more-note">
                还有 {hiddenVocabularyCount} 个匹配词没有直接展开。可以继续搜索单词、中文释义、
                英文释义、级别或词性来缩小范围。
              </section>
            )}
          </>
        )}

        {view === 'library' && (
          <>
            <section className="panel library-toolbar">
              <div className="section-heading">
                <h2>资源库</h2>
                <span>先收录核心资源，再逐步扩展</span>
              </div>
              <div className="filters">
                <input
                  placeholder="搜索资源、标签或用途"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <select
                  value={resourceSkill}
                  onChange={(event) =>
                    setResourceSkill(event.target.value as Skill | 'all')
                  }
                >
                  <option value="all">全部技能</option>
                  {Object.entries(skillLabels).map(([skill, label]) => (
                    <option key={skill} value={skill}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={resourceLevel}
                  onChange={(event) =>
                    setResourceLevel(event.target.value as Difficulty | 'all')
                  }
                >
                  <option value="all">全部难度</option>
                  {Object.entries(difficultyLabels).map(([level, label]) => (
                    <option key={level} value={level}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="resource-grid">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="panel resource-card">
                  <div className="resource-meta">
                    <span>{skillLabels[resource.skill]}</span>
                    <span>{difficultyLabels[resource.difficulty]}</span>
                    <span>{formatLabels[resource.format]}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <footer>
                    <small>{resource.minutes} 分钟</small>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      打开资源
                    </a>
                  </footer>
                </article>
              ))}
            </section>
          </>
        )}

        {view === 'review' && (
          <>
            <section className="stats-grid">
              <article className="panel stat-card">
                <span>连续学习</span>
                <strong>{streak} 天</strong>
              </article>
              <article className="panel stat-card">
                <span>本周任务</span>
                <strong>{weeklyTaskCount}</strong>
              </article>
              <article className="panel stat-card">
                <span>本周时长</span>
                <strong>{weeklyMinutes} 分钟</strong>
              </article>
              <article className="panel stat-card">
                <span>词汇沉淀</span>
                <strong>{state.vocabulary.length}</strong>
              </article>
            </section>

            <section className="split-grid review-grid">
              <article className="panel">
                <div className="section-heading">
                  <h2>核心资源</h2>
                  <span>适合长期放在主线里</span>
                </div>
                <div className="compact-list">
                  {featuredResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong>{resource.title}</strong>
                      <span>{skillLabels[resource.skill]}</span>
                    </a>
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="section-heading">
                  <h2>词汇清单</h2>
                  <span>最近添加优先</span>
                </div>
                <div className="vocab-list">
                  {state.vocabulary.length === 0 && (
                    <p className="empty-state">今天先收藏第一个真正想记住的词。</p>
                  )}
                  {state.vocabulary.map((item) => (
                    <div key={item.id} className="vocab-item">
                      <div>
                        <strong>{item.word}</strong>
                        <span>{item.meaning}</span>
                        {item.example && <small>{item.example}</small>}
                      </div>
                      <button
                        type="button"
                        aria-label={`删除 ${item.word}`}
                        onClick={() => removeVocabularyItem(item.id)}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
