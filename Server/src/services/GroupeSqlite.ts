import {
  createGroupe,
  listGroupes,
  findGroupeById,
  updateGroupe,
  deleteGroupe,
  searchGroupesByName,
  createGroupesTable,
  addStudentToGroupe,
  removeStudentFromGroupe,
} from "../models/sqlite/GroupModel";

export const AddnewGroup = async ({
  identifaite,
  name,
  nbrmax,
  fraise,
}: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  if (!name || !nbrmax || !fraise)
    return { StatusCode: 400, data: "missing fields" };
  createGroupesTable();
  const g = createGroupe({ name, Nbrmax: nbrmax, fraisscolaire: fraise });
  return { StatusCode: 200, data: g };
};

export const GetAllgroupes = async ({ identifaite }: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  const rows = listGroupes();
  return { StatusCode: 200, data: rows };
};

export const Getongroupe = async ({ identifaite, idgroupe }: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  const g = findGroupeById(idgroupe);
  return { StatusCode: 200, data: g };
};

export const deleteongroupe = async ({ identifaite, idgroupe }: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  deleteGroupe(idgroupe);
  return { StatusCode: 200, data: "deleted" };
};

export const Updateongroupe = async ({
  identifaite,
  idgroupe,
  name,
  Nbrmax,
  fraisscolaire,
}: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  const updated = updateGroupe(idgroupe, { name, Nbrmax, fraisscolaire });
  return { StatusCode: 200, data: updated };
};

export const Searchgr = async ({ identifaite, search }: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  const rows = searchGroupesByName(search || "");
  return { StatusCode: 200, data: rows };
};

// helpers used by RegisterstudSqlite
export const pushStudentToGroups = async (
  groupIds: string[],
  studentId: string
) => {
  return groupIds.map((gid) => addStudentToGroupe(gid, studentId));
};

export const removeStudentFromGroups = async (
  groupIds: string[],
  studentId: string
) => {
  return groupIds.map((gid) => removeStudentFromGroupe(gid, studentId));
};
