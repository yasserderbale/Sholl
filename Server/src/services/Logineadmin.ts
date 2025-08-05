import jwt from "jsonwebtoken"
import { loginemodel } from "../models/Logine";
import bcrypt from "bcrypt"

interface Ilogin{
    identifiante:string,
    password:string
}
export const Logineadmin =async ({identifiante,password}:Ilogin) => {
  const booladmin=await loginemodel.findOne({identifiante})
  if(!booladmin){
    return {StatusCode:501,data:"Identifiante not valid "}
  }
  const isvalid=await bcrypt.compare(password,booladmin.password)
  if(!isvalid) return{StatusCode:501,data:"password not valid"}
  const tocken=jwt.sign({identifiante},"yasserderbal2003")
  if(!tocken) return{StatusCode:400,data:"tocken not valid"}

  return {StatusCode:200,data:tocken}
};
