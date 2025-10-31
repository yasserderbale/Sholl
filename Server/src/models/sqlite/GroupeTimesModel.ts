import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface GroupeTime {
  id: string;
  groupeId: string; // groupe id
  heureDebut: string;
  heureFin: string;
  jours: string[];
  classeId: string; // classe id
  createdAt?: string;
  updatedAt?: string;
}

export function createGroupeTimesTable() {
  run(`
    CREATE TABLE IF NOT EXISTS groupe_times (
      id TEXT PRIMARY KEY,
      groupeId TEXT NOT NULL,
      heureDebut TEXT NOT NULL,
      heureFin TEXT NOT NULL,
      jours TEXT NOT NULL,
      classeId TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function createGroupeTime(payload: Partial<GroupeTime>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO groupe_times (id, groupeId, heureDebut, heureFin, jours, classeId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.groupeId ?? null,
      payload.heureDebut ?? null,
      payload.heureFin ?? null,
      payload.jours ? JSON.stringify(payload.jours) : JSON.stringify([]),
      payload.classeId ?? null,
      now,
      now,
    ]
  );
  return findGroupeTimeById(id);
}

export function findGroupeTimeById(id: string) {
  const row = get<any>(`SELECT * FROM groupe_times WHERE id = ?`, [id]);
  if (!row) return null;
  return normalizeRow(row);
}

export function listGroupeTimes(limit = 100, offset = 0) {
  const rows = all<any>(`SELECT * FROM groupe_times LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
  return rows.map(normalizeRow);
}

export function updateGroupeTime(id: string, updates: Partial<GroupeTime>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.heureDebut !== undefined) {
    sets.push(`heureDebut = ?`);
    params.push(updates.heureDebut);
  }
  if (updates.heureFin !== undefined) {
    sets.push(`heureFin = ?`);
    params.push(updates.heureFin);
  }
  if (updates.jours !== undefined) {
    sets.push(`jours = ?`);
    params.push(JSON.stringify(updates.jours));
  }
  if (sets.length === 0) return findGroupeTimeById(id);
  const sql = `UPDATE groupe_times SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findGroupeTimeById(id);
}

export function deleteGroupeTime(id: string) {
  run(`DELETE FROM groupe_times WHERE id = ?`, [id]);
  return true;
}

function normalizeRow(row: any) {
  return {
    id: row.id,
    groupeId: row.groupeId,
    heureDebut: row.heureDebut,
    heureFin: row.heureFin,
    jours: row.jours ? JSON.parse(row.jours) : [],
    classeId: row.classeId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as GroupeTime;
}
