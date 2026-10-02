function init(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            identifier TEXT UNIQUE NOT NULL,

            nis INTEGER UNIQUE,

            name TEXT NOT NULL,

            role TEXT NOT NULL DEFAULT 'STUDENT',

            is_admin INTEGER NOT NULL DEFAULT 0,

            can_write INTEGER NOT NULL DEFAULT 0,

            password_hash TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );


        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            author_id INTEGER NOT NULL,

            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,

            excerpt TEXT,

            content TEXT NOT NULL,

            status TEXT NOT NULL DEFAULT 'DRAFT',

            published_at DATETIME,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (author_id)
                REFERENCES users(id)
        );


        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            article_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,

            content TEXT NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (article_id)
                REFERENCES articles(id),

            FOREIGN KEY (user_id)
                REFERENCES users(id)
        );
    `);


    // Create default admin if none exists
    const admin = db.prepare(`
        SELECT *
        FROM users
        WHERE is_admin = 1
        LIMIT 1
    `).get();


    if (!admin) {
        db.prepare(`
            INSERT INTO users (
                identifier,
                name,
                role,
                is_admin,
                can_write
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            'admin',
            'Administrator',
            'SPECIAL',
            1,
            1
        );
    }
}


export default {
    init
};