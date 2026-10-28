// Generates dictionary-style UK/US IPA for every IELTS entry from ipa-dict
// (MIT, https://github.com/open-dict-data/ipa-dict) and writes
// scripts/fixtures/ielts-phonetics.json. Hand-written corrections and
// part-of-speech-specific stress (increase n. /ˈɪnkriːs/ vs v. /ɪnˈkriːs/)
// live in scripts/fixtures/ielts-phonetics-overrides.json and win at build time.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  normalizeUkIpa,
  normalizeUsIpa,
  primaryStressSyllable,
  usToUkIpa,
} from './lib/ipa-normalize.mjs'
import { normalizeWord, readIeltsSource } from './lib/ielts-vocabulary-source.mjs'

const CACHE_DIR = '.runtime/ipa-dict'
const SOURCE_URL = 'https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data'
const OUTPUT_PATH = 'scripts/fixtures/ielts-phonetics.json'
const OVERRIDES_PATH = 'scripts/fixtures/ielts-phonetics-overrides.json'
// Placeholders in phrase patterns ("convert A into B", "object to (doing) sth.").
const PLACEHOLDER = /(?:^|\s)(?:A|B|sth\.?|sb\.?|\(doing\)|one's)(?=\s|$)/

async function loadDictionary(locale) {
  const path = `${CACHE_DIR}/${locale}.txt`

  if (!existsSync(path)) {
    mkdirSync(CACHE_DIR, { recursive: true })
    const response = await fetch(`${SOURCE_URL}/${locale}.txt`, {
      signal: AbortSignal.timeout(60_000),
    })

    if (!response.ok) {
      throw new Error(`Failed to download ipa-dict ${locale}: ${response.status}`)
    }

    writeFileSync(path, await response.text())
  }

  const dictionary = new Map()

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const [word, ipa] = line.split('\t')

    if (word && ipa && !dictionary.has(word.toLowerCase())) {
      dictionary.set(word.toLowerCase(), ipa)
    }
  }

  return dictionary
}

// British spellings in the list may only exist in American spelling (and the
// reverse for en_UK), e.g. analyse / analyze, colour / color.
function spellingVariants(word) {
  const variants = new Set([word])
  const rules = [
    [/is(e|ed|es|ing|ation|ations|er|ers)$/, 'iz$1'],
    [/iz(e|ed|es|ing|ation|ations|er|ers)$/, 'is$1'],
    [/ys(e|ed|es|ing)$/, 'yz$1'],
    [/our(s|ed|ing|ful|less|ite|able)?$/, 'or$1'],
    [/(ce|ti|bi|fi|li|me|nt|b)re$/, '$1er'],
    [/ogue$/, 'og'],
    [/ence$/, 'ense'],
    [/ll(ed|ing|er|ment)$/, 'l$1'],
    [/l(ment)$/, 'll$1'],
    [/ae/, 'e'],
    [/oe/, 'e'],
    [/^ageing$/, 'aging'],
  ]

  for (const [pattern, replacement] of rules) {
    if (pattern.test(word)) {
      variants.add(word.replace(pattern, replacement))
    }
  }

  return [...variants]
}

const [ukDictionary, usDictionary] = await Promise.all([
  loadDictionary('en_UK'),
  loadDictionary('en_US'),
])
const derived = new Set()

function lookupDirect(dictionary, word, normalize) {
  for (const variant of spellingVariants(word)) {
    if (dictionary.has(variant)) {
      return normalize(dictionary.get(variant), variant)
    }
  }

  return null
}

// Closed compounds missing from the dictionary (postcode, flatmate) are split
// into two known words; the second part's stress becomes secondary and is
// then dropped, giving /ˈpəʊstkəʊd/.
function lookupCompound(dictionary, word, normalize) {
  for (let cut = 3; cut <= word.length - 3; cut += 1) {
    const head = lookupDirect(dictionary, word.slice(0, cut), normalize)
    const tail = head && lookupDirect(dictionary, word.slice(cut), normalize)

    if (head && tail) {
      const headIpa = head.slice(1, -1)
      const stressedHead = /[ˈˌ]/.test(headIpa) ? headIpa : `ˈ${headIpa}`
      const tailIpa = tail.slice(1, -1).replace(/ˈ/g, '')
      return normalize(`/${stressedHead}${tailIpa}/`)
    }
  }

  return null
}

