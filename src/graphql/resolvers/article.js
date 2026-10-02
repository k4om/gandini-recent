import ArticleDB from '../../database/article.js'
import Database from '../../database/index.js'

export default {

    Query: {

        articles(_, args) {
            return ArticleDB.all(
                args.limit ?? 20,
                args.offset ?? 0
            )
        },

        adminDraftArticles(_, args, ctx) {
            if (ctx.user?.role !== 'ADMIN') {
                throw new Error('Admin only')
            }

            return ArticleDB.allDrafts(
                args.limit ?? 20,
                args.offset ?? 0
            )
        },


        article(_, args) {

            if (args.id)
                return ArticleDB.findById(args.id)

            if (args.slug)
                return ArticleDB.findBySlug(args.slug)

            return null
        }

    },


    Mutation: {

        createArticle(_, { input }, ctx) {

            if (!ctx.user?.can_write) {
                throw new Error(
                    'Permission denied'
                )
            }


            return ArticleDB.create({
                author_id: ctx.user.id,
                ...input
            })

        },


        publishArticle(_, { id }, ctx) {

            if (ctx.user?.role !== 'ADMIN') {
                throw new Error(
                    'Admin only'
                )
            }

            return ArticleDB.publish(id)

        }

    },


    Article: {
        author(article) {
            return Database.db.prepare(`
            SELECT *
            FROM users
            WHERE id = ?
        `).get(article.author_id)
        },

        createdAt(article) {
            return article.created_at
        },

        updatedAt(article) {
            return article.updated_at
        },

        publishedAt(article) {
            return article.published_at
        }
    }
}