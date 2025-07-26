import express from "express"
import { validatejwt } from "../medallware/ValidateJWT"
import { RegistnewPaimente } from "../services/Paimentes"
const route = express.Router()


route.post("/Paimentes",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const {idMat,idStud,Mois,Montante,Date}=req.body
const response = await RegistnewPaimente({identifiante,idMat,idStud,Mois,Montante,Date})
res.status(response.StatusCode).json(response)
})
export default route