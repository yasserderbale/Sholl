import mongoose from "mongoose";
interface Igroupe {
  name: string;
  Nbrmax: number;
  fraisscolaire: number;
}
const groupe = new mongoose.Schema<Igroupe>({
  name: { required: true, type: String,unique:true },
  Nbrmax: { required: true, type: Number },
  fraisscolaire: { required: true, type: Number },
});
export const Groupemodel = mongoose.model<Igroupe>("groupe", groupe);
