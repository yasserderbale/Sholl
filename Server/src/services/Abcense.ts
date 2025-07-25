import mongoose from "mongoose"
import { Abcensesmodel } from "../models/Abcenses"
interface Iabcenses {
    identifaite:string,
    idMat:any,
    Date:Date,
    idStud:mongoose.Types.ObjectId,
    cause:string,
}

export const RegistnewAbcense =async ({identifaite,idMat,Date,idStud,cause}:Iabcenses)=>{
if(!identifaite) return {StatusCode:402,data:"identifiante not provider"}
console.log(idMat)
if(!idMat || !Date || !idStud || !cause) return {StatusCode:501,data:"you`ve insert all informations"}
    
     const Abcense={
        Date,cause,matieres:[{idMat}] } 
const result = await Abcensesmodel.findOne({idStud})
    
 if( !result){  
 const inserTnewDate = await Abcensesmodel.create({
 idStud,Abcenses:[Abcense]    
 }) 
  if(!inserTnewDate) return {StatusCode:404,data:"failed to register info...."}
  await inserTnewDate.save()
  return {StatusCode:200,data:inserTnewDate}
  }
  result.Abcenses.push(Abcense)
  await result.save()   
return {StatusCode:200,data:result}

  }
interface IgetAbce {
    identifaite:string
}
export const getAbcense=async({identifaite}:IgetAbce)=>{
    if(!identifaite) return {StatusCode:402,data:"identifiante not provider"}
const getAbc = await Abcensesmodel.find().populate("idStud").populate("Abcenses.matieres.idMat")
if(!getAbc) return {StatusCode:404,data:"conot get information of studentes "}
return {StatusCode :200,data:getAbc}
}