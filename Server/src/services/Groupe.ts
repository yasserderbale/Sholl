import { Groupemodel } from "../models/Groupe";
interface IGroupe {
  identifaite: String;
  name: String;
  nbrmax: Number;
  fraise: Number;
}
export const AddnewGroup = async ({
  identifaite,
  name,
  nbrmax,
  fraise,
}: IGroupe) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!name || !nbrmax || !fraise)
    return { StatusCode: 501, data: "youve inser all informations" };
  const addnewgroup = await Groupemodel.create({
    name,
    Nbrmax: nbrmax,
    fraisscolaire: fraise,
  });
  if (!addnewgroup) return { StatusCode: 404, data: addnewgroup };
  return { StatusCode: 200, data: addnewgroup };
};
interface Iallgroups {
  identifaite: String;
}
export const GetAllgroupes = async ({ identifaite }: Iallgroups) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  const getgroups = await Groupemodel.find();
  if (!getgroups) return { StatusCode: 404, data: getgroups };
  return { StatusCode: 200, data: getgroups };
};
