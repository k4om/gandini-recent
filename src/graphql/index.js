import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadFiles } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import mercurius from 'mercurius'

import { userFromRequest } from '../auth/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


async function loadGraphQL() {
  const schemaPath = path.join(
    __dirname,
    './schemas/**/*.graphql'
  )

  const resolverPath = path.join(
    __dirname,
    './resolvers/**/*.js'
  )


  const typeDefs = mergeTypeDefs(
    await loadFiles(schemaPath)
  )


  const resolvers = mergeResolvers(
    await loadFiles(resolverPath)
  )


  return makeExecutableSchema({
    typeDefs,
    resolvers
  })
}


export default {
  async init(fastify) {

    const schema = await loadGraphQL()

    await fastify.register(mercurius, {
      schema,

      graphiql: process.env.NODE_ENV !== 'production',

      path: '/graphql',

      context: async (request) => ({
        request,
        db: fastify.db,
        user: userFromRequest(request)
      })
    })


    fastify.log.info(
      'GraphQL ready at /graphql'
    )
  }
}