import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  CompletePaymente,
  getOnePaimente,
  getPaimentes,
  RegistnewPaimente,
  SearchePaiementStud,
} from "../services/PaimentesSqlite";
const route = express.Router();
route.post("/Paimentes", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { idMat, idStud, Mois, Montante, Date } = req.body;
  const response = await RegistnewPaimente({
    identifiante,
    idMat,
    idStud,
    Mois,
    Montante,
    Date,
  });
  res.status(response.StatusCode).json(response);
});
route.get("/Paimentes", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await getPaimentes({ identifiante });
  res.status(response.StatusCode).json(response);
});
route.put(
  "/Paimentes/:idStud/complete/:idPaiment",
  validatejwt,
  async (req, res) => {
    const identifiante = (req as any).payload;
    const { idStud, idPaiment } = req.params;
    const { addPrice } = req.body;
    const addPricee = Number(addPrice);
    console.log(typeof addPricee);
    if (isNaN(addPricee)) {
      return res
        .status(400)
        .json({ StatusCode: 400, data: "Invalid additional amount" });
    }

    const response = await CompletePaymente({
      identifiante,
      idStud,
      idPaiment,
      addPricee,
    });
    res.status(response.StatusCode).json(response);
  }
);
route.get("/Paimentes/:idStud/:idPaiment", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { idStud, idPaiment } = req.params;
  const response = await getOnePaimente({ idStud, identifiante, idPaiment });
  res.status(response.StatusCode).json(response);
});
route.get("/PaimentesSearch", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const search = req.query.nam;
  const response = await SearchePaiementStud({ identifiante, search });
  res.status(response.StatusCode).json(response);
});
export default route;
