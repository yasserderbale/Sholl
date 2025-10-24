import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  addGroupeToClasse,
  deleteGroupe,
  getAllGroupes,
  getGroupeById,
  searchGroupeTims,
  updateGroupeTim,
} from "../services/GroupeService";
const router = express.Router();
router.post("/AddGroupe", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { groupeId, classeId, heureDebut, heureFin, jours } = req.body;
  const response = await addGroupeToClasse(
    groupeId,
    classeId,
    heureDebut,
    heureFin,
    jours,
    identifaite
  );
  res.status(response.StatusCode).json(response);
});
router.get("/GetGroupes", validatejwt, async (req, res) => {
  try {
    const identifaite = (req as any).payload;
    const response = await getAllGroupes(identifaite);
    res.status(response.StatusCode).json(response);
  } catch (error) {
    console.error("Error fetching groupes:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});
// ❌ حذف GroupeTim
router.delete("/DeleteGroupe/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { id } = req.params;
  const response = await deleteGroupe(identifaite, id);
  res.status(response.StatusCode).json(response);
});

router.get("/GetGroupe/:id", validatejwt, async (req, res) => {
  const { id } = req.params;
  const response = await getGroupeById(id);
  res.status(response.StatusCode).json(response);
});

// ✏️ تعديل GroupeTim
router.put("/UpdateGroupeTim/:id", validatejwt, async (req, res) => {
  const { id } = req.params;
  const { heureDebut, heureFin, jours } = req.body;
  const response = await updateGroupeTim(id, heureDebut, heureFin, jours);
  res.status(response.StatusCode).json(response);
});

// 🔎 البحث حسب اسم groupe
router.get("/SearchGroupeTims", validatejwt, async (req, res) => {
  const { q } = req.query;
  const response = await searchGroupeTims(q as string);
  res.status(response.StatusCode).json(response);
});

export default router;
