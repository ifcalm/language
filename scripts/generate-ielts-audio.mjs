// Generates IELTS pronunciation audio with Google Cloud Text-to-Speech into
// .runtime/ielts-audio/v1/{uk|us}/{key}.m4a plus a manifest.json.
//
// - Words are sent as plain text; Google's own lexicon is better than forcing
//   our IPA everywhere, and plain text keeps the billed characters low. Only
//   words whose reading depends on part of speech (increase n./v.) are spoken
//   from our IPA via SSML <phoneme>, one file per part of speech:
//   {id}-n.m4a, {id}-v.m4a.
// - Re-running skips files whose request is unchanged, so it can resume.
//
// Env (.env.local): GOOGLE_TTS_API_KEY (an API key restricted to the
// Cloud Text-to-Speech API). Behind a local proxy run with NODE_USE_ENV_PROXY=1.
// Usage: node scripts/generate-ielts-audio.mjs [--sample] [--ids a,b] [--concurrency 4]
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const OUTPUT_DIR = process.env.IELTS_AUDIO_DIR ?? '.runtime/ielts-audio/v1'
const MANIFEST_PATH = `${OUTPUT_DIR}/manifest.json`
const MODULES = ['listening', 'reading', 'writing', 'speaking']
// Studio voices: en-GB Neural2 ignores stress marks in SSML <phoneme>, so it
// cannot tell increase n. /ˈɪnkriːs/ from v. /ɪnˈkriːs/; Studio voices can.
const VOICES = {
  uk: process.env.IELTS_VOICE_UK ?? 'en-GB-Studio-C',
  us: process.env.IELTS_VOICE_US ?? 'en-US-Studio-O',
}
const LOCALES = { uk: 'en-GB', us: 'en-US' }
// Slightly slower than conversational speed, as in learner dictionaries.
const SPEAKING_RATE = Number(process.env.IELTS_SPEAKING_RATE ?? 0.92)
const SAMPLE_IDS = [
  'increase', 'research', 'abuse', 'accommodation', 'hierarchy', 'security-deposit',
  'dna', 'gdp', 'el-nino', 'resume-cv', 'convert-a-into-b', 'object-to-doing-sth',
  'take-into-account', 'semi-detached', 'labour', 'analyse', 'schedule', 'garage',
  'temperature', 'photosynthesis',
]

function readEnv(name) {
  if (process.env[name]) {
    return process.env[name]
  }

  const match = existsSync('.env.local')
    ? readFileSync('.env.local', 'utf8').match(new RegExp(`^${name}=(.+)$`, 'm'))
    : null

  if (!match) {
    throw new Error(`${name} is missing (env or .env.local).`)
  }

  return match[1].trim().replace(/^["']|["']$/g, '')
}

function argValue(flag) {
  const index = process.argv.indexOf(flag)
  return index === -1 ? null : process.argv[index + 1]
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// What a learner should hear for pattern phrases and abbreviations.
function speakableText(word) {
  return word
    .replace(/\(doing\)/g, 'doing')
    .replace(/\bsth\.?/g, 'something')
    .replace(/\bsb\.?/g, 'somebody')
    .replace(/\s+/g, ' ')
    .trim()
}

// Request body for text:synthesize; SSML only when an IPA reading is forced.
function buildRequest(accent, text, ipa) {
  const input = ipa
    ? { ssml: `<speak><phoneme alphabet="ipa" ph="${escapeXml(ipa.replace(/^\/|\/$/g, ''))}">${escapeXml(text)}</phoneme></speak>` }
    : { text }

  return {
    input,
    voice: { languageCode: LOCALES[accent], name: VOICES[accent] },
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000, speakingRate: SPEAKING_RATE },
  }
}

function buildJobs() {
  const entries = MODULES.flatMap(
    (module) => JSON.parse(readFileSync(`src/data/ielts/generated/${module}.json`, 'utf8')).entries,
  )
  const jobs = []

  for (const entry of entries) {
    const text = speakableText(entry.word)

    for (const accent of ['uk', 'us']) {
      if (entry.posPhonetics) {
        for (const row of entry.posPhonetics) {
          const pos = row.pos.replace(/\.$/, '').replace(/\./g, '')
          jobs.push({ key: `${entry.id}-${pos}`, id: entry.id, accent, pos: row.pos, text, request: buildRequest(accent, text, row[accent]) })
        }
      } else {
        jobs.push({ key: entry.id, id: entry.id, accent, pos: null, text, request: buildRequest(accent, text, null) })
      }
    }
  }

  return jobs
}

async function synthesize(job, apiKey) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
      body: JSON.stringify(job.request),
      signal: AbortSignal.timeout(30_000),
    })

    if (response.ok) {
      return Buffer.from((await response.json()).audioContent, 'base64')
    }

    if (response.status === 429 || response.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt * attempt))
      continue
    }

    throw new Error(`Google TTS ${response.status} for ${job.accent}/${job.key}: ${await response.text()}`)
  }

  throw new Error(`Google TTS kept failing for ${job.accent}/${job.key}`)
}

