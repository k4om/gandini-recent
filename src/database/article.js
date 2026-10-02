import Database from './index.js';

function all(limit = 20, offset = 0) {
    return Database.db.prepare(`
        SELECT *
        FROM articles
        WHERE status = 'PUBLISHED'
        ORDER BY published_at DESC
        LIMIT ?
        OFFSET ?
    `).all(limit, offset);
}

function findById(id) {
    return Database.db.prepare(`
        SELECT *
        FROM articles
        WHERE id = ?
    `).get(id);
}

function findBySlug(slug) {
    return Database.db.prepare(`
        SELECT *
        FROM articles
        WHERE slug = ?
    `).get(slug);
}

function create({
    author_id,
    title,
    slug,
    content
}) {
    const result = Database.db.prepare(`
        INSERT INTO articles (
            author_id,
            title,
            slug,
            content,
            status
        )
        VALUES (?, ?, ?, ?, 'DRAFT')
    `).run(
        author_id,
        title,
        slug,
        content
    );

    return findById(result.lastInsertRowid);
}

function publish(id) {
    Database.db.prepare(`
        UPDATE articles
        SET
            status = 'PUBLISHED',
            published_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(id);

    return findById(id);
}

export default {
    all,
    findById,
    findBySlug,
    create,
    publish
};