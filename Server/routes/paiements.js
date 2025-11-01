const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Modèle de données pour les paiements
// Structure: {
//   _id: ObjectId,
//   etudiantId: ObjectId,
//   matiereId: ObjectId,
//   mois: String,
//   annee: String,
//   montant: Number,
//   methodePaiement: String ('especes', 'virement', 'cheque'),
//   datePaiement: Date,
//   dateCreation: Date,
//   statut: String ('en_attente', 'paye', 'en_retard'),
//   numeroFacture: String
// }

// GET /paiements/etudiant/:etudiantId - Récupérer tous les paiements d'un étudiant
router.get('/etudiant/:etudiantId', authenticateToken, async (req, res) => {
  try {
    const { etudiantId } = req.params;
    
    // Ici vous devez remplacer par votre logique de base de données
    // Exemple avec MongoDB:
    // const paiements = await Paiement.find({ etudiantId }).populate('matiereId');
    
    // Pour l'instant, retournons des données d'exemple
    const paiementsExemple = [
      {
        _id: '1',
        etudiantId: etudiantId,
        matiereId: '1',
        mois: 'janvier',
        annee: '2025',
        montant: 2000,
        methodePaiement: 'especes',
        datePaiement: new Date('2025-01-15'),
        dateCreation: new Date('2025-01-15'),
        statut: 'paye',
        numeroFacture: 'FAC-001'
      },
      {
        _id: '2',
        etudiantId: etudiantId,
        matiereId: '2',
        mois: 'janvier',
        annee: '2025',
        montant: 2500,
        methodePaiement: null,
        datePaiement: null,
        dateCreation: new Date('2025-01-01'),
        statut: 'en_attente',
        numeroFacture: null
      }
    ];

    res.json({
      success: true,
      data: paiementsExemple,
      message: 'Paiements récupérés avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des paiements'
    });
  }
});

// POST /paiements - Créer un nouveau paiement
router.post('/', authenticateToken, async (req, res) => {
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
    if (!etudiantId || !matiereId || !mois || !annee || !montant) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: etudiantId, matiereId, mois, annee et montant sont requis'
      });
    }

    // Générer un numéro de facture unique
    const numeroFacture = `FAC-${Date.now()}`;

    // Créer l'objet paiement
    const nouveauPaiement = {
      etudiantId,
      matiereId,
      mois,
      annee,
      montant,
      methodePaiement: methodePaiement || 'especes',
      datePaiement: datePaiement ? new Date(datePaiement) : new Date(),
      dateCreation: new Date(),
      statut: 'paye',
      numeroFacture
    };

    // Ici vous devez sauvegarder en base de données
    // Exemple avec MongoDB:
    // const paiement = new Paiement(nouveauPaiement);
    // const paiementSauvegarde = await paiement.save();

    // Pour l'instant, simulons une sauvegarde réussie
    const paiementSauvegarde = {
      _id: Date.now().toString(),
      ...nouveauPaiement
    };

    res.status(201).json({
      success: true,
      data: paiementSauvegarde,
      message: 'Paiement enregistré avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du paiement'
    });
  }
});

// PUT /paiements/:paiementId - Mettre à jour un paiement
router.put('/:paiementId', authenticateToken, async (req, res) => {
  try {
    const { paiementId } = req.params;
    const {
      montant,
      methodePaiement,
      datePaiement,
      statut
    } = req.body;

    // Ici vous devez mettre à jour en base de données
    // Exemple avec MongoDB:
    // const paiement = await Paiement.findByIdAndUpdate(
    //   paiementId,
    //   { montant, methodePaiement, datePaiement, statut },
    //   { new: true }
    // );

    // Pour l'instant, simulons une mise à jour réussie
    const paiementMisAJour = {
      _id: paiementId,
      montant,
      methodePaiement,
      datePaiement: datePaiement ? new Date(datePaiement) : new Date(),
      statut,
      dateModification: new Date()
    };

    res.json({
      success: true,
      data: paiementMisAJour,
      message: 'Paiement mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du paiement'
    });
  }
});

// DELETE /paiements/:paiementId - Supprimer un paiement
router.delete('/:paiementId', authenticateToken, async (req, res) => {
  try {
    const { paiementId } = req.params;

    // Ici vous devez supprimer de la base de données
    // Exemple avec MongoDB:
    // await Paiement.findByIdAndDelete(paiementId);

    res.json({
      success: true,
      message: 'Paiement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du paiement'
    });
  }
});

// GET /paiements/rapport - Générer un rapport de paiements
router.get('/rapport', authenticateToken, async (req, res) => {
  try {
    const { mois, annee, matiereId, statut } = req.query;

    // Construire les filtres
    const filtres = {};
    if (mois) filtres.mois = mois;
    if (annee) filtres.annee = annee;
    if (matiereId) filtres.matiereId = matiereId;
    if (statut) filtres.statut = statut;

    // Ici vous devez récupérer les données filtrées
    // Exemple avec MongoDB:
    // const paiements = await Paiement.find(filtres)
    //   .populate('etudiantId', 'nom prenom')
    //   .populate('matiereId', 'nom prix');

    // Calculer les statistiques
    const statistiques = {
      totalPaiements: 0,
      montantTotal: 0,
      paiementsEnAttente: 0,
      paiementsPayes: 0,
      paiementsEnRetard: 0
    };

    res.json({
      success: true,
      data: {
        paiements: [], // Remplacer par les données réelles
        statistiques
      },
      message: 'Rapport généré avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la génération du rapport'
    });
  }
});

module.exports = router;
