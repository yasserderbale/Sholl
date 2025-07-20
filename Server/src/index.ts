import express from "express"
import mongoose from "mongoose"
import loginAdmn from "./routes/LoginAdmin"
import Student from "./routes/Students"
import Matier from "./routes/Matieres"
const app=express()
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/school").then(()=>{
    console.log("Connect BDD succed")
}).catch((error)=>{
    console.log("failed connect BDD")
})

app.use(loginAdmn)
app.use(Student)
app.use(Matier)
const port = 3000
app.listen(port,()=>{
    console.log("server run on",port)
})