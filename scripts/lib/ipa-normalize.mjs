// Converts ipa-dict transcriptions into the dictionary style learners know
// (Oxford / Cambridge): /ɪnˈkriːs/ rather than /ˌɪnˈkɹis/.
//
// - UK input (en_UK) marks stress before the vowel and uses ɐ, ɹ, ɛ;
//   stress is moved to the syllable onset and the symbols are normalised.
// - US input (en_US, CMUdict-derived) already marks stress at the onset;
//   vowels get Cambridge-style length marks and r-coloured vowels are split
//   into stressed ɝː and unstressed ɚ.
// - Both: no secondary stress after the primary, no stress mark on
//   monosyllables, script ɡ.

const VOWELS = [
  'aɪə', 'aʊə',
  'eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'əʊ', 'oʊ', 'ɪə', 'eə', 'ɛə', 'ʊə', 'iə', 'uə',
  'iː', 'uː', 'ɑː', 'ɔː', 'ɜː', 'ɝː', 'ɛː',
  'i', 'ɪ', 'e', 'ɛ', 'æ', 'ʌ', 'ɐ', 'ɒ', 'ɔ', 'ɑ', 'ʊ', 'u', 'ə', 'ɚ', 'ɝ', 'o', 'a',
]
const CONSONANTS = ['tʃ', 'dʒ']
const STRESS = new Set(['ˈ', 'ˌ'])

const ONSET_SINGLE = new Set('p b t d k ɡ g m n f v θ ð s z ʃ ʒ h l r w j tʃ dʒ'.split(' '))
const ONSET_CLUSTERS = new Set([
  'pl', 'bl', 'kl', 'ɡl', 'gl', 'fl', 'sl',
  'pr', 'br', 'tr', 'dr', 'kr', 'ɡr', 'gr', 'fr', 'θr', 'ʃr',
  'tw', 'dw', 'kw', 'ɡw', 'gw', 'sw', 'θw',
  'sp', 'st', 'sk', 'sm', 'sn', 'sf',
  'spl', 'spr', 'str', 'skr', 'skw', 'skj', 'spj', 'stj',
  ...'p b t d k ɡ g m n f v θ s z h l'.split(' ').map((c) => `${c}j`),
])

function isVowel(token) {
  return VOWELS.includes(token)
}

export function tokenizeIpa(ipa) {
  const tokens = []
  let index = 0

  while (index < ipa.length) {
    const rest = ipa.slice(index)
    const match =
      VOWELS.find((v) => rest.startsWith(v)) ??
      CONSONANTS.find((c) => rest.startsWith(c)) ??
      ipa[index]
    tokens.push(match)
    index += match.length
  }

  return tokens
}

function isLegalOnset(cluster) {
  const text = cluster.join('')
  return cluster.length === 1 ? ONSET_SINGLE.has(text) : ONSET_CLUSTERS.has(text)
}

// Moves each stress mark to the start of its syllable: the mark may sit
// before the nucleus (en_UK /kˈʌp/) or after part of the onset (en_US
// /əbˈjus/). Consonants before the mark join the onset as long as the
// whole cluster is a legal English onset.
function moveStressToOnset(tokens) {
  const result = []

  tokens.forEach((token, position) => {
    if (!STRESS.has(token)) {
      result.push(token)
      return
    }

    const following = []

    for (const next of tokens.slice(position + 1)) {
      if (isVowel(next) || STRESS.has(next)) {
        break
      }
      following.push(next)
    }

    let start = result.length

    while (start > 0 && !isVowel(result[start - 1]) && !STRESS.has(result[start - 1])) {
      start -= 1
    }

    const preceding = result.slice(start)
    let take = 0

    for (let size = preceding.length; size >= 1; size -= 1) {
      if (isLegalOnset([...preceding.slice(preceding.length - size), ...following])) {
        take = size
        break
      }
    }

    result.splice(result.length - take, 0, token)
  })

  return result
}

// Rewrites each syllable nucleus; `stress` is the mark of its syllable.
// `isLast` tells the mapper whether this is the final nucleus of the word.
function mapNuclei(tokens, mapper) {
  let stress = ''
  const lastVowel = tokens.findLastIndex(isVowel)

  return tokens.map((token, index) => {
    if (STRESS.has(token)) {
      stress = token
      return token
    }

    if (!isVowel(token)) {
      return token
    }

    const mapped = mapper(token, stress, index === lastVowel)
    stress = ''
    return mapped
  })
}

