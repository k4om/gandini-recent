import User from '../../database/user.js'

export default {

  Mutation: {

    login(_, { nis, password }) {

      const user = User.findByNIS(nis)

      if (!user) {
        throw new Error(
          'Invalid login'
        )
      }


      // TODO:
      // compare password hash


      return {
        token: "temporary-token",
        user
      }

    }

  }

}