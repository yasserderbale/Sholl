import {
  createMatiere,
  listMatieres,
  findMatiereById,
  updateMatiere,
  deleteMatiere,
  searchMatieresByName,
  createMatieresTable,
} from "../models/sqlite/MatieresModel";

export const Newmatire = async ({ identifiante, namee, prix, Niveau }: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  if (!namee || !prix || !Niveau)
    return { StatusCode: 400, data: "missing fields" };
  createMatieresTable();
  const mat = createMatiere({ name: namee, prix, Niveau });
  return { StatusCode: 200, data: mat };
};

export const Getmatieres = async ({ identifiante }: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  const rows = listMatieres();
  return { StatusCode: 200, data: rows };
};

export const Getonemat = async ({ identifiante, idmat }: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  const mat = findMatiereById(idmat);
  if (!mat) return { StatusCode: 404, data: "not found" };
  return { StatusCode: 200, data: mat };
};

export const Deletmatiere = async ({ idmatiere, identifiante }: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  if (!idmatiere) return { StatusCode: 400, data: "no id" };
  deleteMatiere(idmatiere);
  return { StatusCode: 200, data: "deleted" };
};

export const updatematiere = async ({
  idmatiere,
  identifiante,
  prix,
  Niveau,
}: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  const updated = updateMatiere(idmatiere, { prix, Niveau });
  return { StatusCode: 200, data: updated };
};

export const Searchonmat = async ({ identifiante, searche }: any) => {
  if (!identifiante) return { StatusCode: 401, data: "no identifiante" };
  const rows = searchMatieresByName(searche || "");
  return { StatusCode: 200, data: rows };
};
