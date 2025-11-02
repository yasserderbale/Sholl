import {
  createStudent,
  listStudents,
  searchStudentsByName,
  findStudentById,
  updateStudent as updateStudentModel,
  deleteStudent,
  createStudentsTable,
} from "../models/sqlite/StudentModel";
import { pushStudentToGroups, removeStudentFromGroups } from "./GroupeSqlite";
import { initDatabase } from "../db/sqlite";

export const Registerstud = async ({
  identifinate,
  Name,
  Age,
  Nivuea,
  Spécialité,
  Groupe,
  Genre,
  Telephone,
  modules,
  Date,
}: any) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  if (
    !Name ||
    !Age ||
    !Nivuea ||
    !Telephone ||
    !modules ||
    !Date ||
    !Genre ||
    !Groupe
  )
    return { StatusCode: 501, data: "you have insert all informations" };

  // create students table if not exists
  createStudentsTable();

  const newStudent = createStudent({
    Name,
    Age,
    Nivuea,
    Spécialité,
    Groupe,
    Genre,
    Telephone,
    modules,
    Date,
  });
  // push student id to groupes
  try {
    if (Groupe && Array.isArray(Groupe) && newStudent?.id) {
      pushStudentToGroups(Groupe, newStudent.id);
    }
  } catch (e) {
    // non-fatal: log and continue
    console.error("failed to add student to groupes", e);
  }
  return { StatusCode: 200, data: { newStudent, registname: [] } };
};

export const getStudentes = async ({ identifinate }: any) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  const students = listStudents();
  return { StatusCode: 200, data: students };
};

export const SearchStudentes = async ({ identifinate, name }: any) => {
  if (!identifinate)
    return { StatusCode: 404, data: "ther isn`t identifiante" };
  if (!name) return { StatusCode: 400, data: "name missing" };
  const students = searchStudentsByName(name as string);
  return { StatusCode: 200, data: students };
};

export const getStudentesOne = async ({ identifinate, idStud }: any) => {
  if (!identifinate)
    return { StatusCode: 404, data: "ther isn`t identifiante" };
  if (!idStud) return { StatusCode: 404, data: "id not provider" };
  const student = findStudentById(idStud);
  if (!student) return { StatusCode: 404, data: "failed getOne student" };
  return { StatusCode: 200, data: student };
};

export const updateStudent = async ({
  identifinate,
  idStud,
  ...updates
}: any) => {
  if (!identifinate)
    return { StatusCode: 404, data: "identifinate not provided" };
  if (!idStud) return { StatusCode: 404, data: "id not provided" };
  const existing = findStudentById(idStud);
  if (!existing) return { StatusCode: 404, data: "Student not found" };
  // handle group membership changes: remove from old groups and add to new ones if Groupe provided
  if (updates.Groupe) {
    try {
      const oldGroupIds = existing.Groupe || [];
      const newGroupIds = updates.Groupe || [];
      // remove from groups that are no longer present
      const toRemove = oldGroupIds.filter(
        (g: string) => !newGroupIds.includes(g)
      );
      const toAdd = newGroupIds.filter((g: string) => !oldGroupIds.includes(g));
      if (toRemove.length) removeStudentFromGroups(toRemove, idStud);
      if (toAdd.length) pushStudentToGroups(toAdd, idStud);
    } catch (e) {
      console.error("failed to sync groups for student update", e);
    }
  }
  const updated = updateStudentModel(idStud, updates);
  return { StatusCode: 200, data: updated };
};

export const DeletStudents = async ({ identifinate, idStud }: any) => {
  if (!identifinate)
    return { StatusCode: 404, data: "identinfiante not provide" };
  if (!idStud) return { StatusCode: 404, data: "id not provider" };
  const existing = findStudentById(idStud);
  if (!existing) return { StatusCode: 404, data: "no Studente" };
  
  const db = initDatabase();
  
  // 1. حذف جميع مدفوعات الطالب من paiements_fr
  try {
    const deletedFr = db.prepare(`
      DELETE FROM paiements_fr 
      WHERE json_extract(studentId, '$[0]') = ? 
         OR studentId LIKE ?
    `).run(idStud, `%"${idStud}"%`);
    console.log(`Deleted ${deletedFr.changes} payments for student ${idStud}`);
  } catch (e) {
    console.error("failed to delete payments from paiements_fr", e);
  }
  
  // 2. حذف الطالب من المجموعات
  try {
    if (existing.Groupe && Array.isArray(existing.Groupe)) {
      removeStudentFromGroups(existing.Groupe, idStud);
    }
  } catch (e) {
    console.error("failed to remove student from groupes on delete", e);
  }
  
  // 3. حذف الطالب نفسه
  deleteStudent(idStud);
  return { StatusCode: 200, data: "Student and all related payments deleted successfully" };
};
