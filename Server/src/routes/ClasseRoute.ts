import express from "express";
import {
  getAllClasses,
  addClasse,
  deleteClasse,
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
  const { name, notes } = req.body;
  const response = await addClasse(identifaite, name, notes);
  res.status(response.StatusCode).json(response);
});

router.delete("/DeleteClasse/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { id } = req.params;
  const response = await deleteClasse(identifaite, id);
  res.status(response.StatusCode).json(response);
});

export default router;
