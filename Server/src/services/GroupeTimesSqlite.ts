import {
  createGroupeTime,
  listGroupeTimes,
  findGroupeTimeById,
  updateGroupeTime,
  deleteGroupeTime,
  createGroupeTimesTable,
} from "../models/sqlite/GroupeTimesModel";
import {
  findClasseById,
  updateClasse,
  createClassesTable,
} from "../models/sqlite/ClasseModel";

export const addGroupeToClasse = async (
  groupeId: string,
  classeId: string,
  heureDebut: string,
  heureFin: string,
  jours: string[],
  identifaite: string
) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  if (!classeId || !groupeId || !heureDebut || !heureFin || !jours)
    return { StatusCode: 501, data: "missing fields" };
  createGroupeTimesTable();
  createClassesTable();
  const classe = findClasseById(classeId);
  if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
  const newGroupeTime = createGroupeTime({
    groupeId,
    heureDebut,
    heureFin,
    jours,
    classeId,
  });
  // push groupe time id into classe.groupes
  try {
    if (classe && newGroupeTime?.id) {
      const updated = updateClasse(classeId, {
        groupes: [...(classe.groupes || []), newGroupeTime.id],
      });
      return { StatusCode: 200, data: updated };
    }
  } catch (e) {
    console.error(e);
  }
  return { StatusCode: 200, data: newGroupeTime };
};

export const getAllGroupes = async (identifaite: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const rows = listGroupeTimes();
  return { StatusCode: 200, data: rows };
};

export const deleteGroupe = async (identifaite: string, groupeId: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  if (!groupeId) return { StatusCode: 404, data: "id groupe not valid" };
  deleteGroupeTime(groupeId);
  return { StatusCode: 200, data: "Groupe supprimé" };
};

export const getGroupeById = async (id: string) => {
  const row = findGroupeTimeById(id);
  if (!row) return { StatusCode: 404, data: "Groupe non trouvé" };
  return { StatusCode: 200, data: row };
};

export const updateGroupeTim = async (
  id: string,
  heureDebut?: string,
  heureFin?: string,
  jours?: string[]
) => {
  const updated = updateGroupeTime(id, { heureDebut, heureFin, jours });
  return { StatusCode: 200, data: updated };
};

export const searchGroupeTims = async (query: string) => {
  // naive search: return groupe times where groupe.name contains query by resolving groupes separately
  // For performance, keep it simple for now: return all and filter client-side
  const all = listGroupeTimes();
  const filtered = all.filter(
    (g) =>
      g.groupeId &&
      g.groupeId.toLowerCase().includes((query || "").toLowerCase())
  );
  return { StatusCode: 200, data: filtered };
};
