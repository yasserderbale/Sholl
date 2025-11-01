import { initDatabase } from '../db/sqlite';

export interface PaiementData {
  etudiantId: string;
  matiereId: string;
  mois: string;
  annee: string;
  montant: number;
  methodePaiement: string;
  datePaiement: string;
}

export const createPaiement = async (paiementData: PaiementData) => {
  const db = initDatabase();
  
  console.log('Données reçues:', paiementData);
  
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
  
  // Convertir le mois français en arabe pour le stockage
  const arabicMonth = monthMapping[paiementData.mois] || paiementData.mois;
  const updatedPaiementData = { ...paiementData, mois: arabicMonth };
  
  // Rechercher le prix de la matière
  console.log('Recherche matière ID:', paiementData.matiereId);
  
  // Debug: vérifier la structure de la table matieres
  try {
    const tableInfo = db.prepare(`PRAGMA table_info(matieres)`).all();
    console.log('Structure table matieres:', tableInfo.map((col: any) => col.name));
    
    // Vérifier s'il y a des matières
    const allMatieres = db.prepare(`SELECT id, name, prix FROM matieres LIMIT 3`).all();
    console.log('Exemples de matières:', allMatieres);
  } catch (debugError) {
    console.error('Erreur debug matieres:', debugError);
  }
  
  let matiere = null;
  try {
    matiere = db.prepare(`
      SELECT prix FROM matieres WHERE id = ?
    `).get(paiementData.matiereId) as any;
  } catch (matiereError) {
    console.error('Erreur lors de la recherche de matière:', matiereError);
    console.log('Le table matieres n\'existe peut-être pas ou a une structure différente');
  }
  
  console.log('Matière trouvée:', matiere);
  
  if (!matiere) {
    console.error(`Matière non trouvée pour ID: ${paiementData.matiereId}`);
    console.log('Utilisation du prix par défaut: 2000');
  }
  
  const prixTotal = matiere?.prix || 2000;
  
  // Pour les paiements partiels, on crée TOUJOURS une nouvelle entrée
  // Cela permet de garder l'historique de chaque tranche payée
  
  console.log('Création d\'une nouvelle tranche de paiement:', {
    etudiant: paiementData.etudiantId,
    montant: paiementData.montant,
    prixTotal
  });
  
  // Calculer le montant total déjà payé pour cette matière/mois
  const paiementsExistants = db.prepare(`
    SELECT SUM(COALESCE(montantPaye, montant, 0)) as totalPaye 
    FROM paiements_fr 
    WHERE etudiantId = ? AND matiereId = ? AND mois = ? AND annee = ?
  `).get(updatedPaiementData.etudiantId, updatedPaiementData.matiereId, updatedPaiementData.mois, updatedPaiementData.annee) as any;
  
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
    // Utiliser la nouvelle structure - chaque tranche est une ligne séparée
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
      paiementData.montant,        // montant de cette tranche
      prixTotal,                   // prix total de la matière
      paiementData.montant,        // montant payé dans cette tranche
      montantRestant,              // ce qui reste après toutes les tranches
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
  
  console.log('Paiement créé avec succès, ID:', result.lastInsertRowid);
  
  return {
    id: result.lastInsertRowid,
    etudiantId: paiementData.etudiantId,
    matiereId: paiementData.matiereId,
    mois: paiementData.mois,
    annee: paiementData.annee,
    montant: paiementData.montant,
    montantTotal: prixTotal,
    montantPaye: paiementData.montant,
    montantRestant: montantRestant,
    datePaiement: paiementData.datePaiement,
    dateCreation: dateCreation,
    statut: statut,
    numeroFacture: numeroFacture,
    methodePaiement: paiementData.methodePaiement
  };
};

