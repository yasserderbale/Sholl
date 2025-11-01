import { initDatabase } from "../db/sqlite";

export interface PaiementFr {
  id?: number;
  etudiantId: string;
  matiereId: string;
  mois: string;
  annee: string;
  montant: number;
  montantTotal?: number; // Prix total de la matière
  montantPaye?: number;  // Montant déjà payé
  montantRestant?: number; // Montant restant à payer
  methodePaiement: 'especes' | 'virement' | 'cheque';
  datePaiement: string;
  dateCreation?: string;
  statut: 'en_attente' | 'paye' | 'partiel' | 'en_retard';
  numeroFacture?: string;
}

export interface PaiementFilters {
  mois?: string;
  annee?: string;
  matiereId?: string;
  statut?: string;
}

// Créer un nouveau paiement avec gestion du paiement partiel
export const createPaiement = async (paiementData: Omit<PaiementFr, 'id' | 'dateCreation' | 'numeroFacture'>): Promise<PaiementFr> => {
  const db = initDatabase();
  
  // Récupérer le prix de la matière
  const matiereQuery = `SELECT prix FROM matieres WHERE id = ?`;
  const matiere = db.prepare(matiereQuery).get(paiementData.matiereId) as { prix: number } | undefined;
  
  console.log(`Recherche matière ID: ${paiementData.matiereId}`);
  console.log('Matière trouvée:', matiere);
  
  if (!matiere) {
    console.error(`Matière non trouvée pour ID: ${paiementData.matiereId}`);
    // Essayer avec un prix par défaut si la matière n'est pas trouvée
    console.log('Utilisation du prix par défaut: 2000');
    // throw new Error('Matière non trouvée');
  }
  
  const prixTotal = matiere?.prix || 2000; // Prix par défaut si matière non trouvée
  
  // Pour les paiements partiels, on crée TOUJOURS une nouvelle entrée
  // Cela permet de garder l'historique de chaque tranche payée
  
  console.log('Création d\'une nouvelle tranche de paiement:', {
    etudiant: paiementData.etudiantId,
    matiere: paiementData.matiereId,
    mois: paiementData.mois,
    montant: paiementData.montant,
    prixTotal
  });
  
  // Calculer le montant total déjà payé pour cette matière/mois
  const paiementsExistants = db.prepare(`
    SELECT SUM(COALESCE(montantPaye, montant, 0)) as totalPaye 
    FROM paiements_fr 
    WHERE etudiantId = ? AND matiereId = ? AND mois = ? AND annee = ?
  `).get(paiementData.etudiantId, paiementData.matiereId, paiementData.mois, paiementData.annee) as any;
  
  const montantDejaPayé = paiementsExistants?.totalPaye || 0;
  const nouveauMontantTotal = montantDejaPayé + paiementData.montant;
  const montantRestant = Math.max(0, prixTotal - nouveauMontantTotal);
  const statut = nouveauMontantTotal >= prixTotal ? 'paye' : 'partiel';
  
  console.log('Calculs de paiement:', {
    montantDejaPayé,
    nouveauMontant: paiementData.montant,
    nouveauMontantTotal,
    montantRestant,
    statut
  });
  
  // Créer toujours une nouvelle tranche de paiement
  const numeroFacture = `FAC-${Date.now()}`;
  const dateCreation = new Date().toISOString();
  
  // Vérifier si les nouvelles colonnes existent
  const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
  const columnNames = tableInfo.map((col: any) => col.name);
  const hasNewColumns = columnNames.includes('montantPaye') && columnNames.includes('montantTotal');
  
  let query;
  let result;
  
  if (hasNewColumns) {
    // Utiliser la nouvelle structure
    query = `
      INSERT INTO paiements_fr (
        etudiantId, matiereId, mois, annee, montant, montantTotal,
        montantPaye, montantRestant, methodePaiement, datePaiement, 
        dateCreation, statut, numeroFacture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    result = db.prepare(query).run(
      paiementData.etudiantId,
      paiementData.matiereId,
      paiementData.mois,
      paiementData.annee,
      paiementData.montant,
      prixTotal,
      paiementData.montant,
      montantRestant,
      paiementData.methodePaiement,
      paiementData.datePaiement,
    // Vérifier si les nouvelles colonnes existent
    const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
    const columnNames = tableInfo.map((col: any) => col.name);
    const hasNewColumns = columnNames.includes('montantPaye') && columnNames.includes('montantTotal');
    
    let query;
    let result;
    
    if (hasNewColumns) {
      // Utiliser la nouvelle structure
      query = `
        INSERT INTO paiements_fr (
          etudiantId, matiereId, mois, annee, montant, montantTotal,
          montantPaye, montantRestant, methodePaiement, datePaiement, 
          dateCreation, statut, numeroFacture
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      result = db.prepare(query).run(
        paiementData.etudiantId,
        paiementData.matiereId,
        paiementData.mois,
        paiementData.annee,
        paiementData.montant,
        prixTotal,
        montantPaye,
        montantRestant,
        paiementData.methodePaiement,
        paiementData.datePaiement,
        dateCreation,
        statut,
        numeroFacture
      );
    } else {
      // Utiliser l'ancienne structure
      query = `
        INSERT INTO paiements_fr (
          etudiantId, matiereId, mois, annee, montant,
          methodePaiement, datePaiement, dateCreation, 
          statut, numeroFacture
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      result = db.prepare(query).run(
        paiementData.etudiantId,
        paiementData.matiereId,
        paiementData.mois,
        paiementData.annee,
        paiementData.montant,
        paiementData.methodePaiement,
        paiementData.datePaiement,
        dateCreation,
        statut,
        numeroFacture
      );
    }
    
    return {
      id: result.lastInsertRowid as number,
      ...paiementData,
      montantTotal: prixTotal,
      montantPaye,
      montantRestant,
      dateCreation,
      statut: statut as any,
      numeroFacture
    };
  }
};

// Récupérer tous les paiements d'un étudiant avec calcul du statut
export const getPaiementsByStudent = async (etudiantId: string): Promise<PaiementFr[]> => {
  const db = initDatabase();
  
  // Vérifier d'abord si les nouvelles colonnes existent
  const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
  const columnNames = tableInfo.map((col: any) => col.name);
  const hasNewColumns = columnNames.includes('montantPaye') && columnNames.includes('montantTotal');
  
  let query;
  if (hasNewColumns) {
    query = `
      SELECT p.*, m.name as matiereName, m.prix as matierePrice,
             CASE 
               WHEN p.montantPaye >= m.prix THEN 'paye'
               WHEN p.montantPaye > 0 THEN 'partiel'
               ELSE 'en_attente'
             END as statutCalcule
      FROM paiements_fr p
      LEFT JOIN matieres m ON p.matiereId = m.id
      WHERE p.etudiantId = ?
      ORDER BY p.dateCreation DESC
    `;
  } else {
    // Fallback pour l'ancienne structure
    query = `
      SELECT p.*, m.name as matiereName, m.prix as matierePrice,
             p.statut as statutCalcule
      FROM paiements_fr p
      LEFT JOIN matieres m ON p.matiereId = m.id
      WHERE p.etudiantId = ?
      ORDER BY p.dateCreation DESC
    `;
  }
  
  const paiements = db.prepare(query).all(etudiantId) as any[];
  
  return paiements.map(p => ({
    id: p.id,
    etudiantId: p.etudiantId,
    matiereId: p.matiereId,
    mois: p.mois,
    annee: p.annee,
    montant: p.montant,
    methodePaiement: p.methodePaiement,
    datePaiement: p.datePaiement,
    dateCreation: p.dateCreation,
    statut: p.statut,
    numeroFacture: p.numeroFacture,
    // Informations supplémentaires de la matière
    matiereName: p.matiereName,
    matierePrice: p.matierePrice
  }));
};

// Mettre à jour un paiement
export const updatePaiement = async (paiementId: string, updateData: Partial<PaiementFr>): Promise<PaiementFr | null> => {
  const db = initDatabase();
  
  // Construire la requête de mise à jour dynamiquement
  const fields = Object.keys(updateData).filter(key => key !== 'id');
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => updateData[field as keyof PaiementFr]);
  
  if (fields.length === 0) {
    throw new Error("Aucune donnée à mettre à jour");
  }
  
  const query = `UPDATE paiements_fr SET ${setClause} WHERE id = ?`;
  const result = db.prepare(query).run(...values, paiementId);
  
  if (result.changes === 0) {
    return null;
  }
  
  // Récupérer le paiement mis à jour
  const selectQuery = `SELECT * FROM paiements_fr WHERE id = ?`;
  const updatedPaiement = db.prepare(selectQuery).get(paiementId) as PaiementFr;
  
  return updatedPaiement;
};

// Supprimer un paiement
export const deletePaiement = async (paiementId: string): Promise<boolean> => {
  const db = initDatabase();
  
  const query = `DELETE FROM paiements_fr WHERE id = ?`;
  const result = db.prepare(query).run(paiementId);
  
  return result.changes > 0;
};

// Récupérer tous les paiements avec filtres
export const getAllPaiements = async (filters: PaiementFilters = {}): Promise<PaiementFr[]> => {
  const db = initDatabase();
  
  let query = `
    SELECT p.*, m.name as matiereName, s.Name as etudiantName
    FROM paiements_fr p
    LEFT JOIN matieres m ON p.matiereId = m.id
    LEFT JOIN students s ON p.etudiantId = s.id
    WHERE 1=1
  `;
  
  const params: any[] = [];
  
  if (filters.mois) {
    query += ` AND p.mois = ?`;
    params.push(filters.mois);
  }
  
  if (filters.annee) {
    query += ` AND p.annee = ?`;
    params.push(filters.annee);
  }
  
  if (filters.matiereId) {
    query += ` AND p.matiereId = ?`;
    params.push(filters.matiereId);
  }
  
  if (filters.statut) {
    query += ` AND p.statut = ?`;
    params.push(filters.statut);
  }
  
  query += ` ORDER BY p.dateCreation DESC`;
  
  const paiements = db.prepare(query).all(...params) as any[];
  
  return paiements.map(p => ({
    id: p.id,
    etudiantId: p.etudiantId,
    matiereId: p.matiereId,
    mois: p.mois,
    annee: p.annee,
    montant: p.montant,
    methodePaiement: p.methodePaiement,
    datePaiement: p.datePaiement,
    dateCreation: p.dateCreation,
    statut: p.statut,
    numeroFacture: p.numeroFacture,
    // Informations supplémentaires
    matiereName: p.matiereName,
    etudiantName: p.etudiantName
  }));
};

// Créer la table des paiements français si elle n'existe pas
export const createPaiementsFrTable = (): void => {
  const db = initDatabase();
  
  // Créer la table de base
  const createQuery = `
    CREATE TABLE IF NOT EXISTS paiements_fr (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      etudiantId TEXT NOT NULL,
      matiereId TEXT NOT NULL,
      mois TEXT NOT NULL,
      annee TEXT NOT NULL,
      montant REAL NOT NULL,
      methodePaiement TEXT CHECK(methodePaiement IN ('especes', 'virement', 'cheque')) DEFAULT 'especes',
      datePaiement TEXT NOT NULL,
      dateCreation TEXT DEFAULT CURRENT_TIMESTAMP,
      statut TEXT CHECK(statut IN ('en_attente', 'paye', 'partiel', 'en_retard')) DEFAULT 'en_attente',
      numeroFacture TEXT UNIQUE
    )
  `;
  
  db.prepare(createQuery).run();
  console.log("Table paiements_fr créée avec succès");
  
  // Ajouter les nouvelles colonnes si elles n'existent pas
  try {
    // Vérifier si les colonnes existent déjà
    const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
    const columnNames = tableInfo.map(col => col.name);
    
    if (!columnNames.includes('montantTotal')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantTotal REAL DEFAULT 0`).run();
      console.log("Colonne montantTotal ajoutée");
    }
    
    if (!columnNames.includes('montantPaye')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantPaye REAL DEFAULT 0`).run();
      console.log("Colonne montantPaye ajoutée");
    }
    
    if (!columnNames.includes('montantRestant')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantRestant REAL DEFAULT 0`).run();
      console.log("Colonne montantRestant ajoutée");
    }
    
  } catch (error) {
    console.log("Erreur lors de l'ajout des colonnes:", error);
  }
  
  // Ajouter des données de test si la table est vide
  const countQuery = `SELECT COUNT(*) as count FROM paiements_fr`;
  const result = db.prepare(countQuery).get() as { count: number };
  
  if (result.count === 0) {
    console.log("Ajout de données de test pour paiements_fr...");
    insertTestData();
  }
};

