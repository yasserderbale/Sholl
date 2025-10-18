import { Groupemodel } from "../models/Groupe";
interface IGroupe {
  identifaite: string;
  name: string;
  nbrmax: number;
  fraise: number;
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
  const checkname = await Groupemodel.findOne({ name });
  if (checkname?.name == name)
    return { StatusCode: 404, data: "name deja exister" };
  const addnewgroup = await Groupemodel.create({
    name,
    Nbrmax: nbrmax,
    fraisscolaire: fraise,
  });
  if (!addnewgroup) return { StatusCode: 404, data: addnewgroup };
  return { StatusCode: 200, data: addnewgroup };
};
interface Iallgroups {
  identifaite: string;
}
export const GetAllgroupes = async ({ identifaite }: Iallgroups) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  const getgroups = await Groupemodel.find().populate("Studentid");
  if (!getgroups) return { StatusCode: 404, data: getgroups };
  return { StatusCode: 200, data: getgroups };
};
interface Iongroups {
  identifaite: string;
  idgroupe: string;
}
export const Getongroupe = async ({ identifaite, idgroupe }: Iongroups) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!idgroupe) return { StatusCode: 401, data: "there isn`t of groupe " };
  const fetchgrouid = await Groupemodel.findById(idgroupe).populate("Studentid");
  return { StatusCode: 200, data: fetchgrouid };
};
export const deleteongroupe = async ({ identifaite, idgroupe }: Iongroups) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!idgroupe) return { StatusCode: 401, data: "there isn`t of groupe " };
  const fetchgrouid = await Groupemodel.findByIdAndDelete(idgroupe);
  return { StatusCode: 200, data: fetchgrouid };
};
interface Iupdategroups {
  identifaite: string;
  idgroupe: string;
  name: string;
  Nbrmax: number;
  fraisscolaire: number;
}
export const Updateongroupe = async ({
  identifaite,
  idgroupe,
  name,
  Nbrmax,
  fraisscolaire,
}: Iupdategroups) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!idgroupe) return { StatusCode: 401, data: "there isn`t of groupe " };
  if (!name && !Nbrmax && !fraisscolaire)
    return { StatusCode: 401, data: "youve to insert any update" };
  const fetchupdate = await Groupemodel.findByIdAndUpdate(
    idgroupe,
    { $set: { name, Nbrmax, fraisscolaire } },
    { new: true }
  );
  if (!fetchupdate)
    return { StatusCode: 404, data: "no updating", fetchupdate };
  return { StatusCode: 200, data: fetchupdate };
};
interface Isearch {
  identifaite: string;
  search: any;
}
export const Searchgr = async ({ identifaite, search }: Isearch) => {
  if (!identifaite) return { StatusCode: 401, data: "there isn`t tocken" };
  const searchOne = await Groupemodel.find({
    name: { $regex: `${search}`, $options: "i" },
  });
  return { StatusCode: 200, data: searchOne };
};
