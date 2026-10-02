import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyProxy from '@fastify/http-proxy';
import GraphQLIntegration from './graphql/index.js';
import Database from './database/index.js';
import RestAPI from './rest-api/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fastify = Fastify({
  logger: true
});

await Database.init();
await GraphQLIntegration.init(fastify);
await RestAPI.load(fastify);

fastify.get('/hello', async () => {
  return { message: 'Hello from REST' }
})

if ((process.env.NODE_ENV || 'development') === 'development') {
  await fastify.register(FastifyProxy, {
    upstream: 'http://localhost:5173',
    websocket: true
  })
} else {
  await fastify.register(FastifyStatic, {
    root: [
      path.join(__dirname, '../dist'),
      path.join(__dirname, 'frontend/public')
    ],
    prefix: '/'
  });

  fastify.setNotFoundHandler((request, reply) => {
    const url = request.url.split('?')[0]

    if (
      request.method === 'GET' &&
      !url.startsWith('/api') &&
      !url.startsWith('/graphql')
    ) {
      return reply.sendFile('index.html')
    }

    return reply.code(404).send({
      error: 'Not found'
    })
  })
}

fastify.listen({ port: 3000 })