// mp3 from Google -> AAC .m4a (mono, 64 kbps), the format the COCA audio uses.
function convertToM4a(mp3Path, m4aPath) {
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', '-c', '1', mp3Path, m4aPath])
  rmSync(mp3Path)
  const info = execFileSync('afinfo', [m4aPath], { encoding: 'utf8' })
  return Math.round(Number(info.match(/estimated duration: ([\d.]+)/)?.[1] ?? 0) * 1000)
}

const apiKey = readEnv('GOOGLE_TTS_API_KEY')
const onlyIds = process.argv.includes('--sample')
  ? new Set(SAMPLE_IDS)
  : argValue('--ids')
    ? new Set(argValue('--ids').split(','))
    : null
const concurrency = Number(argValue('--concurrency') ?? 4)
const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) : {}
const jobs = buildJobs().filter((job) => !onlyIds || onlyIds.has(job.id))

for (const accent of ['uk', 'us']) {
  mkdirSync(`${OUTPUT_DIR}/${accent}`, { recursive: true })
}

const unknown = onlyIds ? [...onlyIds].filter((id) => !jobs.some((job) => job.id === id)) : []
if (unknown.length > 0) {
  throw new Error(`Unknown ids: ${unknown.join(', ')}`)
}

let done = 0
let skipped = 0
const failures = []
const queue = [...jobs]

async function worker() {
  while (queue.length > 0) {
    const job = queue.shift()
    const manifestKey = `${job.accent}/${job.key}`
    const requestHash = createHash('sha1').update(JSON.stringify(job.request)).digest('hex')
    const m4aPath = `${OUTPUT_DIR}/${job.accent}/${job.key}.m4a`

    if (manifest[manifestKey]?.requestHash === requestHash && existsSync(m4aPath)) {
      skipped += 1
      continue
    }

    try {
      const mp3Path = m4aPath.replace(/\.m4a$/, '.mp3')
      writeFileSync(mp3Path, await synthesize(job, apiKey))
      const durationMs = convertToM4a(mp3Path, m4aPath)
      const bytes = readFileSync(m4aPath).length
      manifest[manifestKey] = {
        id: job.id,
        accent: job.accent,
        pos: job.pos,
        text: job.text,
        voice: VOICES[job.accent],
        requestHash,
        durationMs,
        bytes,
      }
      done += 1

      if (done % 100 === 0) {
        writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
        console.log(`${done + skipped}/${jobs.length}`)
      }
    } catch (error) {
      failures.push(`${manifestKey}: ${error.message}`)
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Generated ${done}, skipped ${skipped} unchanged, failed ${failures.length} (of ${jobs.length}).`)
if (failures.length > 0) {
  console.log(failures.slice(0, 20).join('\n'))
  process.exitCode = 1
}
