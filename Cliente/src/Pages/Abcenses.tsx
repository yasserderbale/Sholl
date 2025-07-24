import React, { useState } from "react";
import styles from "../Styles/Abcenses.module.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface Absence {
  id: number;
  nom: string;
  date: string;
  cause: string;
  Matieres:string
}

export const Abcenses = () => {
  const [absences, setAbsences] = useState<Absence[]>([
    { id: 1, nom: "Yasser", date: "2024-12-01", cause: "Maladie" ,Matieres:"math"},
    { id: 2, nom: "Fatima", date: "2024-12-05", cause: "Voyage",Matieres:"math" },
  ]);
  const [searchNom, setSearchNom] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nom, setNom] = useState("");
  const [date, setDate] = useState("");
  const [cause, setCause] = useState("");
  const [Matieres,setMatieres]=useState("")

  const ajouterAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelleAbsence: Absence = {
      id: absences.length + 1,
      nom,
      date,
      cause,
      Matieres
    };
    setAbsences([...absences, nouvelleAbsence]);
    setNom("");
    setDate("");
    setCause("");
    setShowModal(false);
  };

  const absencesFiltres = absences.filter((a) =>
    a.nom.toLowerCase().includes(searchNom.toLowerCase())
  );

  return (
    <Box p={3} className={styles.page}>
      <Typography variant="h4" className={styles.title} gutterBottom>
        Gestion des Absences
      </Typography>

      <Box className={styles.actions} mb={2} display="flex" gap={2}>
        <TextField
          label="Rechercher par nom"
          variant="outlined"
          size="small"
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
          className={styles.searche}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={styles.btnAjouter}
        >
          ➕ Ajouter une absence
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Cause</TableCell>
                <TableCell>Matieres</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {absencesFiltres.map((abs) => (
                <TableRow key={abs.id}>
                  <TableCell>{abs.nom}</TableCell>
                  <TableCell>{abs.date}</TableCell>
                  <TableCell>{abs.cause}</TableCell>
                  <TableCell>{abs.Matieres}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal d'ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={styles.modalOverlay}>
          <Box className={styles.modalContent}>
            <Typography variant="h6" className={styles.titre} gutterBottom>
              Ajouter une absence
            </Typography>
            <form onSubmit={ajouterAbsence} className={styles.form}>
              <TextField
                label="Nom de l'élève"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date d'absence"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                label="Cause"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Matieres"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <Box className={styles.modalActions} display="flex" gap={2}>
                <Button variant="contained" type="submit">
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                  className={styles.btnAnnuler}
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
};

export default Abcenses;
