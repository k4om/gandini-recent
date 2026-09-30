import {
  getUsers,
  getUser
} from '../database/users.js'

export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`

export const resolvers = {
  Query: {
    users: () => getUsers(),
    user: (_, { id }) => getUser(id)
  }
}