function finish(rawTokens) {
  // Two primary marks (ipa-dict /aɪˈdentɪfɪˈkeɪʃən/): the last one is the
  // main stress, earlier ones are secondary.
  const lastPrimary = rawTokens.lastIndexOf('ˈ')
  const tokens = rawTokens.map((token, index) => (token === 'ˈ' && index !== lastPrimary ? 'ˌ' : token))
  const primary = tokens.indexOf('ˈ')
  // Secondary stress only before the primary and at least one syllable away
  // from it (/ˌjuːnɪˈvɜːsəti/, but /ɪnˈstrʌkt/ rather than /ˌɪnˈstrʌkt/).
  let result = tokens.filter((token, index) => {
    if (token !== 'ˌ' || primary === -1) {
      return true
    }

    const vowelsBetween = tokens.slice(index + 1, primary).filter(isVowel).length
    return index < primary && vowelsBetween > 1
  })

  if (result.filter(isVowel).length <= 1) {
    result = result.filter((token) => !STRESS.has(token))
  }

  return `/${weakenPrefixE(result).join('').replace(/g/g, 'ɡ')}/`
}

// Unstressed en-/em-/ex- before the primary stress is /ɪ/ in learner
// dictionaries (environment /ɪnˈvaɪrənmənt/, explore /ɪkˈsplɔː/), while
// ipa-dict often writes /e/.
function weakenPrefixE(tokens) {
  if (tokens[0] !== 'e') {
    return tokens
  }

  const primary = tokens.indexOf('ˈ')
  const before = primary === -1 ? [] : tokens.slice(1, primary)

  return primary > 1 && before.every((token) => !isVowel(token) && !STRESS.has(token)) &&
    ['n', 'm', 'k', 'ɡ', 'g'].includes(tokens[1])
    ? ['ɪ', ...tokens.slice(1)]
    : tokens
}

// Letters whose sound should normally survive in a careful pronunciation.
const CONSONANT_SOUNDS = {
  t: /t/, d: /d/, n: /n|ŋ/, r: /r|ɹ|ɝ|ɚ/, l: /l|ɫ/, k: /k/, p: /p/, b: /b/, m: /m/,
}

// Index of the syllable carrying primary stress (0-based), or -1.
export function primaryStressSyllable(ipa) {
  const tokens = tokenizeIpa(ipa)
  const mark = tokens.lastIndexOf('ˈ')
  return mark === -1 ? -1 : tokens.slice(0, mark).filter(isVowel).length
}

// ipa-dict lists casual variants first for some words (CMUdict "intimate"
// /ˈɪnəmət/, "effect" /ˈifɛkt/); prefer the variant that keeps the most
// spelled consonants and, when known, stresses the same syllable as the
// British form.
function bestVariant(raw, word, stressHint = -1) {
  const variants = raw.split(',').map((item) => item.trim().replace(/^\/|\/$/g, ''))

  if (!word || variants.length === 1) {
    return variants[0]
  }

  // Multi-syllable variants without a stress mark are incomplete; avoid them.
  const score = (ipa) =>
    (/[ˈˌ]/.test(ipa) ? 0 : -1) +
    (/ing$/.test(word) && !/ɪŋ$/.test(ipa) ? -1 : 0) +
    (stressHint !== -1 && primaryStressSyllable(ipa) === stressHint ? 1.5 : 0) +
    Object.entries(CONSONANT_SOUNDS).reduce((total, [letter, sound]) => {
      const spelled = (word.match(new RegExp(letter, 'g')) ?? []).length
      const heard = (ipa.match(new RegExp(sound.source, 'g')) ?? []).length
      return total - Math.max(0, spelled - heard)
    }, 0)

  return variants.reduce((best, item) => (score(item) > score(best) ? item : best))
}

// Dictionaries write unstressed i before a consonant as ɪ (reserve
// /rɪˈzɜːv/); the happY i stays word-final or before a vowel.
const NOT_VOWEL_OR_MARK = `[^/${[...new Set(VOWELS.join(''))].join('')}ˈˌ]`

function shortenUnstressedI(ipa) {
  return ipa.replace(new RegExp(`i(?!ː)(?=[ˈˌ]?${NOT_VOWEL_OR_MARK})`, 'g'), 'ɪ')
}

