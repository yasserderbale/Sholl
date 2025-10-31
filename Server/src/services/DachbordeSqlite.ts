import { all as allPayments } from "../db/sqlite";
import { listPayments } from "../models/sqlite/PaimentesModel";
import { listStudents } from "../models/sqlite/StudentModel";

export const StatistiqDachborde = async ({ identifaite }: any) => {
  if (!identifaite)
    return { StatusCode: 402, data: "identifiante not provider" };
  // number of students
  const students = listStudents();
  const GetEleves = [{ "Nobre des eleves": students.length }];
  // sum of payments
  const payments = listPayments();
  const total = payments.reduce(
    (acc: number, p: any) => acc + (p.Montante || 0),
    0
  );
  const GetPaimentes = [{ _id: "Student", total }];
  // students by specialty
  const groupBySpec: Record<string, number> = {};
  students.forEach((s: any) => {
    const key = s.Spécialité || "unknown";
    groupBySpec[key] = (groupBySpec[key] || 0) + 1;
  });
  const GetEleveSpecialites = Object.keys(groupBySpec).map((k) => ({
    _id: k,
    nbreleves: groupBySpec[k],
  }));
  return {
    StatusCode: 200,
    data: { GetEleves, GetPaimentes, GetEleveSpecialites },
  };
};
