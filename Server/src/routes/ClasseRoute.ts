import express from "express";
import {
  getAllClasses,
  addClasse,
  deleteClasse,
  updateClasse,
  getClasseById,
  getGroupesByClasse,
  searchClasse,
} from "../services/ClassService";
import { validatejwt } from "../medallware/ValidateJWT";
const router = express.Router();
router.get("/AllClasses", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await getAllClasses(identifaite);
  res.status(response.StatusCode).json(response);
});

router.post("/AddClasse", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { nom, description } = req.body;
  const response = await addClasse(identifaite, nom, description);
  res.status(response.StatusCode).json(response);
});

router.delete("/DeleteClasse/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { id } = req.params;
  const response = await deleteClasse(identifaite, id);
  res.status(response.StatusCode).json(response);
});
router.get("/Classe/:id", validatejwt, async (req, res) => {
  const { id } = req.params;
  const response = await getClasseById(id);
  res.status(response.StatusCode).json(response);
});

router.put("/UpdateClasse/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { id } = req.params;
  const { nom, description } = req.body;

  const response = await updateClasse(id, nom, description, identifaite);
  res.status(response.StatusCode).json(response);
});

router.get("/Classe/:id/groupes", validatejwt, async (req, res) => {
  const { id } = req.params;
  const response = await getGroupesByClasse(id);
  res.status(response.StatusCode).json(response);
});

router.get("/SearchClasse", validatejwt, async (req, res) => {
  const { q } = req.query; // q = query (الكلمة لي راك تبحث بيها)
  const response = await searchClasse(q as string);
  res.status(response.StatusCode).json(response);
});

export default router;
