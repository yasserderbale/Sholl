import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface Classe {
  id: string;
  name: string;
  notes?: string;
  groupes: string[]; // array of GroupeTimes ids
  createdAt?: string;
  updatedAt?: string;
}

export function createClassesTable() {
  run(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT,
      groupes TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function createClasse(payload: Partial<Classe>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO classes (id, name, notes, groupes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.name ?? null,
      payload.notes ?? null,
      payload.groupes ? JSON.stringify(payload.groupes) : JSON.stringify([]),
      now,
      now,
    ]
  );
  return findClasseById(id);
}

export function findClasseById(id: string) {
  const row = get<any>(`SELECT * FROM classes WHERE id = ?`, [id]);
  if (!row) return null;
  return normalizeRow(row);
}

export function listClasses(limit = 100, offset = 0) {
  const rows = all<any>(`SELECT * FROM classes LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
  return rows.map(normalizeRow);
}

export function updateClasse(id: string, updates: Partial<Classe>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.name !== undefined) {
    sets.push(`name = ?`);
    params.push(updates.name);
  }
  if (updates.notes !== undefined) {
    sets.push(`notes = ?`);
    params.push(updates.notes);
  }
  if (updates.groupes !== undefined) {
    sets.push(`groupes = ?`);
    params.push(JSON.stringify(updates.groupes));
  }
  if (sets.length === 0) return findClasseById(id);
  const sql = `UPDATE classes SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findClasseById(id);
}

export function deleteClasse(id: string) {
  run(`DELETE FROM classes WHERE id = ?`, [id]);
  return true;
}

function normalizeRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    notes: row.notes,
    groupes: row.groupes ? JSON.parse(row.groupes) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as Classe;
}
