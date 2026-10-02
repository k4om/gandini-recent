import bcrypt from 'bcryptjs'
import Database from './index.js'

const [identifier, password] = process.argv.slice(2)

if (!identifier || !password) {
  console.error('Usage: node src/database/set-password.js <identifier> <password>')
  process.exit(1)
}

const result = Database.db
  .prepare(`
    UPDATE users
    SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
    WHERE identifier = ?
  `)
  .run(bcrypt.hashSync(password, 10), identifier)

console.log(
  result.changes
    ? `Password updated for "${identifier}".`
    : `No user with identifier "${identifier}".`
)