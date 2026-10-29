// Topic arrangement for the IELTS vocabulary: src/data/ielts/topics.json lists
// modules, topics, optional sub-groups and the word ids in display order.
// It holds no word data (that lives in D1), so regrouping words is a plain
// file edit. docs/ielts-vocabulary.md is rendered from D1 + this file.
import { readFileSync } from 'node:fs'

export const IELTS_TOPICS_PATH = 'src/data/ielts/topics.json'
export const IELTS_MARKDOWN_PATH = 'docs/ielts-vocabulary.md'

const MODULE_IDS = ['listening', 'reading', 'writing', 'speaking']
const MODULE_NUMERALS = ['一', '二', '三', '四']

// Returns modules with topics shaped like the generated catalog:
// { id, order, title, groups?: [{ title, entryCount }], entries: [{ id, group? }] }.
export function readIeltsTopics(path = IELTS_TOPICS_PATH) {
  const { modules } = JSON.parse(readFileSync(path, 'utf8'))

  if (modules.map((module) => module.id).join() !== MODULE_IDS.join()) {
    throw new Error(`${path} must list the modules ${MODULE_IDS.join(', ')} in that order`)
  }

  const seen = new Map()

  return modules.map((module) => ({
    id: module.id,
    name: module.name,
    nameEn: module.nameEn,
    description: module.description,
    topics: module.topics.map((topic, index) => {
      const order = index + 1
      const id = `${module.id}-${String(order).padStart(2, '0')}`
      const groups = topic.groups ?? null

      if (groups ? topic.words : !topic.words) {
        throw new Error(`Topic "${topic.title}" needs either "words" or "groups"`)
      }

      const entries = groups
        ? groups.flatMap((group, groupIndex) => group.words.map((wordId) => ({ id: wordId, group: groupIndex })))
        : topic.words.map((wordId) => ({ id: wordId }))

      for (const entry of entries) {
        if (seen.has(entry.id)) {
          throw new Error(`"${entry.id}" is listed in both "${seen.get(entry.id)}" and "${topic.title}"`)
        }
        seen.set(entry.id, topic.title)
      }

      return {
        id,
        order,
        title: topic.title,
        groups: groups ? groups.map((group) => ({ title: group.title, entryCount: group.words.length })) : [],
        entries,
      }
    }),
  }))
}

// Readable word list for people; generated, never edited by hand.
export function renderIeltsMarkdown(modules, wordsById) {
  const count = (module) => module.topics.reduce((total, topic) => total + topic.entries.length, 0)
  const total = modules.reduce((sum, module) => sum + count(module), 0)
  const phrases = modules
    .flatMap((module) => module.topics.flatMap((topic) => topic.entries))
    .filter((entry) => wordsById.get(entry.id).meaningZh.startsWith('phr.')).length
  const line = (entry) => {
    const word = wordsById.get(entry.id)
    return `- **${word.word}** ${word.meaningZh}`
  }

  const header = `# 雅思核心词汇表(独立版)

> **本文件由 \`npm run ielts:build\` 自动生成,请勿手改。** 词条、释义、音标、音频以 D1(\`ielts_words\`、\`ielts_pronunciations\`)为准;话题与词序在 \`${IELTS_TOPICS_PATH}\`。详见 \`src/data/ielts/README.md\`。

## 说明

**来源**:原创整理。收词参考开放词表做覆盖校验(ECDICT 雅思标签、NGSL / NAWL,见 \`docs/ielts-xref/\`),释义与话题归类均为自编;不摘录任何商业出版物。

**收词原则**

1. 只收雅思备考真正需要专门记的词:纯基础词(dog、book、happy 等)不收;中考范围内但在雅思中有学术用法或听力拼写要求的词保留(如 research、passport)。
2. 一词多义时只写雅思语境下的常用义;话题是展示用的分组,一个词放在最典型的话题下。
3. 词组只收固定搭配或听力场景中整体出现的名词短语(如 *security deposit*);需要宾语的动词短语写出完整结构(如 *convert A into B*、*object to (doing) sth.*)。

**格式**:\`- **单词** 词性 中文释义\`。词性缩写:n. 名词,v. 动词,adj. 形容词,adv. 副词,prep. 介词,conj. 连词,pron. 代词,phr. 词组。

**结构与统计**(按雅思考试四个模块组织,共 ${total} 条:单词 ${total - phrases},词组 ${phrases})

| 模块 | 内容 | 话题数 | 条数 |
|---|---|---|---|
${modules.map((module, index) => `| ${MODULE_NUMERALS[index]}、${module.name} | ${module.description} | ${module.topics.length} | ${count(module)} |`).join('\n')}
`

  const body = modules
    .map((module, moduleIndex) => {
      const topics = module.topics.map((topic) => {
        const heading = `## ${moduleIndex + 1}.${topic.order} ${topic.title}`

        if (topic.groups.length === 0) {
          return `${heading}\n\n${topic.entries.map(line).join('\n')}`
        }

        const groups = topic.groups.map(
          (group, groupIndex) =>
            `### ${group.title}\n\n${topic.entries.filter((entry) => entry.group === groupIndex).map(line).join('\n')}`,
        )
        return `${heading}\n\n${groups.join('\n\n')}`
      })

      return `---\n\n# ${MODULE_NUMERALS[moduleIndex]}、${module.name}\n\n${topics.join('\n\n')}`
    })
    .join('\n\n')

  return `${header}\n${body}\n`
}
