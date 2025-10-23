import GroupTims from "../models/GroupeTimes";
import Classe from "../models/Classe";
import mongoose from "mongoose";
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

  return { StatusCode: 201, data: classe };
};

export const getAllGroupes = async (identifaite: any) => {
  if (!identifaite) {
    return { StatusCode: 402, data: "identifiante not provider" };
  }
  try {
    const groupes = await GroupTims.find()
      .populate("groupeId")
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
