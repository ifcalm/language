import { useEffect, useMemo, useRef, useState } from 'react'
import type { CoreVocabularyEntry, VocabularyExample } from '../../data/vocabulary'
import {
  mapApiVocabularyItem,
  requestVocabularyList,
} from '../vocabulary/api'
import './sentence-practice.css'

const PRACTICE_PAGE_SIZE = 500
const RECENT_SECONDARY_WINDOW = 50
const PREFERRED_SECONDARY_REPEAT_LIMIT = 3
const PROGRESS_STORAGE_KEY = 'english-orbit:sentence-practice-progress-v2'
const WORD_PATTERN = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g

async function requestPracticePage(
  offset: number,
  signal: AbortSignal,
) {
  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await requestVocabularyList(
        { query: '', offset, limit: PRACTICE_PAGE_SIZE },
        signal,
      )
    } catch (error) {
      lastError = error
      if (signal.aborted) {
        throw error
      }
      await new Promise((resolve) => window.setTimeout(resolve, 300 * (attempt + 1)))
    }
  }

  throw lastError
}

const SECOND_TARGET_STOP_WORDS = new Set([
  'a',
  'about',
  'after',
  'again',
  'also',
  'am',
  'an',
  'are',
  'as',
  'be',
  'because',
  'been',
  'before',
  'being',
  'between',
  'can',
  'could',
  'did',
  'do',
  'does',
  'every',
  'for',
  'from',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'its',
  'into',
  'is',
  'it',
  'just',
  'like',
  'may',
  'me',
  'might',
  'mine',
  'more',
  'must',
  'my',
  'of',
  'our',
  'ours',
  'other',
  'shall',
  'she',
  'should',
  'some',
  'than',
  'that',
  'the',
  'them',
  'their',
  'theirs',
  'there',
  'these',
  'they',
  'this',
  'those',
  'to',
  'through',
  'under',
  'us',
  'very',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'who',
  'whom',
  'whose',
  'while',
  'will',
  'with',
  'would',
  'you',
  'your',
  'yours',
])

interface SentenceWord {
  text: string
  start: number
  end: number
}

interface PracticeTarget extends SentenceWord {
  id: string
}

interface SentenceExercise {
  id: string
  vocabularyWord: string
  sentenceEn: string
  sentenceZh: string
  targets: [PracticeTarget, PracticeTarget]
}

interface ExerciseDraft {
  id: string
  vocabularyWord: string
  sentenceEn: string
  sentenceZh: string
  primary: SentenceWord
  secondaryCandidates: SentenceWord[]
}

const IRREGULAR_FORMS: Record<string, string[]> = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  become: ['became', 'become', 'becomes', 'becoming'],
  begin: ['began', 'begun', 'begins', 'beginning'],
  bring: ['brought', 'brings', 'bringing'],
  come: ['came', 'comes', 'coming'],
  do: ['does', 'did', 'done', 'doing'],
  dub: ['dubs', 'dubbed', 'dubbing'],
  embed: ['embeds', 'embedded', 'embedding'],
  equip: ['equips', 'equipped', 'equipping'],
  feel: ['felt', 'feels', 'feeling'],
  find: ['found', 'finds', 'finding'],
  get: ['got', 'gotten', 'gets', 'getting'],
  give: ['gave', 'given', 'gives', 'giving'],
  go: ['went', 'gone', 'goes', 'going'],
  have: ['has', 'had', 'having'],
  hear: ['heard', 'hears', 'hearing'],
  hold: ['held', 'holds', 'holding'],
  keep: ['kept', 'keeps', 'keeping'],
  know: ['knew', 'known', 'knows', 'knowing'],
  leave: ['left', 'leaves', 'leaving'],
  make: ['made', 'makes', 'making'],
  put: ['put', 'puts', 'putting'],
  say: ['said', 'says', 'saying'],
  see: ['saw', 'seen', 'sees', 'seeing'],
  stand: ['stood', 'stands', 'standing'],
  take: ['took', 'taken', 'takes', 'taking'],
  tell: ['told', 'tells', 'telling'],
  think: ['thought', 'thinks', 'thinking'],
  kidnap: ['kidnaps', 'kidnapped', 'kidnapping'],
  stun: ['stuns', 'stunned', 'stunning'],
  trim: ['trims', 'trimmed', 'trimming'],
  write: ['wrote', 'written', 'writes', 'writing'],
}

function normalizeWord(value: string) {
  return value.trim().toLowerCase().replace('’', "'")
}

