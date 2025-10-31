import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(__dirname, "../../data/database.sqlite");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let db: Database.Database | null = null;

export function initDatabase() {
  if (!db) {
    db = new Database(dbPath);
    try {
      db.pragma("journal_mode = WAL");
    } catch (e) {
      // ignore if pragma not supported
    }
  }
  return db;
}

export function run(sql: string, params: any[] = []) {
  return initDatabase()!
    .prepare(sql)
    .run(...params);
}

export function get<T = any>(sql: string, params: any[] = []) {
  return initDatabase()!
    .prepare(sql)
    .get(...params) as T | undefined;
}

export function all<T = any>(sql: string, params: any[] = []) {
  return initDatabase()!
    .prepare(sql)
    .all(...params) as T[];
}

export function close() {
  if (db) {
    db.close();
    db = null;
  }
}

export default {
  initDatabase,
  run,
  get,
  all,
  close,
};
