import { readFileSync } from 'node:fs'

export const IELTS_SOURCE_PATH = 'docs/ielts-vocabulary.md'

export const IELTS_MODULES = [
  {
    id: 'listening',
    heading: '一、听力',
    name: '听力',
    nameEn: 'Listening',
    description: '租房、旅游、选课等生活与校园场景',
  },
  {
    id: 'reading',
    heading: '二、阅读',
    name: '阅读',
    nameEn: 'Reading',
    description: '学术核心词与学术阅读学科话题',
  },
  {
    id: 'writing',
    heading: '三、写作',
    name: '写作',
    nameEn: 'Writing',
    description: '小作文图表、固定搭配与大作文话题',
  },
  {
    id: 'speaking',
    heading: '四、口语',
    name: '口语',
    nameEn: 'Speaking',
    description: '人物、物品、地点、感受与兴趣',
  },
]

const ENTRY_PATTERN = /^- \*\*(.+?)\*\* (.+)$/
const POS_PATTERN = /(?:^|(?<=[\s;]))((?:n|v|adj|adv|prep|conj|pron|phr)\.(?:\/(?:n|v|adj|adv)\.)?)\s*/g

export function normalizeWord(word) {
  return word.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Entry ids: lowercase, accents and apostrophes removed, everything else
// that is not a letter or digit becomes "-" (security deposit ->
// security-deposit). Ids are assigned once and stored in D1; when two words
// would get the same id, the later one is named by hand here.
export const ID_OVERRIDES = {
  'résumé': 'resume-cv',
}

export function slugifyWord(word) {
  const normalized = normalizeWord(word)

  if (ID_OVERRIDES[normalized]) {
    return ID_OVERRIDES[normalized]
  }

  return normalized
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// "n. 存款;定金 v. 存入" -> [{ pos: 'n.', meaning: '存款;定金' }, { pos: 'v.', meaning: '存入' }]
export function parseSenses(text) {
  const markers = [...text.matchAll(POS_PATTERN)]

  if (markers.length === 0 || markers[0].index !== 0) {
    throw new Error(`Entry meaning must start with a part of speech: "${text}"`)
  }

  const parts = markers.map((marker) => marker[1])

  if (new Set(parts).size !== parts.length) {
    throw new Error(`Repeated part of speech in "${text}"; merge its meanings into one segment`)
  }

  return markers.map((marker, index) => {
    const start = marker.index + marker[0].length
    const end = markers[index + 1]?.index ?? text.length
    const meaning = text.slice(start, end).trim().replace(/;$/, '')

    if (!meaning) {
      throw new Error(`Empty meaning after "${marker[1]}" in "${text}"`)
    }

    return { pos: marker[1], meaning }
  })
}

export function readIeltsSource(path = IELTS_SOURCE_PATH) {
  const lines = readFileSync(path, 'utf8').split('\n')
  const modules = IELTS_MODULES.map((module) => ({ ...module, topics: [] }))
  let module = null
  let topic = null

  for (const line of lines) {
    if (line.startsWith('# ')) {
      module = modules.find((item) => line === `# ${item.heading}`) ?? null
      topic = null
      continue
    }

    const topicMatch = line.match(/^## (\d+)\.(\d+) (.+)$/)

    if (topicMatch && module) {
      const order = Number(topicMatch[2])
      topic = {
        id: `${module.id}-${String(order).padStart(2, '0')}`,
        order,
        title: topicMatch[3].trim(),
        groups: [],
        entries: [],
      }
      module.topics.push(topic)
      continue
    }

    // Optional "### 小节" headings split a merged topic into sub-groups.
    const groupMatch = line.match(/^### (.+)$/)

    if (groupMatch && topic) {
      topic.groups.push({ title: groupMatch[1].trim(), entryCount: 0 })
      continue
    }

    const entryMatch = line.match(ENTRY_PATTERN)

    if (entryMatch && topic) {
      const word = entryMatch[1].trim()
      const group = topic.groups.length > 0 ? topic.groups.length - 1 : undefined

      if (group !== undefined) {
        topic.groups[group].entryCount += 1
      }

      topic.entries.push({
        word,
        group,
        senses: parseSenses(entryMatch[2].trim()),
      })
    }
  }

  const seen = new Map()

  for (const item of modules) {
    if (item.topics.length === 0) {
      throw new Error(`Module "${item.heading}" has no topics in ${path}`)
    }

    for (const { title, entries } of item.topics) {
      for (const entry of entries) {
        const id = slugifyWord(entry.word)

        if (seen.has(id)) {
          throw new Error(
            `Duplicate entry id "${id}": "${entry.word}" (${title}) and "${seen.get(id)}"`,
          )
        }

        seen.set(id, `${entry.word} (${title})`)
        entry.id = id
      }
    }
  }

  return modules
}
