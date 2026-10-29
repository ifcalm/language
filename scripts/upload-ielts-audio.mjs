// Uploads generated IELTS audio from .runtime/ielts-audio/v1 to the R2 bucket
// under ielts/pronunciations/v1/{uk|us}/{key}.m4a via the Cloudflare API, then
// writes scripts/fixtures/ielts-audio.json (the committed list of keys that
// exist on R2, read by build-ielts-data).
//
// Objects already on R2 are skipped unless --force. --dry-run only reports.
// Behind a local proxy run with NODE_USE_ENV_PROXY=1.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '2497517a9aa6fae07a043ac4a24bfdd2'
const BUCKET = 'english-orbit'
const PREFIX = 'ielts/pronunciations/v1'
const LOCAL_DIR = '.runtime/ielts-audio/v1'
const MANIFEST_PATH = `${LOCAL_DIR}/manifest.json`
const FIXTURE_PATH = 'scripts/fixtures/ielts-audio.json'
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects`
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const CONCURRENCY = 8

function readToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN
  }

  const match = readFileSync('.env.local', 'utf8').match(/^CLOUDFLARE_API_TOKEN=(.+)$/m)

  if (!match) {
    throw new Error('CLOUDFLARE_API_TOKEN is missing (env or .env.local).')
  }

  return match[1].trim().replace(/^["']|["']$/g, '')
}

const token = readToken()
const headers = { Authorization: `Bearer ${token}` }

async function listRemoteKeys() {
  const keys = new Set()
  let cursor = ''

  do {
    const url = `${API}?prefix=${encodeURIComponent(`${PREFIX}/`)}&per_page=1000${cursor ? `&cursor=${cursor}` : ''}`
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) })
    const body = await response.json()

    if (!body.success) {
      throw new Error(`R2 list failed: ${JSON.stringify(body.errors)}`)
    }

    for (const object of body.result) {
      keys.add(object.key)
    }

    cursor = body.result_info?.is_truncated ? body.result_info.cursor : ''
  } while (cursor)

  return keys
}

async function upload(localPath, key) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(`${API}/${key}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'audio/mp4' },
      body: readFileSync(localPath),
      signal: AbortSignal.timeout(60_000),
    })

    if (response.ok) {
      return
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`R2 PUT ${response.status} ${key}: ${await response.text()}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt * attempt))
  }

  throw new Error(`R2 PUT kept failing for ${key}`)
}

if (!existsSync(MANIFEST_PATH)) {
  throw new Error(`Missing ${MANIFEST_PATH}; run generate-ielts-audio first.`)
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
const local = Object.keys(manifest)
  .filter((manifestKey) => existsSync(`${LOCAL_DIR}/${manifestKey}.m4a`))
  .map((manifestKey) => ({ manifestKey, key: `${PREFIX}/${manifestKey}.m4a` }))
const remote = await listRemoteKeys()
const pending = local.filter((item) => FORCE || !remote.has(item.key))

console.log(`Local ${local.length}, already on R2 ${remote.size}, to upload ${pending.length}.`)

if (!DRY_RUN) {
  const queue = [...pending]
  const failures = []
  let uploaded = 0

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const item = queue.shift()

        try {
          await upload(`${LOCAL_DIR}/${item.manifestKey}.m4a`, item.key)
          remote.add(item.key)
          uploaded += 1

          if (uploaded % 500 === 0) {
            console.log(`uploaded ${uploaded}/${pending.length}`)
          }
        } catch (error) {
          failures.push(error.message)
        }
      }
    }),
  )

  console.log(`Uploaded ${uploaded}, failed ${failures.length}.`)
  if (failures.length > 0) {
    console.log(failures.slice(0, 20).join('\n'))
    process.exitCode = 1
  }

  // Record only keys confirmed on R2 so the site never links missing audio.
  const onRemote = Object.keys(manifest)
    .filter((manifestKey) => remote.has(`${PREFIX}/${manifestKey}.m4a`))
    .sort()
  writeFileSync(FIXTURE_PATH, `${JSON.stringify({ prefix: PREFIX, keys: onRemote }, null, 2)}\n`)
  console.log(`Wrote ${onRemote.length} keys -> ${FIXTURE_PATH}`)
}
