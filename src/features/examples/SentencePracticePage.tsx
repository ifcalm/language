import { useEffect, useMemo, useRef, useState } from 'react'
import type { CoreVocabularyEntry, VocabularyExample } from '../../data/vocabulary'
import {
  mapApiVocabularyItem,
  requestVocabularyList,
} from '../vocabulary/api'
import './sentence-practice.css'

const PRACTICE_VOCABULARY_LIMIT = 240
const SIMPLE_SENTENCE_MIN_WORDS = 5
const SIMPLE_SENTENCE_MAX_WORDS = 12
const WORD_PATTERN = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g

const SECOND_TARGET_STOP_WORDS = new Set([
  'about',
  'after',
  'again',
  'also',
  'because',
  'before',
  'being',
  'between',
  'could',
  'every',
  'from',
  'have',
  'into',
  'just',
  'more',
  'other',
  'should',
  'some',
  'than',
  'that',
  'their',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'under',
  'very',
  'what',
  'when',
  'where',
  'which',
  'while',
  'with',
  'would',
  'your',
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
  sentenceEn: string
  sentenceZh: string
  targets: [PracticeTarget, PracticeTarget]
}

function normalizeWord(value: string) {
  return value.trim().toLowerCase().replace('’', "'")
}

function isTargetWordForm(candidate: string, vocabularyWord: string) {
  const word = normalizeWord(vocabularyWord)
  const token = normalizeWord(candidate)

  if (!word || !/^[a-z]+$/.test(word)) {
    return token === word
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

  return forms.has(token)
}

function getSentenceWords(sentence: string): SentenceWord[] {
  return Array.from(sentence.matchAll(WORD_PATTERN), (match) => ({
    text: match[0],
    start: match.index,
    end: match.index + match[0].length,
  }))
}

function buildExercise(
  item: CoreVocabularyEntry,
  example: VocabularyExample,
): SentenceExercise | null {
  const normalizedVocabularyWord = normalizeWord(item.word)

  if (
    normalizedVocabularyWord.length < 4 ||
    SECOND_TARGET_STOP_WORDS.has(normalizedVocabularyWord)
  ) {
    return null
  }

  const words = getSentenceWords(example.sentenceEn)

  if (
    words.length < SIMPLE_SENTENCE_MIN_WORDS ||
    words.length > SIMPLE_SENTENCE_MAX_WORDS ||
    /[;:]/.test(example.sentenceEn)
  ) {
    return null
  }

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
        normalized.length >= 4 &&
        !SECOND_TARGET_STOP_WORDS.has(normalized)
      )
    })
    .sort((left, right) => {
      const leftDistance = Math.abs(left.index - primaryIndex)
      const rightDistance = Math.abs(right.index - primaryIndex)
      return leftDistance - rightDistance || left.index - right.index
    })

  const secondary = secondaryCandidates[0]?.word

  if (!secondary) {
    return null
  }

  const primary = words[primaryIndex]
  const targets = [primary, secondary]
    .sort((left, right) => left.start - right.start)
    .map((word, index) => ({
      ...word,
      id: `${example.id}-${index}`,
    })) as [PracticeTarget, PracticeTarget]

  return {
    id: `${item.id}-${example.id}`,
    sentenceEn: example.sentenceEn,
    sentenceZh: example.sentenceZh,
    targets,
  }
}

function buildExercises(items: CoreVocabularyEntry[]) {
  const exercises: SentenceExercise[] = []

  for (const item of items) {
    for (const example of item.examples ?? []) {
      const exercise = buildExercise(item, example)

      if (exercise) {
        exercises.push(exercise)
        break
      }
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
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const exercises = useMemo(() => buildExercises(vocabulary), [vocabulary])
  const exercise = exercises[exerciseIndex] ?? null
  const answerStates = exercise
    ? exercise.targets.map((target, index) =>
        getAnswerState(answers[index], target.text),
      )
    : []
  const isComplete = answerStates.every((state) => state === 'complete')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPracticeSentences() {
      setIsLoading(true)
      setLoadError('')

      try {
        const payload = await requestVocabularyList(
          { query: '', offset: 0, limit: PRACTICE_VOCABULARY_LIMIT },
          controller.signal,
        )
        setVocabulary(payload.items.map(mapApiVocabularyItem))
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : '例句暂时无法读取',
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

  function showNextExercise() {
    if (exercises.length === 0) {
      return
    }

    setExerciseIndex((index) => (index + 1) % exercises.length)
    setAnswers(['', ''])
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
              showNextExercise()
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
    return <section className="panel sentence-practice-message">正在准备例句…</section>
  }

  if (loadError || !exercise) {
    return (
      <section className="panel sentence-practice-message" role="status">
        {loadError ? '例句暂时无法读取，请稍后再试。' : '暂时没有可练习的例句。'}
      </section>
    )
  }

  return (
    <section className="panel sentence-practice-card">
      <div className="sentence-practice-intro">
        <span>Sentence Practice</span>
        <h2>补全句子中的两个单词</h2>
        <p>灰色单词是提示。直接输入，拼写正确会变绿，错误会变红。</p>
      </div>

      <div className="sentence-practice-stage">
        <p className="sentence-practice-sentence">{renderSentence()}</p>
        {exercise.sentenceZh ? (
          <p className="sentence-practice-translation">{exercise.sentenceZh}</p>
        ) : null}
      </div>

      <footer className="sentence-practice-footer">
        <span className={isComplete ? 'is-complete' : ''} role="status">
          {isComplete ? '很好，两个单词都正确。' : '按句子顺序输入两个单词'}
        </span>
        <button type="button" onClick={showNextExercise}>
          换一句
        </button>
      </footer>
    </section>
  )
}

export default SentencePracticePage
