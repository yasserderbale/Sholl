import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  getAbcense,
  RegistnewAbcense,
  SearchAbcense,
} from "../services/Abcense";
const route = express.Router();
route.post("/Abcenses", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { idMat, Date, idStud, cause } = req.body;
  console.log(req.body);
  const response = await RegistnewAbcense({
    identifaite,
    idMat,
    Date,
    idStud,
    cause,
  });
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
export default route;
