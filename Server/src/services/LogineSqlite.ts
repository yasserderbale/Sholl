import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createLoginTable,
  findLoginByIdentifiante,
  insertLogin,
} from "../models/sqlite/LoginModel";

export const Logineadmin = async ({ identifiante, password }: any) => {
  createLoginTable();
  const row = findLoginByIdentifiante(identifiante);
  if (!row) return { StatusCode: 501, data: "Identifiante not valid " };
  const isvalid = await bcrypt.compare(password, row.password);
  if (!isvalid) return { StatusCode: 501, data: "password not valid" };
  const tocken = jwt.sign({ identifiante }, "yasserderbal2003");
  if (!tocken) return { StatusCode: 400, data: "tocken not valid" };
  return { StatusCode: 200, data: tocken };
};

// helper to create an admin if none exists
export const ensureAdmin = async (identifiante: string, password: string) => {
  createLoginTable();
  const existing = findLoginByIdentifiante(identifiante);
  if (existing) return existing;
  const hashed = await bcrypt.hash(password, 10);
  return insertLogin(identifiante, hashed);
};
