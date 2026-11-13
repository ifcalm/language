import { useEffect, useMemo, useState } from 'react'
import { safeDecodeURIComponent } from '../../app/routing'
import {
  getIeltsAudioUrl,
  ieltsCatalog,
  loadIeltsModule,
  type IeltsEntry,
  type IeltsModuleData,
  type IeltsModuleId,
  type IeltsModuleSummary,
  type IeltsTopicSummary,
} from '../../data/ielts'
import { IeltsPractice } from './IeltsPractice'
import { IeltsSenses } from './IeltsSenses'
import { useIeltsAudio } from './useIeltsAudio'
import { useIeltsExamples } from './useIeltsExamples'
import { useIeltsProgress, type IeltsProgress } from './useIeltsProgress'
import './ielts.css'

// URL layout: /ielts, /ielts/:module, /ielts/:module/:topicOrder,
// /ielts/:module/:topicOrder/:entryId and /ielts/:module/:topicOrder/practice[/:section].
// "practice" is reserved: build-ielts-data.mjs rejects an entry with that id.
const PRACTICE_SEGMENT = 'practice'

interface IeltsRoute {
  moduleId: IeltsModuleId | null
  topicOrder: number | null
  entryId: string | null
  /** Sentence practice; section is an index into topic.groups, null for the whole topic. */
  practice?: { section: number | null } | null
}

type TopicFilter = 'all' | 'learning' | 'mastered'

function parseIeltsRoute(pathname: string): IeltsRoute {
  const [, , moduleSegment, topicSegment, entrySegment, sectionSegment] = pathname.split('/')
  const module = ieltsCatalog.modules.find((item) => item.id === moduleSegment)

  if (!module) {
    return { moduleId: null, topicOrder: null, entryId: null }
  }

  const topic = module.topics.find((item) => String(item.order) === topicSegment)

  if (topic && entrySegment === PRACTICE_SEGMENT) {
    const section = Number(sectionSegment) - 1
    return {
      moduleId: module.id,
      topicOrder: topic.order,
      entryId: null,
      practice: {
        section: Number.isInteger(section) && topic.groups?.[section] ? section : null,
      },
    }
  }

  return {
    moduleId: module.id,
    topicOrder: topic?.order ?? null,
    entryId: topic && entrySegment ? safeDecodeURIComponent(entrySegment) : null,
  }
}

function buildIeltsPath({ moduleId, topicOrder, entryId, practice }: IeltsRoute) {
  const tail = practice
    ? [PRACTICE_SEGMENT, practice.section === null ? null : practice.section + 1]
    : [entryId && encodeURIComponent(entryId)]

  return ['/ielts', moduleId, topicOrder, ...tail]
    .filter((segment) => segment !== null && segment !== undefined && segment !== '')
    .join('/')
}

function getTopicOrder(topicId: string) {
  return Number(topicId.split('-').pop())
}

function useIeltsModule(
  moduleId: IeltsModuleId | null,
  syncTopics: IeltsProgress['syncTopics'],
) {
  const [state, setState] = useState<{
    moduleId: IeltsModuleId | null
    data: IeltsModuleData | null
    error: string
  }>({ moduleId: null, data: null, error: '' })

  useEffect(() => {
    if (!moduleId) {
      return
    }

    let cancelled = false

    loadIeltsModule(moduleId).then(
      (data) => {
        if (!cancelled) {
          setState({ moduleId, data, error: '' })
          syncTopics(data.entries)
        }
      },
      () =>
        !cancelled &&
        setState({ moduleId, data: null, error: '词表加载失败，请检查网络后刷新重试。' }),
    )

    return () => {
      cancelled = true
    }
  }, [moduleId, syncTopics])

  return state.moduleId === moduleId ? state : { moduleId, data: null, error: '' }
}

