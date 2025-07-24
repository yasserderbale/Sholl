import express from "express"
import { validatejwt } from "../medallware/ValidateJWT"
import { getAbcense, RegistnewAbcense } from "../services/Abcense"
const route = express.Router()
route.post("/Abcenses",validatejwt, async(req,res)=>{
const identifaite= (req as any).payload
const {idMat,Date,idStud,cause} = req.body
const response = await RegistnewAbcense({identifaite,idMat,Date,idStud,cause})
res.status(response.StatusCode).json(response)
})
route.get("/Abcenses",validatejwt, async(req,res)=>{
const identifaite= (req as any).payload
const response = await getAbcense({identifaite})
res.status(response.StatusCode).json(response)
})
export default route