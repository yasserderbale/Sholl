import mongoose, { Schema } from "mongoose";
interface Igroupe {
  name: string;
  Nbrmax: number;
  fraisscolaire: number;
  Studentid: mongoose.Types.ObjectId[]; // نخزن هنا الـIDs
}
const groupe = new mongoose.Schema<Igroupe>({
  name: { required: true, type: String, unique: true },
  Nbrmax: { required: true, type: Number },
  fraisscolaire: { required: true, type: Number },
  Studentid: [
    { type: Schema.Types.ObjectId, ref: "Studente", required: false },
  ],
});

export const Groupemodel = mongoose.model<Igroupe>("groupe", groupe);
