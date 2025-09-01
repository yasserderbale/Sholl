import mongoose, { Document, Schema } from "mongoose";
interface Items extends Document {
    matid:mongoose.Types.ObjectId,
}
interface Istudentes extends Document{
    Name:string,
    Age:number,
    Spécialité:string,
    Genre:string
    Nivuea:string,
    Telephone:number,
    modules:Items[],
    Date:Date
}
const itemShema=new mongoose.Schema<Items>({
    matid:{type:Schema.Types.ObjectId,ref:"Matiere"},
   
})
const StudenteShema=new mongoose.Schema<Istudentes>({
Name:{type:String,required:true},
Age:{type:Number,required:true},
Spécialité:{type:String,required:false},
Genre:{type:String,required:true},
Nivuea:{type:String,required:true},
Telephone:{type:Number,required:true},
modules :[itemShema],
Date:{type:Date,required:true}
}) 
export const Studentemodel= mongoose.model<Istudentes>("Studente",StudenteShema) 