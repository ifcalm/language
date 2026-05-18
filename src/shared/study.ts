export type GoalId = 'balanced' | 'conversation' | 'career' | 'exam'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface StudyProfile {
  name: string
  goal: GoalId
  level: Difficulty
  minutesPerDay: number
}

export interface DailyLog {
  completedTaskIds: string[]
  reflection: string
  minutesLogged: number
}

export interface VocabularyItem {
  id: string
  word: string
  meaning: string
  example: string
  createdAt: string
}

export interface AppState {
  profile: StudyProfile
  logs: Record<string, DailyLog>
  vocabulary: VocabularyItem[]
}

export const defaultState: AppState = {
  profile: {
    name: 'Learner',
    goal: 'balanced',
    level: 'intermediate',
    minutesPerDay: 40,
  },
  logs: {},
  vocabulary: [],
}

const goalIds = new Set<GoalId>(['balanced', 'conversation', 'career', 'exam'])
const difficultyIds = new Set<Difficulty>(['beginner', 'intermediate', 'advanced'])

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function clampMinutes(value: number) {
  return Math.max(20, Math.min(120, Math.round(value)))
}

function normalizeProfile(value: unknown): StudyProfile | null {
  if (!isObject(value)) {
    return null
  }

  const { name, goal, level, minutesPerDay } = value
  if (
    typeof name !== 'string' ||
    typeof goal !== 'string' ||
    typeof level !== 'string' ||
    typeof minutesPerDay !== 'number' ||
    !goalIds.has(goal as GoalId) ||
    !difficultyIds.has(level as Difficulty)
  ) {
    return null
  }

  return {
    name: name.trim().slice(0, 80) || defaultState.profile.name,
    goal: goal as GoalId,
    level: level as Difficulty,
    minutesPerDay: clampMinutes(minutesPerDay),
  }
}

function normalizeDailyLog(value: unknown): DailyLog | null {
  if (!isObject(value)) {
    return null
  }

  const { completedTaskIds, reflection, minutesLogged } = value
  if (
    !Array.isArray(completedTaskIds) ||
    !completedTaskIds.every((taskId) => typeof taskId === 'string') ||
    typeof reflection !== 'string' ||
    typeof minutesLogged !== 'number'
  ) {
    return null
  }

  return {
    completedTaskIds: completedTaskIds.slice(0, 16),
    reflection: reflection.slice(0, 1200),
    minutesLogged: Math.max(0, Math.round(minutesLogged)),
  }
}

function normalizeVocabularyItem(value: unknown): VocabularyItem | null {
  if (!isObject(value)) {
    return null
  }

  const { id, word, meaning, example, createdAt } = value
  if (
    typeof id !== 'string' ||
    typeof word !== 'string' ||
    typeof meaning !== 'string' ||
    typeof example !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null
  }

  const normalizedWord = word.trim().slice(0, 160)
  const normalizedMeaning = meaning.trim().slice(0, 320)
  if (!normalizedWord || !normalizedMeaning) {
    return null
  }

  return {
    id: id.trim().slice(0, 120),
    word: normalizedWord,
    meaning: normalizedMeaning,
    example: example.trim().slice(0, 800),
    createdAt: createdAt.trim().slice(0, 32),
  }
}

export function normalizeAppState(value: unknown): AppState | null {
  if (!isObject(value)) {
    return null
  }

  const profile = normalizeProfile(value.profile)
  if (!profile || !isObject(value.logs) || !Array.isArray(value.vocabulary)) {
    return null
  }

  const logs: Record<string, DailyLog> = {}
  for (const [dateKey, dailyLog] of Object.entries(value.logs)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return null
    }

    const normalizedLog = normalizeDailyLog(dailyLog)
    if (!normalizedLog) {
      return null
    }

    logs[dateKey] = normalizedLog
  }

  const vocabulary = value.vocabulary
    .map((item) => normalizeVocabularyItem(item))
    .filter((item): item is VocabularyItem => item !== null)
    .slice(0, 500)

  return {
    profile,
    logs,
    vocabulary,
  }
}
