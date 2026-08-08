import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

if (existsSync('.env.local')) {
  loadEnvFile('.env.local')
}

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'

function parseWranglerJson(output) {
  const trimmed = output.trim()

  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed)
  }

  const start = output.indexOf('[\n')
  if (start !== -1) {
    return JSON.parse(output.slice(start))
  }

  throw new Error(`Could not find JSON payload in Wrangler output:\n${output}`)
}

export function queryRemoteD1(sql) {
  const result = spawnSync(
    NODE,
    [
      WRANGLER,
      'd1',
      'execute',
      DATABASE,
      '--remote',
      '--json',
      '--command',
      sql,
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: 'pipe',
    },
  )

  if (result.status !== 0) {
    throw new Error(
      `Remote D1 query failed\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }

  const payload = parseWranglerJson(result.stdout ?? '')
  const queryResult = payload[0]

  if (!queryResult?.success) {
    throw new Error(`Remote D1 query was not successful: ${JSON.stringify(payload)}`)
  }

  return queryResult.results ?? []
}

export function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}
