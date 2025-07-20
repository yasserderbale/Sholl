import mongoose, { Document, model, Schema } from "mongoose";
interface Items extends Document {
    matid:mongoose.Types.ObjectId,
    name:string,
    prix:number
}
interface Istudentes extends Document{
    Name:string,
    Age:number,
    Nivuea:number,
    Telephone:number,
    modules:Items[],
    Date:Date
}
const itemShema=new mongoose.Schema<Items>({
    matid:{type:Schema.Types.ObjectId,ref:"Matiere"},
    name:{type:String,required:true},
    prix:{type:Number,required:true},
})
const StudenteShema=new mongoose.Schema<Istudentes>({
Name:{type:String,required:true},
Age:{type:Number,required:true},
Nivuea:{type:Number,required:true},
Telephone:{type:Number,required:true},
modules :[itemShema],
Date:{type:Date,required:true}
}) 
export const Studentemodel= mongoose.model<Istudentes>("Studente",StudenteShema) 