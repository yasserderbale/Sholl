import { run, get } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface LoginRow {
  id: string;
  identifiante: string;
  password: string; // hashed
  createdAt?: string;
  updatedAt?: string;
}

export function createLoginTable() {
  run(`
    CREATE TABLE IF NOT EXISTS logins (
      id TEXT PRIMARY KEY,
      identifiante TEXT UNIQUE,
      password TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function insertLogin(identifiante: string, password: string) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO logins (id, identifiante, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
    [id, identifiante, password, now, now]
  );
  return findLoginByIdentifiante(identifiante);
}

export function findLoginByIdentifiante(identifiante: string) {
  return (
    get<LoginRow>(`SELECT * FROM logins WHERE identifiante = ?`, [
      identifiante,
    ]) || null
  );
}
