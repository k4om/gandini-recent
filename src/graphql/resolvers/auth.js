import {
  loginStudent,
  loginTeacher,
  loginAdmin
} from '../../auth/index.js'

export default {

  Query: {
    me(_, __, ctx) {
      return ctx.user ?? null
    }
  },

  Mutation: {
    loginStudent(_, { nis, password }) {
      return loginStudent(nis, password)
    },

    loginTeacher(_, { identifier, password }) {
      return loginTeacher(identifier, password)
    },

    loginAdmin(_, { identifier, password }) {
      return loginAdmin(identifier, password)
    }
  }

}