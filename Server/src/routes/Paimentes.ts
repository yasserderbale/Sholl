import express from "express";
import { validatejwt } from "../medallware/ValidateJWT";
import {
  CompletePaymente,
  getOnePaimente,
  getPaimentes,
  RegistnewPaimente,
  SearchePaiementStud,
} from "../services/PaimentesSqlite";
import {
  createPaiement,
  getPaiementsByStudent,
  createPaiementsFrTable,
  recreatePaiementsFrTable
} from '../services/PaiementsFrServiceFixed';
const route = express.Router();
route.post("/Paimentes", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { idMat, idStud, Mois, Montante, Date } = req.body;
  const response = await RegistnewPaimente({
    identifiante,
    idMat,
    idStud,
    Mois,
    Montante,
    Date,
  });
  res.status(response.StatusCode).json(response);
});
route.get("/Paimentes", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const response = await getPaimentes({ identifiante });
  res.status(response.StatusCode).json(response);
});
route.put(
  "/Paimentes/:idStud/complete/:idPaiment",
  validatejwt,
  async (req, res) => {
    const identifiante = (req as any).payload;
    const { idStud, idPaiment } = req.params;
    const { addPrice } = req.body;
    const addPricee = Number(addPrice);
    console.log(typeof addPricee);
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
route.get("/Paimentes/:idStud/:idPaiment", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const { idStud, idPaiment } = req.params;
  const response = await getOnePaimente({ idStud, identifiante, idPaiment });
  res.status(response.StatusCode).json(response);
});
route.get("/PaimentesSearch", validatejwt, async (req, res) => {
  const identifiante = (req as any).payload;
  const search = req.query.nam;
  const response = await SearchePaiementStud({ identifiante, search });
  res.status(response.StatusCode).json(response);
});

// ===== NOUVEAUX ENDPOINTS EN FRANÇAIS =====

// GET /paiements/etudiant/:etudiantId - Récupérer tous les paiements d'un étudiant
route.get("/paiements/etudiant/:etudiantId", validatejwt, async (req, res) => {
  try {
    const { etudiantId } = req.params;
    
    console.log(`Recherche des paiements pour l'étudiant: ${etudiantId}`);
    
    if (!etudiantId) {
      return res.status(400).json({
        success: false,
        message: "ID de l'étudiant requis"
      });
    }

    const paiements = await getPaiementsByStudent(etudiantId);
    
    console.log(`Paiements trouvés: ${paiements.length}`);
    
    res.json({
      success: true,
      data: paiements,
      message: "Paiements récupérés avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des paiements"
    });
  }
});

// POST /paiements - Créer un nouveau paiement
route.post("/paiements", validatejwt, async (req, res) => {
  try {
    const {
      etudiantId,
      matiereId,
      mois,
      annee,
      montant,
      methodePaiement,
      datePaiement
    } = req.body;

    // Validation des données
    console.log('Données reçues:', { etudiantId, matiereId, mois, annee, montant, methodePaiement });
    
    if (!etudiantId || !matiereId || !mois || !annee || !montant) {
      return res.status(400).json({
        success: false,
        message: "Données manquantes: etudiantId, matiereId, mois, annee et montant sont requis"
      });
    }
    
    if (montant <= 0) {
      return res.status(400).json({
        success: false,
        message: "Le montant doit être supérieur à zéro"
      });
    }

    // Convertir les méthodes de paiement du frontend vers la base de données
    const convertMethodePaiement = (method: string) => {
      switch (method) {
        case 'cash': return 'especes';
        case 'bank': return 'virement';
        case 'check': return 'cheque';
        default: return 'especes';
      }
    };

    const nouveauPaiement = await createPaiement({
      etudiantId,
      matiereId,
      mois,
      annee,
      montant,
      methodePaiement: convertMethodePaiement(methodePaiement || 'cash'),
      datePaiement: datePaiement || new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      data: nouveauPaiement,
      message: "Paiement enregistré avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du paiement"
    });
  }
});

// Endpoint pour supprimer tous les paiements
route.delete("/paiements/delete-all", validatejwt, async (req, res) => {
  try {
    const db = require('../db/sqlite').initDatabase();
    
    // Compter les paiements avant suppression
    const countBefore = db.prepare(`SELECT COUNT(*) as count FROM paiements_fr`).get();
    console.log(`Paiements avant suppression: ${countBefore.count}`);
    
    // Supprimer tous les paiements
    const result = db.prepare(`DELETE FROM paiements_fr`).run();
    
    console.log(`${result.changes} paiements supprimés`);
    
    res.json({
      success: true,
      message: `Tous les paiements ont été supprimés (${result.changes} enregistrements)`,
      deletedCount: result.changes
    });

  } catch (error: any) {
    console.error("Erreur lors de la suppression des paiements:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression des paiements",
      error: error?.message
    });
  }
});

// Endpoint pour recréer la table paiements_fr
route.post("/paiements/recreate-table", validatejwt, async (req, res) => {
  try {
    recreatePaiementsFrTable();
    
    res.json({
      success: true,
      message: "Table paiements_fr recréée avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la recréation de la table:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recréation de la table"
    });
  }
});

