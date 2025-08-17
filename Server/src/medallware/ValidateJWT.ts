import { NextFunction, Request, Response } from "express";
import  Jwt  from "jsonwebtoken";
export const validatejwt=(req:Request,res:Response,next:NextFunction)=>{
const Authheader=req.headers.authorization
if(!Authheader) return res.status(401).json({message:"there isn`t not tocken"})
    const tocken=Authheader.split(" ")[1]
Jwt.verify(tocken,"yasserderbal2003",(erore,payload)=>{
    if(erore) return res.status(401).json({message:"invalid tocken"});
        (req as any).payload=payload
    next()
})

}