function ExampleList({ entry }: { entry: IeltsEntry }) {
  const { data, error } = useIeltsExamples(entry.topicId)
  const examples = data?.[entry.id] ?? []

  if (error || !data) {
    return <p className="ielts-status ielts-examples-status" role="status">{error || '正在加载例句…'}</p>
  }

  if (examples.length === 0) {
    return null
  }

  return (
    <section className="ielts-examples" aria-label={`${entry.word} 的例句`}>
      <h2>例句</h2>
      <ul>
        {examples.map((example) => (
          <li key={example.en}>
            <p lang="en">
              {example.en.slice(0, example.start)}
              <mark>{example.en.slice(example.start, example.start + example.length)}</mark>
              {example.en.slice(example.start + example.length)}
            </p>
            <p className="ielts-example-zh">{example.zh}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="ielts-progress">
      <div className="ielts-progress-track" aria-hidden="true">
        <div className="ielts-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span>
        <span className="visually-hidden">已掌握 </span>
        {done} / {total}
      </span>
    </div>
  )
}

function SpeakerIcon() {
  return (
    <svg className="vocab-accent-speaker" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
      <path className="vocab-accent-wave" d="M15.5 9.6a3.6 3.6 0 0 1 0 4.8" />
      <path className="vocab-accent-wave" d="M18 7.2a7.2 7.2 0 0 1 0 9.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

function Breadcrumb({
  module,
  topic,
  current,
  onNavigate,
}: {
  module: IeltsModuleSummary
  topic?: IeltsTopicSummary
  /** A page below the topic, such as practice; the topic then links back. */
  current?: string
  onNavigate: (route: IeltsRoute) => void
}) {
  return (
    <nav className="ielts-breadcrumb" aria-label="当前位置">
      <button type="button" onClick={() => onNavigate({ moduleId: null, topicOrder: null, entryId: null })}>
        雅思
      </button>
      <span aria-hidden="true">/</span>
      {topic ? (
        <>
          <button
            type="button"
            onClick={() => onNavigate({ moduleId: module.id, topicOrder: null, entryId: null })}
          >
            {module.name}
          </button>
          <span aria-hidden="true">/</span>
          {current ? (
            <>
              <button
                type="button"
                onClick={() =>
                  onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: null })
                }
              >
                {topic.title}
              </button>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{current}</span>
            </>
          ) : (
            <span aria-current="page">{topic.title}</span>
          )}
        </>
      ) : (
        <span aria-current="page">{module.name}</span>
      )}
    </nav>
  )
}

function MasterButton({
  entry,
  progress,
  compact = false,
}: {
  entry: IeltsEntry
  progress: IeltsProgress
  compact?: boolean
}) {
  const mastered = progress.isMastered(entry.id)

  return (
    <button
      type="button"
      className={`ielts-master${mastered ? ' is-mastered' : ''}${compact ? ' is-compact' : ''}`}
      aria-pressed={mastered}
      aria-label={mastered ? `取消标记 ${entry.word} 为已掌握` : `标记 ${entry.word} 为已掌握`}
      onClick={(event) => {
        event.stopPropagation()
        progress.toggleMastered(entry.id, entry.topicId)
      }}
    >
      <CheckIcon />
      {compact ? null : <span>{mastered ? '已掌握' : '标记掌握'}</span>}
    </button>
  )
}

function EntryRow({
  entry,
  progress,
  showTopic,
  onOpen,
}: {
  entry: IeltsEntry
  progress: IeltsProgress
  showTopic?: string
  onOpen: () => void
}) {
  return (
    <li className={`ielts-entry-row${progress.isMastered(entry.id) ? ' is-mastered' : ''}`}>
      <button type="button" className="ielts-entry-main" onClick={onOpen}>
        <strong>{entry.word}</strong>
        <IeltsSenses entry={entry} />
        {showTopic ? <small>{showTopic}</small> : null}
      </button>
      <MasterButton entry={entry} progress={progress} compact />
    </li>
  )
}

function ModuleOverview({
  progress,
  onNavigate,
}: {
  progress: IeltsProgress
  onNavigate: (route: IeltsRoute) => void
}) {
  return (
    <>
      <header className="ielts-hero">
        <h1>雅思词汇</h1>
        <p>
          按雅思考试四个模块整理，共 {ieltsCatalog.entryCount} 个单词与词组。选择模块，再按话题逐个学习。
        </p>
      </header>

      <div className="ielts-module-grid">
        {ieltsCatalog.modules.map((module) => (
          <button
            key={module.id}
            type="button"
            className="ielts-module-card"
            onClick={() => onNavigate({ moduleId: module.id, topicOrder: null, entryId: null })}
          >
            <span className="ielts-module-en">{module.nameEn}</span>
            <h2>{module.name}</h2>
            <p>{module.description}</p>
            <small>
              {module.topics.length} 个话题 · {module.entryCount} 词
            </small>
            <ProgressBar done={progress.countMastered(module.id)} total={module.entryCount} />
          </button>
        ))}
      </div>
    </>
  )
}

function ModuleView({
  module,
  progress,
  onNavigate,
}: {
  module: IeltsModuleSummary
  progress: IeltsProgress
  onNavigate: (route: IeltsRoute) => void
}) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const { data, error } = useIeltsModule(
    normalizedQuery ? module.id : null,
    progress.syncTopics,
  )
  const topicTitles = useMemo(
    () => new Map(module.topics.map((topic) => [topic.id, topic.title])),
    [module],
  )
  const results = useMemo(() => {
    if (!data || !normalizedQuery) {
      return []
    }

    return data.entries.filter(
      (entry) =>
        entry.word.toLowerCase().includes(normalizedQuery) ||
        entry.spellingUs?.includes(normalizedQuery) ||
        entry.senses.some((sense) => sense.meaning.includes(normalizedQuery)),
    )
  }, [data, normalizedQuery])

  return (
    <>
      <Breadcrumb module={module} onNavigate={onNavigate} />
      <header className="ielts-section-head">
        <div>
          <span className="ielts-module-en">{module.nameEn}</span>
          <h1>{module.name}</h1>
          <p>{module.description}</p>
        </div>
        <ProgressBar done={progress.countMastered(module.id)} total={module.entryCount} />
      </header>

      <label className="ielts-search">
        <span className="visually-hidden">在{module.name}模块中搜索</span>
        <input
          type="search"
          value={query}
          placeholder={`在${module.name}中搜索单词或中文释义`}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {normalizedQuery ? (
        <section className="ielts-panel" aria-live="polite">
          {error ? <p className="ielts-status">{error}</p> : null}
          {!error && !data ? <p className="ielts-status">正在加载词表…</p> : null}
          {data && results.length === 0 ? (
            <p className="ielts-status">没有找到匹配的词。</p>
          ) : null}
          {results.length > 0 ? (
            <ul className="ielts-entry-list">
              {results.slice(0, 100).map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  progress={progress}
                  showTopic={topicTitles.get(entry.topicId)}
                  onOpen={() =>
                    onNavigate({
                      moduleId: module.id,
                      topicOrder: getTopicOrder(entry.topicId),
                      entryId: entry.id,
                    })
                  }
                />
              ))}
            </ul>
          ) : null}
        </section>
      ) : (
        <ol className="ielts-topic-grid">
          {module.topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className="ielts-topic-card"
                onClick={() =>
                  onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: null })
                }
              >
                <span className="ielts-topic-index">{String(topic.order).padStart(2, '0')}</span>
                <strong>{topic.title}</strong>
                {topic.groups ? (
                  <small className="ielts-topic-groups">
                    {topic.groups.map((group) => group.title).join(' · ')}
                  </small>
                ) : null}
                <ProgressBar done={progress.countMastered(topic.id)} total={topic.entryCount} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

function TopicView({
  module,
  topic,
  entries,
  progress,
  onNavigate,
}: {
  module: IeltsModuleSummary
  topic: IeltsTopicSummary
  entries: IeltsEntry[]
  progress: IeltsProgress
  onNavigate: (route: IeltsRoute) => void
}) {
  const [filter, setFilter] = useState<TopicFilter>('all')
  const masteredCount = entries.filter((entry) => progress.isMastered(entry.id)).length
  const visibleEntries = entries.filter((entry) => {
    if (filter === 'all') {
      return true
    }

    return progress.isMastered(entry.id) === (filter === 'mastered')
  })
  // Merged topics keep their original sub-groups as section headings.
  const groupedEntries = topic.groups
    ? topic.groups
        .map((group, index) => ({
          key: `group-${index}`,
          index,
          title: group.title,
          entries: visibleEntries.filter((entry) => entry.group === index),
        }))
        .filter((group) => group.entries.length > 0)
    : [{ key: 'all', index: null, title: '', entries: visibleEntries }]
  const topicIndex = module.topics.findIndex((item) => item.id === topic.id)
  const previousTopic = module.topics[topicIndex - 1]
  const nextTopic = module.topics[topicIndex + 1]
  const filters: Array<{ id: TopicFilter; label: string; count: number }> = [
    { id: 'all', label: '全部', count: entries.length },
    { id: 'learning', label: '未掌握', count: entries.length - masteredCount },
    { id: 'mastered', label: '已掌握', count: masteredCount },
  ]

  return (
    <>
      <Breadcrumb module={module} topic={topic} onNavigate={onNavigate} />
      <header className="ielts-section-head">
        <div>
          <span className="ielts-module-en">
            {module.name} · 话题 {String(topic.order).padStart(2, '0')}
          </span>
          <h1>{topic.title}</h1>
        </div>
        <div className="ielts-topic-actions">
          <ProgressBar done={masteredCount} total={entries.length} />
          <button
            type="button"
            className="ielts-practice-start"
            onClick={() =>
              onNavigate({
                moduleId: module.id,
                topicOrder: topic.order,
                entryId: null,
                practice: { section: null },
              })
            }
          >
            练习本话题
          </button>
        </div>
      </header>

      <div className="ielts-filter" role="group" aria-label="筛选词条">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={filter === item.id ? 'active' : ''}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
            <span>{item.count}</span>
          </button>
        ))}
      </div>

      {visibleEntries.length === 0 ? (
        <section className="ielts-panel">
          <p className="ielts-status">
            {filter === 'learning' ? '这个话题的词都已掌握。' : '还没有标记已掌握的词。'}
          </p>
        </section>
      ) : (
        groupedEntries.map((group) => (
          <section key={group.key} className="ielts-group">
            {group.title ? (
              <div className="ielts-group-head">
                <h2 className="ielts-group-title">
                  {group.title}
                  <span>{group.entries.length}</span>
                </h2>
                <button
                  type="button"
                  className="ielts-practice-start is-quiet"
                  onClick={() =>
                    onNavigate({
                      moduleId: module.id,
                      topicOrder: topic.order,
                      entryId: null,
                      practice: { section: group.index },
                    })
                  }
                >
                  练习本节
                </button>
              </div>
            ) : null}
            <div className="ielts-panel">
              <ul className="ielts-entry-list">
                {group.entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    progress={progress}
                    onOpen={() =>
                      onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: entry.id })
                    }
                  />
                ))}
              </ul>
            </div>
          </section>
        ))
      )}

      <nav className="ielts-pager" aria-label="切换话题">
        {previousTopic ? (
          <button
            type="button"
            onClick={() =>
              onNavigate({ moduleId: module.id, topicOrder: previousTopic.order, entryId: null })
            }
          >
            ← {previousTopic.title}
          </button>
        ) : (
          <span />
        )}
        {nextTopic ? (
          <button
            type="button"
            onClick={() =>
              onNavigate({ moduleId: module.id, topicOrder: nextTopic.order, entryId: null })
            }
          >
            {nextTopic.title} →
          </button>
        ) : null}
      </nav>
    </>
  )
}

