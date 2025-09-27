import { paimentesModel } from "../models/Paimentes";
import { Studentemodel } from "../models/Student";

interface Idachbord {
  identifaite: string;
}

export const StatistiqDachborde = async ({ identifaite }: Idachbord) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const GetEleves = await Studentemodel.aggregate([
    { $count: "Nobre des eleves" },
  ]);
  const GetPaimentes = await paimentesModel.aggregate([
    {
      $unwind: "$paimentes",
    },
    { $group: { _id: "Student", total: { $sum: "$paimentes.Montante" } } },
  ]);
  const GetEleveSpecialites = await Studentemodel.aggregate([
    {
      $group: {
        _id: "$Spécialité",
        nbreleves: { $sum: 1 },
      },
    },
  ]);
  return {
    StatusCode: 200,
    data: { GetEleves, GetPaimentes, GetEleveSpecialites },
  };
};
