import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyProxy from '@fastify/http-proxy';
import GraphQLIntegration from './graphql/index.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fastify = Fastify({
  logger: true
});

GraphQLIntegration.init(fastify);

fastify.get('/hello', async () => {
  return { message: 'Hello from REST' }
})

if ((process.env.NODE_ENV || 'development') === 'development') {
  await fastify.register(FastifyProxy, {
    upstream: 'http://localhost:5173'
  })
} else {
  fastify.register(FastifyStatic, {
    root: path.join(__dirname, '../dist'),
    prefix: '/'
  })

  fastify.setNotFoundHandler((request, reply) => {
    if (request.method === 'GET' &&
      !request.url.startsWith('/api') &&
      !request.url.startsWith('/graphql')) {
      return reply.sendFile('index.html')
    }

    return reply.code(404).send({
      error: 'Not found'
    })
  })
}

fastify.listen({ port: 3000 })