import React, { useEffect, useRef, useState } from "react";
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
  Select,
  MenuItem,
  OutlinedInput,
  type SelectChangeEvent,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usAuth } from "../Context/AuthContext";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};
export const Abcenses = () => {
  const { stude, mat, tocken } = usAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // 👈 طالب واحد مختار
  const [idMat, setmodules] = useState<string[]>([]); 
  const hadnlModules = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setmodules(typeof value === "string" ? value.split(",") : value);
  };
  const [abcense, setabcense] = useState<any[]>([]);
  const name = useRef<HTMLInputElement>(null);
  const date = useRef<HTMLInputElement>(null);
  const caus = useRef<HTMLInputElement>(null);
    useEffect(() => {
    if (tocken) {
      GetAbcense();
    }
  },[] );
  // 📌 Get absences
  const GetAbcense = async () => {
    const getabcenses = await fetch("http://localhost:3000/Abcenses", {
      headers: {
        Authorization: `Bearer ${tocken}`,
      },
    });
    if (!getabcenses.ok) {
      alert("get failed");
      return;
    }
    const response = await getabcenses.json();
    setabcense(response.data);
          console.log("running Abcense API",response.data)

  }; 
   // 📌 Ajouter absence
    const Addabcens = async (event: React.FormEvent) => {
    event.preventDefault();
    const idStud = name.current?.value;
    const Date = date.current?.value;
    const cause = caus.current?.value;
    const Abcense = await fetch(`http://localhost:3000/Abcenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tocken}`,
      },
      body: JSON.stringify({ idStud, Date, cause, idMat }),
    });
    if (!Abcense.ok) {
      console.log("add failed");
      return;
    }
    await Abcense.json();
    name.current!.value = "";
    date.current!.value = "";
    caus.current!.value = "";
    setmodules([]);
    setShowModal(false);
    GetAbcense();
  };
  // 📌 Search
  const Searche = async (event: any) => {
    const getOne = await fetch(
      `http://localhost:3000/SearchAbc?name=${event}`,
      {
        headers: {
          Authorization: `Bearer ${tocken}`,
        },
      }
    );
    if (!getOne.ok) {
      console.log("failed getone");
      return;
    }
    const response = await getOne.json();
    setabcense(response.data);
  };
  return (
    <Box p={3} className={styles.page}>
      <Typography variant="h4" className={styles.title} gutterBottom>
        Gestion des Absences
      </Typography>

      <Box className={styles.actions} mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e) => Searche(e.target.value)}
          label="Rechercher par nom"
          variant="outlined"
          size="small"
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

      {abcense.length == 0 ? (
        <h1>No data</h1>
       
      ) : (
         <Paper>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Nombre d&apos;absences</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(abcense??[]).map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.idStud?.Name ?item.idStud.Name:"Eleve supprimer"}</TableCell>
                    <TableCell>{item.Abcenses.length}</TableCell>
                    <TableCell>
                      <Button
                      startIcon={<VisibilityIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedStudent(item)}
                      >
                        Voir détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Modal details d'un étudiant */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box className={styles.modalOverlay}>
          <Box className={styles.modalContent} sx={{maxHeight:"500px",maxWidth:"750px", overflowY:"auto"}}>
            <Typography variant="h6" gutterBottom>
              Détails des absences de {selectedStudent?.idStud?.Name}
            </Typography>
            {selectedStudent && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Cause</TableCell>
                    <TableCell>Matieres</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudent.Abcenses.map((Abcens: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{Abcens.Date.split("T")[0]}</TableCell>
                      <TableCell>{Abcens.cause}</TableCell>
                      <TableCell>
                        {Abcens.matieres
                          .map((m: any) => m.idMat.name)
                          .join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setSelectedStudent(null)}
              >
                Fermer
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Modal d'ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={styles.modalOverlay}>
          <Box className={styles.modalContent}>
            <Typography variant="h6" className={styles.titre} gutterBottom>
              Ajouter une absence
            </Typography>
            <form onSubmit={Addabcens} className={styles.form}>
              <Typography>Élève</Typography>
              <Select
                inputRef={name}
                sx={{ width: "100%" }}
                input={<OutlinedInput id="select-single" />}
              >
                {stude.map((eleve: any) => (
                  <MenuItem key={eleve._id} value={eleve._id}>
                    {eleve.Name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                inputRef={date}
                label="Date d'absence"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                inputRef={caus}
                label="Cause"
                required
                fullWidth
                margin="normal"
              />
              <Typography>Modules</Typography>
              <Select
                sx={{ width: "100%" }}
                multiple
                onChange={hadnlModules}
                value={idMat}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Modules" />
                }
                MenuProps={MenuProps}
              >
                {mat.map((name) => (
                  <MenuItem value={name._id} key={name._id}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>

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
