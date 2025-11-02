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

// POST /paiements - إنشاء دفعة جديدة
route.post("/paiements", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { etudiantId, matiereId, mois, montant, datePaiement } = req.body;
  
  // تحويل أسماء الحقول للتطابق مع الـ service
  const response = await RegistnewPaimente({
    identifiante,
    idMat: matiereId,
    idStud: etudiantId,
    Mois: mois,
    Montante: montant,
    Date: datePaiement,
  });
  res.status(response.StatusCode).json(response);
});

// GET /paiements - جلب جميع المدفوعات
route.get("/paiements", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await getPaimentes({ identifiante });
  res.status(response.StatusCode).json(response);
});

// GET /paiements/etudiant/:studentId - جلب مدفوعات طالب محدد
route.get("/paiements/etudiant/:studentId", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { studentId } = req.params;
  const response = await SearchePaiementStud({ identifiante, search: studentId });
  res.status(response.StatusCode).json(response);
});

// PUT /paiements/:idStud/complete/:idPaiment - إكمال دفعة
route.put(
  "/paiements/:idStud/complete/:idPaiment",
  validatejwt,
  async (req, res) => {
    const identifiante = (req as any).payload;
    const { idStud, idPaiment } = req.params;
    const { addPrice } = req.body;
    const addPricee = Number(addPrice);
    
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

// GET /paiements/:idStud/:idPaiment - جلب دفعة محددة
route.get("/paiements/:idStud/:idPaiment", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { idStud, idPaiment } = req.params;
  const response = await getOnePaimente({ idStud, identifiante, idPaiment });
  res.status(response.StatusCode).json(response);
});

// DELETE /paiements/delete-all - حذف جميع المدفوعات
route.delete("/paiements/delete-all", validatejwt, async (req, res) => {
  try {
    const { run } = require("../db/sqlite");
    run("DELETE FROM payments");
    res.status(200).json({ 
      StatusCode: 200, 
      message: "جميع المدفوعات تم حذفها بنجاح" 
    });
  } catch (error) {
    console.error("Error deleting payments:", error);
    res.status(500).json({ 
      StatusCode: 500, 
      message: "خطأ في حذف المدفوعات" 
    });
  }
});

// POST /paiements/recreate-table - إعادة إنشاء جدول المدفوعات
route.post("/paiements/recreate-table", validatejwt, async (req, res) => {
  try {
    const { run } = require("../db/sqlite");
    const { createPaymentsTable } = require("../models/sqlite/PaimentesModel");
    
    // حذف الجدول القديم
    run("DROP TABLE IF EXISTS payments");
    
    // إنشاء جدول جديد
    createPaymentsTable();
    
    res.status(200).json({ 
      StatusCode: 200, 
      message: "تم إعادة إنشاء جدول المدفوعات بنجاح" 
    });
  } catch (error) {
    console.error("Error recreating table:", error);
    res.status(500).json({ 
      StatusCode: 500, 
      message: "خطأ في إعادة إنشاء الجدول" 
    });
  }
});

// GET /paiements/report - تقرير المدفوعات
route.get("/paiements/report", validatejwt, async (req, res) => {
  try {
    const identifiante = (req as any).payload;
    const { month, groupId } = req.query;
    
    // جلب جميع المدفوعات والطلاب
    const { listPayments } = require("../models/sqlite/PaimentesModel");
    const { findMatiereById } = require("../models/sqlite/MatieresModel");
    const { findStudentById, listStudents } = require("../models/sqlite/StudentModel");
    const { listGroupes } = require("../models/sqlite/GroupModel");
    
    const allPayments = listPayments();
    const allStudents = listStudents(1000, 0); // جلب جميع الطلاب
    
    // تصفية الطلاب حسب المجموعة أولاً
    let filteredStudents = allStudents;
    
    if (groupId && groupId !== 'tous') {
      const allGroups = listGroupes(1000, 0);
      const selectedGroup = allGroups.find((g: any) => g.id === groupId);
      
      if (selectedGroup && selectedGroup.Studentid) {
        filteredStudents = allStudents.filter((student: any) => 
          selectedGroup.Studentid.includes(student.id)
        );
      } else {
        // إذا لم توجد المجموعة، ارجع قائمة فارغة
        filteredStudents = [];
      }
    }
    
    // إنشاء تقرير لجميع الطلاب المصفيين
    const studentGroups: { [key: string]: any } = {};
    
    // إضافة جميع الطلاب المصفيين أولاً مع مواد افتراضية
    const { listMatieres } = require("../models/sqlite/MatieresModel");
    const allMatieres = listMatieres(1000, 0);
    
    filteredStudents.forEach((student: any) => {
      // تحديد اسم المجموعة
      let groupName = 'Non assigné';
      
      if (student.Groupe && Array.isArray(student.Groupe) && student.Groupe.length > 0) {
        const { findGroupeById } = require("../models/sqlite/GroupModel");
        const group = findGroupeById(student.Groupe[0]);
        groupName = group?.name || 'Non assigné';
      } else if (student.Spécialité) {
        groupName = student.Spécialité;
      } else {
        // البحث العكسي في المجموعات
        const allGroups = listGroupes(1000, 0);
        for (const group of allGroups) {
          if (group.Studentid && Array.isArray(group.Studentid) && group.Studentid.includes(student.id)) {
            groupName = group.name;
            break;
          }
        }
      }
      
      // إضافة جميع مواد الطالب مع حالاتها لجميع الأشهر
      const subjects: { [key: string]: any } = {};
      if (student.modules && Array.isArray(student.modules) && student.modules.length > 0) {
        student.modules.forEach((module: any) => {
          // إذا كان module عبارة عن string (ID مباشر)
          const moduleId = typeof module === 'string' ? module : module.matid;
          const matiere = allMatieres.find((m: any) => m.id === moduleId);
          if (matiere) {
            // حساب المدفوعات لهذه المادة حسب الشهر المختار
            let totalPaidForSubject = 0;
            let paymentsCount = 0;
            
            // إذا كان شهر محدد، احسب فقط لهذا الشهر
            if (month && month !== 'tous') {
              const studentMonthPayments = allPayments.filter((p: any) => {
                if (p.studentId !== student.id) return false;
                try {
                  const mois = p.Mois ? 
                    (typeof p.Mois === 'string' ? JSON.parse(p.Mois) : p.Mois) : [];
                  return Array.isArray(mois) ? mois.includes(month) : false;
                } catch (e) {
                  return false;
                }
              });
              
              studentMonthPayments.forEach((payment: any) => {
                try {
                  const paymentMatieres = payment.matieres ? 
                    (typeof payment.matieres === 'string' ? JSON.parse(payment.matieres) : payment.matieres) : [];
                  
                  const hasThisSubject = paymentMatieres.some((mat: any) => mat.idMat === matiere.id);
                  if (hasThisSubject) {
                    totalPaidForSubject += payment.Montante || 0;
                    paymentsCount += 1;
                  }
                } catch (e) {
                  // تجاهل الأخطاء
                }
              });
            } else {
              // إذا كان "جميع الأشهر"، احسب جميع المدفوعات
              const studentAllPayments = allPayments.filter((p: any) => p.studentId === student.id);
              
              studentAllPayments.forEach((payment: any) => {
                try {
                  const paymentMatieres = payment.matieres ? 
                    (typeof payment.matieres === 'string' ? JSON.parse(payment.matieres) : payment.matieres) : [];
                  
                  const hasThisSubject = paymentMatieres.some((mat: any) => mat.idMat === matiere.id);
                  if (hasThisSubject) {
                    totalPaidForSubject += payment.Montante || 0;
                    paymentsCount += 1;
                  }
                } catch (e) {
                  // تجاهل الأخطاء
                }
              });
            }
            
            const remaining = Math.max(0, (matiere.prix || 0) - totalPaidForSubject);
            let status = 'non_paye';
            if (remaining === 0 && totalPaidForSubject > 0) {
              status = 'paye';
            } else if (totalPaidForSubject > 0) {
              status = 'partiel';
            }
            
            subjects[matiere.id] = {
              subjectId: matiere.id,
              subjectName: matiere.name,
              price: matiere.prix || 0,
              totalPaid: totalPaidForSubject,
              remaining: remaining,
              status: status,
              paymentsCount: paymentsCount
            };
          }
        });
      } else {
        // إذا لم يكن للطالب modules، أضف جميع المواد المتاحة
        allMatieres.forEach((matiere: any) => {
          // حساب إجمالي المدفوعات لهذه المادة (جميع الأشهر)
          const studentAllPayments = allPayments.filter((p: any) => p.studentId === student.id);
          let totalPaidForSubject = 0;
          let paymentsCount = 0;
          
          studentAllPayments.forEach((payment: any) => {
            try {
              const paymentMatieres = payment.matieres ? 
                (typeof payment.matieres === 'string' ? JSON.parse(payment.matieres) : payment.matieres) : [];
              
              const hasThisSubject = paymentMatieres.some((mat: any) => mat.idMat === matiere.id);
              if (hasThisSubject) {
                totalPaidForSubject += payment.Montante || 0;
                paymentsCount += 1;
              }
            } catch (e) {
              // تجاهل الأخطاء
            }
          });
          
          const remaining = Math.max(0, (matiere.prix || 0) - totalPaidForSubject);
          let status = 'non_paye';
          if (remaining === 0 && totalPaidForSubject > 0) {
            status = 'paye';
          } else if (totalPaidForSubject > 0) {
            status = 'partiel';
          }
          
          subjects[matiere.id] = {
            subjectId: matiere.id,
            subjectName: matiere.name,
            price: matiere.prix || 0,
            totalPaid: totalPaidForSubject,
            remaining: remaining,
            status: status,
            paymentsCount: paymentsCount
          };
        });
      }
      
      studentGroups[student.id] = {
        studentId: student.id,
        studentName: student.Name || 'غير محدد',
        groupName: groupName,
        subjects: subjects,
        totalExpected: 0,
        totalPaid: 0,
        totalRemaining: 0
      };
    });
    
    // تصفية المدفوعات حسب الشهر والطلاب المصفيين
    const filteredPayments = allPayments.filter((payment: any) => {
      // فقط المدفوعات للطلاب المصفيين
      if (!studentGroups[payment.studentId]) return false;
      
      // تصفية حسب الشهر
      if (month && month !== 'tous') {
        try {
          const mois = payment.Mois ? 
            (typeof payment.Mois === 'string' ? JSON.parse(payment.Mois) : payment.Mois) : [];
          return Array.isArray(mois) ? mois.includes(month) : false;
        } catch (e) {
          return false;
        }
      }
      
      return true;
    });
    
    // تنسيق البيانات للتقرير
    const reportData = filteredPayments.map((payment: any) => {
      let matieres = [];
      let mois = [];
      
      try {
        matieres = payment.matieres ? 
          (typeof payment.matieres === 'string' ? JSON.parse(payment.matieres) : payment.matieres) : [];
      } catch (e) {
        console.log('Error parsing matieres in report:', payment.matieres);
        matieres = [];
      }
      
      try {
        mois = payment.Mois ? 
          (typeof payment.Mois === 'string' ? JSON.parse(payment.Mois) : payment.Mois) : [];
      } catch (e) {
        console.log('Error parsing Mois in report:', payment.Mois);
        mois = [];
      }
      
      const student = findStudentById(payment.studentId);
      
      return {
        id: payment.id,
        studentName: student?.Name || 'غير محدد',
        studentId: payment.studentId,
        matieres: matieres.map((mat: any) => {
          const matiere = findMatiereById(mat.idMat);
          return {
            id: mat.idMat,
            name: matiere?.name || 'غير محدد',
            prix: matiere?.prix || 0
          };
        }),
        mois: mois,
        montant: payment.Montante || 0,
        status: payment.status || 'en_attente',
        date: payment.Date,
        createdAt: payment.createdAt
      };
    });
    
    // إحصائيات التقرير
    const totalAmount = reportData.reduce((sum: number, p: any) => sum + p.montant, 0);
    const totalPayments = reportData.length;
    const completedPayments = reportData.filter((p: any) => p.status === 'Paimente Complet').length;
    const partialPayments = reportData.filter((p: any) => p.status && p.status.includes('Partiel')).length;
    
    // ملاحظة: المواد وحالاتها تم حسابها بالفعل أعلاه لجميع الأشهر
    // reportData يحتوي فقط على المدفوعات المصفية حسب الشهر المختار
    // لكن حالات المواد في studentGroups تعكس جميع الأشهر
    
    // تحويل إلى array وحساب الإجماليات
    const students = Object.values(studentGroups).map((student: any) => {
      const subjects = Object.values(student.subjects);
      student.subjects = subjects;
      student.totalExpected = subjects.reduce((sum: number, sub: any) => sum + sub.price, 0);
      student.totalPaid = subjects.reduce((sum: number, sub: any) => sum + sub.totalPaid, 0);
      student.totalRemaining = student.totalExpected - student.totalPaid;
      
      // تحديد الحالة العامة
      if (student.totalExpected === 0) {
        // إذا لم يكن للطالب مواد، اعتبره غير مدفوع
        student.overallStatus = 'non_paye';
      } else if (student.totalRemaining === 0 && student.totalExpected > 0) {
        student.overallStatus = 'paye';
      } else if (student.totalPaid > 0) {
        student.overallStatus = 'partiel';
      } else {
        student.overallStatus = 'non_paye';
      }
      
      return student;
    });

    res.status(200).json({
      success: true,
      data: {
        students: students,
        stats: {
          total: students.length,
          paye: students.filter(s => s.overallStatus === 'paye').length,
          partiel: students.filter(s => s.overallStatus === 'partiel').length,
          nonPaye: students.filter(s => s.overallStatus === 'non_paye').length,
          totalExpected: students.reduce((sum, s) => sum + s.totalExpected, 0),
          totalCollected: students.reduce((sum, s) => sum + s.totalPaid, 0),
          collectionRate: students.length > 0 ? 
            (students.reduce((sum, s) => sum + s.totalPaid, 0) / 
             students.reduce((sum, s) => sum + s.totalExpected, 0) * 100).toFixed(1) : '0'
        },
        filters: {
          month: month || 'tous',
          groupId: groupId || 'tous'
        }
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ 
      StatusCode: 500, 
      message: "خطأ في جلب التقرير" 
    });
  }
});

export default route;
