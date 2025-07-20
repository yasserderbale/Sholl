import React, { useState } from 'react';
import Styles from '../Styles/Matieres.module.css';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  TextField,
} from '@mui/material';

interface Matiere {
  id: number;
  nom: string;
  prix: number;
}

export function Matires() {
  const [matieres, setMatieres] = useState<Matiere[]>([
    { id: 1, nom: 'Maths', prix: 2000 },
    { id: 2, nom: 'Physique', prix: 2500 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [idASupprimer, setIdASupprimer] = useState<number | null>(null);

  const [nomMatiere, setNomMatiere] = useState('');
  const [prixMatiere, setPrixMatiere] = useState<number | ''>('');

  const ajouterMatiere = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelleMatiere: Matiere = {
      id: matieres.length + 1,
      nom: nomMatiere,
      prix: Number(prixMatiere),
    };
    setMatieres([...matieres, nouvelleMatiere]);
    setNomMatiere('');
    setPrixMatiere('');
    setShowModal(false);
  };

  const supprimerMatiere = (id: number) => {
    setMatieres(matieres.filter((m) => m.id !== id));
    setIdASupprimer(null);
  };

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Gestion des matières
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
        className={Styles.btnAjouter}
      >
        ➕ Ajouter une matière
      </Button>

      <Paper sx={{ mt: 3 }}>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prix mensuel (DA)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matieres.map((mat) => (
              <TableRow key={mat.id}>
                <TableCell>{mat.nom}</TableCell>
                <TableCell>{mat.prix} DA</TableCell>
                <TableCell>
                  <Button size="small" className={Styles.btnModifier}>
                    <UpdateIcon/>
                     Modifier
                  </Button>
                  <Button
                    size="small"
                    className={Styles.btnSupprimer}
                    onClick={() => setIdASupprimer(mat.id)}
                  >
                    <DeleteForeverIcon/> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal Ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Ajouter une matière
            </Typography>
            <form onSubmit={ajouterMatiere} className={Styles.form}>
              <TextField
                label="Nom de la matière"
                value={nomMatiere}
                onChange={(e) => setNomMatiere(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Prix mensuel"
                type="number"
                value={prixMatiere}
                onChange={(e) => setPrixMatiere(Number(e.target.value))}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button variant="contained" type="submit" className={Styles.Enregistrer}>
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  type="button"
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

      {/* Modal Confirmation Supprimer */}
      <Modal open={idASupprimer !== null} onClose={() => setIdASupprimer(null)}>
        <Box className={Styles.modalOverlay1}>
          <Box className={Styles.modalContent1}>
            <Typography variant="h6">Êtes-vous sûr de vouloir supprimer ?</Typography>
            <Box className={Styles.modalActions1} display="flex" gap={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => supprimerMatiere(idASupprimer!)}
                className={Styles.btnConfirmer1}
              >
                Oui
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIdASupprimer(null)}
                className={Styles.btnAnnuler1}
              >
                Non
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
