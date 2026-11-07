// Checks shared by the IELTS example scripts, plus the layout of the example
// source files under docs/ielts-review/examples/.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const MIN_WORDS = 8
const MAX_WORDS = 20
export const MAX_PER_ENTRY = 3

export const EXAMPLES_DIR = 'docs/ielts-review/examples/'
// Review tables, in the order their rows follow the source files.
const REVIEW_TABLES = ['listening', 'reading-academic', 'reading-science', 'reading-society', 'speaking', 'writing']

export const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function exampleProblems(en, zh, target) {
  const problems = []
  const length = en.trim().split(/\s+/).length
  if (length < MIN_WORDS || length > MAX_WORDS) problems.push(`${length} words: ${en}`)
  if (!/[.?!]["”’]?$/.test(en)) problems.push(`no final punctuation: ${en}`)
  if (!zh?.trim()) problems.push(`no translation: ${en}`)
  else if (!/[。?!”]$/.test(zh)) problems.push(`no final punctuation: ${zh}`)

  const hits = en.match(new RegExp(`(?<![\\w-])${escapeRegExp(target)}(?![\\w-])`, 'g')) ?? []
  if (hits.length !== 1) problems.push(`target "${target}" found ${hits.length} times: ${en}`)
  return problems
}

// Rewrites the source files and the sentence columns of the review tables so
// they hold `sentenceOf(id)` for every example. Example ids follow the order
// of the source files, as when the sentences were first inserted.
export function writeExampleSources(sentenceOf) {
  const files = readdirSync(EXAMPLES_DIR).filter((name) => name.endsWith('.json')).sort()
  const countByWord = new Map()
  const ordered = []

  for (const name of files) {
    const rows = JSON.parse(readFileSync(EXAMPLES_DIR + name, 'utf8')).map(([wordId]) => {
      const n = (countByWord.get(wordId) ?? 0) + 1
      countByWord.set(wordId, n)
      const { en, zh, target } = sentenceOf(`${wordId}-${n}`)
      ordered.push({ en, zh, target })
      return [wordId, en, zh, target]
    })
    writeFileSync(EXAMPLES_DIR + name, `[\n${rows.map((row) => JSON.stringify(row)).join(',\n')}\n]\n`)
  }

  const cell = (text) => text.replaceAll('|', '\\|')
  let next = 0
  for (const table of REVIEW_TABLES) {
    const path = `${EXAMPLES_DIR}${table}.md`
    const lines = readFileSync(path, 'utf8').split('\n').map((line) => {
      if (!line.startsWith('| ') || line.startsWith('| 词条')) return line
      const [word, meaning] = line.slice(2).split(' | ')
      const row = ordered[next++]
      return `| ${word} | ${meaning} | ${cell(row.en.replace(row.target, `**${row.target}**`))} | ${cell(row.zh)} |`
    })
    writeFileSync(path, lines.join('\n'))
  }
  if (next !== ordered.length) throw new Error(`review tables hold ${next} rows, source files ${ordered.length}`)
}
