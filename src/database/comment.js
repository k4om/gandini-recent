import Database from './index.js';

function findById(id) {
    return Database.db.prepare(`
        SELECT *
        FROM comments
        WHERE id = ?
    `).get(id);
}

function byArticle(articleId) {
    return Database.db.prepare(`
        SELECT *
        FROM comments
        WHERE article_id = ?
        ORDER BY created_at DESC
    `).all(articleId);
}

function create(articleId, userId, content) {
    const result = Database.db.prepare(`
        INSERT INTO comments (
            article_id,
            user_id,
            content
        )
        VALUES (?, ?, ?)
    `).run(
        articleId,
        userId,
        content
    );

    return findById(result.lastInsertRowid);
}

export default {
    byArticle,
    create
};