// GET /paiements/report - Endpoint spécial pour le rapport des paiements
route.get("/paiements/report", validatejwt, async (req, res) => {
  try {
    const { groupId, month, year } = req.query as { groupId?: string; month?: string; year?: string };
    const db = require('../db/sqlite').initDatabase();
    
    console.log('Paramètres du rapport:', { groupId, month, year });
    
    // Mapper les mois français vers arabe si nécessaire
    const monthMapping: { [key: string]: string } = {
      'Janvier': 'يناير',
      'Février': 'فبراير',
      'Mars': 'مارس',
      'Avril': 'أبريل',
      'Mai': 'مايو',
      'Juin': 'يونيو',
      'Juillet': 'يوليو',
      'Août': 'أغسطس',
      'Septembre': 'سبتمبر',
      'Octobre': 'أكتوبر',
      'Novembre': 'نوفمبر',
      'Décembre': 'ديسمبر'
    };
    
    // Préparer toutes les variantes du mois pour recherche flexible
    const monthVariants: string[] = [];
    if (month) {
      const arabicMonth = monthMapping[month as string];
      if (arabicMonth) {
        monthVariants.push(arabicMonth); // العربي
        monthVariants.push(month as string); // الفرنسي
      } else {
        monthVariants.push(month as string); // أي صيغة أخرى
      }
      
      // إضافة الصيغة الرقمية
      const monthIndex = Object.keys(monthMapping).indexOf(month as string) + 1;
      if (monthIndex > 0) {
        monthVariants.push(String(monthIndex)); // "1"
        monthVariants.push(String(monthIndex).padStart(2, '0')); // "01"
      }
    }
    
    console.log('صيغ الشهر للبحث:', monthVariants);
    
    // Préparer l'année: ignorer si undefined/null/"undefined"/"null"
    const rawYear = typeof year === 'string' ? year : undefined;
    const yearParam = rawYear && rawYear.toLowerCase() !== 'undefined' && rawYear.toLowerCase() !== 'null' && rawYear.trim() !== ''
      ? rawYear
      : null;
    
    // Récupérer tous les étudiants ou ceux d'un groupe spécifique (avec leurs modules)
    let studentsQuery = `SELECT id, Name, modules FROM students`;
    let studentsParams: any[] = [];
    
    if (groupId && groupId !== 'tous') {
      // Récupérer les IDs des étudiants du groupe
      const group = db.prepare(`SELECT Studentid FROM groupes WHERE id = ?`).get(groupId);
      if (group && group.Studentid) {
        const studentIds = JSON.parse(group.Studentid);
        const placeholders = studentIds.map(() => '?').join(',');
        studentsQuery = `SELECT id, Name, modules FROM students WHERE id IN (${placeholders})`;
        studentsParams = studentIds;
      }
    }
    
    const students = db.prepare(studentsQuery).all(...studentsParams);
    console.log(`Étudiants trouvés: ${students.length}`);
    
    // Récupérer toutes les matières
    const matieres = db.prepare(`SELECT id, name, prix FROM matieres`).all();
    console.log(`Matières trouvées: ${matieres.length}`);
    
    // Récupérer tous les groupes pour afficher le nom du groupe
    const allGroups = db.prepare(`SELECT id, name, Studentid FROM groupes`).all();
    
    // Pour chaque étudiant, calculer son statut de paiement
    const reportData = [];
    
    for (const student of students) {
      // Trouver le groupe de l'étudiant
      let studentGroup = 'Non assigné';
      if (groupId && groupId !== 'tous') {
        const group = allGroups.find((g: any) => g.id === groupId);
        studentGroup = group?.name || group?.Name || 'Non assigné';
      } else {
        // Chercher dans tous les groupes
        for (const grp of allGroups) {
          if (grp.Studentid) {
            let studentIds: string[] = [];
            try {
              studentIds = typeof grp.Studentid === 'string' 
                ? JSON.parse(grp.Studentid) 
                : grp.Studentid;
            } catch (e) {
              console.error('Erreur parsing Studentid:', e);
            }
            
            if (studentIds.includes(student.id)) {
              studentGroup = grp.name || grp.Name || 'Groupe';
              break;
            }
          }
        }
      }
      
      const studentReport: any = {
        studentId: student.id,
        studentName: student.Name,
        groupName: studentGroup,
        subjects: [],
        totalExpected: 0,
        totalPaid: 0,
        totalRemaining: 0,
        overallStatus: 'non_paye'
      };
      
      // Récupérer les modules de l'étudiant
      let studentModules: string[] = [];
      if (student.modules) {
        try {
          studentModules = typeof student.modules === 'string' 
            ? JSON.parse(student.modules) 
            : student.modules;
        } catch (e) {
          console.error('Erreur parsing modules:', e);
          studentModules = [];
        }
      }
      
      // Filtrer les matières: seulement celles que l'étudiant étudie
      const studentMatieres = matieres.filter((matiere: any) => {
        if (studentModules.length === 0) return true; // Si pas de modules, afficher toutes
        return studentModules.some((mod: any) => {
          const modId = typeof mod === 'string' ? mod : (mod.matid?._id || mod.matid || mod._id || mod.id);
          return modId === matiere.id;
        });
      });
      
      console.log(`Étudiant ${student.Name}: ${studentMatieres.length} matières`);
      
      // Pour chaque matière de l'étudiant, vérifier les paiements
      for (const matiere of studentMatieres) {
        let paiementsQuery = `
          SELECT SUM(COALESCE(montantPaye, montant, 0)) as totalPaye,
                 COUNT(*) as nombrePaiements
          FROM paiements_fr 
          WHERE etudiantId = ? AND matiereId = ?
        `;
        let paiementsParams = [student.id, matiere.id];
        
        // Ajouter le filtre du mois (مرن لكل الصيغ) والسنة بشكل اختياري
        if (monthVariants.length > 0) {
          const monthConditions = monthVariants.map(() => 'mois = ?').join(' OR ');
          paiementsQuery += ` AND (${monthConditions})`;
          paiementsParams.push(...monthVariants);
        }
        if (yearParam) {
          paiementsQuery += ` AND annee = ?`;
          paiementsParams.push(yearParam);
        }
        
        const paiementInfo = db.prepare(paiementsQuery).get(...paiementsParams);
        const totalPaid = paiementInfo?.totalPaye || 0;
        const remaining = Math.max(0, matiere.prix - totalPaid);
        
        let status = 'non_paye';
        if (totalPaid >= matiere.prix) {
          status = 'paye';
        } else if (totalPaid > 0) {
          status = 'partiel';
        }
        
        studentReport.subjects.push({
          subjectId: matiere.id,
          subjectName: matiere.name,
          price: matiere.prix,
          totalPaid: totalPaid,
          remaining: remaining,
          status: status,
          paymentsCount: paiementInfo?.nombrePaiements || 0
        });
        
        studentReport.totalExpected += matiere.prix;
        studentReport.totalPaid += totalPaid;
      }
      
      studentReport.totalRemaining = studentReport.totalExpected - studentReport.totalPaid;
      
      // Déterminer le statut général
      if (studentReport.totalPaid >= studentReport.totalExpected) {
        studentReport.overallStatus = 'paye';
      } else if (studentReport.totalPaid > 0) {
        studentReport.overallStatus = 'partiel';
      }
      
      reportData.push(studentReport);
    }
    
    // Calculer les statistiques générales
    const stats: any = {
      total: reportData.length,
      paye: reportData.filter((s: any) => s.overallStatus === 'paye').length,
      partiel: reportData.filter((s: any) => s.overallStatus === 'partiel').length,
      nonPaye: reportData.filter((s: any) => s.overallStatus === 'non_paye').length,
      totalExpected: reportData.reduce((sum: number, s: any) => sum + s.totalExpected, 0),
      totalCollected: reportData.reduce((sum: number, s: any) => sum + s.totalPaid, 0)
    };
    
    stats.collectionRate = stats.totalExpected > 0 ? 
      ((stats.totalCollected / stats.totalExpected) * 100).toFixed(1) : '0';
    
    console.log('Statistiques du rapport:', stats);
    
    res.json({
      success: true,
      data: {
        students: reportData,
        stats: stats,
        filters: {
          groupId: groupId || 'tous',
          month: month || null,
          year: year
        }
      },
      message: "Rapport des paiements généré avec succès"
    });
    
  } catch (error: any) {
    console.error("Erreur lors de la génération du rapport:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la génération du rapport",
      error: error?.message || 'Erreur inconnue'
    });
  }
});

