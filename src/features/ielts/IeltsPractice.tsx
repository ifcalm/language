import { useEffect, useMemo, useRef, useState } from 'react'
import type { IeltsEntry, IeltsExample, IeltsTopicSummary } from '../../data/ielts'
import { ClozeBlank } from '../../shared/cloze/ClozeBlank'
import { getClozeAnswerState } from '../../shared/cloze/clozeAnswer'
import { IeltsSenses } from './IeltsSenses'
import { useIeltsExamples } from './useIeltsExamples'
import type { IeltsProgress } from './useIeltsProgress'

// Sentence fill-in for one topic or one section of it. Each entry is practised
// with its first example sentence, which uses the sense the topic is about.
// The target word sits faded in place and the learner types over it.

// { [topic id or "topic id/section"]: entry id of the sentence to resume at }
const POSITION_STORAGE_KEY = 'ielts-practice-position-v1'
const HIDE_HINT_STORAGE_KEY = 'ielts-practice-hide-hint-v1'

interface PracticeBlank {
  text: string
  start: number
  end: number
}

interface PracticeItem {
  entry: IeltsEntry
  example: IeltsExample
  blanks: PracticeBlank[]
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private mode or blocked storage: practice still works for this visit.
  }
}

function readPositions(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(readStorage(POSITION_STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function savePosition(scopeKey: string, entryId: string | null) {
  const positions = readPositions()

  if (entryId) {
    positions[scopeKey] = entryId
  } else {
    delete positions[scopeKey]
  }

  writeStorage(POSITION_STORAGE_KEY, JSON.stringify(positions))
}

// A phrase target (cope with) becomes one blank per word.
function buildBlanks(example: IeltsExample): PracticeBlank[] {
  const target = example.en.slice(example.start, example.start + example.length)

  return Array.from(target.matchAll(/\S+/g), (match) => ({
    text: match[0],
    start: example.start + match.index,
    end: example.start + match.index + match[0].length,
  }))
}

// Typing lands in the blank unless focus is already in a text field; the
// hint checkbox and buttons don't count.
const TEXT_ENTRY_SELECTOR =
  'input:not([type]), input[type="text"], input[type="search"], input[type="number"], textarea, select, [contenteditable]'

// Letters (accented ones too), digits for mid-1990s and 3D, apostrophes, hyphens.
function sanitizeAnswer(value: string) {
  return value.replace(/[^\p{L}\p{N}'’-]/gu, '')
}

function PracticeExercise({
  item,
  hideHint,
  isFirst,
  onPrevious,
  onNext,
}: {
  item: PracticeItem
  hideHint: boolean
  isFirst: boolean
  onPrevious: () => void
  onNext: () => void
}) {
  const { entry, example, blanks } = item
  const [answers, setAnswers] = useState<string[]>(() => blanks.map(() => ''))
  const [isPeeking, setIsPeeking] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const states = blanks.map((blank, index) => getClozeAnswerState(answers[index], blank.text))
  const isComplete = states.every((state) => state === 'complete')
  const currentBlank = Math.max(
    states.findIndex((state) => state !== 'complete'),
    0,
  )

  const currentBlankRef = useRef(currentBlank)
  currentBlankRef.current = currentBlank

  // Focus the blank on arrival, and again after the hint toggle took focus.
  useEffect(() => {
    inputRefs.current[currentBlankRef.current]?.focus({ preventScroll: true })
  }, [hideHint])

  // Typing anywhere on the page goes into the first unfinished blank.
  useEffect(() => {
    if (isComplete) {
      return
    }

    function handleTypingStart(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !/^[\p{L}\p{N}'’-]$/u.test(event.key) ||
        (event.target instanceof HTMLElement &&
          event.target.closest(TEXT_ENTRY_SELECTOR))
      ) {
        return
      }

      event.preventDefault()
      inputRefs.current[currentBlank]?.focus({ preventScroll: true })
      setAnswers((current) =>
        current.map((answer, index) => (index === currentBlank ? answer + event.key : answer)),
      )
    }

    document.addEventListener('keydown', handleTypingStart)
    return () => document.removeEventListener('keydown', handleTypingStart)
  }, [currentBlank, isComplete])

  function updateAnswer(index: number, value: string) {
    const answer = sanitizeAnswer(value)
    const nextAnswers = answers.map((current, answerIndex) =>
      answerIndex === index ? answer : current,
    )
    setAnswers(nextAnswers)

    if (getClozeAnswerState(answer, blanks[index].text) === 'complete') {
      const nextBlank = blanks.findIndex(
        (blank, blankIndex) =>
          getClozeAnswerState(nextAnswers[blankIndex], blank.text) !== 'complete',
      )
      if (nextBlank >= 0) {
        inputRefs.current[nextBlank]?.focus({ preventScroll: true })
      }
    }
  }

  const sentence: React.ReactNode[] = []
  let cursor = 0
  blanks.forEach((blank, index) => {
    sentence.push(example.en.slice(cursor, blank.start))
    sentence.push(
      <ClozeBlank
        key={blank.start}
        answer={blank.text}
        value={answers[index]}
        state={states[index]}
        hideHint={hideHint && !isPeeking}
        ariaLabel={
          blanks.length > 1
            ? `第 ${index + 1} 个空，${blank.text.length} 个字母`
            : `填空，${blank.text.length} 个字母`
        }
        inputRef={(node) => {
          inputRefs.current[index] = node
        }}
        onChange={(value) => updateAnswer(index, value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && isComplete) {
            event.preventDefault()
            onNext()
          }
        }}
      />,
    )
    cursor = blank.end
  })
  sentence.push(example.en.slice(cursor))

  return (
    <>
      <div className="ielts-practice-stage">
        <p className="ielts-practice-sentence" lang="en">
          {sentence}
        </p>
        <p className="ielts-practice-translation">{example.zh}</p>
        {isComplete ? (
          <div className="ielts-practice-answer" role="status">
            <strong lang="en">{entry.word}</strong>
            <IeltsSenses entry={entry} />
            <small>按回车进入下一句</small>
          </div>
        ) : null}
      </div>

      <footer className="ielts-practice-footer">
        {hideHint && !isPeeking && !isComplete ? (
          <button type="button" className="is-quiet" onClick={() => {
            setIsPeeking(true)
            inputRefs.current[currentBlank]?.focus({ preventScroll: true })
          }}>
            看提示
          </button>
        ) : null}
        <span className="ielts-practice-footer-gap" />
        {isFirst ? null : (
          <button type="button" className="is-quiet" onClick={onPrevious}>
            上一句
          </button>
        )}
        <button type="button" onClick={onNext}>
          下一句
        </button>
      </footer>
    </>
  )
}

export function IeltsPractice({
  topic,
  section,
  entries,
  progress,
  next,
  onBack,
}: {
  topic: IeltsTopicSummary
  /** Index into topic.groups, or null for the whole topic. */
  section: number | null
  /** All entries of the topic, in topic order. */
  entries: IeltsEntry[]
  progress: IeltsProgress
  /** Where to go after finishing: the next section, or the next topic. */
  next: { label: string; onGo: () => void } | null
  onBack: () => void
}) {
  const { data: examples, error } = useIeltsExamples(topic.id)
  const scopeKey = section === null ? topic.id : `${topic.id}/${section}`
  const scopeTitle = section === null ? topic.title : `${topic.title} · ${topic.groups?.[section]?.title ?? ''}`
  const scopeEntries = useMemo(
    () => (section === null ? entries : entries.filter((entry) => entry.group === section)),
    [entries, section],
  )
  const [onlyLearning, setOnlyLearning] = useState(true)
  const [hideHint, setHideHint] = useState(() => readStorage(HIDE_HINT_STORAGE_KEY) === '1')
  // Mastered entries are read once (and again when the filter changes), so
  // the list does not shift while practising.
  const [masteredIds, setMasteredIds] = useState(
    () => new Set(scopeEntries.filter((entry) => progress.isMastered(entry.id)).map((entry) => entry.id)),
  )
  const [position, setPosition] = useState<string | null>(
    () => readPositions()[scopeKey] ?? null,
  )
  const [isFinished, setIsFinished] = useState(false)
  // Bumped on restart so a one-sentence round still starts with empty blanks.
  const [round, setRound] = useState(0)

  const items = useMemo(() => {
    if (!examples) {
      return []
    }

    return scopeEntries.flatMap((entry): PracticeItem[] => {
      const example = examples[entry.id]?.[0]

      if (!example || (onlyLearning && masteredIds.has(entry.id))) {
        return []
      }

      return [{ entry, example, blanks: buildBlanks(example) }]
    })
  }, [examples, scopeEntries, onlyLearning, masteredIds])

  // Resume at the saved sentence; if it is filtered out now, at the next one.
  const currentIndex = useMemo(() => {
    if (!position) {
      return 0
    }

    const exact = items.findIndex((item) => item.entry.id === position)
    if (exact >= 0) {
      return exact
    }

    const scopeOrder = new Map(scopeEntries.map((entry, index) => [entry.id, index]))
    const savedOrder = scopeOrder.get(position) ?? -1
    return Math.max(
      items.findIndex((item) => (scopeOrder.get(item.entry.id) ?? 0) >= savedOrder),
      0,
    )
  }, [items, position, scopeEntries])
  const item = items[currentIndex]

  function goTo(index: number) {
    const entryId = items[index].entry.id
    setPosition(entryId)
    savePosition(scopeKey, entryId)
    window.scrollTo({ top: 0 })
  }

  function goNext() {
    if (currentIndex + 1 < items.length) {
      goTo(currentIndex + 1)
      return
    }

    setIsFinished(true)
    setPosition(null)
    savePosition(scopeKey, null)
  }

  function restart() {
    setIsFinished(false)
    setPosition(null)
    setRound((value) => value + 1)
  }

  function toggleOnlyLearning() {
    setMasteredIds(
      new Set(scopeEntries.filter((entry) => progress.isMastered(entry.id)).map((entry) => entry.id)),
    )
    setOnlyLearning((value) => !value)
  }

  function toggleHideHint(value: boolean) {
    setHideHint(value)
    writeStorage(HIDE_HINT_STORAGE_KEY, value ? '1' : '0')
  }

  let body: React.ReactNode
  if (error || !examples) {
    body = (
      <p className="ielts-status" role="status">
        {error || '正在加载例句…'}
      </p>
    )
  } else if (isFinished) {
    body = (
      <div className="ielts-practice-done" role="status">
        <strong>练完了</strong>
        <p>这一轮共 {items.length} 句。</p>
        <div>
          <button type="button" className="is-quiet" onClick={restart}>
            重新练
          </button>
          <button type="button" className="is-quiet" onClick={onBack}>
            返回话题
          </button>
          {next ? (
            <button type="button" onClick={next.onGo}>
              {next.label}
            </button>
          ) : null}
        </div>
      </div>
    )
  } else if (!item) {
    body = (
      <div className="ielts-practice-done" role="status">
        {onlyLearning && scopeEntries.length > 0 ? (
          <>
            <strong>这部分的词都已掌握</strong>
            <div>
              <button type="button" onClick={toggleOnlyLearning}>
                练习全部 {scopeEntries.length} 个词
              </button>
            </div>
          </>
        ) : (
          <p>没有可练习的例句。</p>
        )}
      </div>
    )
  } else {
    body = (
      <PracticeExercise
        key={`${round}-${item.entry.id}`}
        item={item}
        hideHint={hideHint}
        isFirst={currentIndex === 0}
        onPrevious={() => goTo(currentIndex - 1)}
        onNext={goNext}
      />
    )
  }

  return (
    <>
      <header className="ielts-section-head">
        <div>
          <span className="ielts-module-en">例句填空</span>
          <h1>{scopeTitle}</h1>
        </div>
      </header>

      <section className="ielts-panel ielts-practice">
        <div className="ielts-practice-bar">
          <button
            type="button"
            className={`ielts-practice-chip${onlyLearning ? ' active' : ''}`}
            aria-pressed={onlyLearning}
            onClick={toggleOnlyLearning}
          >
            只练未掌握
          </button>
          <label className="ielts-practice-toggle">
            <input
              type="checkbox"
              checked={hideHint}
              onChange={(event) => toggleHideHint(event.target.checked)}
            />
            隐藏提示
          </label>
          {item && !isFinished ? (
            <span className="ielts-practice-count">
              第 {currentIndex + 1} / {items.length} 句
            </span>
          ) : null}
        </div>
        {body}
      </section>
    </>
  )
}
