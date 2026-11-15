import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getIeltsPrimaryReading,
  ieltsCatalog,
  loadIeltsModule,
  type IeltsEntry,
  type IeltsExample,
  type IeltsModuleData,
  type IeltsModuleId,
} from '../../data/ielts'
import { IeltsSenses } from '../ielts/IeltsSenses'
import { useIeltsAudio } from '../ielts/useIeltsAudio'
import { useIeltsExamples } from '../ielts/useIeltsExamples'
import { ClozeBlank } from '../../shared/cloze/ClozeBlank'
import { CLOZE_CHARACTERS, useClozeBlanks } from '../../shared/cloze/useClozeBlanks'
import './home.css'

// The home page is one thing: copy IELTS words. The word sits faded in place,
// the learner types over it, and Enter moves to the next word of the topic.

// Where to resume: { topicId, entryId }.
const POSITION_STORAGE_KEY = 'home-ielts-copy-v1'

interface CopyPosition {
  topicId: string
  entryId: string | null
}

const TOPICS = ieltsCatalog.modules.flatMap((module) =>
  module.topics.map((topic) => ({ module, topic })),
)

function readPosition(): CopyPosition {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(POSITION_STORAGE_KEY) ?? 'null')

    if (parsed && typeof parsed === 'object' && 'topicId' in parsed) {
      const { topicId, entryId } = parsed as { topicId: unknown; entryId?: unknown }

      if (typeof topicId === 'string' && TOPICS.some((item) => item.topic.id === topicId)) {
        return { topicId, entryId: typeof entryId === 'string' ? entryId : null }
      }
    }
  } catch {
    // Unreadable storage: start from the first topic.
  }

  return { topicId: TOPICS[0].topic.id, entryId: null }
}

function savePosition(position: CopyPosition) {
  try {
    window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position))
  } catch {
    // Private mode or blocked storage: copying still works for this visit.
  }
}

function useIeltsModuleEntries(moduleId: IeltsModuleId) {
  const [state, setState] = useState<{
    moduleId: IeltsModuleId | null
    data: IeltsModuleData | null
    error: string
  }>({ moduleId: null, data: null, error: '' })

  useEffect(() => {
    let cancelled = false

    loadIeltsModule(moduleId).then(
      (data) => !cancelled && setState({ moduleId, data, error: '' }),
      () =>
        !cancelled &&
        setState({ moduleId, data: null, error: '词表加载失败，请检查网络后刷新重试。' }),
    )

    return () => {
      cancelled = true
    }
  }, [moduleId])

  return state.moduleId === moduleId ? state : { moduleId, data: null, error: '' }
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
      <path d="M15.5 9.6a3.6 3.6 0 0 1 0 4.8" />
      <path d="M18 7.2a7.2 7.2 0 0 1 0 9.6" />
    </svg>
  )
}

// "object to (doing) sth." -> blanks for object, to, doing, sth; the brackets
// and the full stop stay as plain text between them.
function splitWord(word: string) {
  // blank is the index among the blanks, or null for plain text.
  const parts: Array<{ text: string; blank: number | null }> = []
  let cursor = 0
  let blanks = 0

  for (const match of word.matchAll(CLOZE_CHARACTERS)) {
    if (match.index > cursor) {
      parts.push({ text: word.slice(cursor, match.index), blank: null })
    }
    parts.push({ text: match[0], blank: blanks })
    blanks += 1
    cursor = match.index + match[0].length
  }

  if (cursor < word.length) {
    parts.push({ text: word.slice(cursor), blank: null })
  }

  return parts
}

function CopyWord({
  entry,
  example,
  reading,
  onNext,
}: {
  entry: IeltsEntry
  example: IeltsExample | undefined
  /** IPA and the play button, shown right under the word. */
  reading: React.ReactNode
  onNext: () => void
}) {
  const parts = useMemo(() => splitWord(entry.word), [entry.word])
  const expected = useMemo(
    () => parts.filter((part) => part.blank !== null).map((part) => part.text),
    [parts],
  )
  const { answers, states, isComplete, focusCurrent, updateAnswer, setInputRef } = useClozeBlanks(
    expected,
    onNext,
  )

  useEffect(() => {
    focusCurrent()
  }, [focusCurrent])

  return (
    <>
      <p
        className={`home-copy-word${entry.word.length > 22 ? ' is-longer' : entry.word.length > 13 ? ' is-long' : ''}`}
        lang="en"
      >
        {parts.map((part, index) => {
          const current = part.blank

          if (current === null) {
            return <span key={index}>{part.text}</span>
          }

          return (
            <ClozeBlank
              key={index}
              answer={part.text}
              value={answers[current]}
              state={states[current]}
              ariaLabel={
                expected.length > 1
                  ? `第 ${current + 1} 个词，${part.text.length} 个字母`
                  : `抄写单词，${part.text.length} 个字母`
              }
              inputRef={setInputRef(current)}
              onChange={(value) => updateAnswer(current, value)}
            />
          )
        })}
      </p>

      {reading}

      <div className="home-copy-meaning">
        <IeltsSenses entry={entry} />
      </div>

      <div className={`home-copy-example${isComplete ? ' is-shown' : ''}`} aria-live="polite">
        {isComplete && example ? (
          <>
            <p lang="en">
              {example.en.slice(0, example.start)}
              <mark>{example.en.slice(example.start, example.start + example.length)}</mark>
              {example.en.slice(example.start + example.length)}
            </p>
            <p>{example.zh}</p>
          </>
        ) : null}
        {isComplete ? <small>按回车进入下一个</small> : null}
      </div>
    </>
  )
}

