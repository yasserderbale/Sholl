import mongoose, { Document, Schema } from "mongoose";
interface IabcensesofMat {
  idMat: mongoose.Types.ObjectId | mongoose.Types.ObjectId[];
}
interface IabcensesofDat {
  cause: string;
  Date: Date;
  matieres: IabcensesofMat[];
}
interface IAbcense {
  idStud: mongoose.Types.ObjectId[] | mongoose.Types.ObjectId;
  Abcenses: IabcensesofDat[];
}
const Mat = new mongoose.Schema<IabcensesofMat>({
  idMat: { type: Schema.Types.ObjectId, ref: "Matiere", required: true },
});
const Dat = new mongoose.Schema<IabcensesofDat>({
  cause: { type: String },
  Date: { type: Date },
  matieres: [Mat],
});
const Abcenses = new mongoose.Schema<IAbcense>({
  idStud: [{ type: Schema.Types.ObjectId, ref: "Studente", required: true }],
  Abcenses: [Dat],
});

export const Abcensesmodel = mongoose.model<IAbcense>("Abcense", Abcenses);
