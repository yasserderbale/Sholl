import mongoose from "mongoose";
import { Abcensesmodel } from "../models/Abcenses";
import { Groupemodel } from "../models/Groupe";
import { Matieres } from "../models/Matieres";
import { paimentesModel } from "../models/Paimentes";
import { Studentemodel } from "../models/Student";
interface Ident {
  _id?: mongoose.Types.ObjectId;
  identifinate: string;
  Name: string;
  Age: number;
  Spécialité: string;
  Groupe: any;
  Genre: string;
  Nivuea: number;
  Telephone: number;
  modules: any[];
  Date: Date;
}
export const Registerstud = async ({
  identifinate,
  Name,
  Age,
  Nivuea,
  Spécialité,
  Groupe,
  Genre,
  Telephone,
  modules,
  Date,
}: Ident) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  if (
    !Name ||
    !Age ||
    !Nivuea ||
    !Telephone ||
    !modules.length ||
    !Date ||
    !Genre ||
    !Groupe
  )
    return { StatusCode: 501, data: "you have insert all informations" };
  console.log("hado ta3 Groups", Groupe);
  const getnamOfStundets = await Studentemodel.findOne({ Name });
  if (getnamOfStundets)
    return { StatusCode: 404, data: "studentes already exist " };
  const Allmodel = await Promise.all(
    modules.map(async (idmat) => {
      const searchemodel = await Matieres.findById({ _id: idmat });
      if (!searchemodel) return { StatusCode: 404, data: "no model existe" };
      return {
        matid: searchemodel._id,
      };
    })
  );
  if (!Allmodel) return { StatusCode: 404, data: "ther isn`t model " };
  const newStudent = await Studentemodel.create({
    Name,
    Age,
    Spécialité,
    Groupe,
    Genre,
    Nivuea,
    Telephone,
    modules: Allmodel,
    Date,
  });
  if (!newStudent) return { StatusCode: 404, data: "no Resgestration" };
  await newStudent.save();
  console.log(newStudent);
  const Gestgroups = await Groupemodel.find({ _id: { $in: Groupe } });
  if (!Gestgroups) return { StatusCode: 404, data: "no Groups existe" };
  console.log("hadoma les groups li l9inahom ", Gestgroups);
  const registname = await Promise.all(
    Gestgroups.map(async (group) => {
      // نزيد الـID تاع الطالب بدل الاسم
      group.Studentid.push(newStudent._id as mongoose.Types.ObjectId);
      await group.save();
    })
  );

  if (!registname)
    return { StatusCode: 201, data: "no regsite of nam in his groups" };
  return { StatusCode: 200, data: { newStudent, registname } };
};
interface Istundet {
  identifinate: string;
}
export const getStudentes = async ({ identifinate }: Istundet) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  const getStudents = await Studentemodel.find()
    .populate("modules.matid")
    .populate("Groupe");
  if (!getStudents) return { StatusCode: 401, data: "ther isn`t Studentes" };
  return { StatusCode: 200, data: getStudents };
};
interface Istudsearch {
  identifinate: string;
  name: any;
}
export const SearchStudentes = async ({ identifinate, name }: Istudsearch) => {
  if (!identifinate)
    return { StatusCode: 404, data: "ther isn`t identifiante" };
  //  if (!name) return { StatusCode: 404, data: "ther isn`t text of searche" };

  const getStudent = await Studentemodel.find({
    Name: { $regex: name, $options: "i" },
  })
    .populate("modules.matid")
    .populate("Groupe");
  if (!getStudentes) return { StatusCode: 404, data: "can`t dearche student" };
  return { StatusCode: 200, data: getStudent };
};
interface Iupdate {
  identifinate: string;
  idStud: string;
  Name: string;
  Age: number;
  Spécialité: string;
  Groupe: mongoose.Types.ObjectId[]; // ✅ نخليها واضحة أنها array of ObjectIds
  Genre: string;
  Nivuea: string;
  Telephone: number;
  modules: mongoose.Types.ObjectId[]; // ✅ كذلك
  Date: Date;
}

