import {
  createClasse,
  findClasseById,
  listClasses,
  updateClasse as updateClasseModel,
  deleteClasse as deleteClasseModel,
  createClassesTable,
} from "../models/sqlite/ClasseModel";
import {
  listGroupeTimes,
  findGroupeTimeById,
  deleteGroupeTime,
  createGroupeTimesTable,
} from "../models/sqlite/GroupeTimesModel";
import { findGroupeById } from "../models/sqlite/GroupModel";

export const getAllClasses = async (identifaite: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  createClassesTable();
  createGroupeTimesTable();
  const classes = listClasses();
  // populate groupes
  const populated = classes.map((c: any) => {
    const groupes = (c.groupes || [])
      .map((gtId: string) => {
        const gt = findGroupeTimeById(gtId);
        if (!gt) return null;
        const grp = gt.groupeId ? findGroupeById(gt.groupeId) : null;
        return { ...gt, groupeId: grp };
      })
      .filter(Boolean);
    return { ...c, groupes };
  });
  return { StatusCode: 200, data: populated };
};

export const getClasseById = async (id: string) => {
  try {
    const classe = findClasseById(id);
    if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
    const groupes = (classe.groupes || [])
      .map((gtId: string) => {
        const gt = findGroupeTimeById(gtId);
        if (!gt) return null;
        const grp = gt.groupeId ? findGroupeById(gt.groupeId) : null;
        return { ...gt, groupeId: grp };
      })
      .filter(Boolean);
    return { StatusCode: 200, data: { ...classe, groupes } };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};

export const addClasse = async (
  identifaite: any,
  nom: string,
  description?: string
) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  createClassesTable();
  const newC = createClasse({ name: nom, notes: description });
  return { StatusCode: 200, data: newC };
};

export const updateClasse = async (
  id: string,
  nom: any,
  description: string,
  identifaite: any
) => {
  try {
    if (!identifaite)
      return { StatusCode: 402, data: "Identifiante non fourni" };
    if (!id || (!nom && !description))
      return { StatusCode: 400, data: "Tous les champs sont obligatoires" };
    const existing = findClasseById(id);
    if (!existing) return { StatusCode: 404, data: "Classe non trouvée" };
    const updated = updateClasseModel(id, { name: nom, notes: description });
    return { StatusCode: 200, data: updated };
  } catch (error) {
    console.error("Erreur UpdateClasse:", error);
    return { StatusCode: 500, data: "Erreur interne du serveur" };
  }
};

export const deleteClasse = async (identifaite: any, classId: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const classe = findClasseById(classId);
  if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
  // delete associated groupe times
  const gts = listGroupeTimes().filter((g: any) => g.classeId === classId);
  gts.forEach((g: any) => deleteGroupeTime(g.id));
  deleteClasseModel(classId);
  return { StatusCode: 200, data: "Classe supprimée avec succès" };
};

export const getGroupesByClasse = async (id: string) => {
  try {
    const classe = findClasseById(id);
    if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
    const groupes = (classe.groupes || [])
      .map((gtId: string) => {
        const gt = findGroupeTimeById(gtId);
        if (!gt) return null;
        const grp = gt.groupeId ? findGroupeById(gt.groupeId) : null;
        return { ...gt, groupeId: grp };
      })
      .filter(Boolean);
    return { StatusCode: 200, data: groupes };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};

export const searchClasse = async (query: string) => {
  try {
    if (!query || query.trim() === "")
      return {
        StatusCode: 400,
        data: "Veuillez fournir un mot-clé de recherche",
      };
    const all = listClasses();
    const regex = new RegExp(query, "i");
    const classes = all.filter(
      (c: any) => regex.test(c.name || "") || regex.test(c.notes || "")
    );
    if (!classes.length)
      return { StatusCode: 404, data: "Aucune classe trouvée" };
    return { StatusCode: 200, data: classes };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};
