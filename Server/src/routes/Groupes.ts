import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import { AddnewGroup, GetAllgroupes } from "../services/Groupe";
const app = express.Router();
app.post("/Groupes", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { name, nbrmax, fraise } = req.body;
  const response = await AddnewGroup({ identifaite, name, nbrmax, fraise });
  res.status(response.StatusCode).json(response);
});
app.get("/Groupes", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await GetAllgroupes({identifaite})
  res.status(response.StatusCode).json(response)
});
export default app;
