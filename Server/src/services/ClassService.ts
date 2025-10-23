import Classe from "../models/Classe";
import Groupe from "../models/GroupeTimes";

export const getAllClasses = async (identifaite: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };

  const classes = await Classe.find().populate("groupes");
  return { StatusCode: 200, data: classes };
};

export const addClasse = async (
  identifaite: string,
  name: string,
  notes?: string
) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };

  const newClass = new Classe({ name, notes });
  await newClass.save();
  return { StatusCode: 201, data: newClass };
};

export const deleteClasse = async (identifaite: string, classId: string) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };

  const classe = await Classe.findByIdAndDelete(classId);
  if (!classe) return { StatusCode: 404, data: "Classe non trouvée" };

  await Groupe.deleteMany({ classeId: classId });
  return { StatusCode: 200, data: "Classe supprimée avec succès" };
};
