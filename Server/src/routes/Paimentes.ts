import express from "express"
import { validatejwt } from "../medallware/ValidateJWT"
import { CompletePaymente, getOnePaimente, getPaimentes, RegistnewPaimente } from "../services/Paimentes"
const route = express.Router()
route.post("/Paimentes",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const {idMat,idStud,Mois,Montante,Date}=req.body
const response = await RegistnewPaimente({identifiante,idMat,idStud,Mois,Montante,Date})
res.status(response.StatusCode).json(response)
})
route.get("/Paimentes",validatejwt,async(req,res)=>{
    const identifiante = (req as any).payload
const response = await getPaimentes({identifiante})
res.status(response.StatusCode).json(response)
})
route.put("/Paimentes/:idStud/complete/:idPaiment",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const {idStud,idPaiment} = req.params
const  {addPrice} = req.body

  if ( isNaN(addPrice)) {
    return res.status(400).json({ StatusCode: 400, data: "Invalid additional amount" });
  }
const response = await CompletePaymente({identifiante,idStud,idPaiment,addPrice})
res.status(response.StatusCode).json(response)
})
route.get("/Paimentes/:idStud",validatejwt,async(req,res)=>{
  const identifiante = (req as any).payload
  const {idStud} = req.params
  const response = await getOnePaimente({idStud,identifiante})
  res.status(response.StatusCode).json(response)
})
export default route