function HomePage() {
  const [position, setPosition] = useState<CopyPosition>(readPosition)
  const topicIndex = Math.max(
    TOPICS.findIndex((item) => item.topic.id === position.topicId),
    0,
  )
  const { module, topic } = TOPICS[topicIndex]
  const { data, error: moduleError } = useIeltsModuleEntries(module.id)
  const { data: examples } = useIeltsExamples(topic.id)
  const audio = useIeltsAudio()
  const entries = useMemo(
    () => data?.entries.filter((entry) => entry.topicId === topic.id) ?? [],
    [data, topic.id],
  )
  const index = Math.max(
    entries.findIndex((entry) => entry.id === position.entryId),
    0,
  )
  const entry = entries[index]
  const reading = entry ? getIeltsPrimaryReading(entry) : null

  const goTo = useCallback((next: CopyPosition) => {
    setPosition(next)
    savePosition(next)
  }, [])

  const goNext = useCallback(() => {
    if (index + 1 < entries.length) {
      goTo({ topicId: topic.id, entryId: entries[index + 1].id })
      return
    }

    // End of the topic: carry on with the next one, and wrap after the last.
    goTo({ topicId: TOPICS[(topicIndex + 1) % TOPICS.length].topic.id, entryId: null })
  }, [entries, goTo, index, topic.id, topicIndex])

  // Each word is read out as it appears. Browsers refuse sound before the
  // visitor has touched the page, so the first word waits for a key or a click.
  const hasInteractedRef = useRef(false)
  const { play } = audio
  const entryId = entry?.id
  const entryWord = entry?.word
  const audioUrl = reading?.url

  useEffect(() => {
    if (!entryId || !entryWord || !audioUrl) {
      return
    }

    const readOut = () => play(entryId, audioUrl, `${entryWord} 的读音`)

    if (hasInteractedRef.current) {
      readOut()
      return
    }

    function handleFirstInteraction() {
      hasInteractedRef.current = true
      readOut()
    }

    window.addEventListener('keydown', handleFirstInteraction, { once: true })
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('keydown', handleFirstInteraction)
      window.removeEventListener('pointerdown', handleFirstInteraction)
    }
  }, [audioUrl, entryId, entryWord, play])

  return (
    <section className="home-copy" aria-label="雅思单词抄写">
      <header className="home-copy-bar">
        <label>
          <span className="visually-hidden">模块</span>
          <select
            value={module.id}
            onChange={(event) => {
              const target = ieltsCatalog.modules.find((item) => item.id === event.target.value)

              if (target) {
                goTo({ topicId: target.topics[0].id, entryId: null })
              }
            }}
          >
            {ieltsCatalog.modules.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="visually-hidden">话题</span>
          <select
            value={topic.id}
            onChange={(event) => goTo({ topicId: event.target.value, entryId: null })}
          >
            {module.topics.map((item) => (
              <option key={item.id} value={item.id}>
                {String(item.order).padStart(2, '0')} {item.title}
              </option>
            ))}
          </select>
        </label>
        {entry ? (
          <span className="home-copy-count">
            {index + 1} / {entries.length}
          </span>
        ) : null}
      </header>

      <div className="home-copy-stage">
        {entry ? (
          <>
            <CopyWord
              key={entry.id}
              entry={entry}
              example={examples?.[entry.id]?.[0]}
              onNext={goNext}
              reading={
                <div className="home-copy-reading">
                  {reading?.phonetic ? <span>{reading.phonetic}</span> : null}
                  {reading?.url ? (
                    <button
                      type="button"
                      className={audio.activeKey === entry.id ? 'playing' : undefined}
                      aria-label={`播放 ${entry.word} 的英式读音`}
                      onClick={() =>
                        audio.play(entry.id, reading.url as string, `${entry.word} 的读音`)
                      }
                    >
                      <SpeakerIcon />
                    </button>
                  ) : null}
                </div>
              }
            />
            {audio.playbackError ? (
              <p className="home-copy-status" role="status">
                {audio.playbackError}
              </p>
            ) : null}
          </>
        ) : (
          <p className="home-copy-status" role="status">
            {moduleError || '正在加载单词…'}
          </p>
        )}
      </div>

      {entry ? (
        <footer className="home-copy-footer">
          <button
            type="button"
            className="is-quiet"
            disabled={index === 0}
            onClick={() => goTo({ topicId: topic.id, entryId: entries[index - 1].id })}
          >
            上一个
          </button>
          <button type="button" onClick={goNext}>
            下一个
          </button>
        </footer>
      ) : null}
    </section>
  )
}

export default HomePage
