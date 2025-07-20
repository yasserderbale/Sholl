import { Matieres } from "../models/Matieres";
import { Studentemodel } from "../models/Student";

interface Ident {
  identifinate: string;
  Name: string;
  Age: number;
  Nivuea: number;
  Telephone: number;
  modules: any[];
  Date: Date;
}
export const Registerstud =async ({
  identifinate,
  Name,
  Age,
  Nivuea,
  Telephone,
  modules,
  Date
}: Ident) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  if (!Name || !Age || !Nivuea || !Telephone || !modules || !Date) return { StatusCode: 501, data: "you have insert all informations" };
  const Allmodel = await Promise.all(
   modules.map(async(Name)=>{
      const searchemodel = await Matieres.findOne({name:Name.name})
      if(!searchemodel) return {StatusCode:404,data:"no model existe"}
      return {
        matid:searchemodel._id,
        name:searchemodel.name,
        prix:searchemodel.prix
      }
    })
  )
  if(!Allmodel) return {StatusCode:404,data:"ther isn`t model "}
  const newStudent = await Studentemodel.create({
    Name,Age,Nivuea,Telephone,modules:Allmodel,Date
  })
  if(!newStudent) return {StatusCode:404,data:"no Resgestration"}
   await newStudent.save()
// if(!getmodel) return {StatusCode:404,data:"ther isn`t model"}
 return { StatusCode: 200, data: newStudent }

};
interface Istundet{
  identifinate:string
}
export const getStudentes=async({identifinate}:Istundet)=>{
   if (!identifinate) return { StatusCode: 401, data: "ther isn`t identifiante" };
  const getStudents = await Studentemodel.find()
  if(!getStudents) return { StatusCode: 401, data: "ther isn`t Studentes" };
  return { StatusCode: 200, data: getStudents };
}
