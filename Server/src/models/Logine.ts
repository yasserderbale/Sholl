import mongoose, { Document } from "mongoose";
interface Ilogine extends Document {
    identifiante:string,
    password:string
}
const LogineShema=new mongoose.Schema({
identifiante:{type:String,required:true},
password:{type:String,required:true}
})
export const loginemodel=mongoose.model<Ilogine>("Logine",LogineShema)



