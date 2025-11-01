import { Router } from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import { getSettings, updateSettings } from "../services/SettingsSqlite";

const app = Router();

// Get settings
app.get("/settings", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await getSettings({ identifaite });
  res.status(response.StatusCode).json(response);
});

// Update settings
app.post("/settings", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const { schoolNameFr, schoolNameAr, address, phone, email } = req.body;
  
  const response = await updateSettings({
    identifaite,
    schoolNameFr,
    schoolNameAr,
    address,
    phone,
    email,
  });
  
  res.status(response.StatusCode).json(response);
});

export default app;
