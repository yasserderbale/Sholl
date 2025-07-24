import { Abcensesmodel } from "../models/Abcenses"
interface Iabcenses {
    identifaite:string,
    idMat:any,
    Date:Date,
    idStud:any,
    cause:string
}

export const RegistnewAbcense =async ({identifaite,idMat,Date,idStud,cause}:Iabcenses)=>{
if(!identifaite) return {StatusCode:402,data:"identifiante not provider"}
if(!idMat && !Date && !idStud &&!cause) return {StatusCode:402,data:"you`ve insert all informations"}
    const result = await Abcensesmodel.findOne({idStud})
 if( !result){  
 const inserTnewDate = await Abcensesmodel.create({
 idStud,Date,cause,idMat:[idMat],    
 }) 
  if(!inserTnewDate) return {StatusCode:402,data:"failed to register info...."}
  await inserTnewDate.save()
  return {StatusCode:200,data:inserTnewDate}
  }
  
return {StatusCode:200,data:""}

  }
interface IgetAbce {
    identifaite:string
}
export const getAbcense=async({identifaite}:IgetAbce)=>{
    if(!identifaite) return {StatusCode:402,data:"identifiante not provider"}
const getAbc = await Abcensesmodel.find().populate("idStud").populate("idMat")
if(!getAbc) return {StatusCode:404,data:"conot get information of studentes "}
return {StatusCode :200,data:getAbc}
}