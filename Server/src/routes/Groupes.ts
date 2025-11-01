import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  AddnewGroup,
  deleteongroupe,
  GetAllgroupes,
  Getongroupe,
  Searchgr,
  Updateongroupe,
} from "../services/GroupeSqlite";
const app = express.Router();
app.post("/Groupes", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { name } = req.body;
  const response = await AddnewGroup({
    identifaite,
    name,
  });
  res.status(response.StatusCode).json(response);
});
app.get("/Groupes", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await GetAllgroupes({ identifaite });
  res.status(response.StatusCode).json(response);
});
app.get("/Groupes/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const idgroupe = req.params.id;
  const reponse = await Getongroupe({ identifaite, idgroupe });
  res.status(reponse.StatusCode).json(reponse);
});
app.put("/Groupes/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const idgroupe = req.params.id;
  const { name } = req.body;
  const reponse = await Updateongroupe({
    identifaite,
    idgroupe,
    name,
  });
  res.status(reponse.StatusCode).json(reponse);
});
app.delete("/Groupes/:id", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const idgroupe = req.params.id;
  console.log(idgroupe);
  const reponse = await deleteongroupe({ identifaite, idgroupe });
  res.status(reponse.StatusCode).json(reponse);
});
app.get("/SeatcheGroupe", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const search = req.query.name;
  const response = await Searchgr({ identifaite, search });
  res.status(response.StatusCode).json(response);
});
export default app;
