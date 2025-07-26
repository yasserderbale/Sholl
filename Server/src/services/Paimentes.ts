import mongoose from "mongoose"
import { paimentesModel } from "../models/Paimentes"

interface Ipaimente {
    identifiante:mongoose.Types.ObjectId[],
    idMat:mongoose.Types.ObjectId[],
    idStud:mongoose.Types.ObjectId[],
    Mois:string,
    Montante:number,
    Date:Date
}

export const RegistnewPaimente=async({identifiante,idMat,idStud,Mois,Montante,Date}:Ipaimente)=>{
if(!identifiante) return {StatusCode:404,data:"failed chek tocken "}
if(!idMat || !idStud || !Mois || !Montante || !Date) return {StatusCode:404,data:"you`ve to insert all info.. "}
const Paimentes ={
    Mois,Montante,Date,matieres:Array.isArray(idMat) ? idMat.map((id)=>({idMat:id})):[{idMat}]
}
const checkpaiment =await paimentesModel.findOne({idStud})
if(!checkpaiment) {
   const insertpaiment = await paimentesModel.create({
        idStud:idStud,
        paimentes:[Paimentes]
    })
    if(!insertpaiment) return {StatusCode:501,data:"failed insert"}
    return {StatusCode:200,data:insertpaiment}
}
 checkpaiment.paimentes.push(Paimentes)
 await checkpaiment.save()
return {StatusCode:200,data:checkpaiment}

}