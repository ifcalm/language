// Minimal client for R2's S3-compatible API (AWS Signature V4), used instead
// of the Cloudflare REST API, which is rate limited (~1200 requests / 5 min)
// and cannot set Cache-Control on objects.
//
// Env (.env.local): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.
import { createHash, createHmac } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

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

const sha256 = (data) => createHash('sha256').update(data).digest('hex')
const hmac = (key, data) => createHmac('sha256', key).update(data).digest()

// RFC 3986 encoding as SigV4 requires ("/" kept for object paths).
function encode(value, keepSlash = false) {
  const encoded = encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  )
  return keepSlash ? encoded.replace(/%2F/g, '/') : encoded
}

export function createR2Client(bucket) {
  const accountId = readEnv('R2_ACCOUNT_ID')
  const accessKeyId = readEnv('R2_ACCESS_KEY_ID')
  const secretAccessKey = readEnv('R2_SECRET_ACCESS_KEY')
  const host = `${accountId}.r2.cloudflarestorage.com`

  async function request(method, key, { query = {}, headers = {}, body } = {}) {
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const date = amzDate.slice(0, 8)
    const payloadHash = sha256(body ?? '')
    const path = `/${bucket}${key ? `/${encode(key, true)}` : ''}`
    const canonicalQuery = Object.keys(query)
      .sort()
      .map((name) => `${encode(name)}=${encode(String(query[name]))}`)
      .join('&')
    const allHeaders = {
      ...Object.fromEntries(Object.entries(headers).map(([name, value]) => [name.toLowerCase(), String(value).trim()])),
      host,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    }
    const signedHeaders = Object.keys(allHeaders).sort()
    const canonicalRequest = [
      method,
      path,
      canonicalQuery,
      signedHeaders.map((name) => `${name}:${allHeaders[name]}\n`).join(''),
      signedHeaders.join(';'),
      payloadHash,
    ].join('\n')
    const scope = `${date}/auto/s3/aws4_request`
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n')
    const signingKey = ['auto', 's3', 'aws4_request'].reduce(
      (key, part) => hmac(key, part),
      hmac(`AWS4${secretAccessKey}`, date),
    )
    const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')
    const { host: _host, ...sendHeaders } = allHeaders

    return fetch(`https://${host}${path}${canonicalQuery ? `?${canonicalQuery}` : ''}`, {
      method,
      headers: {
        ...sendHeaders,
        Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders.join(';')}, Signature=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(60_000),
    })
  }

  return {
    async putObject(key, body, headers) {
      const response = await request('PUT', key, { headers, body })

      if (!response.ok) {
        throw new Error(`R2 PUT ${response.status} ${key}: ${await response.text()}`)
      }
    },

    async headObject(key) {
      const response = await request('HEAD', key)
      return response.ok ? Object.fromEntries(response.headers) : null
    },

    async listKeys(prefix) {
      const keys = new Set()
      let token = ''

      do {
        const query = { 'list-type': 2, prefix, ...(token ? { 'continuation-token': token } : {}) }
        let response
        let xml = ''

        // R2 occasionally answers 500 InternalError; retry a few times.
        for (let attempt = 1; attempt <= 4; attempt += 1) {
          response = await request('GET', '', { query })
          xml = await response.text()

          if (response.ok || response.status < 500) {
            break
          }

          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        }

        if (!response.ok) {
          throw new Error(`R2 LIST ${response.status}: ${xml}`)
        }

        for (const match of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) {
          keys.add(match[1].replace(/&amp;/g, '&'))
        }

        token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
          ? (xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1] ?? '')
          : ''
      } while (token)

      return keys
    },
  }
}
