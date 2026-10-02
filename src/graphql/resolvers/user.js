import Database from '../../database/index.js'
import { effectiveRole } from '../../auth/index.js'

export default {

  Query: {
    user(_, { id }) {
      return Database.db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
      `).get(id)
    }
  },


  User: {

    role(parent) {
      return effectiveRole(parent)
    },

    canWrite(parent) {
      return Boolean(parent.can_write)
    }

  }

}