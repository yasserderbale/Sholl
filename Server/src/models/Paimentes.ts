import mongoose, { Document, Schema }  from "mongoose";
interface Imatieres {
    idMat:mongoose.Types.ObjectId 
}
interface IStudents {
matieres:Imatieres[],
Mois:string,
Montante:number,
Date:Date
}
interface Ipaimentes extends Document{
    idStud:mongoose.Types.ObjectId,
    paimentes:IStudents[]
}
const matieres = new Schema<Imatieres>({
    idMat:[{type:Schema.Types.ObjectId,ref:"Matiere"}],

})
const Studentes = new Schema <IStudents>({
    matieres:[matieres],
Mois:{type:String},
Montante:{type:Number},
Date:{type:Date}
}) 
const Paimentes = new Schema<Ipaimentes>({
    idStud:{type:Schema.Types.ObjectId,ref:"Studente"},
    paimentes:[Studentes]
})

export const paimentesModel = mongoose.model<Ipaimentes>("Paimente",Paimentes)