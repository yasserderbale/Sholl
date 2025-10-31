import {
  insertAbsence,
  listAbsences,
  listAbsencesByStudent,
  deleteAbsence,
  deleteAllAbsences,
  findAbsenceById,
  updateAbsence as updateAbsenceModel,
  AbcenseRecord
} from "../models/sqlite/AbcensesModel";
import { findStudentById } from "../models/sqlite/StudentModel";
import { createAbcensesTable } from "../models/sqlite/AbcensesModel";

export const RegistnewAbcense = async ({
  identifaite,
  idMat,
  Date,
  idStud,
  cause,
}: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  if (!idMat || !Date || !idStud || idStud.length === 0)
    return { StatusCode: 501, data: "you must insert all information!" };
  createAbcensesTable();
  // ids is expected to be array of student ids
  const ids = Array.isArray(idStud) ? idStud : [idStud];
  const newAbData = {
    Date,
    cause,
    matieres: Array.isArray(idMat)
      ? idMat.map((m: any) => ({ idMat: m }))
      : [{ idMat }],
  };
  const results = [];
  for (const sid of ids) {
    const student = findStudentById(sid);
    // if student exists, insert absence record
    if (student) {
      const insertedAbsence = insertAbsence({
        studentId: sid,
        Date,
        cause,
        matieres: newAbData.matieres,
      });
      results.push(insertedAbsence);
    }
  }
  
  // التصحيح: نعيد رسالة نجاح بدلاً من المصفوفة
  return { StatusCode: 200, data: `تم إضافة ${results.length} غياب بنجاح` };
};

export const getAbcense = async ({ identifaite }: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const rows = listAbsences();
  return { StatusCode: 200, data: rows };
};

export const SearchAbcense = async ({ identifaite, search }: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  // naive: return all absences that link to students whose name matches. For now return all and let frontend filter.
  const rows = listAbsences();
  return { StatusCode: 200, data: rows };
};

export const removeAbsence = async (id: string) => {
  if (!id) {
    return { StatusCode: 400, data: "ID de l'absence manquant" };
  }
  
  const success = deleteAbsence(id);
  if (success) {
    return { StatusCode: 200, data: "Absence supprimée avec succès" };
  } else {
    return { StatusCode: 404, data: "Absence non trouvée ou erreur lors de la suppression" };
  }
};

export const removeAllAbsences = async () => {
  const success = deleteAllAbsences();
  if (success) {
    return { StatusCode: 200, data: "Toutes les absences ont été supprimées" };
  } else {
    return { StatusCode: 500, data: "Erreur lors de la suppression des absences" };
  }
};

export const updateAbsence = async (id: string, updates: Partial<AbcenseRecord> & { idStud?: string | string[], idMat?: string | string[] }): Promise<{
  StatusCode: number;
  data: string;
  absence?: AbcenseRecord;
}> => {
  if (!id) {
    return { StatusCode: 400, data: "ID de l'absence manquant" };
  }

  // Vérifier que l'absence existe
  const existingAbsence = findAbsenceById(id);
  if (!existingAbsence) {
    return { StatusCode: 404, data: "Absence non trouvée" };
  }

  // Préparer les données de mise à jour
  const updateData: any = {
    Date: updates.Date || existingAbsence.Date,
    cause: updates.cause || existingAbsence.cause,
  };

  // Si des étudiants sont fournis, mettre à jour la liste des étudiants
  if (updates.idStud) {
    updateData.studentId = Array.isArray(updates.idStud) 
      ? updates.idStud[0] 
      : updates.idStud;
  }

  // Si des matières sont fournies, les ajouter
  if (updates.idMat) {
    updateData.matieres = Array.isArray(updates.idMat)
      ? updates.idMat.map((m: any) => (typeof m === 'string' ? { idMat: m } : m))
      : [{ idMat: updates.idMat }];
  }

  const updatedAbsence = updateAbsenceModel(id, updateData);
  
  if (updatedAbsence) {
    return { 
      StatusCode: 200, 
      data: "Absence mise à jour avec succès",
      absence: updatedAbsence
    };
  } else {
    return { 
      StatusCode: 500, 
      data: "Erreur lors de la mise à jour de l'absence" 
    };
  }
};
