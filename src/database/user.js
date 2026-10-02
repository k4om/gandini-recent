import Database from './index.js';

function findById(id) {
    return Database.db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(id);
}

function findByNIS(nis) {
    return Database.db.prepare(`
        SELECT *
        FROM users
        WHERE nis = ?
    `).get(nis);
}

function setCanWrite(id, value) {
    Database.db.prepare(`
        UPDATE users
        SET can_write = ?
        WHERE id = ?
    `).run(
        value ? 1 : 0,
        id
    );

    return findById(id);
}

function create({
    nis = null,
    name,
    role = 'STUDENT',
    can_write = false,
    password_hash = null
}) {
    const result = Database.db.prepare(`
        INSERT INTO users (
            nis,
            name,
            role,
            can_write,
            password_hash
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(
        nis,
        name,
        role,
        can_write ? 1 : 0,
        password_hash
    );

    return findById(result.lastInsertRowid);
}


function findAll() {
    return Database.db.prepare(`
        SELECT *
        FROM users
        ORDER BY id ASC
    `).all();
}


function updateRole(id, role) {
    Database.db.prepare(`
        UPDATE users
        SET role = ?
        WHERE id = ?
    `).run(role, id);

    return findById(id);
}

export default {
    findById,
    findByNIS,
    findAll,
    create,
    setCanWrite,
    updateRole
};