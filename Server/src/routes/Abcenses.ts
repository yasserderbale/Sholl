import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  getAbcense,
  RegistnewAbcense,
  SearchAbcense,
  removeAbsence,
  removeAllAbsences,
  updateAbsence
} from "../services/AbcenseSqlite";
const route = express.Router();
route.post("/Abcenses", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { idMat, Date, idStud, cause } = req.body;
  console.log("بيانات الوصول:", req.body);
  console.log("الطلاب المختارين:", idStud);
  console.log("المعرف:", identifaite);
  
  const response = await RegistnewAbcense({
    identifaite,
    idMat,
    Date,
    idStud,
    cause,
  });
  console.log("الاستجابة:", response);
  res.status(response.StatusCode).json(response);
});
route.get("/Abcenses", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await getAbcense({ identifaite });
  res.status(response.StatusCode).json(response);
});
route.get("/SearchAbc", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  let search = req.query.search;
  // if (!search || typeof search !== "string" || search.trim() === "") {
  // search = ""; // أو تقدر تهمل البحث نهائياً
  // }
  console.log(search);
  const response = await SearchAbcense({ identifaite, search });
  res.status(response.StatusCode).json(response);
});

// Supprimer une absence spécifique
route.delete('/Abcenses/:id', validatejwt, async (req, res) => {
  const { id } = req.params;
  const response = await removeAbsence(id);
  res.status(response.StatusCode).json(response);
});

// Supprimer toutes les absences
route.delete('/Abcenses', validatejwt, async (req, res) => {
  const response = await removeAllAbsences();
  res.status(response.StatusCode).json(response);
});

// Mettre à jour une absence
route.put('/Abcenses/:id', validatejwt, async (req, res) => {
  const { id } = req.params;
  const { idMat, Date, idStud, cause } = req.body;
  
  const response = await updateAbsence(id, {
    idMat,
    Date,
    idStud,
    cause
  });
  
  res.status(response.StatusCode).json(response);
});

export default route;