// Insérer des données de test
const insertTestData = (): void => {
  const db = initDatabase();
  
  // Récupérer quelques étudiants et matières existants
  const students = db.prepare(`SELECT id FROM students LIMIT 3`).all() as { id: string }[];
  const matieres = db.prepare(`SELECT id FROM matieres LIMIT 5`).all() as { id: string }[];
  
  if (students.length === 0 || matieres.length === 0) {
    console.log("Pas d'étudiants ou de matières trouvés pour les données de test");
    return;
  }
  
  const testPayments = [
    {
      etudiantId: students[0]?.id,
      matiereId: matieres[0]?.id,
      mois: 'janvier',
      annee: '2025',
      montant: 2000,
      methodePaiement: 'especes',
      datePaiement: '2025-01-15T10:00:00.000Z',
      statut: 'paye',
      numeroFacture: 'FAC-001-2025'
    },
    {
      etudiantId: students[0]?.id,
      matiereId: matieres[1]?.id,
      mois: 'janvier',
      annee: '2025',
      montant: 2500,
      methodePaiement: 'virement',
      datePaiement: '2025-01-10T14:30:00.000Z',
      statut: 'paye',
      numeroFacture: 'FAC-002-2025'
    },
    {
      etudiantId: students[1]?.id,
      matiereId: matieres[0]?.id,
      mois: 'janvier',
      annee: '2025',
      montant: 2000,
      methodePaiement: 'especes',
      datePaiement: '2025-01-20T09:15:00.000Z',
      statut: 'paye',
      numeroFacture: 'FAC-003-2025'
    }
  ];
  
  const insertQuery = `
    INSERT INTO paiements_fr (
      etudiantId, matiereId, mois, annee, montant,
      methodePaiement, datePaiement, statut, numeroFacture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const stmt = db.prepare(insertQuery);
  
  testPayments.forEach(payment => {
    try {
      stmt.run(
        payment.etudiantId,
        payment.matiereId,
        payment.mois,
        payment.annee,
        payment.montant,
        payment.methodePaiement,
        payment.datePaiement,
        payment.statut,
        payment.numeroFacture
      );
    } catch (error) {
      console.log('Erreur lors de l\'insertion des données de test:', error);
    }
  });
  
  console.log(`${testPayments.length} paiements de test ajoutés`);
};

// Fonction pour recréer la table avec la nouvelle structure
export const recreatePaiementsFrTable = (): void => {
  const db = initDatabase();
  
  console.log("Recréation de la table paiements_fr avec la nouvelle structure...");
  
  try {
    // Sauvegarder les données existantes
    const existingData = db.prepare(`SELECT * FROM paiements_fr`).all();
    console.log(`Sauvegarde de ${existingData.length} enregistrements existants`);
    
    // Supprimer l'ancienne table
    db.prepare(`DROP TABLE IF EXISTS paiements_fr`).run();
    
    // Créer la nouvelle table avec toutes les colonnes
    const createQuery = `
      CREATE TABLE paiements_fr (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        etudiantId TEXT NOT NULL,
        matiereId TEXT NOT NULL,
        mois TEXT NOT NULL,
        annee TEXT NOT NULL,
        montant REAL NOT NULL,
        montantTotal REAL DEFAULT 0,
        montantPaye REAL DEFAULT 0,
        montantRestant REAL DEFAULT 0,
        methodePaiement TEXT CHECK(methodePaiement IN ('especes', 'virement', 'cheque')) DEFAULT 'especes',
        datePaiement TEXT NOT NULL,
        dateCreation TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT CHECK(statut IN ('en_attente', 'paye', 'partiel', 'en_retard')) DEFAULT 'en_attente',
        numeroFacture TEXT UNIQUE
      )
    `;
    
    db.prepare(createQuery).run();
    console.log("Nouvelle table paiements_fr créée avec succès");
    
    // Restaurer les données existantes avec les nouvelles colonnes
    if (existingData.length > 0) {
      const insertQuery = `
        INSERT INTO paiements_fr (
          etudiantId, matiereId, mois, annee, montant, montantTotal,
          montantPaye, montantRestant, methodePaiement, datePaiement,
          dateCreation, statut, numeroFacture
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const stmt = db.prepare(insertQuery);
      
      existingData.forEach((row: any) => {
        // Calculer les nouvelles valeurs
        const montantPaye = row.montant || 0;
        const montantTotal = row.montant || 0; // Utiliser le montant comme total par défaut
        const montantRestant = 0; // Considérer comme payé par défaut
        
        stmt.run(
          row.etudiantId,
          row.matiereId,
          row.mois,
          row.annee,
          row.montant,
          montantTotal,
          montantPaye,
          montantRestant,
          row.methodePaiement || 'especes',
          row.datePaiement,
          row.dateCreation || new Date().toISOString(),
          row.statut || 'paye',
          row.numeroFacture
        );
      });
      
      console.log(`${existingData.length} enregistrements restaurés`);
    }
    
  } catch (error) {
    console.error("Erreur lors de la recréation de la table:", error);
  }
};
