// Learners look words up the way they meet them in a sentence ("improves",
// "running", "children"), while the vocab table stores base forms. This lists
// the base forms an inflected word could come from, most likely first; the
// caller keeps the first one that exists in the table.

const IRREGULAR_BASES: Record<string, string> = {
  am: 'be',
  are: 'be',
  is: 'be',
  was: 'be',
  were: 'be',
  been: 'be',
  became: 'become',
  began: 'begin',
  begun: 'begin',
  bought: 'buy',
  broke: 'break',
  broken: 'break',
  brought: 'bring',
  built: 'build',
  came: 'come',
  caught: 'catch',
  children: 'child',
  chose: 'choose',
  chosen: 'choose',
  did: 'do',
  does: 'do',
  done: 'do',
  drew: 'draw',
  drawn: 'draw',
  drove: 'drive',
  driven: 'drive',
  ate: 'eat',
  eaten: 'eat',
  fell: 'fall',
  fallen: 'fall',
  felt: 'feel',
  feet: 'foot',
  found: 'find',
  flew: 'fly',
  flown: 'fly',
  forgot: 'forget',
  forgotten: 'forget',
  gave: 'give',
  given: 'give',
  went: 'go',
  gone: 'go',
  goes: 'go',
  got: 'get',
  gotten: 'get',
  grew: 'grow',
  grown: 'grow',
  had: 'have',
  has: 'have',
  heard: 'hear',
  held: 'hold',
  hid: 'hide',
  hidden: 'hide',
  kept: 'keep',
  knew: 'know',
  known: 'know',
  led: 'lead',
  lost: 'lose',
  made: 'make',
  meant: 'mean',
  men: 'man',
  met: 'meet',
  paid: 'pay',
  ran: 'run',
  said: 'say',
  sat: 'sit',
  saw: 'see',
  seen: 'see',
  sent: 'send',
  sold: 'sell',
  spoke: 'speak',
  spoken: 'speak',
  spent: 'spend',
  stood: 'stand',
  taught: 'teach',
  thought: 'think',
  threw: 'throw',
  thrown: 'throw',
  told: 'tell',
  took: 'take',
  taken: 'take',
  understood: 'understand',
  women: 'woman',
  won: 'win',
  wore: 'wear',
  worn: 'wear',
  wrote: 'write',
  written: 'write',
}

const MIN_BASE_LENGTH = 2

// "stopped" -> "stop", "running" -> "run"; "passed" -> "pass" is handled by
// the plain stem, so both are offered.
function undoubleFinalConsonant(stem: string) {
  const last = stem.at(-1)

  return stem.length > 2 && last === stem.at(-2) && last && !'aeiou'.includes(last)
    ? stem.slice(0, -1)
    : null
}

export function getBaseFormCandidates(value: string): string[] {
  const word = value.trim().toLowerCase()

  if (!/^[a-z]+$/.test(word)) {
    return []
  }

  const candidates: Array<string | null> = [IRREGULAR_BASES[word] ?? null]

  if (word.endsWith('ies') || word.endsWith('ied')) {
    // studies -> study, but also ties -> tie.
    candidates.push(`${word.slice(0, -3)}y`, word.slice(0, -1))
  }

  if (word.endsWith('ing')) {
    const stem = word.slice(0, -3)
    // making -> make before mak; running -> run.
    candidates.push(`${stem}e`, stem, undoubleFinalConsonant(stem))
  }

  if (word.endsWith('ed')) {
    const stem = word.slice(0, -2)
    // used -> use before us; stopped -> stop.
    candidates.push(`${stem}e`, stem, undoubleFinalConsonant(stem))
  }

  if (word.endsWith('es')) {
    // improves -> improve before improv; boxes -> box.
    candidates.push(word.slice(0, -1), word.slice(0, -2))
  } else if (word.endsWith('s') && !word.endsWith('ss')) {
    candidates.push(word.slice(0, -1))
  }

  return [
    ...new Set(
      candidates.filter(
        (candidate): candidate is string =>
          candidate !== null &&
          candidate.length >= MIN_BASE_LENGTH &&
          candidate !== word,
      ),
    ),
  ]
}
