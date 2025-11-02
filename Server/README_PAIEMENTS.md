# API de Gestion des Paiements

Ce document décrit les endpoints de l'API pour la gestion des paiements des étudiants.

## Configuration

1. Ajoutez le fichier `routes/paiements.js` à votre serveur Express
2. Importez et utilisez les routes dans votre `app.js` ou `server.js`:

```javascript
const paiementsRoutes = require('./routes/paiements');
app.use('/paiements', paiementsRoutes);
```

## Endpoints

### 1. Récupérer les paiements d'un étudiant
```
GET /paiements/etudiant/:etudiantId
```

**Headers requis:**
- `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "1",
      "etudiantId": "etudiant123",
      "matiereId": "matiere456",
      "mois": "janvier",
      "annee": "2025",
      "montant": 2000,
      "methodePaiement": "especes",
      "datePaiement": "2025-01-15T00:00:00.000Z",
      "statut": "paye",
      "numeroFacture": "FAC-001"
    }
  ],
  "message": "Paiements récupérés avec succès"
}
```

### 2. Créer un nouveau paiement
```
POST /paiements
```

**Headers requis:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Corps de la requête:**
```json
{
  "etudiantId": "etudiant123",
  "matiereId": "matiere456",
  "mois": "janvier",
  "annee": "2025",
  "montant": 2000,
  "methodePaiement": "especes",
  "datePaiement": "2025-01-15T00:00:00.000Z"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "nouveauId",
    "etudiantId": "etudiant123",
    "matiereId": "matiere456",
    "mois": "janvier",
    "annee": "2025",
    "montant": 2000,
    "methodePaiement": "especes",
    "datePaiement": "2025-01-15T00:00:00.000Z",
    "statut": "paye",
    "numeroFacture": "FAC-1640995200000"
  },
  "message": "Paiement enregistré avec succès"
}
```

### 3. Mettre à jour un paiement
```
PUT /paiements/:paiementId
```

**Headers requis:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Corps de la requête:**
```json
{
  "montant": 2500,
  "methodePaiement": "virement",
  "datePaiement": "2025-01-16T00:00:00.000Z",
  "statut": "paye"
}
```

### 4. Supprimer un paiement
```
DELETE /paiements/:paiementId
```

**Headers requis:**
- `Authorization: Bearer <token>`

### 5. Générer un rapport de paiements
```
GET /paiements/rapport?mois=janvier&annee=2025&statut=paye
```

**Paramètres de requête optionnels:**
- `mois`: Filtrer par mois
- `annee`: Filtrer par année
- `matiereId`: Filtrer par matière
- `statut`: Filtrer par statut (`en_attente`, `paye`, `en_retard`)

## Statuts des paiements

- `en_attente`: Paiement en attente
- `paye`: Paiement effectué
- `en_retard`: Paiement en retard

## Méthodes de paiement

- `especes`: Paiement en espèces
- `virement`: Virement bancaire
- `cheque`: Paiement par chèque

## Structure de la base de données

### Collection: paiements
```javascript
{
  _id: ObjectId,
  etudiantId: ObjectId, // Référence vers l'étudiant
  matiereId: ObjectId,  // Référence vers la matière
  mois: String,         // Mois du paiement
  annee: String,        // Année du paiement
  montant: Number,      // Montant en dinars
  methodePaiement: String, // Méthode de paiement
  datePaiement: Date,   // Date du paiement
  dateCreation: Date,   // Date de création de l'enregistrement
  statut: String,       // Statut du paiement
  numeroFacture: String // Numéro de facture unique
}
```

## Intégration avec le frontend

Le frontend utilise ces endpoints pour:
1. Afficher les matières d'un étudiant avec leurs statuts de paiement
2. Permettre le paiement des matières en attente
3. Afficher l'historique des paiements
4. Générer des rapports

## Sécurité

- Tous les endpoints nécessitent une authentification JWT
- Validation des données d'entrée
- Gestion des erreurs appropriée
- Logs des opérations importantes

## Exemple d'utilisation dans le frontend

```typescript
// Récupérer les paiements d'un étudiant
const fetchStudentPayments = async (studentId: string) => {
  const response = await fetch(`/paiements/etudiant/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const result = await response.json();
  return result.data;
};

// Créer un nouveau paiement
const createPayment = async (paymentData: any) => {
  const response = await fetch('/paiements', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};
```
