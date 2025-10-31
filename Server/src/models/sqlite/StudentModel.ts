import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface Student {
  id: string;
  Name: string;
  Age?: number;
  Spécialité?: string;
  Groupe?: string[]; // array of group ids (strings)
  Genre?: string;
  Nivuea?: number;
  Telephone?: string;
  modules?: any[]; // minimal representation: array of { matid }
  Date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createStudentsTable() {
  run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      Name TEXT,
      Age INTEGER,
      Spécialité TEXT,
      Groupe TEXT,
      Genre TEXT,
      Nivuea INTEGER,
      Telephone TEXT,
      modules TEXT,
      Date TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function createStudent(payload: Partial<Student>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO students (id, Name, Age, Spécialité, Groupe, Genre, Nivuea, Telephone, modules, Date, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.Name ?? null,
      payload.Age ?? null,
      payload.Spécialité ?? null,
      payload.Groupe ? JSON.stringify(payload.Groupe) : null,
      payload.Genre ?? null,
      payload.Nivuea ?? null,
      payload.Telephone ?? null,
      payload.modules ? JSON.stringify(payload.modules) : null,
      payload.Date ?? null,
      now,
      now,
    ]
  );
  return findStudentById(id);
}

export function findStudentById(id: string) {
  const row = get<Student & { modules?: string; Groupe?: string }>(
    `SELECT * FROM students WHERE id = ?`,
    [id]
  );
  if (!row) return null;
  return normalizeRow(row);
}

export function listStudents(limit = 100, offset = 0) {
  const rows = all<Student & { modules?: string; Groupe?: string }>(
    `SELECT * FROM students LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows.map(normalizeRow);
}

export function searchStudentsByName(name: string) {
  const rows = all<Student & { modules?: string; Groupe?: string }>(
    `SELECT * FROM students WHERE Name LIKE ?`,
    [`%${name}%`]
  );
  return rows.map(normalizeRow);
}

export function updateStudent(id: string, updates: Partial<Student>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.Name !== undefined) {
    sets.push(`Name = ?`);
    params.push(updates.Name);
  }
  if (updates.Age !== undefined) {
    sets.push(`Age = ?`);
    params.push(updates.Age);
  }
  if (updates.Spécialité !== undefined) {
    sets.push(`Spécialité = ?`);
    params.push(updates.Spécialité);
  }
  if (updates.Groupe !== undefined) {
    sets.push(`Groupe = ?`);
    params.push(JSON.stringify(updates.Groupe));
  }
  if (updates.Genre !== undefined) {
    sets.push(`Genre = ?`);
    params.push(updates.Genre);
  }
  if (updates.Nivuea !== undefined) {
    sets.push(`Nivuea = ?`);
    params.push(updates.Nivuea);
  }
  if (updates.Telephone !== undefined) {
    sets.push(`Telephone = ?`);
    params.push(updates.Telephone);
  }
  if (updates.modules !== undefined) {
    sets.push(`modules = ?`);
    params.push(JSON.stringify(updates.modules));
  }
  if (updates.Date !== undefined) {
    sets.push(`Date = ?`);
    params.push(updates.Date);
  }
  if (sets.length === 0) return findStudentById(id);
  const sql = `UPDATE students SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findStudentById(id);
}

export function deleteStudent(id: string) {
  run(`DELETE FROM students WHERE id = ?`, [id]);
  return true;
}

function normalizeRow(row: any) {
  const modules = row.modules ? JSON.parse(row.modules) : [];
  const Groupe = row.Groupe ? JSON.parse(row.Groupe) : [];
  return {
    id: row.id,
    Name: row.Name,
    Age: row.Age,
    Spécialité: row.Spécialité,
    Groupe,
    Genre: row.Genre,
    Nivuea: row.Nivuea,
    Telephone: row.Telephone,
    modules,
    Date: row.Date,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as Student;
}
