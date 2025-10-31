import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface PaymentRecord {
  id: string;
  studentId: string;
  Mois: string[];
  Montante: number;
  Date: string;
  status: string | number;
  matieres: any[]; // array of { idMat }
  createdAt?: string;
  updatedAt?: string;
}

export function createPaymentsTable() {
  run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      Mois TEXT,
      Montante REAL,
      Date TEXT,
      status TEXT,
      matieres TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function insertPayment(payload: Partial<PaymentRecord>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO payments (id, studentId, Mois, Montante, Date, status, matieres, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.studentId ?? null,
      payload.Mois ? JSON.stringify(payload.Mois) : JSON.stringify([]),
      payload.Montante ?? 0,
      payload.Date ?? null,
      payload.status ?? null,
      payload.matieres ? JSON.stringify(payload.matieres) : JSON.stringify([]),
      now,
      now,
    ]
  );
  return findPaymentById(id);
}

export function findPaymentById(id: string) {
  const row = get<any>(`SELECT * FROM payments WHERE id = ?`, [id]);
  if (!row) return null;
  return normalizeRow(row);
}

export function listPayments(limit = 100, offset = 0) {
  const rows = all<any>(`SELECT * FROM payments LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
  return rows.map(normalizeRow);
}

export function listPaymentsByStudent(studentId: string) {
  const rows = all<any>(`SELECT * FROM payments WHERE studentId = ?`, [
    studentId,
  ]);
  return rows.map(normalizeRow);
}

export function updatePayment(id: string, updates: Partial<PaymentRecord>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.Mois !== undefined) {
    sets.push(`Mois = ?`);
    params.push(JSON.stringify(updates.Mois));
  }
  if (updates.Montante !== undefined) {
    sets.push(`Montante = ?`);
    params.push(updates.Montante);
  }
  if (updates.Date !== undefined) {
    sets.push(`Date = ?`);
    params.push(updates.Date);
  }
  if (updates.status !== undefined) {
    sets.push(`status = ?`);
    params.push(updates.status);
  }
  if (updates.matieres !== undefined) {
    sets.push(`matieres = ?`);
    params.push(JSON.stringify(updates.matieres));
  }
  if (sets.length === 0) return findPaymentById(id);
  const sql = `UPDATE payments SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findPaymentById(id);
}

export function deletePaymentsByStudent(studentId: string) {
  run(`DELETE FROM payments WHERE studentId = ?`, [studentId]);
  return true;
}

function normalizeRow(row: any) {
  return {
    id: row.id,
    studentId: row.studentId,
    Mois: row.Mois ? JSON.parse(row.Mois) : [],
    Montante: row.Montante,
    Date: row.Date,
    status: row.status,
    matieres: row.matieres ? JSON.parse(row.matieres) : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as PaymentRecord;
}
