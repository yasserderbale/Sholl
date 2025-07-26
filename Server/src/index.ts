import express from "express"
import mongoose from "mongoose"
import loginAdmn from "./routes/LoginAdmin"
import Student from "./routes/Students"
import Matier from "./routes/Matieres"
import Abcense from "./routes/Abcenses"
import Paimentes from "./routes/Paimentes"
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
app.use(Abcense)
app.use(Paimentes)
const port = 3000
app.listen(port,()=>{
    console.log("server run on",port)
})