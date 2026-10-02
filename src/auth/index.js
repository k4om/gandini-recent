import bcrypt from 'bcryptjs'
import User from '../database/user.js'
import { signToken, verifyToken } from './token.js'

const INVALID = 'Identitas atau kata sandi salah'

// Compared against when the user doesn't exist, so timing doesn't reveal it
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)

/** The role a user acts as. is_admin / SPECIAL accounts are always ADMIN. */
export function effectiveRole(user) {
  if (user.is_admin || user.role === 'SPECIAL') return 'ADMIN'
  return user.role
}

function authenticate({ user, password, expectedRole }) {
  const matches = bcrypt.compareSync(
    String(password ?? ''),
    user?.password_hash || DUMMY_HASH
  )

  if (!user || !user.password_hash || !matches) throw new Error(INVALID)
  if (effectiveRole(user) !== expectedRole) throw new Error(INVALID)

  return { token: signToken(user.id), user }
}

export function loginStudent(nis, password) {
  return authenticate({
    user: User.findByNIS(nis),
    password,
    expectedRole: 'STUDENT'
  })
}

export function loginTeacher(identifier, password) {
  return authenticate({
    user: User.findByIdentifier(identifier),
    password,
    expectedRole: 'TEACHER'
  })
}

export function loginAdmin(identifier, password) {
  return authenticate({
    user: User.findByIdentifier(identifier),
    password,
    expectedRole: 'ADMIN'
  })
}

/** Reads "Authorization: Bearer <token>" and returns the user (or null). */
export function userFromRequest(request) {
  const match = /^Bearer (.+)$/i.exec(request.headers.authorization || '')
  if (!match) return null

  const data = verifyToken(match[1])
  if (!data) return null

  const user = User.findById(data.sub)
  if (!user) return null

  return { ...user, role: effectiveRole(user) }
}