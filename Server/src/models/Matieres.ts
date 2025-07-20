import mongoose, { Document, Schema } from "mongoose";
export interface Imatires extends Document{
    name:string,
    prix:number
}
const matiershema:Schema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    prix:{type:Number,required:true}
})
export const Matieres=mongoose.model<Imatires>("Matiere",matiershema)