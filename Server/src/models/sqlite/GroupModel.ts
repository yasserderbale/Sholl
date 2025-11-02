import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface Groupe {
  id: string;
  name: string;
  Nbrmax: number;
  fraisscolaire: number;
  Studentid: string[]; // array of student ids
  createdAt?: string;
  updatedAt?: string;
}

export function createGroupesTable() {
  run(`
    CREATE TABLE IF NOT EXISTS groupes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      Nbrmax INTEGER NOT NULL,
      fraisscolaire REAL NOT NULL,
      Studentid TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function createGroupe(payload: Partial<Groupe>) {
  // التحقق من وجود اسم مشابه (case-insensitive)
  if (payload.name) {
    const existing = get<any>(
      `SELECT * FROM groupes WHERE LOWER(name) = LOWER(?)`,
      [payload.name]
    );
    if (existing) {
      throw new Error(`Un groupe avec le nom "${payload.name}" existe déjà`);
    }
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO groupes (id, name, Nbrmax, fraisscolaire, Studentid, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.name ?? null,
      payload.Nbrmax ?? 0,
      payload.fraisscolaire ?? 0,
      payload.Studentid
        ? JSON.stringify(payload.Studentid)
        : JSON.stringify([]),
      now,
      now,
    ]
  );
  return findGroupeById(id);
}

export function findGroupeById(id: string) {
  const row = get<any>(`SELECT * FROM groupes WHERE id = ?`, [id]);
  if (!row) return null;
  return normalizeRow(row);
}

export function listGroupes(limit = 100, offset = 0) {
  const rows = all<any>(`SELECT * FROM groupes LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
  return rows.map(normalizeRow);
}

export function searchGroupesByName(name: string) {
  const rows = all<any>(`SELECT * FROM groupes WHERE name LIKE ?`, [
    `%${name}%`,
  ]);
  return rows.map(normalizeRow);
}

export function updateGroupe(id: string, updates: Partial<Groupe>) {
  // التحقق من وجود اسم مشابه (case-insensitive) عند تحديث الاسم
  if (updates.name !== undefined) {
    const existing = get<any>(
      `SELECT * FROM groupes WHERE LOWER(name) = LOWER(?) AND id != ?`,
      [updates.name, id]
    );
    if (existing) {
      throw new Error(`Un groupe avec le nom "${updates.name}" existe déjà`);
    }
  }
  
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.name !== undefined) {
    sets.push(`name = ?`);
    params.push(updates.name);
  }
  if (updates.Nbrmax !== undefined) {
    sets.push(`Nbrmax = ?`);
    params.push(updates.Nbrmax);
  }
  if (updates.fraisscolaire !== undefined) {
    sets.push(`fraisscolaire = ?`);
    params.push(updates.fraisscolaire);
  }
  if (updates.Studentid !== undefined) {
    sets.push(`Studentid = ?`);
    params.push(JSON.stringify(updates.Studentid));
  }
  if (sets.length === 0) return findGroupeById(id);
  const sql = `UPDATE groupes SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findGroupeById(id);
}

export function deleteGroupe(id: string) {
  run(`DELETE FROM groupes WHERE id = ?`, [id]);
  return true;
}

export function addStudentToGroupe(groupeId: string, studentId: string) {
  const g = findGroupeById(groupeId);
  if (!g) return null;
  const ids = new Set(g.Studentid || []);
  ids.add(studentId);
  return updateGroupe(groupeId, { Studentid: Array.from(ids) });
}

export function removeStudentFromGroupe(groupeId: string, studentId: string) {
  const g = findGroupeById(groupeId);
  if (!g) return null;
  const ids = (g.Studentid || []).filter((id) => id !== studentId);
  return updateGroupe(groupeId, { Studentid: ids });
}

function normalizeRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    Nbrmax: row.Nbrmax,
    fraisscolaire: row.fraisscolaire,
    Studentid: row.Studentid ? JSON.parse(row.Studentid) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as Groupe;
}