export const updateStudent = async ({
  identifinate,
  idStud,
  Name,
  Age,
  Spécialité,
  Groupe,
  Genre,
  Nivuea,
  Telephone,
  modules,
  Date,
}: Iupdate) => {
  // 🧩 1. Validation الأساسية
  if (!identifinate)
    return { StatusCode: 404, data: "identifinate not provided" };

  if (
    !idStud ||
    !Name ||
    !Age ||
    !Nivuea ||
    !Telephone ||
    !modules.length ||
    !Spécialité ||
    !Genre ||
    !Date ||
    !Groupe.length
  )
    return { StatusCode: 404, data: "Invalid or missing data" };

  // 🧩 2. التأكد من وجود الطالب
  const getidstud = await Studentemodel.findById(idStud);
  if (!getidstud) return { StatusCode: 404, data: "Student not found" };

  // 🧩 3. نحذفو الاسم القديم من المجموعات القديمة
  await Groupemodel.updateMany(
    { _id: { $in: getidstud.Groupe } },
    {
      $pull: {
        nameStud: getidstud.Name,
        Studentid: getidstud._id as mongoose.Types.ObjectId,
      },
    }
  );

  // 🧩 4. نضيفوه في المجموعات الجديدة (id و name)
  await Groupemodel.updateMany(
    { _id: { $in: Groupe } },
    {
      $addToSet: {
        nameStud: Name,
        Studentid: getidstud._id as mongoose.Types.ObjectId,
      },
    }
  );

  // 🧩 5. نحضرو قائمة المواد الجديدة
  const getMatieres = await Promise.all(
    modules.map(async (idmat) => {
      const getmatieres = await Matieres.findById(idmat);
      if (!getmatieres) return null;
      return {
        matid: getmatieres._id,
        name: getmatieres.name,
        prix: getmatieres.prix,
      };
    })
  );

  const validatmat = getMatieres.filter((item) => item != null);

  // 🧩 6. التحديث الفعلي للطالب
  const updateStude = await Studentemodel.findByIdAndUpdate(
    idStud,
    {
      $set: {
        Name,
        Age,
        Nivuea,
        Spécialité,
        Genre,
        Telephone,
        modules: validatmat,
        Date,
        Groupe,
      },
    },
    { returnDocument: "after" }
  );

  if (!updateStude) return { StatusCode: 501, data: "Update failed" };

  return { StatusCode: 200, data: updateStude };
};
interface Istud {
  identifinate: string;
  idStud: string;
}
export const DeletStudents = async ({ identifinate, idStud }: Istud) => {
  if (!identifinate)
    return { StatusCode: 404, data: "identinfiante not provide" };
  if (!idStud) return { StatusCode: 404, data: "id not provider" };
  const grouid = await Studentemodel.findById(idStud);
  if (!grouid) return { StatusCode: 404, date: "no Studente" };
  await Groupemodel.updateMany(
    { _id: grouid.Groupe },
    { $pull: { nameStud: grouid.Name } }
  );
  const Deletone = await Studentemodel.findByIdAndDelete(idStud);
  const DeleteAbcenses = await Abcensesmodel.findOneAndDelete({
    idStud: idStud,
  });
  const DeletePaimentes = await paimentesModel.findOneAndDelete({
    idStud: idStud,
  });
  // console.log("hado te3 supprimer", DeleteAbcenses, DeletePaimentes, Deletone);
  if (Deletone == null && DeleteAbcenses == null && DeletePaimentes == null)
    return { StatusCode: 404, data: "failed delete" };
  return { StatusCode: 200, data: "succued delete" };
};
export const getStudentesOne = async ({ identifinate, idStud }: Istud) => {
  if (!identifinate)
    return { StatusCode: 404, data: "identinfiante not provide" };
  if (!idStud) return { StatusCode: 404, data: "id not provider" };
  const getOne = await Studentemodel.findById(idStud)
    .populate("modules.matid")
    .populate("Groupe");
  if (!getOne) return { StatusCode: 404, data: "failed getOne student" };
  return { StatusCode: 200, data: getOne };
};
