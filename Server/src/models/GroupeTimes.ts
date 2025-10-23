import mongoose, { Schema, Document } from "mongoose";

export interface IGroupeTims extends Document {
  groupeId: mongoose.Types.ObjectId; // هنا المرجع إلى Groupe
  heureDebut: string;
  heureFin: string;
  jours: string[];
  classeId: mongoose.Types.ObjectId; // تبقى كيما كانت
}

const GroupeTimsSchema = new Schema<IGroupeTims>(
  {
    groupeId: { type: Schema.Types.ObjectId, ref: "groupe", required: true }, // 🔥 المرجع الحقيقي
    heureDebut: { type: String, required: true },
    heureFin: { type: String, required: true },
    jours: { type: [String], required: true },
    classeId: { type: Schema.Types.ObjectId, ref: "Classe", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGroupeTims>("GroupeTims", GroupeTimsSchema);
