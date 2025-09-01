import { Abcensesmodel } from "../models/Abcenses";
import { Matieres } from "../models/Matieres";
import { paimentesModel } from "../models/Paimentes";
import { Studentemodel } from "../models/Student";
interface Ident {
  identifinate: string;
  Name: string;
  Age: number;
  Spécialité:string,
  Genre:string,
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
  Spécialité,
  Genre,
  Telephone,
  modules,
  Date
}: Ident) => {
  if (!identifinate)
    return { StatusCode: 401, data: "ther isn`t identifiante" };
  if (!Name || !Age || !Nivuea || !Telephone || !modules.length || !Date  || !Genre) return { StatusCode: 501, data: "you have insert all informations" };
  const getnamOfStundets = await Studentemodel.findOne({Name})
  if(getnamOfStundets) return { StatusCode: 404, data: "studentes already exist " };
  const Allmodel = await Promise.all(
   modules.map(async(Name)=>{
      const searchemodel = await Matieres.findOne({name:Name})
      if(!searchemodel) return {StatusCode:404,data:"no model existe"}
      return {
        matid:searchemodel._id,
      }
    })
  )
  if(!Allmodel) return {StatusCode:404,data:"ther isn`t model "}

  const newStudent = await Studentemodel.create({
    Name,Age,Spécialité,Genre,Nivuea,Telephone,modules:Allmodel,Date
  })
  if(!newStudent) return {StatusCode:404,data:"no Resgestration"}
   await newStudent.save()
 return { StatusCode: 200, data: newStudent }

};
interface Istundet{
  identifinate:string
}
export const getStudentes=async({identifinate}:Istundet)=>{
   if (!identifinate) return { StatusCode: 401, data: "ther isn`t identifiante" };
  const getStudents = await Studentemodel.find().populate("modules.matid")
  if(!getStudents) return { StatusCode: 401, data: "ther isn`t Studentes" };
  return { StatusCode: 200, data: getStudents };
}
interface Istudsearch{
  identifinate:string,
  name:any
}
export const SearchStudentes=async({identifinate,name}:Istudsearch)=>{
   if (!identifinate) return { StatusCode: 404, data: "ther isn`t identifiante" };
    //  if (!name) return { StatusCode: 404, data: "ther isn`t text of searche" };

  const getStudent = await Studentemodel.find({
    Name:{$regex:name,$options:"i"}}).populate("modules.matid")
if(!getStudentes) return{StatusCode:404,data:"can`t dearche student"}
return { StatusCode: 200, data: getStudent };
}
interface Iupdate{
  identifinate:string,
  idStud:string,
  Name:string,
  Age:number,
  Spécialité:string,
  Genre:string,
  Nivuea:string,
  Telephone:number,
  modules:any [],
  Date:Date
}
export const updateStudent=async({identifinate,idStud,Name,Age,Spécialité,Genre,Nivuea,Telephone,modules,Date}:Iupdate)=>{
if(!identifinate) return {StatusCode:404,data:"identinfiante not provide"}
if(!idStud && !Name  && !Age && !Nivuea && !Telephone && !modules && !Spécialité && !Genre && !Date) return {StatusCode:404,data:"Id not valid"}
 const getMatieres = await Promise.all( modules.map(async(Nam)=>{
const getmatieres = await Matieres.findOne({name:Nam})
if(!getmatieres)  return null
return {
  matid:getmatieres._id,
  name:getmatieres.name,
  prix:getmatieres.prix
}
}))
 
 const validatmat = getMatieres.filter((item)=>item!=null)
 const updateStude =await Studentemodel.findByIdAndUpdate(idStud,{$set:{Name,Age,Nivuea,Spécialité,Genre,Telephone,modules:validatmat,Date}},{returnDocument:"after"})
 if(!updateStude) return {StatusCode:501,data:"updating not valide"}
 return {StatusCode:200,data:updateStude} 
}
interface Istud {
  identifinate:string,
  idStud:string
}
export const DeletStudents=async({identifinate,idStud}:Istud)=>{
  if(!identifinate ) return {StatusCode:404,data:"identinfiante not provide"}
  if(!idStud) return {StatusCode:404,data:"id not provider"}
const Deletone = await Studentemodel.findByIdAndDelete(idStud)
 const DeleteAbcenses = await Abcensesmodel.findOneAndDelete({idStud:idStud})
 const DeletePaimentes = await paimentesModel.findOneAndDelete({idStud:idStud})
 console.log("hado te3 supprimer",DeleteAbcenses,DeletePaimentes,Deletone)
if(Deletone==null && DeleteAbcenses==null && DeletePaimentes==null) return {StatusCode:404,data:"failed delete"}
return {StatusCode:200,data:"succued delete"}
}
export const getStudentesOne=async({identifinate,idStud}:Istud)=>{
if(!identifinate ) return {StatusCode:404,data:"identinfiante not provide"}
  if(!idStud) return {StatusCode:404,data:"id not provider"}
  const getOne = await Studentemodel.findById(idStud).populate("modules.matid")
  if(!getOne) return {StatusCode:404,data:"failed getOne student"}
  return {StatusCode:200,data:getOne}

}