import { run, get, all } from "../../db/sqlite";
import { v4 as uuidv4 } from "uuid";

export interface Matiere {
  id: string;
  name: string;
  prix: number;
  Niveau: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createMatieresTable() {
  run(`
    CREATE TABLE IF NOT EXISTS matieres (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prix REAL NOT NULL,
      Niveau TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT,
      UNIQUE(name, Niveau)
    )
  `);
}

export function createMatiere(payload: Partial<Matiere>) {
  const id = uuidv4();
  const now = new Date().toISOString();
  run(
    `INSERT INTO matieres (id, name, prix, Niveau, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.name ?? null,
      payload.prix ?? 0,
      payload.Niveau ?? null,
      now,
      now,
    ]
  );
  return findMatiereById(id);
}

export function findMatiereById(id: string) {
  return get<Matiere>(`SELECT * FROM matieres WHERE id = ?`, [id]) || null;
}

export function listMatieres(limit = 100, offset = 0) {
  return all<Matiere>(`SELECT * FROM matieres LIMIT ? OFFSET ?`, [
    limit,
    offset,
  ]);
}

export function searchMatieresByName(name: string) {
  return all<Matiere>(`SELECT * FROM matieres WHERE name LIKE ?`, [
    `%${name}%`,
  ]);
}

export function updateMatiere(id: string, updates: Partial<Matiere>) {
  const now = new Date().toISOString();
  const sets: string[] = [];
  const params: any[] = [];
  if (updates.name !== undefined) {
    sets.push(`name = ?`);
    params.push(updates.name);
  }
  if (updates.prix !== undefined) {
    sets.push(`prix = ?`);
    params.push(updates.prix);
  }
  if (updates.Niveau !== undefined) {
    sets.push(`Niveau = ?`);
    params.push(updates.Niveau);
  }
  if (sets.length === 0) return findMatiereById(id);
  const sql = `UPDATE matieres SET ${sets.join(
    ", "
  )}, updatedAt = ? WHERE id = ?`;
  params.push(now, id);
  run(sql, params);
  return findMatiereById(id);
}

export function deleteMatiere(id: string) {
  run(`DELETE FROM matieres WHERE id = ?`, [id]);
  return true;
}
