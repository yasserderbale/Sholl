import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import { StatistiqDachborde } from "../services/DachbordeSqlite";
const app = express.Router();

// Route الأصلي
app.get("/Dachbord", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await StatistiqDachborde({ identifaite });
  res.status(response.StatusCode).json(response);
});

// Route جديد للـ Frontend
app.get("/dashboard/stats", validatejwt, async (req, res) => {
  const identifaite = (req as any).payload;
  const response = await StatistiqDachborde({ identifaite });
  
  // تحويل البيانات لتتطابق مع ما يتوقعه Frontend
  if (response.StatusCode === 200 && typeof response.data === 'object') {
    const data = response.data as any;
    const { GetEleves, GetPaimentes, GetEleveSpecialites } = data;
    
    // حساب المدفوعات حسب الشهر
    const { listPayments } = require("../models/sqlite/PaimentesModel");
    const allPayments = listPayments();
    
    const monthlyData: { [key: string]: number } = {};
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    // تهيئة الأشهر بقيم 0
    months.forEach(month => {
      monthlyData[month] = 0;
    });
    
    // حساب المدفوعات لكل شهر
    allPayments.forEach((payment: any) => {
      try {
        const mois = payment.Mois ? 
          (typeof payment.Mois === 'string' ? JSON.parse(payment.Mois) : payment.Mois) : [];
        
        if (Array.isArray(mois)) {
          mois.forEach((month: string) => {
            if (monthlyData[month] !== undefined) {
              monthlyData[month] += payment.Montante || 0;
            }
          });
        }
      } catch (e) {
        // تجاهل الأخطاء
      }
    });
    
    const monthlyRevenue = months.map(month => ({
      month: month,
      amount: monthlyData[month]
    }));

    // حساب الطلاب الجدد هذا الشهر
    const { listStudents } = require("../models/sqlite/StudentModel");
    const allStudents = listStudents();
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();
    
    const newStudentsThisMonth = allStudents.filter((student: any) => {
      if (!student.createdAt) return false;
      
      const studentDate = new Date(student.createdAt);
      return studentDate.getMonth() === currentMonth && 
             studentDate.getFullYear() === currentYear;
    }).length;

    const formattedData = {
      totalStudents: GetEleves[0]?.["Nobre des eleves"] || 0,
      newStudentsThisMonth: newStudentsThisMonth,
      paymentsThisMonth: allPayments.length, // عدد المدفوعات وليس المبلغ
      totalAmount: GetPaimentes[0]?.total || 0,
      specialties: GetEleveSpecialites || [],
      monthlyRevenue: monthlyRevenue
    };
    
    res.status(200).json(formattedData);
  } else {
    res.status(response.StatusCode).json(response);
  }
});

export default app;
