import mongoose from "mongoose"
import { paimentesModel } from "../models/Paimentes"
import { Matieres } from "../models/Matieres"
import { AnyAaaaRecord } from "dns"
import { match } from "assert"
import path from "path"

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
    const bool = Restprix == 0 ? "Paimente Complet" : Math.abs(Restprix) 
   const insertpaiment = await paimentesModel.create({
        idStud:idStud,
        paimentes:[{Mois,Montante,Date,matieres:mapMatieres,status:bool}],
        
    })
    if(!insertpaiment) return {StatusCode:501,data:"failed insert"}
    return {StatusCode:200,data:insertpaiment}
}

const chechMatieres =await Matieres.find({_id:{$in:Objectid}})
    if(!chechMatieres) return {StatusCode:501,data:"failed get Matires"}
    const paidmounth = checkpaiment.paimentes.flatMap((p:any)=>p.Mois)
    const boolMountch = Mois.filter((m)=>paidmounth.includes(m))
    if(boolMountch.length >0) return {StatusCode:400,data:`Ce Mois deja Payees :${boolMountch}`}
   const totalprcieMat = chechMatieres.reduce((accumalitore,currentvalue)=>accumalitore+=currentvalue.prix,0)
   const Restprix = Montante  - (totalprcieMat * Mois.length)
    const bool = Restprix === 0 ? "Paimente Complet" :   Math.abs(Restprix)


 checkpaiment.paimentes.push({Mois,Montante,Date,matieres:mapMatieres,status:bool}) 

 await checkpaiment.save()
return {StatusCode:200,data:checkpaiment}

}
interface Igetpaimente {
    identifiante:mongoose.Types.ObjectId
}
export const getPaimentes=async({identifiante}:Igetpaimente)=>{
    if(!identifiante) return {StatusCode:404,data:"failed chek tocken "}
    const getpaimentes = await paimentesModel.find().populate("idStud").populate("paimentes.matieres.idMat")
    if(!getpaimentes) return {StatusCode:404,data:"failed get paimentes"}
    return {StatusCode:200,data:getpaimentes}

}
interface Icompletepai {
    identifiante:mongoose.Types.ObjectId,
    idPaiment:string,
    idStud:string,
    addPricee:number
}
export const CompletePaymente=async({identifiante,idStud,idPaiment,addPricee}:Icompletepai)=>{
if(!identifiante) return {StatusCode:404,data:"failed chek tocken "}
if(!idPaiment || !idStud || !addPricee ) return {StatusCode:404,data:"you`ve to insert all info.. "}
const checkStudent = await paimentesModel.findOne({idStud})
if(!checkStudent) return {StatusCode:404,data:"Failed get Students"}
const checkpaiment = (checkStudent.paimentes as any).id(idPaiment)
if(!checkpaiment) return {StatusCode:404,data:"Failed get Paiments"}
const ObjectIdMat = checkpaiment.matieres.map((m:any)=>m.idMat)
const chechMatieres =await Matieres.find({_id:{$in:ObjectIdMat}})
if(!chechMatieres) return {StatusCode:404,data:"Failed get Matieres"}
const prcieMat = chechMatieres.reduce((acc,curr)=>acc+=curr.prix,0)
const totalprcieMat = prcieMat*(checkpaiment.Mois.length)
 const expectedPrice =  checkpaiment.Montante+=addPricee;
checkpaiment.status = expectedPrice-totalprcieMat == 0 ? "Paiment Complet": Math.abs(expectedPrice-totalprcieMat)
await checkStudent.save()
return {StatusCode:200,data:checkpaiment}


}
interface IPaimente {
    identifiante:mongoose.Types.ObjectId,
    idStud:string,
    idPaiment:string
}
export const getOnePaimente=async ({identifiante,idStud,idPaiment}:IPaimente)=>{
if(!identifiante) return {StatusCode:404,data:"failed check tocken "}
if(!idStud || !idPaiment) return {StatusCode:404,data:"req of student check Student "}
const getOneStudent =await paimentesModel.findOne({idStud}).populate("idStud")
if(!getOneStudent) return {StatusCode:404,data:"failed check Student "}
const getOnepaime =  (getOneStudent.paimentes as any).filter((item:any)=>item._id==idPaiment)
return {StatusCode:200,data:getOnepaime}
}
interface Isearch{
    identifiante:string,
    search:any
}
export const SearchePaiementStud=async({identifiante,search}:Isearch)=>{
if(!identifiante) return {StatusCode:404,data:"failed check tocken "}
const checkSearch = await paimentesModel.find().populate({path:'idStud',match:{Name:{$regex:search,$options:"i"}}}).populate("paimentes.matieres.idMat")
const Filtersearche = checkSearch.filter((item)=>item.idStud!==null)
return {StatusCode:200,data:Filtersearche}
}