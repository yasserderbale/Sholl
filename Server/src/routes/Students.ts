import express from 'express'
import { getStudentes, Registerstud } from '../services/Registerstud'
import { validatejwt } from '../medallware/ValidateJWT'
const route=express.Router()
route.post("/Register",validatejwt,async(req,res)=>{    
    const identifinate=(req as any).payload
    const {Name,Age,Nivuea,Telephone,modules,Date}=req.body
    const response=await Registerstud({identifinate,Name,Age,Nivuea,Telephone,modules,Date})
    return res.status(response.StatusCode).json(response)
})
route.get("/Register",validatejwt,async(req,res)=>{
    const identifinate=(req as any).payload
const response = await getStudentes({identifinate})
res.status(response.StatusCode).json(response)
})

export default route