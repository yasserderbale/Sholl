import mongoose, { Document, Schema } from "mongoose";
export interface Imatires extends Document{
    name:string,
    prix:number,
    Niveau:string
}
const matiershema:Schema=new mongoose.Schema({
    name:{type:String,required:true,unique:false},
    prix:{type:Number,required:true},
    Niveau:{type:String,required:true}
})
matiershema.index({name:1,Niveau:1},{unique:true})
export const Matieres=mongoose.model<Imatires>("Matiere",matiershema)