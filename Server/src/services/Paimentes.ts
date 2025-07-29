import mongoose from "mongoose"
import { paimentesModel } from "../models/Paimentes"
import { Matieres } from "../models/Matieres"

interface Ipaimente {
    identifiante:mongoose.Types.ObjectId[],
    idMat:mongoose.Types.ObjectId[],
    idStud:mongoose.Types.ObjectId[],
    Mois:string[],
    Montante:number,
    Date:Date
}

export const RegistnewPaimente=async({identifiante,idMat,idStud,Mois,Montante,Date}:Ipaimente)=>{
if(!identifiante) return {StatusCode:404,data:"failed chek tocken "}
if(!idMat || !idStud || !Mois || !Montante || !Date) return {StatusCode:404,data:"you`ve to insert all info.. "}
const mapMatieres = Array.isArray(idMat) ? idMat.map((id)=>({idMat:id})):[{idMat}]
const checkpaiment =await paimentesModel.findOne({idStud})
const Objectid = idMat.map((id)=> new mongoose.Types.ObjectId(id))      
if(!checkpaiment) {
    const chechMatieres =await Matieres.find({_id:{$in:Objectid}})
    if(!chechMatieres) return {StatusCode:501,data:"failed get Matires"}
   const totalprcieMat = chechMatieres.reduce((accumalitore,currentvalue)=>accumalitore+=currentvalue.prix,0)
   const Restprix = Montante  - (totalprcieMat * Mois.length)
    const bool = Restprix === 0 ? "Paimente Complet" : [`il est reste : ${Restprix}`]
   const insertpaiment = await paimentesModel.create({
        idStud:idStud,
        paimentes:[{Mois,Montante,Date,matieres:mapMatieres,status:bool}],
        
    })
    if(!insertpaiment) return {StatusCode:501,data:"failed insert"}
    return {StatusCode:200,data:insertpaiment}
}

const chechMatieres =await Matieres.find({_id:{$in:Objectid}})
    if(!chechMatieres) return {StatusCode:501,data:"failed get Matires"}
   const totalprcieMat = chechMatieres.reduce((accumalitore,currentvalue)=>accumalitore+=currentvalue.prix,0)
   const Restprix = Montante  - (totalprcieMat * Mois.length)
    const bool = Restprix === 0 ? "Paimente Complet" :  Restprix


 checkpaiment.paimentes.push({Mois,Montante,Date,matieres:mapMatieres,status:bool}) 

 await checkpaiment.save()
return {StatusCode:200,data:checkpaiment}

}
interface Igetpaimente {
    identifiante:mongoose.Types.ObjectId
}
export const getPaimentes=async({identifiante}:Igetpaimente)=>{
    if(!identifiante) return {StatusCode:404,data:"failed chek tocken "}
    const getpaimentes = await paimentesModel.find().populate("idStud")
    if(!getpaimentes) return {StatusCode:404,data:"failed get paimentes"}
    return {StatusCode:200,data:getpaimentes}

}