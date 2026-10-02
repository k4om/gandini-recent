import Database from '../../database/index.js'

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

    canWrite(parent) {
      return Boolean(parent.can_write)
    }

  }

}