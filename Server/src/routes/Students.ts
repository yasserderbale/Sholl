import express from 'express'
import { DeletStudents, getStudentes, getStudentesOne, Registerstud, SearchStudentes, updateStudent } from '../services/Registerstud'
import { validatejwt } from '../medallware/ValidateJWT'
const route=express.Router()
route.post("/Student",validatejwt,async(req,res)=>{    
    const identifinate=(req as any).payload
    const {Name,Age,Nivuea,Telephone,modules,Date}=req.body
    const response=await Registerstud({identifinate,Name,Age,Nivuea,Telephone,modules,Date})
    return res.status(response.StatusCode).json(response)
})
route.get("/Student",validatejwt,async(req,res)=>{
    const identifinate=(req as any).payload
const response = await getStudentes({identifinate})
res.status(response.StatusCode).json(response)
})
route.get("/Search",validatejwt,async(req,res)=>{
    const identifinate=(req as any).payload
    const name = req.query.name || ""
const response = await SearchStudentes({identifinate,name})
res.status(response.StatusCode).json(response)
})
route.get("/Student/:id",validatejwt,async(req,res)=>{
    const identifinate=(req as any).payload
    const idStud=req.params.id
const response = await getStudentesOne({identifinate,idStud})
res.status(response.StatusCode).json(response)
})
route.put("/Student/:id",validatejwt,async(req,res)=>{
        const identifinate=(req as any).payload
        const idStud=req.params.id
        const {Name,Age,Nivuea,Telephone,modules} = req.body
        const response = await updateStudent({identifinate,idStud,Name,Age,Nivuea,Telephone,modules})
        res.status(response.StatusCode).json(response)
})
route.delete("/Student/:id",validatejwt,async(req,res)=>{
        const identifinate=(req as any).payload
       const idStud = req.params.id
        const response = await DeletStudents({identifinate,idStud})
         res.status(response.StatusCode).json(response)
})
export default route