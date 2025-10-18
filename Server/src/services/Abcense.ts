import mongoose from "mongoose";
import { Abcensesmodel } from "../models/Abcenses";
import { Studentemodel } from "../models/Student";
interface Iabcenses {
  identifaite: string;
  idMat: string[] | string;
  Date: Date;
  idStud: any[] | any;
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
  if (!idMat || !Date || !idStud || idStud.length === 0)
    return { StatusCode: 501, data: "you must insert all information!" };
  // فلترة وتحويل المعرفات
  const ids = idStud
    .filter((id: any) => typeof id === "string" && id.length === 24)
    .map((id: string) => new mongoose.Types.ObjectId(id));
  console.log("🧩 Students IDs:", ids);
  // إعداد بيانات الغياب
  const newAbcenseData = {
    Date,
    cause,
    matieres: Array.isArray(idMat)
      ? idMat
          .filter((id) => typeof id === "string" && id.length === 24)
          .map((id) => ({ idMat: new mongoose.Types.ObjectId(id) }))
      : typeof idMat === "string" && idMat.length === 24
      ? [{ idMat: new mongoose.Types.ObjectId(idMat) }]
      : [],
  };

  // تسجيل الغياب لكل طالب
  const promises = ids.map(async (studId: any) => {
    let existing = await Abcensesmodel.findOne({ idStud: { $in: [studId] } });
    if (existing) {
      existing.Abcenses.push(newAbcenseData);
      return existing.save();
    } else {
      return Abcensesmodel.create({
        idStud: [studId],
        Abcenses: [newAbcenseData],
      });
    }
  });
  const result = await Promise.all(promises);

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

  try {
    // ⬅️ أولاً نلقاو الطلاب اللي الاسم تاعهم فيه الكلمة المبحوث عنها
    const students = await Studentemodel.find({
      Name: { $regex: search, $options: "i" },
    }).select("_id");

    if (!students.length) return { StatusCode: 200, data: "" };

    // ⬅️ نجيب absences فقط للطلاب لي لقيناهم
    const studentIds = students.map((s) => s._id);

    const gestAbc = await Abcensesmodel.find({ idStud: { $in: studentIds } })
      .populate("idStud") // يعمر الطالب كامل
      .populate("Abcenses.matieres.idMat"); // يعمر المواد

    if (!gestAbc.length)
      return { StatusCode: 404, data: "Aucune absence trouvée" };

    return { StatusCode: 200, data: gestAbc };
  } catch (error) {
    console.error("Erreur dans SearchAbcense:", error);
    return { StatusCode: 500, data: "Erreur interne du serveur" };
  }
};