export const getPaiementsByStudent = async (etudiantId: string) => {
  const db = initDatabase();
  
  console.log('Recherche des paiements pour l\'étudiant:', etudiantId);
  
  // Debug: vérifier les tables
  try {
    const matieresTableInfo = db.prepare(`PRAGMA table_info(matieres)`).all();
    console.log('Colonnes table matieres:', matieresTableInfo.map((col: any) => col.name));
    
    const paiementsTableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all();
    console.log('Colonnes table paiements_fr:', paiementsTableInfo.map((col: any) => col.name));
  } catch (debugError) {
    console.error('Erreur debug tables:', debugError);
  }
  
  // Vérifier si les nouvelles colonnes existent
  const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
  const columnNames = tableInfo.map((col: any) => col.name);
  const hasNewColumns = columnNames.includes('montantPaye') && columnNames.includes('montantTotal');
  
  let query;
  let useJoin = false;
  
  // Vérifier si la table matieres existe
  try {
    db.prepare(`SELECT 1 FROM matieres LIMIT 1`).get();
    useJoin = true;
    console.log('Table matieres accessible, utilisation du JOIN');
  } catch {
    console.log('Table matieres non accessible, requête sans JOIN');
  }
  
  if (useJoin) {
    if (hasNewColumns) {
      query = `
        SELECT 
          p.*,
          m.name as matiereName,
          m.prix as matierePrice
        FROM paiements_fr p
        LEFT JOIN matieres m ON p.matiereId = m.id
        WHERE p.etudiantId = ?
        ORDER BY p.dateCreation DESC
      `;
    } else {
      query = `
        SELECT 
          p.*,
          m.name as matiereName,
          m.prix as matierePrice,
          p.montant as montantPaye,
          COALESCE(m.prix, 2000) as montantTotal,
          CASE 
            WHEN p.montant >= COALESCE(m.prix, 2000) THEN 0
            ELSE COALESCE(m.prix, 2000) - p.montant
          END as montantRestant
        FROM paiements_fr p
        LEFT JOIN matieres m ON p.matiereId = m.id
        WHERE p.etudiantId = ?
        ORDER BY p.dateCreation DESC
      `;
    }
  } else {
    // Requête sans JOIN si la table matieres n'est pas accessible
    if (hasNewColumns) {
      query = `
        SELECT 
          p.*,
          'Matière inconnue' as matiereName,
          2000 as matierePrice
        FROM paiements_fr p
        WHERE p.etudiantId = ?
        ORDER BY p.dateCreation DESC
      `;
    } else {
      query = `
        SELECT 
          p.*,
          'Matière inconnue' as matiereName,
          2000 as matierePrice,
          p.montant as montantPaye,
          2000 as montantTotal,
          CASE 
            WHEN p.montant >= 2000 THEN 0
            ELSE 2000 - p.montant
          END as montantRestant
        FROM paiements_fr p
        WHERE p.etudiantId = ?
        ORDER BY p.dateCreation DESC
      `;
    }
  }
  
  try {
    const paiements = db.prepare(query).all(etudiantId) as any[];
    console.log('Paiements trouvés:', paiements.length);
    
    return paiements.map(p => ({
      id: p.id || p._id,
      etudiantId: p.etudiantId,
      matiereId: p.matiereId,
      matiereName: p.matiereName,
      mois: p.mois,
      annee: p.annee,
      montant: p.montant,
      montantTotal: p.montantTotal || p.matierePrice || 2000,
      montantPaye: p.montantPaye || p.montant,
      montantRestant: p.montantRestant || 0,
      datePaiement: p.datePaiement,
      dateCreation: p.dateCreation,
      statut: p.statut,
      numeroFacture: p.numeroFacture,
      methodePaiement: p.methodePaiement
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    throw error;
  }
};

// Fonction pour créer la table avec la nouvelle structure
export const createPaiementsFrTable = (): void => {
  const db = initDatabase();
  
  try {
    // Créer la table avec toutes les colonnes nécessaires
    db.prepare(`
      CREATE TABLE IF NOT EXISTS paiements_fr (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        etudiantId TEXT NOT NULL,
        matiereId TEXT NOT NULL,
        mois TEXT NOT NULL,
        annee TEXT NOT NULL,
        montant REAL NOT NULL,
        montantTotal REAL DEFAULT 0,
        montantPaye REAL DEFAULT 0,
        montantRestant REAL DEFAULT 0,
        methodePaiement TEXT CHECK(methodePaiement IN ('especes', 'virement', 'cheque', 'cash', 'bank', 'check')) DEFAULT 'especes',
        datePaiement TEXT NOT NULL,
        dateCreation TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT CHECK(statut IN ('en_attente', 'paye', 'partiel', 'en_retard')) DEFAULT 'en_attente',
        numeroFacture TEXT UNIQUE
      )
    `).run();
    
    console.log('Table paiements_fr créée avec succès');
    
    // Vérifier et ajouter les colonnes manquantes si nécessaire
    const tableInfo = db.prepare(`PRAGMA table_info(paiements_fr)`).all() as any[];
    const columnNames = tableInfo.map((col: any) => col.name);
    
    if (!columnNames.includes('montantTotal')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantTotal REAL DEFAULT 0`).run();
      console.log('Colonne montantTotal ajoutée');
    }
    
    if (!columnNames.includes('montantPaye')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantPaye REAL DEFAULT 0`).run();
      console.log('Colonne montantPaye ajoutée');
    }
    
    if (!columnNames.includes('montantRestant')) {
      db.prepare(`ALTER TABLE paiements_fr ADD COLUMN montantRestant REAL DEFAULT 0`).run();
      console.log('Colonne montantRestant ajoutée');
    }
    
  } catch (error) {
    console.error('Erreur lors de la création de la table:', error);
    throw error;
  }
};

// Fonction pour recréer la table avec les nouvelles colonnes
export const recreatePaiementsFrTable = (): void => {
  const db = initDatabase();
  
  try {
    // Sauvegarder les données existantes
    const existingData = db.prepare(`SELECT * FROM paiements_fr`).all();
    console.log(`Sauvegarde de ${existingData.length} paiements existants`);
    
    // Supprimer l'ancienne table
    db.prepare(`DROP TABLE IF EXISTS paiements_fr`).run();
    
    // Créer la nouvelle table
    db.prepare(`
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
        methodePaiement TEXT CHECK(methodePaiement IN ('especes', 'virement', 'cheque', 'cash', 'bank', 'check')) DEFAULT 'especes',
        datePaiement TEXT NOT NULL,
        dateCreation TEXT DEFAULT CURRENT_TIMESTAMP,
        statut TEXT CHECK(statut IN ('en_attente', 'paye', 'partiel', 'en_retard')) DEFAULT 'en_attente',
        numeroFacture TEXT UNIQUE
      )
    `).run();
    
    // Restaurer les données avec les nouvelles colonnes
    const insertQuery = `
      INSERT INTO paiements_fr (
        etudiantId, matiereId, mois, annee, montant, montantTotal,
        montantPaye, montantRestant, methodePaiement, datePaiement,
        dateCreation, statut, numeroFacture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const stmt = db.prepare(insertQuery);
    existingData.forEach((row: any) => {
      const montantTotal = row.montantTotal || 2000; // Prix par défaut
      const montantPaye = row.montantPaye || row.montant || 0;
      const montantRestant = Math.max(0, montantTotal - montantPaye);
      const statut = montantPaye >= montantTotal ? 'paye' : (montantPaye > 0 ? 'partiel' : 'en_attente');
      
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
        row.dateCreation,
        statut,
        row.numeroFacture
      );
    });
    
    console.log('Table paiements_fr recréée avec succès');
  } catch (error) {
    console.error('Erreur lors de la recréation de la table:', error);
    throw error;
  }
};
