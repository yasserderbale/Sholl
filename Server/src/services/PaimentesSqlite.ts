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
  
  // تحويل Mois إلى array إذا كان string
  const moisArray = Array.isArray(Mois) ? Mois : [Mois];
  
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
  const Restprix = Montante - totalprcieMat * moisArray.length;
  const bool = Restprix === 0 ? "Paimente Complet" : 
               Restprix > 0 ? "Paimente Partiel - Surplus" : "Paimente Partiel - Insuffisant";

  // البحث عن دفعة موجودة لنفس الشهر والمادة
  const existingPayment = existing.find((p) => {
    const pMois = p.Mois ? (typeof p.Mois === 'string' ? JSON.parse(p.Mois) : p.Mois) : [];
    const pMatieres = p.matieres ? (typeof p.matieres === 'string' ? JSON.parse(p.matieres) : p.matieres) : [];
    const hasMonth = pMois.some((m: string) => moisArray.includes(m));
    const hasMatiere = pMatieres.some((mat: any) => matIds.includes(mat.idMat));
    return hasMonth && hasMatiere;
  });

  if (existingPayment) {
    // إذا كانت الدفعة مكتملة، منع الإضافة
    if (existingPayment.status === 'Paimente Complet') {
      return { StatusCode: 400, data: `Ce Mois deja Payees completement :${moisArray}` };
    }
    
    // إكمال الدفعة الموجودة
    const newTotal = (existingPayment.Montante || 0) + Montante;
    const newRestprix = newTotal - totalprcieMat * moisArray.length;
    const newStatus = newRestprix === 0 ? "Paimente Complet" : 
                     newRestprix > 0 ? "Paimente Partiel - Surplus" : "Paimente Partiel - Insuffisant";
    
    const { updatePayment } = require('../models/sqlite/PaimentesModel');
    updatePayment(existingPayment.id, {
      Montante: newTotal,
      status: newStatus,
      Date: Date
    });
    
    return { StatusCode: 200, data: "Paiment mis à jour avec succès" };
  }

  // إنشاء دفعة جديدة
  const newP = insertPayment({
    studentId: idStud,
    Mois: moisArray,
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
  
  // جلب مدفوعات الطالب المحدد
  const studentPayments = listPaymentsByStudent(search);
  
  // تحويل البيانات لتتطابق مع ما يتوقعه Frontend
  const formattedPayments = studentPayments.map((payment: any) => {
    let matieres = [];
    let mois = [];
    
    // معالجة matieres بأمان
    if (payment.matieres) {
      if (typeof payment.matieres === 'string') {
        try {
          matieres = JSON.parse(payment.matieres);
        } catch (e) {
          console.log('Error parsing matieres:', payment.matieres);
          matieres = [];
        }
      } else if (Array.isArray(payment.matieres)) {
        matieres = payment.matieres;
      }
    }
    
    // معالجة Mois بأمان
    if (payment.Mois) {
      if (typeof payment.Mois === 'string') {
        try {
          mois = JSON.parse(payment.Mois);
        } catch (e) {
          console.log('Error parsing Mois:', payment.Mois);
          mois = [payment.Mois]; // إذا فشل parsing، اعتبره string واحد
        }
      } else if (Array.isArray(payment.Mois)) {
        mois = payment.Mois;
      }
    }
    
    const firstMatiere = matieres[0];
    const firstMois = mois[0];
    
    // حساب السعر الإجمالي المطلوب
    const matiere = firstMatiere ? require('../models/sqlite/MatieresModel').findMatiereById(firstMatiere.idMat) : null;
    const prixMatiere = matiere?.prix || 0;
    const montantTotal = prixMatiere * mois.length;
    const montantPaye = payment.Montante || 0;
    const montantRestant = Math.max(0, montantTotal - montantPaye);
    
    // تحديد الحالة
    let statut = 'en_attente';
    if (payment.status === 'Paimente Complet') {
      statut = 'paye';
    } else if (payment.status && payment.status.includes('Partiel')) {
      statut = 'partiel';
    }
    
    return {
      id: payment.id,
      _id: payment.id,
      matiereId: firstMatiere?.idMat || null,
      mois: firstMois || '',
      annee: '2025',
      montant: montantTotal,
      montantTotal: montantTotal,
      montantPaye: montantPaye,
      montantRestant: montantRestant,
      datePaiement: payment.Date || new Date().toISOString().split('T')[0],
      methodePaiement: 'cash',
      statut: statut
    };
  });
  
  return { StatusCode: 200, data: formattedPayments };
};
