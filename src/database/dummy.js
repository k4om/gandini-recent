import bcrypt from 'bcryptjs'

function init(db) {

    const users = [
        {
            identifier: '23010001',
            nis: 23010001,
            name: 'Ahmad Fauzan',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 0
        },
        {
            identifier: '23010002',
            nis: 23010002,
            name: 'Budi Santoso',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 1
        },
        {
            identifier: '23010003',
            nis: 23010003,
            name: 'Citra Lestari',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 0
        },
        {
            identifier: '23010004',
            nis: 23010004,
            name: 'Dimas Pratama',
            role: 'STUDENT',
            is_admin: 0,
            can_write: 0
        },
        {
            identifier: 'guru.rina',
            nis: null,
            name: 'Bu Rina',
            role: 'TEACHER',
            is_admin: 0,
            can_write: 1
        },
        {
            identifier: 'guru.andi',
            nis: null,
            name: 'Pak Andi',
            role: 'TEACHER',
            is_admin: 1,
            can_write: 1
        }
    ];


    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (
            identifier,
            nis,
            name,
            role,
            is_admin,
            can_write,
            password_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);


    for (const user of users) {
        insertUser.run(
            user.identifier,
            user.nis,
            user.name,
            user.role,
            user.is_admin,
            user.can_write,
            bcrypt.hashSync('password', 10)
        );
    }


    const usersDb = db.prepare(`
        SELECT id, identifier
        FROM users
    `).all();


    const findUser = (identifier) =>
        usersDb.find(
            x => x.identifier === identifier
        );


    const articles = [
        {
            author: '23010002',
            title: 'Persiapan Olimpiade Sains Sekolah',
            slug: 'persiapan-olimpiade-sains',
            content: 'Tim sekolah sedang melakukan persiapan untuk olimpiade sains tingkat daerah.',
            status: 'PUBLISHED'
        },
        {
            author: 'guru.rina',
            title: 'Jadwal Ujian Semester Genap',
            slug: 'jadwal-ujian-semester-genap',
            content: 'Berikut jadwal ujian semester genap tahun ajaran ini.',
            status: 'PUBLISHED'
        },
        {
            author: 'guru.andi',
            title: 'Pengumuman Libur Nasional',
            slug: 'pengumuman-libur-nasional',
            content: 'Sekolah akan mengikuti jadwal libur nasional.',
            status: 'PUBLISHED'
        },
        {
            author: '23010002',
            title: 'Kegiatan Bakti Sosial OSIS',
            slug: 'kegiatan-bakti-sosial-osis',
            content: 'OSIS mengadakan kegiatan bakti sosial bersama warga sekitar.',
            status: 'DRAFT'
        }
    ];


    const insertArticle = db.prepare(`
        INSERT OR IGNORE INTO articles (
            author_id,
            title,
            slug,
            content,
            status,
            published_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);


    for (const article of articles) {

        const author = findUser(article.author);

        if (!author)
            continue;

        insertArticle.run(
            author.id,
            article.title,
            article.slug,
            article.content,
            article.status,
            article.status === 'PUBLISHED'
                ? new Date().toISOString()
                : null
        );
    }


    const articleDb = db.prepare(`
        SELECT id
        FROM articles
    `).all();


    const insertComment = db.prepare(`
        INSERT INTO comments (
            article_id,
            user_id,
            content
        )
        VALUES (?, ?, ?)
    `);


    if (articleDb.length > 0) {

        const ahmad = findUser('23010001');

        insertComment.run(
            articleDb[0].id,
            ahmad.id,
            'Semoga tim sekolah menang!'
        );

        insertComment.run(
            articleDb[0].id,
            findUser('guru.rina').id,
            'Tetap semangat belajar.'
        );
    }

}


export default {
    init
};