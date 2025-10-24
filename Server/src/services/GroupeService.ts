import GroupTims from "../models/GroupeTimes";
import Classe from "../models/Classe";
import mongoose from "mongoose";
import GroupeTimes from "../models/GroupeTimes";
import { Groupemodel } from "../models/Groupe";
export const addGroupeToClasse = async (
  groupeId: string,
  classeId: string, // ← هنا خليه string
  heureDebut: string,
  heureFin: string,
  jours: string[],
  identifaite: string
) => {
  if (!identifaite) {
    return { StatusCode: 402, data: "identifiante not provider" };
  }
  if (!classeId || !groupeId || !heureDebut || !heureFin || !jours) {
    return { StatusCode: 501, data: "youve to insert all informations " };
  }
  const idclasse = new mongoose.Types.ObjectId(classeId);
  const classe = await Classe.findById(idclasse);
  if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
  const newGroupeTims = new GroupTims({
    groupeId,
    heureDebut,
    heureFin,
    jours,
    classeId,
  });

  await newGroupeTims.save();

  classe.groupes.push(newGroupeTims._id as mongoose.Types.ObjectId);
  await classe.save();

  return { StatusCode: 200, data: classe };
};

export const getAllGroupes = async (identifaite: any) => {
  if (!identifaite) {
    return { StatusCode: 402, data: "identifiante not provider" };
  }
  try {
    const groupes = await GroupTims.find()
      .populate("groupeId", "name")
      .populate("classeId"); // هنا تجيب جميع القروبات
    return {
      StatusCode: 200,
      data: groupes,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return {
      StatusCode: 500,
      message: "Erreur interne du serveur",
    };
  }
};
// ❌ Delete GroupeTim
export const deleteGroupe = async (identifaite: string, groupeId: string) => {
  if (!identifaite) {
    return { StatusCode: 402, data: "identifiante not provider" };
  }
  if (!groupeId) {
    return { StatusCode: 404, data: "id groupe note valide" };
  }
  const grp = await GroupTims.findByIdAndDelete(groupeId);
  if (!grp) return { StatusCode: 404, data: "Groupe non trouvé" };

  return { StatusCode: 200, data: "Groupe supprimé" };
};
export const getGroupeById = async (id: string) => {
  try {
    const groupe = await GroupeTimes.findById(id).populate("classeId");
    if (!groupe) return { StatusCode: 404, data: "Groupe non trouvé" };
    return { StatusCode: 200, data: groupe };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};
export const updateGroupeTim = async (
  id: string,
  heureDebut?: string,
  heureFin?: string,
  jours?: string[]
) => {
  try {
    const groupeTim = await GroupTims.findById(id);
    if (!groupeTim) return { StatusCode: 404, data: "GroupeTim non trouvé" };
    if (heureDebut) groupeTim.heureDebut = heureDebut;
    if (heureFin) groupeTim.heureFin = heureFin;
    if (jours) groupeTim.jours = jours;

    await groupeTim.save();

    return { StatusCode: 200, data: groupeTim };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};

// 🔎 Search GroupeTims by Groupe name
export const searchGroupeTims = async (query: string) => {
  try {
    const groupes = await Groupemodel.find({
      name: { $regex: query, $options: "i" },
    });
    console.log(groupes);
    const groupeIds = groupes.map((g) => g._id);

    const result = await GroupTims.find({
      groupeId: { $in: groupeIds },
    }).populate("groupeId", "name");

    if (!result.length)
      return { StatusCode: 404, data: "Aucun GroupeTims trouvé" };

    return { StatusCode: 200, data: result };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};
