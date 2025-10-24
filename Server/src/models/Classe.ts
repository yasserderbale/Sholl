import mongoose, { Schema, Document } from "mongoose";

export interface IClasse extends Document {
  name: string;
  notes?: string;
  groupes: mongoose.Types.ObjectId[]; // relation vers les groupes
}

const ClasseSchema = new Schema<IClasse>(
  {
    name: { type: String, required: true },
    notes: { type: String },
    groupes: [{ type: Schema.Types.ObjectId, ref: "GroupeTims" }],
  },
  { timestamps: true }
);

export default mongoose.model<IClasse>("Classe", ClasseSchema);
