import Database from 'better-sqlite3'
import FirstTime from './first-time-creation.js';
import Dummy from './dummy.js';
import { access, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path';

export const db_file = process.env.DB_FILE || 'data/db.db';
await mkdir(dirname(db_file), { recursive: true });

let not_first_time = false;
try {
    not_first_time = await access(db_file);
} catch (err) { }

export let __db = null;

function init() {
    if (__db) return;

    __db = new Database(db_file);
    __db.pragma('journal_mode = WAL');

    if (!not_first_time) {
        FirstTime.init(__db);
        Dummy.init(__db);
    }
}

export default {
    init,
    get db() {
        return __db;
    },
    db_file
};