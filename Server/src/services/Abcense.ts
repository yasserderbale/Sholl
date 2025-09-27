import mongoose from "mongoose";
import { Abcensesmodel } from "../models/Abcenses";
interface Iabcenses {
  identifaite: string;
  idMat: any;
  Date: Date;
  idStud: mongoose.Types.ObjectId;
  cause: string;
}

export const RegistnewAbcense = async ({
  identifaite,
  idMat,
  Date,
  idStud,
  cause,
}: Iabcenses) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  console.log(idMat);
  if (!idMat || !Date || !idStud || !cause)
    return { StatusCode: 501, data: "you`ve insert all informations" };

  const Abcense = {
    Date,
    cause,
    matieres: Array.isArray(idMat)
      ? idMat.map((id) => ({ idMat: id }))
      : [{ idMat }],
  };
  const result = await Abcensesmodel.findOne({ idStud });

  if (!result) {
    const inserTnewDate = await Abcensesmodel.create({
      idStud,
      Abcenses: [Abcense],
    });
    if (!inserTnewDate)
      return { StatusCode: 404, data: "failed to register info...." };
    await inserTnewDate.save();
    return { StatusCode: 200, data: inserTnewDate };
  }
  result.Abcenses.push(Abcense);
  await result.save();
  return { StatusCode: 200, data: result };
};
interface IgetAbce {
  identifaite: string;
}
export const getAbcense = async ({ identifaite }: IgetAbce) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const getAbc = await Abcensesmodel.find()
    .populate("idStud")
    .populate("Abcenses.matieres.idMat");
  if (!getAbc)
    return { StatusCode: 404, data: "conot get information of studentes " };
  return { StatusCode: 200, data: getAbc };
};
interface searchAbc {
  identifaite: string;
  search: any;
}
export const SearchAbcense = async ({ identifaite, search }: searchAbc) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  let gestAbc = await Abcensesmodel.find()
    .populate({
      path: "idStud",
      match: { Name: { $regex: search, $options: "i" } },
    })
    .populate("Abcenses.matieres.idMat");
  gestAbc = gestAbc.filter((name) => name.idStud != null);
  if (!gestAbc) return { StatusCode: 404, data: "no data from searche" };
  return { StatusCode: 200, data: gestAbc };
};
