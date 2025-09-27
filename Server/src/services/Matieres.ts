import { Matieres } from "../models/Matieres";

interface Imatiere {
  idmatiere: string;
  identifiante: string;
}

export const Deletmatiere = async ({ idmatiere, identifiante }: Imatiere) => {
  if (!identifiante) return { StatusCode: 501, data: "there isn`t tocken" };
  if (!idmatiere) return { StatusCode: 501, data: "id of  matiere invalid" };
  // const getmatiere = await Matieres.find();
  //  if (!getmatiere)
  // return { StatusCode: 501, data: "there isn`t matiere exist" };
  const deletemat = await Matieres.findByIdAndDelete(idmatiere);
  if (!deletemat) {
    return { StatusCode: 404, data: "Matiere not found" };
  }

  return { StatusCode: 200, data: deletemat };
};
interface Imatiereupd {
  idmatiere: any;
  identifiante: string;
  prix: number;
  Niveau: string;
}
export const updatematiere = async ({
  identifiante,
  idmatiere,
  prix,
  Niveau,
}: Imatiereupd) => {
  if (!identifiante) {
    return { StatusCode: 401, data: "Token is missing" };
  }
  if (!idmatiere) {
    return { StatusCode: 404, data: "ID of matiere is invalid" };
  }
  if (!prix && !Niveau) {
    return { StatusCode: 400, data: "Name or prix is invalid" };
  }

  const update = await Matieres.findByIdAndUpdate(
    idmatiere,
    { $set: { prix, Niveau } },
    { returnDocument: "after" }
  );

  return { StatusCode: 200, data: update };
};
interface Igetmat {
  identifiante: string;
}
export const Getmatieres = async ({ identifiante }: Igetmat) => {
  if (!identifiante) return { StatusCode: 404, data: "tocken no provider" };
  const getmat = await Matieres.find();
  if (!getmat) return { StatusCode: 404, data: "no Matieres existe" };
  return { StatusCode: 200, data: getmat };
};
interface Igeonmat {
  identifiante: string;
  idmat: any;
}
export const Getonemat = async ({ identifiante, idmat }: Igeonmat) => {
  if (!identifiante) return { StatusCode: 404, data: "tocken no provider" };
  if (!idmat) return { StatusCode: 404, data: " Idmatires doesn`t existe " };
  const getone = await Matieres.findById(idmat);
  if (!getone) return { StatusCode: 404, data: "no matires returned" };
  return { StatusCode: 200, data: getone };
};
interface Iident {
  identifiante: string;
  namee: string;
  prix: number;
  Niveau: string;
}
export const Newmatire = async ({
  identifiante,
  namee,
  prix,
  Niveau,
}: Iident) => {
  if (!identifiante) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!namee || !prix || !Niveau)
    return { StatusCode: 401, data: "there isn`t name or prix" };
  const findname = await Matieres.find();
  if (!findname) return { StatusCode: 401, data: "no reultate finding" };
  const nametires = findname.map((Name) => Name);
  for (let nam of nametires) {
    if (nam.name == namee && nam.Niveau == Niveau) {
      console.log(nam.name, nam.Niveau);
      console.log(namee, Niveau);
      return { StatusCode: 404, data: "matires already existe" };
    }
  }
  const insertdata = await Matieres.create({
    name: namee,
    prix: prix,
    Niveau: Niveau,
  });
  if (!insertdata) return { StatusCode: 401, data: "no data saving" };
  await insertdata.save();
  return { StatusCode: 200, data: insertdata };
};
interface Isearch {
  identifiante: string;
  searche: any;
}
export const Searchonmat = async ({ identifiante, searche }: Isearch) => {
  if (!identifiante) return { StatusCode: 401, data: "there isn`t tocken" };
  const getonemat = await Matieres.find({
    name: { $regex: searche, $options: "i" },
  });
  return { StatusCode: 200, data: getonemat };
};
