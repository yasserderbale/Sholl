import express from 'express'
import { validatejwt } from '../medallware/ValidateJWT'
import { StatistiqDachborde } from '../services/Dachborde'
const app = express.Router()
app.get("/Dachbord",validatejwt,async(req,res)=>{
const identifaite= (req as any).payload
const response = await StatistiqDachborde({identifaite})
res.status(response.StatusCode).json(response)
})
export default app