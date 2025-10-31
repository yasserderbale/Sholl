import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  addTeacher,
  getTeachers,
  getTeacher,
  updateOneTeacher,
  deleteOneTeacher,
  searchTeachers,
} from "../services/TeacherSqlite";

const router = express.Router();

router.post("/Teachers", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await addTeacher(identifiante, req.body);
  res.status(response.StatusCode).json(response);
});

router.get("/Teachers", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await getTeachers(identifiante);
  res.status(response.StatusCode).json(response);
});

router.get("/Teachers/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { id } = req.params;
  const response = await getTeacher(identifiante, id);
  res.status(response.StatusCode).json(response);
});

router.put("/Teachers/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { id } = req.params;
  const response = await updateOneTeacher(identifiante, id, req.body);
  res.status(response.StatusCode).json(response);
});

router.delete("/Teachers/:id", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { id } = req.params;
  const response = await deleteOneTeacher(identifiante, id);
  res.status(response.StatusCode).json(response);
});

router.get("/SearchTeachers", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const q = (req.query.q as string) || "";
  const response = await searchTeachers(identifiante, q);
  res.status(response.StatusCode).json(response);
});

export default router;


