import mercurius from 'mercurius'

function init(fastify) {
    fastify.register(mercurius, {
        schema: `
            type Query {
            hello: String!
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello world!'
            }
        },
        graphiql: true
    });
}

export default {
    init
}