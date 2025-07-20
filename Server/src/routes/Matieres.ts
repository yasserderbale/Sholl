import express from 'express'
import { validatejwt } from '../medallware/ValidateJWT'
import { Newmatire } from '../services/Newmatire'
import { Deletmatiere, Getmatieres, Getonemat, updatematiere } from '../services/Matieres'
const route = express.Router()
route.get("/Matieres",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const response = await Getmatieres ({identifiante})
return res.status(response.StatusCode).json(response)
})
route.get("/Matieres/:id",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const idmat=req.params.id

const response = await Getonemat ({identifiante,idmat})
return res.status(response.StatusCode).json(response)
})
route.post("/newMatire",validatejwt,async(req,res)=>{
const identifiante=(req as any).payload
const {name,prix}=req.body
const response=await Newmatire({identifiante,name,prix})
return res.status(response.StatusCode).json(response)
})
route.delete("/newMatire",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const idmatiere="6873f565c01cdc49d9427c77"
const response= await Deletmatiere({idmatiere,identifiante})
return res.status(response.StatusCode).json(response)
})
route.put("/newMatire/:id",validatejwt,async(req,res)=>{
const identifiante = (req as any).payload
const idmatiere=req.params.id
const {name,prix}=req.body 
const respons= await updatematiere({idmatiere,identifiante,name,prix})
return res.status(respons.StatusCode).json(respons)



})
export default route