import express from "express";
import { Logineadmin } from "../services/LogineSqlite";
const route = express.Router();
route.post("/Login", async (req, res) => {
  const { identifiante, password } = req.body;
  const response = await Logineadmin({ identifiante, password });
  res.status(response.StatusCode).json(response);
});
export default route;
