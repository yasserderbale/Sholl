import mongoose, { Document, Schema } from "mongoose"

interface IabcensesofMat extends Document{
    idMat:mongoose.Types.ObjectId,
    cause:string
}
interface IabcensesofDat extends Document{
    Date:Date,
    matieres:IabcensesofMat[]
}
interface Iabcenses extends Document{
    IdStud:mongoose.Types.ObjectId,
    Abcense:IabcensesofDat[]
}
const Mat = new mongoose.Schema<IabcensesofMat>({
idMat:{type:Schema.Types.ObjectId,ref:"Matiere",required:true},
cause:{type:String}
})
const Dat = new mongoose.Schema<IabcensesofDat>({
    Date:{type:Date},
    matieres:[Mat]
})
const abcense = new mongoose.Schema<Iabcenses>({
    IdStud:{type:Schema.Types.ObjectId,ref:"Studente",required:true},
    Abcense:[Dat]
})
 export const Abcensesmodel = mongoose.model<Iabcenses>("Abcense",abcense)