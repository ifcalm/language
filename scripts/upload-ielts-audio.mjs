// Uploads generated IELTS audio from .runtime/ielts-audio/v1 to the R2 bucket
// under ielts/pronunciations/v1/{uk|us}/{key}.m4a through R2's S3-compatible
// API (not rate limited like the Cloudflare REST API), with a long-lived
// Cache-Control header. The path is versioned (v1), so files never change in
// place. Then writes scripts/fixtures/ielts-audio.json, the committed list of
// keys confirmed on R2, read by build-ielts-data.
//
// Objects already on R2 are skipped unless --force. --dry-run only reports.
// Behind a local proxy run with NODE_USE_ENV_PROXY=1.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createR2Client } from './lib/r2-s3.mjs'

const BUCKET = 'english-orbit'
const PREFIX = 'ielts/pronunciations/v1'
const LOCAL_DIR = '.runtime/ielts-audio/v1'
const MANIFEST_PATH = `${LOCAL_DIR}/manifest.json`
const FIXTURE_PATH = 'scripts/fixtures/ielts-audio.json'
const CACHE_CONTROL = 'public, max-age=31536000, immutable'
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const CONCURRENCY = Number(process.env.IELTS_UPLOAD_CONCURRENCY ?? 24)

if (!existsSync(MANIFEST_PATH)) {
  throw new Error(`Missing ${MANIFEST_PATH}; run generate-ielts-audio first.`)
}

const r2 = createR2Client(BUCKET)
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
const local = Object.keys(manifest)
  .filter((manifestKey) => existsSync(`${LOCAL_DIR}/${manifestKey}.m4a`))
  .map((manifestKey) => ({ manifestKey, key: `${PREFIX}/${manifestKey}.m4a` }))
const remote = await r2.listKeys(`${PREFIX}/`)
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

        for (let attempt = 1; attempt <= 4; attempt += 1) {
          try {
            await r2.putObject(item.key, readFileSync(`${LOCAL_DIR}/${item.manifestKey}.m4a`), {
              'Content-Type': 'audio/mp4',
              'Cache-Control': CACHE_CONTROL,
            })
            remote.add(item.key)
            uploaded += 1
            break
          } catch (error) {
            if (attempt === 4) {
              failures.push(error.message)
            } else {
              await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
            }
          }
        }

        if (uploaded > 0 && uploaded % 1000 === 0) {
          console.log(`uploaded ${uploaded}/${pending.length}`)
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
  const confirmed = await r2.listKeys(`${PREFIX}/`)
  const onRemote = Object.keys(manifest)
    .filter((manifestKey) => confirmed.has(`${PREFIX}/${manifestKey}.m4a`))
    .sort()
  writeFileSync(FIXTURE_PATH, `${JSON.stringify({ prefix: PREFIX, keys: onRemote }, null, 2)}\n`)
  console.log(`Wrote ${onRemote.length} keys -> ${FIXTURE_PATH}`)
}