function EntryView({
  module,
  topic,
  entries,
  entry,
  progress,
  onNavigate,
}: {
  module: IeltsModuleSummary
  topic: IeltsTopicSummary
  entries: IeltsEntry[]
  entry: IeltsEntry
  progress: IeltsProgress
  onNavigate: (route: IeltsRoute) => void
}) {
  const { activeKey, playbackError, play } = useIeltsAudio()
  const index = entries.findIndex((item) => item.id === entry.id)
  const previousEntry = entries[index - 1]
  const nextEntry = entries[index + 1]
  const accents = [
    { id: 'uk' as const, label: 'UK', phonetic: entry.phoneticUk },
    { id: 'us' as const, label: 'US', phonetic: entry.phoneticUs },
  ].filter((accent) => accent.phonetic || entry.audio)

  function openEntry(target: IeltsEntry) {
    onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: target.id })
  }

  return (
    <>
      <Breadcrumb module={module} topic={topic} onNavigate={onNavigate} />

      <article className="ielts-panel ielts-entry-detail">
        <header>
          <span className="ielts-module-en">
            {index + 1} / {entries.length}
          </span>
          <h1>{entry.word}</h1>
        </header>

        {accents.length > 0 ? (
          <div className="vocab-accent-list ielts-accents" aria-label={`${entry.word} 读音`}>
            {accents.map((accent) => {
              const url = getIeltsAudioUrl(entry, accent.id)
              const key = `${entry.id}-${accent.id}`

              return (
                <div className="vocab-accent" key={accent.id}>
                  <span className="vocab-accent-tag">{accent.label}</span>
                  <span className="vocab-accent-ipa">
                    {entry.posPhonetics
                      ? entry.posPhonetics.map((row) => {
                          const posUrl = getIeltsAudioUrl(entry, accent.id, row.pos)
                          const posKey = `${entry.id}-${accent.id}-${row.pos}`

                          return (
                            <span key={row.pos} className="ielts-pos-ipa">
                              <em>{row.pos}</em> {row[accent.id]}
                              {posUrl ? (
                                <button
                                  type="button"
                                  className={`vocab-accent-play ielts-pos-play${activeKey === posKey ? ' playing' : ''}`}
                                  aria-label={`播放 ${entry.word} ${row.pos} ${accent.label} 读音`}
                                  onClick={() =>
                                    play(posKey, posUrl, `${entry.word} ${row.pos} 的 ${accent.label} 读音`)
                                  }
                                >
                                  <SpeakerIcon />
                                </button>
                              ) : null}
                            </span>
                          )
                        })
                      : accent.phonetic}
                  </span>
                  {url ? (
                    <button
                      type="button"
                      className={`vocab-accent-play${activeKey === key ? ' playing' : ''}`}
                      aria-label={`播放 ${entry.word} ${accent.label} 读音`}
                      onClick={() => play(key, url, `${entry.word} 的 ${accent.label} 读音`)}
                    >
                      <SpeakerIcon />
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="ielts-status ielts-no-audio">音标与读音整理中</p>
        )}
        {playbackError ? <p className="ielts-status" role="alert">{playbackError}</p> : null}

        <ul className="ielts-sense-list">
          {entry.senses.map((sense, senseIndex) => (
            <li key={senseIndex}>
              <em>{sense.pos}</em>
              <span>{sense.meaning}</span>
            </li>
          ))}
        </ul>

        <ExampleList entry={entry} />

        <MasterButton entry={entry} progress={progress} />
      </article>

      <nav className="ielts-pager" aria-label="切换单词">
        {previousEntry ? (
          <button type="button" onClick={() => openEntry(previousEntry)}>
            ← {previousEntry.word}
          </button>
        ) : (
          <span />
        )}
        {nextEntry ? (
          <button type="button" onClick={() => openEntry(nextEntry)}>
            {nextEntry.word} →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: null })}
          >
            返回话题列表
          </button>
        )}
      </nav>
    </>
  )
}

function TopicLoader({
  module,
  topic,
  entryId,
  practice,
  progress,
  onNavigate,
}: {
  module: IeltsModuleSummary
  topic: IeltsTopicSummary
  entryId: string | null
  practice: IeltsRoute['practice']
  progress: IeltsProgress
  onNavigate: (route: IeltsRoute) => void
}) {
  const { data, error } = useIeltsModule(module.id, progress.syncTopics)
  const entries = useMemo(
    () => data?.entries.filter((entry) => entry.topicId === topic.id) ?? [],
    [data, topic.id],
  )
  const hasUnknownEntry =
    Boolean(data && entryId) && !entries.some((item) => item.id === entryId)

  useEffect(() => {
    if (hasUnknownEntry) {
      window.history.replaceState(
        null,
        '',
        buildIeltsPath({ moduleId: module.id, topicOrder: topic.order, entryId: null }),
      )
    }
  }, [hasUnknownEntry, module.id, topic.order])

  if (error || !data) {
    return (
      <>
        <Breadcrumb module={module} topic={topic} onNavigate={onNavigate} />
        <section className="ielts-panel">
          <p className="ielts-status" role="status">
            {error || '正在加载词表…'}
          </p>
        </section>
      </>
    )
  }

  if (practice) {
    const { section } = practice
    const groups = topic.groups
    const nextTopic = module.topics[module.topics.findIndex((item) => item.id === topic.id) + 1]
    const next =
      section !== null && groups && section + 1 < groups.length
        ? {
            label: `下一节：${groups[section + 1].title}`,
            onGo: () =>
              onNavigate({
                moduleId: module.id,
                topicOrder: topic.order,
                entryId: null,
                practice: { section: section + 1 },
              }),
          }
        : nextTopic
          ? {
              label: `下一个话题：${nextTopic.title}`,
              onGo: () =>
                onNavigate({
                  moduleId: module.id,
                  topicOrder: nextTopic.order,
                  entryId: null,
                  practice: { section: null },
                }),
            }
          : null

    return (
      <>
        <Breadcrumb module={module} topic={topic} current="例句填空" onNavigate={onNavigate} />
        <IeltsPractice
          key={`${topic.id}/${section}`}
          topic={topic}
          section={section}
          entries={entries}
          progress={progress}
          next={next}
          onBack={() => onNavigate({ moduleId: module.id, topicOrder: topic.order, entryId: null })}
        />
      </>
    )
  }

  const entry = entryId ? entries.find((item) => item.id === entryId) : undefined

  if (entry) {
    return (
      <EntryView
        module={module}
        topic={topic}
        entries={entries}
        entry={entry}
        progress={progress}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <TopicView
      key={topic.id}
      module={module}
      topic={topic}
      entries={entries}
      progress={progress}
      onNavigate={onNavigate}
    />
  )
}

function IeltsPage() {
  const [route, setRoute] = useState<IeltsRoute>(() => parseIeltsRoute(window.location.pathname))
  const progress = useIeltsProgress()
  const module = ieltsCatalog.modules.find((item) => item.id === route.moduleId)
  const topic = module?.topics.find((item) => item.order === route.topicOrder)

  useEffect(() => {
    function handlePopState() {
      setRoute(parseIeltsRoute(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Normalise unknown module/topic segments back to the closest valid page.
  useEffect(() => {
    const canonicalPath = buildIeltsPath(route)

    if (window.location.pathname !== canonicalPath && !route.entryId) {
      window.history.replaceState(null, '', canonicalPath)
    }
  }, [route])

  function navigate(nextRoute: IeltsRoute) {
    setRoute(nextRoute)
    window.history.pushState(null, '', buildIeltsPath(nextRoute))
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="ielts-page">
      {!module ? <ModuleOverview progress={progress} onNavigate={navigate} /> : null}
      {module && !topic ? (
        <ModuleView key={module.id} module={module} progress={progress} onNavigate={navigate} />
      ) : null}
      {module && topic ? (
        <TopicLoader
          module={module}
          topic={topic}
          entryId={route.entryId}
          practice={route.practice ?? null}
          progress={progress}
          onNavigate={navigate}
        />
      ) : null}
    </div>
  )
}

export default IeltsPage