function firstVariant(raw, word, stressHint) {
  return bestVariant(raw, word, stressHint)
}

function prepare(variant) {
  return tokenizeIpa(variant.replace(/ɹ/g, 'r').replace(/ɫ/g, 'l'))
}

export function normalizeUkIpa(raw, word) {
  const tokens = moveStressToOnset(prepare(firstVariant(raw, word)))
  const mapped = mapNuclei(tokens, (vowel, stress) => {
    switch (vowel) {
      case 'ɐ':
        return stress ? 'ʌ' : 'ə'
      case 'ɛ':
        return 'e'
      case 'ɛə':
      case 'ɛː':
        return 'eə'
      // Only a stressed NEAR vowel is ɪə; unstressed it is i + ə
      // (experience /ɪkˈspɪəriəns/, helium /ˈhiːliəm/).
      case 'iə':
      case 'ɪə':
        return stress ? 'ɪə' : 'iə'
      case 'uə':
        return 'ʊə'
      default:
        return vowel
    }
  })

  return finish(mapped)
}

const US_VOWEL_CLASS = '(?:aɪ|aʊ|eɪ|oʊ|ɔɪ|[iɪeɛæʌəɑɔʊuɝ])'

export function normalizeUsIpa(raw, word, stressHint = -1) {
  // CMUdict writes "garage" as /ɡɝˈɑʒ/: an unstressed ɝ before a vowel is
  // /ə/ + an r that starts the next syllable (/ɡəˈrɑːʒ/).
  const variant = firstVariant(raw, word, stressHint).replace(
    new RegExp(`ɝ([ˈˌ]?)(?=${US_VOWEL_CLASS})`, 'g'),
    'ə$1ɹ',
  )
  // en_US already marks stress at the onset except before a j-glide
  // (/əbˈjus/); only those are moved, so /ˈlaɪtˌweɪt/ keeps its boundary.
  const tokens = prepare(variant).flatMap((token, index, all) =>
    STRESS.has(token) && all[index + 1] === 'j' && !isVowel(all[index - 1] ?? '') ? [] : [token],
  )
  const glided = tokens.length === prepare(variant).length ? tokens : moveStressToOnset(prepare(variant))
  const mapped = mapNuclei(glided, (vowel, stress, isLast) => {
    // A secondary-stressed final i (CMUdict "phonology" /…ˌdʒi/) is the
    // short happY vowel, not iː.
    const long = stress === 'ˈ' || (stress === 'ˌ' && !isLast)

    switch (vowel) {
      case 'ə':
        return stress ? 'ʌ' : 'ə'
      case 'ɝ':
        return stress ? 'ɝː' : 'ɚ'
      case 'i':
        return long ? 'iː' : 'i'
      case 'u':
        return long ? 'uː' : 'u'
      case 'ɑ':
        return 'ɑː'
      case 'ɔ':
        return 'ɔː'
      case 'ɛ':
        return 'e'
      default:
        return vowel
    }
  })

  return shortenUnstressedI(finish(mapped))
}

// Fallback for words missing from en_UK: derive a non-rhotic British form from
// a normalised US transcription. LOT vowels (US ɑː, spelled with "o") become ɒ.
// Results are approximate and listed for review by build-ielts-phonetics.
export function usToUkIpa(usIpa, word) {
  const lotCount = (word.match(/o/gi) ?? []).length
  let ipa = usIpa
    .replace(/oʊ/g, 'əʊ')
    .replace(/ɝː/g, 'ɜː')
    .replace(/ɚ/g, 'ə')

  const rhotic = [
    ['aɪr', 'aɪə'],
    ['aʊr', 'aʊə'],
    ['ɑːr', 'ɑː'],
    ['ɔːr', 'ɔː'],
    ['er', 'eə'],
    ['ɪr', 'ɪə'],
    ['ʊr', 'ʊə'],
  ]

  for (const [us, uk] of rhotic) {
    // Only an r that does not start the next syllable is dropped.
    ipa = ipa.replace(new RegExp(`${us}(?![ˈˌ]?(?:${VOWELS.join('|')}))`, 'g'), uk)
  }

  ipa = shortenUnstressedI(ipa)

  const lots = ipa.match(/ɑː(?!r)/g)?.length ?? 0

  if (lotCount > 0 && lots > 0 && lots <= lotCount) {
    ipa = ipa.replace(/ɑː(?!r)/g, 'ɒ')
  }

  return ipa
}
