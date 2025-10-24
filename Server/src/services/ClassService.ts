import mongoose from "mongoose";
import Classe, { IClasse } from "../models/Classe";
import Groupe from "../models/GroupeTimes";

export const getAllClasses = async (identifaite: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  const classes = await Classe.find().populate("groupes");
  return { StatusCode: 200, data: classes };
};
export const getClasseById = async (id: string) => {
  try {
    const classe = await Classe.findById(id).populate("groupes");
    if (!classe) {
      return { StatusCode: 404, data: "Classe non trouvée" };
    }
    return { StatusCode: 200, data: classe };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};

export const addClasse = async (
  identifaite: string,
  nom: string,
  description?: string
) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };

  const newClass = new Classe({name:nom, notes:description });
  await newClass.save();
  return { StatusCode: 200, data: newClass };
};

export const updateClasse = async (
  id: string,
  nom: any,
  description: string,
  identifaite: string
) => {
  try {
    if (!identifaite) {
      return { StatusCode: 402, data: "Identifiante non fourni" };
    }

    if (!id || (!nom && !description))
      return { StatusCode: 400, data: "Tous les champs sont obligatoires" };
    const objectId = new mongoose.Types.ObjectId(id);
    const classe = (await Classe.findById(objectId)) as IClasse | null;
    if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };
    classe.name = nom;
    classe.notes = description;
    await classe.save();

    return { StatusCode: 200, data: classe };
  } catch (error) {
    console.error("Erreur UpdateClasse:", error);
    return { StatusCode: 500, data: "Erreur interne du serveur" };
  }
};

export const deleteClasse = async (identifaite: string, classId: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };

  const classe = await Classe.findByIdAndDelete(classId);
  if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };

  await Groupe.deleteMany({ classeId: classId });
  return { StatusCode: 200, data: "Classe supprimée avec succès" };
};
export const getGroupesByClasse = async (id: string) => {
  try {
    const classe = await Classe.findById(id).populate("groupes");
    if (!classe) {
      return { StatusCode: 404, data: "Classe non trouvée" };
    }
    return { StatusCode: 200, data: classe.groupes };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};
export const searchClasse = async (query: string) => {
  try {
    if (!query || query.trim() === "") {
      return {
        StatusCode: 400,
        data: "Veuillez fournir un mot-clé de recherche",
      };
    }

    // نستعمل Regex باش نسمح بالبحث الجزئي (partial search)
    const regex = new RegExp(query, "i"); // i = ignore case (ما يهمش الحروف الكبيرة/الصغيرة)

    const classes = await Classe.find({
      $or: [{ name: regex }, { notes: regex }],
    });

    if (!classes.length) {
      return { StatusCode: 404, data: "Aucune classe trouvée" };
    }

    return { StatusCode: 200, data: classes };
  } catch (error) {
    return { StatusCode: 500, data: error };
  }
};
