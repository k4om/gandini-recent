import CommentDB from '../../database/comment.js'
import Database from '../../database/index.js'

export default {

  Query: {

    comments(_, { articleId }) {
      return CommentDB.byArticle(articleId)
    }

  },


  Mutation: {

    createComment(_, args, ctx) {

      if (!ctx.user) {
        throw new Error(
          'Login required'
        )
      }

      const content = args.content.trim()

      if (!content) {
        throw new Error(
          'Comment cannot be empty'
        )
      }


      return CommentDB.create(
        args.articleId,
        ctx.user.id,
        content
      )

    }

  },


  Comment: {

    user(comment) {
      return Database.db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
      `).get(comment.user_id)
    },

    createdAt(comment) {
      return comment.created_at
    }

  }

}