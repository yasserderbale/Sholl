import { Router } from 'express';
import { initDatabase } from '../db/sqlite';
import { validatejwt } from '../medallware/ValidateJWT';

const route = Router();

// Endpoint للحصول على إحصائيات Dashboard
route.get('/dashboard/stats', validatejwt, async (req, res) => {
  try {
    const db = initDatabase();
    
    // 1. عدد الطلاب الكلي
    const totalStudents = db.prepare(`SELECT COUNT(*) as count FROM students`).get() as { count: number };
    
    // 2. الطلاب الجدد هذا الشهر
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const newStudentsThisMonth = db.prepare(`
      SELECT COUNT(*) as count FROM students 
      WHERE strftime('%m', Date) = ? AND strftime('%Y', Date) = ?
    `).get(currentMonth.toString().padStart(2, '0'), currentYear.toString()) as { count: number };
    
    // 3. المدفوعات من paiements_fr فقط
    let paymentsCount = 0;
    let totalAmount = 0;
    
    try {
      const paymentsFr = db.prepare(`
        SELECT COUNT(*) as count, SUM(CAST(montant AS REAL)) as total 
        FROM paiements_fr
      `).get() as { count: number; total: number | null };
      
      paymentsCount = paymentsFr?.count || 0;
      totalAmount = paymentsFr?.total || 0;
    } catch (e) {
      console.log('Table paiements_fr not found or empty');
    }
    
    const paymentsThisMonth = { count: paymentsCount };
    const totalAmountThisMonth = { total: totalAmount };
    
    // 5. إحصائيات شهرية للرسم البياني (كل 12 شهر)
    const monthlyRevenue = [];
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthNamesAlt = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 
                           'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    const monthNamesAr = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
                          'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthNameFr = monthNames[month - 1];
      const monthNameAr = monthNamesAr[month - 1];
      const monthPadded = month.toString().padStart(2, '0');
      
      let monthRevenue = 0;
      
      // محاولة من paiements_fr (بحث بكل الصيغ الممكنة)
      try {
        // البحث بكل الصيغ: فرنسي (بالنقطتين وبدون)، عربي، رقم
        const monthNameFrAlt = monthNamesAlt[month - 1];
        const revenueFr = db.prepare(`
          SELECT SUM(CAST(montant AS REAL)) as total FROM paiements_fr 
          WHERE LOWER(mois) LIKE LOWER(?) 
             OR LOWER(mois) LIKE LOWER(?)
             OR LOWER(mois) LIKE LOWER(?)
             OR mois LIKE ?
             OR mois LIKE ?
             OR mois = ?
             OR mois = ?
        `).get(
          `%${monthNameFr}%`,
          `%${monthNameFrAlt}%`,
          `%${monthNameAr}%`,
          `%${month}%`,
          `%${monthPadded}%`,
          month.toString(),
          monthPadded
        ) as { total: number | null };
        monthRevenue += revenueFr?.total || 0;
      } catch (e) {
        // جدول غير موجود
      }
      
      monthlyRevenue.push({
        month: monthNameFr.substring(0, 3),
        amount: monthRevenue
      });
    }
    
    // 6. عدد المواد
    const totalSubjects = db.prepare(`SELECT COUNT(*) as count FROM matieres`).get() as { count: number };
    
    // 7. عدد المجموعات
    const totalGroups = db.prepare(`SELECT COUNT(*) as count FROM groupes`).get() as { count: number };
    
    res.json({
      success: true,
      data: {
        totalStudents: totalStudents?.count || 0,
        newStudentsThisMonth: newStudentsThisMonth?.count || 0,
        paymentsThisMonth: paymentsThisMonth?.count || 0,
        totalAmountThisMonth: totalAmountThisMonth?.total || 0,
        monthlyRevenue: monthlyRevenue,
        totalSubjects: totalSubjects?.count || 0,
        totalGroups: totalGroups?.count || 0
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error?.message
    });
  }
});

export default route;