function getTargetWordForms(vocabularyWord: string) {
  const word = normalizeWord(vocabularyWord)

  if (!word || !/^[a-z]+$/.test(word)) {
    return new Set([word])
  }

  const forms = new Set([
    word,
    `${word}s`,
    `${word}es`,
    `${word}ed`,
    `${word}d`,
    `${word}ing`,
  ])

  if (word.endsWith('y') && word.length > 1) {
    forms.add(`${word.slice(0, -1)}ies`)
    forms.add(`${word.slice(0, -1)}ied`)
  }

  if (word.endsWith('e')) {
    forms.add(`${word.slice(0, -1)}ing`)
  }

  const irregularForms = Object.hasOwn(IRREGULAR_FORMS, word)
    ? IRREGULAR_FORMS[word]
    : []
  for (const irregularForm of irregularForms) {
    forms.add(irregularForm)
  }

  return forms
}

function isTargetWordForm(candidate: string, vocabularyWord: string) {
  return getTargetWordForms(vocabularyWord).has(normalizeWord(candidate))
}

function getSentenceWords(sentence: string): SentenceWord[] {
  return Array.from(sentence.matchAll(WORD_PATTERN), (match) => ({
    text: match[0],
    start: match.index,
    end: match.index + match[0].length,
  }))
}

function buildExerciseDraft(
  item: CoreVocabularyEntry,
  example: VocabularyExample,
): ExerciseDraft | null {
  const words = getSentenceWords(example.sentenceEn)

  const primaryIndex = words.findIndex((word) =>
    isTargetWordForm(word.text, item.word),
  )

  if (primaryIndex < 0) {
    return null
  }

  const secondaryCandidates = words
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => {
      const normalized = normalizeWord(word.text)
      return (
        index !== primaryIndex &&
        normalized.length >= 3 &&
        !SECOND_TARGET_STOP_WORDS.has(normalized)
      )
    })
    .map(({ word }) => word)

  if (secondaryCandidates.length === 0) {
    return null
  }

  return {
    id: `${item.id}-${example.id}`,
    vocabularyWord: item.word,
    sentenceEn: example.sentenceEn,
    sentenceZh: example.sentenceZh,
    primary: words[primaryIndex],
    secondaryCandidates,
  }
}

function buildExercises(items: CoreVocabularyEntry[]) {
  const frequencyByWord = new Map(
    items.map((item) => [normalizeWord(item.word), item.frequencyRank ?? 999_999]),
  )
  const practicedWords = new Set<string>()
  const secondaryUseCounts = new Map<string, number>()
  const recentSecondaryWords: string[] = []
  const exercises: SentenceExercise[] = []

  for (const item of items) {
    let draft: ExerciseDraft | null = null

    for (const example of item.examples ?? []) {
      draft = buildExerciseDraft(item, example)

      if (draft) {
        break
      }
    }

    if (!draft) {
      continue
    }

    const recentWords = new Set(recentSecondaryWords)
    const rankedCandidates = [...draft.secondaryCandidates].sort((left, right) => {
      const leftWord = normalizeWord(left.text)
      const rightWord = normalizeWord(right.text)
      const leftRecent = recentWords.has(leftWord) ? 1 : 0
      const rightRecent = recentWords.has(rightWord) ? 1 : 0
      const leftPracticed = practicedWords.has(leftWord) ? 1 : 0
      const rightPracticed = practicedWords.has(rightWord) ? 1 : 0
      const leftUseCount = secondaryUseCounts.get(leftWord) ?? 0
      const rightUseCount = secondaryUseCounts.get(rightWord) ?? 0
      const leftAtRepeatLimit =
        leftUseCount >= PREFERRED_SECONDARY_REPEAT_LIMIT ? 1 : 0
      const rightAtRepeatLimit =
        rightUseCount >= PREFERRED_SECONDARY_REPEAT_LIMIT ? 1 : 0

      return (
        leftRecent - rightRecent ||
        leftPracticed - rightPracticed ||
        leftAtRepeatLimit - rightAtRepeatLimit ||
        leftUseCount - rightUseCount ||
        (frequencyByWord.get(leftWord) ?? 999_999) -
          (frequencyByWord.get(rightWord) ?? 999_999) ||
        left.start - right.start
      )
    })
    const secondary = rankedCandidates[0]
    const targets = [draft.primary, secondary]
      .sort((left, right) => left.start - right.start)
      .map((word, index) => ({
        ...word,
        id: `${draft.id}-${index}`,
      })) as [PracticeTarget, PracticeTarget]

    exercises.push({
      id: draft.id,
      vocabularyWord: draft.vocabularyWord,
      sentenceEn: draft.sentenceEn,
      sentenceZh: draft.sentenceZh,
      targets,
    })

    practicedWords.add(normalizeWord(draft.primary.text))
    const normalizedSecondary = normalizeWord(secondary.text)
    practicedWords.add(normalizedSecondary)
    secondaryUseCounts.set(
      normalizedSecondary,
      (secondaryUseCounts.get(normalizedSecondary) ?? 0) + 1,
    )
    recentSecondaryWords.push(normalizedSecondary)
    if (recentSecondaryWords.length > RECENT_SECONDARY_WINDOW) {
      recentSecondaryWords.shift()
    }
  }

  return exercises
}

