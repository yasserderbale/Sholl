import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface TeacherRow {
  id: string;
  name: string;
  age?: number;
  specialty?: string;
  gender?: "Male" | "Female";
  phone?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createTeachersTable() {
  run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      specialty TEXT,
      gender TEXT,
      phone TEXT,
      notes TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);
}

export function insertTeacher(payload: Partial<TeacherRow>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO teachers (id, name, age, specialty, gender, phone, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.name ?? null,
      payload.age ?? null,
      payload.specialty ?? null,
      payload.gender ?? null,
      payload.phone ?? null,
      payload.notes ?? null,
      now,
      now,
    ]
  );
  return findTeacherById(id);
}

export function findTeacherById(id: string) {
  const row = get<any>(`SELECT * FROM teachers WHERE id = ?`, [id]);
  return row ? (row as TeacherRow) : null;
}

export function listTeachers(limit = 100, offset = 0) {
  return all<TeacherRow>(`SELECT * FROM teachers LIMIT ? OFFSET ?`, [limit, offset]);
}

export function searchTeachersByName(name: string) {
  return all<TeacherRow>(`SELECT * FROM teachers WHERE name LIKE ?`, [
    `%${name}%`,
  ]);
}

export function updateTeacher(id: string, updates: Partial<TeacherRow>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  const fields: (keyof TeacherRow)[] = [
    "name",
    "age",
    "specialty",
    "gender",
    "phone",
    "notes",
  ];
  for (const key of fields) {
    if (updates[key] !== undefined) {
      sets.push(`${key} = ?`);
      // @ts-ignore
      params.push(updates[key]);
    }
  }
  if (sets.length === 0) return findTeacherById(id);
  const sql = `UPDATE teachers SET ${sets.join(", ")}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findTeacherById(id);
}

export function deleteTeacher(id: string) {
  run(`DELETE FROM teachers WHERE id = ?`, [id]);
  return true;
}