// Endpoint pour debug et vérification
route.get("/paiements/debug", validatejwt, async (req, res) => {
  try {
    const db = require('../db/sqlite').initDatabase();
    
    const students = db.prepare(`SELECT id, Name FROM students LIMIT 5`).all();
    const matieres = db.prepare(`SELECT id, name, prix FROM matieres LIMIT 10`).all();
    
    // Vérifier les paiements existants avec leurs mois
    const paiements = db.prepare(`
      SELECT id, etudiantId, matiereId, mois, annee, montantPaye, statut 
      FROM paiements_fr 
      LIMIT 10
    `).all();
    
    // Compter les paiements par mois
    const paiementsParMois = db.prepare(`
      SELECT mois, COUNT(*) as count 
      FROM paiements_fr 
      GROUP BY mois
    `).all();
    
    // Vérifier la structure de la table paiements_fr
    const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all();
    
    res.json({
      success: true,
      data: {
        students,
        matieres,
        paiements,
        paiementsParMois,
        studentsCount: students.length,
        matieresCount: matieres.length,
        paiementsCount: paiements.length,
        tableStructure: tableInfo
      },
      message: "Données de débogage récupérées"
    });

  } catch (error: any) {
    console.error("Erreur lors du débogage:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors du débogage",
      error: error?.message
    });
  }
});


export default route;
