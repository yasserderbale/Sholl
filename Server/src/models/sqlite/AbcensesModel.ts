import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface AbcenseRecord {
  id: string;
  studentId: string;
  Date: string;
  cause?: string;
  matieres: any[]; // array of { idMat }
  createdAt?: string;
  updatedAt?: string;
}

export function createAbcensesTable() {
  run(`
    CREATE TABLE IF NOT EXISTS absences (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      Date TEXT,
      cause TEXT,
      matieres TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function insertAbsence(payload: Partial<AbcenseRecord>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO absences (id, studentId, Date, cause, matieres, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.studentId ?? null,
      payload.Date ?? null,
      payload.cause ?? null,
      payload.matieres ? JSON.stringify(payload.matieres) : JSON.stringify([]),
      now,
      now,
    ]
  );
  return findAbsenceById(id);
}

export function findAbsenceById(id: string) {
  const row = get<any>(`SELECT * FROM absences WHERE id = ?`, [id]);
  if (!row) return null;
  return normalizeRow(row);
}

export function listAbsences(limit = 100, offset = 0) {
  const rows = all<any>(`SELECT * FROM absences LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
  return rows.map(normalizeRow);
}

export function listAbsencesByStudent(studentId: string) {
  const rows = all<any>(`SELECT * FROM absences WHERE studentId = ?`, [
    studentId,
  ]);
  return rows.map(normalizeRow);
}

function normalizeRow(row: any) {
  return {
    id: row.id,
    studentId: row.studentId,
    Date: row.Date,
    cause: row.cause,
    matieres: row.matieres ? JSON.parse(row.matieres) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as AbcenseRecord;
}

export function deleteAbsence(id: string): boolean {
  try {
    const result = run(`DELETE FROM absences WHERE id = ?`, [id]);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting absence:', error);
    return false;
  }
}

export function deleteAllAbsences(): boolean {
  try {
    run(`DELETE FROM absences`);
    return true;
  } catch (error) {
    console.error('Error deleting all absences:', error);
    return false;
  }
}

export function updateAbsence(id: string, updates: Partial<AbcenseRecord>): AbcenseRecord | null {
  const now = new Date().toISOString();
  const existing = findAbsenceById(id);
  
  if (!existing) {
    return null;
  }
  
  const updatedRecord = {
    ...existing,
    ...updates,
    updatedAt: now,
  };
  
  run(
    `UPDATE absences SET 
      studentId = ?, 
      Date = ?, 
      cause = ?, 
      matieres = ?, 
      updatedAt = ? 
    WHERE id = ?`,
    [
      updatedRecord.studentId,
      updatedRecord.Date,
      updatedRecord.cause,
      JSON.stringify(updatedRecord.matieres || []),
      now,
      id
    ]
  );
  
  return findAbsenceById(id);
}
