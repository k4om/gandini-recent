import Database from 'better-sqlite3'
import FirstTime from './first-time-creation.js';
import { exists } from 'node:fs/promises'

export const db_file = process.env.DB_FILE || 'data/db.db';
const not_first_time = await exists(db_file);

export let db = null;

export function initDatabase() {
    if (db) return;
    
    db = new Database(db_file);
    db.pragma('journal_mode = WAL');

    if (!not_first_time) {
        FirstTime.init(db);
    }
}