function getAnswerState(answer: string, expected: string) {
  if (!answer) {
    return 'empty'
  }

  const normalizedAnswer = normalizeWord(answer)
  const normalizedExpected = normalizeWord(expected)

  if (normalizedAnswer === normalizedExpected) {
    return 'complete'
  }

  return normalizedExpected.startsWith(normalizedAnswer) ? 'correct' : 'error'
}

function SentencePracticePage() {
  const [vocabulary, setVocabulary] = useState<CoreVocabularyEntry[]>([])
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [answers, setAnswers] = useState(['', ''])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadedCount, setLoadedCount] = useState(0)
  const [availableCount, setAvailableCount] = useState(0)
  const [jumpMessage, setJumpMessage] = useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const questionNumberInputRef = useRef<HTMLInputElement | null>(null)
  const pendingQuestionIndexRef = useRef<number | null>(null)
  const savedProgressRestoredRef = useRef(false)

  const exercises = useMemo(() => buildExercises(vocabulary), [vocabulary])
  const exercise = exercises[exerciseIndex] ?? null
  const answerStates = exercise
    ? exercise.targets.map((target, index) =>
        getAnswerState(answers[index], target.text),
      )
    : []
  const isComplete = answerStates.every((state) => state === 'complete')
  const displayedExerciseCount = availableCount || exercises.length

  useEffect(() => {
    const controller = new AbortController()

    async function loadPracticeSentences() {
      setIsLoading(true)
      setLoadError('')
      let hasLoadedInitialPage = false

      try {
        const firstPage = await requestPracticePage(0, controller.signal)
        const allItems = [...firstPage.items]
        setAvailableCount(firstPage.pagination.total)
        setLoadedCount(allItems.length)
        hasLoadedInitialPage = true

        const savedExerciseId = (() => {
          try {
            return window.localStorage.getItem(PROGRESS_STORAGE_KEY)
          } catch {
            return null
          }
        })()

        function publishLoadedItems() {
          const mappedVocabulary = allItems.map(mapApiVocabularyItem)
          const preparedExercises = buildExercises(mappedVocabulary)
          const pendingQuestionIndex = pendingQuestionIndexRef.current
          if (
            pendingQuestionIndex !== null &&
            pendingQuestionIndex < preparedExercises.length
          ) {
            setExerciseIndex(pendingQuestionIndex)
            setAnswers(['', ''])
            pendingQuestionIndexRef.current = null
            savedProgressRestoredRef.current = true
            setJumpMessage('')
            try {
              window.localStorage.setItem(
                PROGRESS_STORAGE_KEY,
                preparedExercises[pendingQuestionIndex].id,
              )
            } catch {
              // Progress remains usable for the current session.
            }
          } else if (savedExerciseId && !savedProgressRestoredRef.current) {
            const savedIndex = preparedExercises.findIndex(
              (candidate) => candidate.id === savedExerciseId,
            )
            if (savedIndex >= 0) {
              setExerciseIndex(savedIndex)
              savedProgressRestoredRef.current = true
            }
          }
          setVocabulary(mappedVocabulary)
        }

        publishLoadedItems()
        setIsLoading(false)

        const remainingOffsets: number[] = []
        for (
          let offset = PRACTICE_PAGE_SIZE;
          offset < firstPage.pagination.total;
          offset += PRACTICE_PAGE_SIZE
        ) {
          remainingOffsets.push(offset)
        }

        for (let index = 0; index < remainingOffsets.length; index += 2) {
          const offsetBatch = remainingOffsets.slice(index, index + 2)
          const pageBatch = await Promise.all(
            offsetBatch.map((offset) =>
              requestPracticePage(offset, controller.signal),
            ),
          )
          for (const page of pageBatch) {
            allItems.push(...page.items)
          }
          setLoadedCount(allItems.length)
          publishLoadedItems()
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (pendingQuestionIndexRef.current !== null) {
            setJumpMessage('目标题目暂时未加载，请刷新后重试。')
          }
          setLoadError(
            hasLoadedInitialPage
              ? '部分例句暂时无法读取，请刷新后继续加载。'
              : error instanceof Error
                ? error.message
                : '例句暂时无法读取',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadPracticeSentences()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (exercise) {
      inputRefs.current[0]?.focus()
    }
  }, [exercise])

  function showExerciseAtOffset(offset: number) {
    if (exercises.length === 0) {
      return
    }

    const nextIndex =
      (exerciseIndex + offset + exercises.length) % exercises.length
    pendingQuestionIndexRef.current = null
    savedProgressRestoredRef.current = true
    setJumpMessage('')
    setExerciseIndex(nextIndex)
    setAnswers(['', ''])
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        exercises[nextIndex].id,
      )
    } catch {
      // Progress remains usable for the current session without persistence.
    }
  }

  function jumpToQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const requestedQuestion = Number(questionNumberInputRef.current?.value)

    if (
      !Number.isInteger(requestedQuestion) ||
      requestedQuestion < 1 ||
      requestedQuestion > displayedExerciseCount
    ) {
      setJumpMessage(`请输入 1–${displayedExerciseCount} 之间的题号。`)
      questionNumberInputRef.current?.focus()
      return
    }

    const requestedIndex = requestedQuestion - 1
    if (requestedIndex >= exercises.length) {
      pendingQuestionIndexRef.current = requestedIndex
      savedProgressRestoredRef.current = true
      setJumpMessage(`正在加载第 ${requestedQuestion} 题…`)
      return
    }

    pendingQuestionIndexRef.current = null
    savedProgressRestoredRef.current = true
    setJumpMessage('')
    setExerciseIndex(requestedIndex)
    setAnswers(['', ''])
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        exercises[requestedIndex].id,
      )
    } catch {
      // Progress remains usable for the current session without persistence.
    }
  }

  function updateAnswer(index: number, value: string) {
    if (!exercise) {
      return
    }

    const nextAnswers = [...answers]
    nextAnswers[index] = value.replace(/[^A-Za-z'’-]/g, '')
    setAnswers(nextAnswers)

    if (
      getAnswerState(nextAnswers[index], exercise.targets[index].text) ===
        'complete' &&
      index < exercise.targets.length - 1
    ) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function renderSentence() {
    if (!exercise) {
      return null
    }

    const parts: React.ReactNode[] = []
    let cursor = 0

    exercise.targets.forEach((target, index) => {
      parts.push(exercise.sentenceEn.slice(cursor, target.start))
      parts.push(
        <input
          key={target.id}
          ref={(node) => {
            inputRefs.current[index] = node
          }}
          className={`sentence-practice-input is-${answerStates[index]}`}
          style={{ width: `${Math.max(target.text.length + 1, 5)}ch` }}
          value={answers[index]}
          placeholder={target.text}
          aria-label={`第 ${index + 1} 个单词，${target.text.length} 个字母`}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => updateAnswer(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && isComplete) {
              showExerciseAtOffset(1)
            }
          }}
        />,
      )
      cursor = target.end
    })

    parts.push(exercise.sentenceEn.slice(cursor))
    return parts
  }

  if (isLoading) {
    return (
      <section className="panel sentence-practice-message">
        正在准备例句…
        {availableCount > 0 ? `（${loadedCount} / ${availableCount}）` : ''}
      </section>
    )
  }

  if (!exercise) {
    return (
      <section className="panel sentence-practice-message" role="status">
        {loadError || '暂时没有可练习的例句。'}
      </section>
    )
  }

  return (
    <section className="panel sentence-practice-card">
      <header className="sentence-practice-progress">
        <form className="sentence-practice-jump" onSubmit={jumpToQuestion}>
          <label>
            第
            <input
              key={exerciseIndex}
              ref={questionNumberInputRef}
              type="number"
              min="1"
              max={displayedExerciseCount}
              defaultValue={exerciseIndex + 1}
              inputMode="numeric"
              aria-label="跳转题号"
            />
            / {displayedExerciseCount} 题
          </label>
          <button type="submit">跳转</button>
        </form>
        {jumpMessage ? (
          <span className="sentence-practice-jump-message" role="status">
            {jumpMessage}
          </span>
        ) : null}
      </header>

      <div className="sentence-practice-stage">
        <p className="sentence-practice-sentence">{renderSentence()}</p>
        {exercise.sentenceZh ? (
          <p className="sentence-practice-translation">{exercise.sentenceZh}</p>
        ) : null}
      </div>

      <footer className="sentence-practice-footer">
        <button
          type="button"
          className="is-previous"
          onClick={() => showExerciseAtOffset(-1)}
        >
          上一句
        </button>
        <button type="button" onClick={() => showExerciseAtOffset(1)}>
          下一句
        </button>
      </footer>
    </section>
  )
}

export default SentencePracticePage
