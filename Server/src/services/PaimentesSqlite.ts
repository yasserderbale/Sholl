import {
  insertPayment,
  listPayments,
  listPaymentsByStudent,
  findPaymentById,
  updatePayment,
} from "../models/sqlite/PaimentesModel";
import {
  findMatiereById,
  createMatieresTable,
} from "../models/sqlite/MatieresModel";
import { findStudentById } from "../models/sqlite/StudentModel";

export const RegistnewPaimente = async ({
  identifiante,
  idMat,
  idStud,
  Mois,
  Montante,
  Date,
}: any) => {
  if (!identifiante) return { StatusCode: 404, data: "failed chek tocken " };
  if (!idMat || !idStud || !Mois || !Montante || !Date)
    return { StatusCode: 404, data: "you`ve to insert all info.. " };
  createMatieresTable();
  const mapMatieres = Array.isArray(idMat)
    ? idMat.map((id: any) => ({ idMat: id }))
    : [{ idMat }];
  // check existing payments for student
  const existing = listPaymentsByStudent(idStud);
  // validate matieres exist and compute total price
  const matIds = Array.isArray(idMat) ? idMat : [idMat];
  const chechMatieres = matIds
    .map((m: string) => findMatiereById(m))
    .filter(Boolean);
  if (!chechMatieres.length)
    return { StatusCode: 501, data: "failed get Matires" };
  const totalprcieMat = chechMatieres.reduce(
    (acc: number, cur: any) => acc + (cur.prix || 0),
    0
  );
  const Restprix = Montante - totalprcieMat * Mois.length;
  const bool = Restprix === 0 ? "Paimente Complet" : Math.abs(Restprix);

  // check duplicate months
  if (existing && existing.length) {
    const paidMonths = existing.flatMap((p) => p.Mois || []);
    const dup = Mois.filter((m: string) => paidMonths.includes(m));
    if (dup.length > 0)
      return { StatusCode: 400, data: `Ce Mois deja Payees :${dup}` };
  }

  const newP = insertPayment({
    studentId: idStud,
    Mois,
    Montante,
    Date,
    matieres: mapMatieres,
    status: bool,
  });
  return { StatusCode: 200, data: newP };
};

export const getPaimentes = async ({ identifiante }: any) => {
  if (!identifiante) return { StatusCode: 404, data: "failed chek tocken " };
  const rows = listPayments();
  // optional: enhance to populate student and matieres details
  return { StatusCode: 200, data: rows };
};

export const CompletePaymente = async ({
  identifiante,
  idStud,
  idPaiment,
  addPricee,
}: any) => {
  if (!identifiante) return { StatusCode: 404, data: "failed chek tocken " };
  if (!idPaiment || !idStud || !addPricee)
    return { StatusCode: 404, data: "you`ve to insert all info.. " };
  const payment = findPaymentById(idPaiment);
  if (!payment) return { StatusCode: 404, data: "Failed get Paiments" };
  const matIds = (payment.matieres || []).map((m: any) => m.idMat);
  const chechMatieres = matIds
    .map((m: string) => findMatiereById(m))
    .filter(Boolean);
  if (!chechMatieres.length)
    return { StatusCode: 404, data: "Failed get Matieres" };
  const prcieMat = chechMatieres.reduce(
    (acc: number, cur: any) => acc + (cur.prix || 0),
    0
  );
  const totalprcieMat = prcieMat * (payment.Mois?.length || 0);
  const expectedPrice = (payment.Montante += addPricee);
  const status =
    expectedPrice - totalprcieMat === 0
      ? "Paiment Complet"
      : Math.abs(expectedPrice - totalprcieMat);
  updatePayment(idPaiment, { Montante: expectedPrice, status });
  const updated = findPaymentById(idPaiment);
  return { StatusCode: 200, data: updated };
};

export const getOnePaimente = async ({
  identifiante,
  idStud,
  idPaiment,
}: any) => {
  if (!identifiante) return { StatusCode: 404, data: "failed check tocken " };
  if (!idStud || !idPaiment)
    return { StatusCode: 404, data: "req of student check Student " };
  const payment = findPaymentById(idPaiment);
  if (!payment) return { StatusCode: 404, data: "failed check Student " };
  return { StatusCode: 200, data: payment };
};

export const SearchePaiementStud = async ({ identifiante, search }: any) => {
  if (!identifiante) return { StatusCode: 404, data: "failed check tocken " };
  // naive search: find students whose name matches and then payments by their id
  const matched: any[] = [];
  // we don't have direct SQL join here because student model is separate; simplified: return all payments and let frontend filter
  const all = listPayments();
  return { StatusCode: 200, data: all };
};