function lookupUk(word) {
  const found =
    lookupDirect(ukDictionary, word, normalizeUkIpa) ??
    lookupCompound(ukDictionary, word, normalizeUkIpa)

  if (found) {
    return found
  }

  const usIpa = lookupUs(word)

  if (usIpa) {
    derived.add(word)
    return usToUkIpa(usIpa, word)
  }

  return null
}

// The British form (when en_UK has the word) tells which US variant to pick.
function lookupUs(word) {
  const ukIpa =
    lookupDirect(ukDictionary, word, normalizeUkIpa) ?? lookupCompound(ukDictionary, word, normalizeUkIpa)
  const hint = ukIpa ? primaryStressSyllable(ukIpa) : -1
  const normalize = (raw, variant) => normalizeUsIpa(raw, variant, hint)

  return lookupDirect(usDictionary, word, normalize) ?? lookupCompound(usDictionary, word, normalize)
}

// Function words inside phrases take their weak forms, as in dictionaries
// (/meɪk ˈjuːs əv/, not /meɪk juːs ɒv/).
const WEAK_FORMS = {
  uk: { a: '/ə/', an: '/ən/', and: '/ənd/', of: '/əv/', to: '/tə/', the: '/ðə/', for: '/fə/', at: '/ət/', from: '/frəm/', as: '/əz/', be: '/bi/', than: '/ðən/' },
  us: { a: '/ə/', an: '/ən/', and: '/ənd/', of: '/əv/', to: '/tə/', the: '/ðə/', for: '/fɚ/', at: '/ət/', from: '/frəm/', as: '/əz/', be: '/bi/', than: '/ðən/' },
}

// Phrases and hyphenated compounds are transcribed word by word.
function transcribe(text, lookup, accent) {
  const word = normalizeWord(text)
  const direct = lookup(word)

  if (direct || !/[\s-]/.test(word)) {
    return direct
  }

  const parts = word.split(/[\s-]+/).filter(Boolean)
  const transcribed = parts.map((part) =>
    parts.length > 1 && WEAK_FORMS[accent][part] ? WEAK_FORMS[accent][part] : lookup(part),
  )

  if (transcribed.some((part) => !part)) {
    return null
  }

  const joined = transcribed.map((part) => part.slice(1, -1))

  // Hyphenated compounds carry their main stress on the last part
  // (semi-detached /ˌsemi dɪˈtætʃt/); earlier stresses become secondary.
  if (/-/.test(word) && !/\s/.test(word)) {
    const last = joined.length - 1
    return `/${joined.map((part, index) => (index < last ? part.replace(/ˈ/g, 'ˌ') : part)).join(' ')}/`
  }

  return `/${joined.join(' ')}/`
}
const overrides = existsSync(OVERRIDES_PATH)
  ? JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'))
  : {}
const phonetics = {}
const missing = { uk: [], us: [] }

for (const entry of readIeltsSource().flatMap((module) => module.topics).flatMap((topic) => topic.entries)) {
  const key = normalizeWord(entry.word)

  if (PLACEHOLDER.test(entry.word)) {
    continue
  }

  const result = {
    uk: transcribe(entry.word, lookupUk, 'uk'),
    us: transcribe(entry.word, lookupUs, 'us'),
  }

  for (const accent of ['uk', 'us']) {
    if (!result[accent] && !overrides[key]?.[accent] && !overrides[key]?.byPos) {
      missing[accent].push(entry.word)
    }
  }

  phonetics[key] = result
}

const unknownOverrides = Object.keys(overrides).filter(
  (key) => !key.startsWith('_') && !(key in phonetics),
)

if (unknownOverrides.length > 0) {
  throw new Error(`Overrides for words not in the list: ${unknownOverrides.join(', ')}`)
}

writeFileSync(OUTPUT_PATH, `${JSON.stringify(phonetics, null, 2)}\n`)
console.log(`Wrote ${Object.keys(phonetics).length} entries -> ${OUTPUT_PATH}`)
console.log(`Still missing UK ${missing.uk.length}, US ${missing.us.length} (add them to ${OVERRIDES_PATH}).`)

console.log(`UK derived from US for ${derived.size} words (review list: --list-derived).`)

if (process.argv.includes('--list-missing')) {
  console.log(JSON.stringify(missing, null, 2))
}

if (process.argv.includes('--list-derived')) {
  console.log(JSON.stringify([...derived].sort()))
}
