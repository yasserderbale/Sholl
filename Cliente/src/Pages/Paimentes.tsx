import React, { useState } from 'react';
import Styles from '../Styles/Paimentes.module.css';

import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  
} from '@mui/material';

interface Paiement {
  id: number;
  eleve: string;
  matiere: string;
  mois: string;
  montant: number;
  date: string;
  methode: string;
  statut: 'Payé' | 'Non payé';
  notes?: string;
}

export function Paimentes() {
  const [paiements, setPaiements] = useState<Paiement[]>([
    {
      id: 1,
      eleve: 'Ahmed',
      matiere: 'Maths',
      mois: 'Janvier',
      montant: 2000,
      date: '2025-07-05',
      methode: 'Cash',
      statut: 'Payé',
      notes: 'Paiement comptant',
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [eleve, setEleve] = useState('');
  const [matiere, setMatiere] = useState('');
  const [mois, setMois] = useState('');
  const [montant, setMontant] = useState<number | ''>('');
  const [datePaiement, setDatePaiement] = useState('');
  const [methode, setMethode] = useState('Cash');
  const [notes, setNotes] = useState('');

  const [search, setSearch] = useState('');

  const ajouterPaiement = (e: React.FormEvent) => {
    e.preventDefault();
    const nouveau: Paiement = {
      id: paiements.length + 1,
      eleve,
      matiere,
      mois,
      montant: Number(montant),
      date: datePaiement,
      methode,
      statut: 'Payé',
      notes,
    };
    setPaiements([...paiements, nouveau]);
    setEleve('');
    setMatiere('');
    setMois('');
    setMontant('');
    setDatePaiement('');
    setMethode('Cash');
    setNotes('');
    setShowModal(false);
  };

  const paiementsFiltres = paiements.filter((p) =>
    p.eleve.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Gestion des paiements
      </Typography>

      <Box className={Styles.actions} display="flex" gap={2} mb={2}>
        <TextField
          label="Rechercher par élève"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={Styles.input}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={Styles.btnAjouter}
        >
          ➕ Ajouter Paiement
        </Button>
      </Box>

      <Paper>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Élève</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Mois</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Méthode</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paiementsFiltres.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.eleve}</TableCell>
                <TableCell>{p.matiere}</TableCell>
                <TableCell>{p.mois}</TableCell>
                <TableCell>{p.montant} DA</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.methode}</TableCell>
                <TableCell>{p.statut}</TableCell>
                <TableCell>{p.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Ajouter Paiement
            </Typography>
            <form onSubmit={ajouterPaiement} className={Styles.form}>
              <TextField
                label="Nom élève"
                value={eleve}
                onChange={(e) => setEleve(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <TextField
                label="Matière"
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <TextField
                label="Mois"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <TextField
                label="Montant"
                type="number"
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

             

              <TextField
                label="Date de paiement"
                type="date"
                value={datePaiement}
                onChange={(e) => setDatePaiement(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

             
              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button
                  variant="contained"
                  type="submit"
                  className={Styles.btnConfirmer}
                >
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                  className={Styles.btnAnnuler}
                >
                  Annuler
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
