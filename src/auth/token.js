import crypto from 'node:crypto'

const isProd = process.env.NODE_ENV === 'production'
const SECRET =
  process.env.AUTH_SECRET || (isProd ? null : 'dev-only-secret-change-me')

if (!SECRET) {
  throw new Error('AUTH_SECRET must be set when NODE_ENV=production')
}

const TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

const b64 = (value) => Buffer.from(value).toString('base64url')
const sign = (data) =>
  crypto.createHmac('sha256', SECRET).update(data).digest('base64url')

export function signToken(userId) {
  const payload = b64(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + TTL_SECONDS
    })
  )
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token) {
  if (typeof token !== 'string') return null

  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined) return null

  const given = Buffer.from(signature)
  const expected = Buffer.from(sign(payload))
  if (given.length !== expected.length) return null
  if (!crypto.timingSafeEqual(given, expected)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.exp || data.exp < Date.now() / 1000) return null
    return data
  } catch {
    return null
  }
}