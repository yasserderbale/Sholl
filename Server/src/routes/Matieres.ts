import express, { response } from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import { Newmatire, Searchonmat } from "../services/MatieresSqlite";
import {
  Deletmatiere,
  Getmatieres,
  Getonemat,
  updatematiere,
} from "../services/MatieresSqlite";
const route = express.Router();
route.get("/Matieres", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await Getmatieres({ identifiante });
  return res.status(response.StatusCode).json(response);
});
route.get("/Matieres/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const idmat = req.params.id;
  const response = await Getonemat({ identifiante, idmat });
  return res.status(response.StatusCode).json(response);
});
route.post("/newMatire", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { namee, prix, Niveau } = req.body;
  const response = await Newmatire({ identifiante, namee, prix, Niveau });
  return res.status(response.StatusCode).json(response);
});
route.delete("/newMatire/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const idmatiere = req.params.id;
  const response = await Deletmatiere({ idmatiere, identifiante });
  return res.status(response.StatusCode).json(response);
});
route.put("/newMatire/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const idmatiere = req.params.id;
  const { prix, Niveau } = req.body;
  const respons = await updatematiere({
    idmatiere,
    identifiante,
    prix,
    Niveau,
  });
  return res.status(respons.StatusCode).json(respons);
});
route.get("/searchOne", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const searche = req.query.name;
  const response = await Searchonmat({ identifiante, searche });
  res.status(response.StatusCode).json(response);
});
export default route;
