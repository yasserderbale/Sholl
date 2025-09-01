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
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from '@mui/icons-material/Add';
import { usAuth } from "../Context/AuthContext";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP },
  },
};
import { Snackbar, Alert } from "@mui/material";
export const Abcenses = () => {
  const [toast, setToast] = useState<{open:boolean, message:string, severity:"success"|"error"|"info"|"warning"}>({
  open: false,
  message: "",
  severity: "success",
});
  const { stude, mat, tocken } = usAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [idMat, setmodules] = useState<string[]>([]);
  const [abcense, setabcense] = useState<any[]>([]);

  const name = useRef<HTMLInputElement>(null);
  const date = useRef<HTMLInputElement>(null);
  const caus = useRef<HTMLInputElement>(null);

  // 📌 جلب البيانات أول ما يكون عندنا token
  useEffect(() => {
    if (tocken) {
      GetAbcense();
    }
  }, [tocken]);

  // 📌 Get absences
  const GetAbcense = async () => {
    const getabcenses = await fetch("http://localhost:3000/Abcenses", {
      headers: { Authorization: `Bearer ${tocken}` },
    });
    if (!getabcenses.ok) {
      alert("get failed");
      return;
    }
    const response = await getabcenses.json();
    setabcense(response.data);
    console.log("running Abcense API", response.data);
  };

  // 📌 Ajouter absence
const Addabcens = async (event: React.FormEvent) => {
  event.preventDefault();
  const idStud = name.current?.value;
  const Date = date.current?.value;
  const cause = caus.current?.value;

  try {
    const Abcense = await fetch(`http://localhost:3000/Abcenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tocken}`,
      },
      body: JSON.stringify({ idStud, Date, cause, idMat }),
    });

    if (!Abcense.ok) {
      setToast({ open: true, message: "Échec lors de l'ajout de l'absence", severity: "error" });
      return;
    }

    await Abcense.json();

    // reset inputs
    name.current!.value = "";
    date.current!.value = "";
    caus.current!.value = "";
    setmodules([]);
    setShowModal(false);
    GetAbcense();

    setToast({ open: true, message: "Absence ajoutée avec succès ", severity: "success" });
  } catch (error) {
    setToast({ open: true, message: "Erreur serveur ❌", severity: "error" });
  }
};

  // 📌 Search (مع debounce)
  const Searche =async (event: any) => {
      const getOne = await fetch(
        `http://localhost:3000/SearchAbc?name=${event}`,
        { headers: { Authorization: `Bearer ${tocken}` } }
      );
      if (!getOne.ok) {
        console.log("failed getone");
        return;
      }
      const response = await getOne.json();
      setabcense(response.data);
   
  };

  const hadnlModules = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setmodules(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box p={3} className={styles.page}>
      <Snackbar
  open={toast.open}
  autoHideDuration={3000}
  onClose={() => setToast({ ...toast, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setToast({ ...toast, open: false })}
    severity={toast.severity}
    sx={{ width: "100%"}}
  >
    {toast.message}
  </Alert>
</Snackbar>

      <Typography variant="h4" className={styles.title} gutterBottom>
        Gestion des Absences
      </Typography>

      {/* 🔍 Search + Ajouter */}
      <Box className={styles.actions} mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e) => Searche(e.target.value)}
         label="🔍 Rechercher par nom"
          variant="outlined"
          size="small"
          sx={{
            width:250,
            background:"#f9fafb",
            borderRadius:"10px"
          }}
        />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
         sx={{ borderRadius:"10px", textTransform:"none" }}
         onClick={() => setShowModal(true)}
        >
           Ajouter une absence
        </Button>
      </Box>

      {/* 📌 Table */}
      {abcense.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          style={{ marginTop: "20px" }}
        >
          Aucun résultat trouvé.
        </Typography>
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
                {(abcense ?? []).map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {item.idStud?.Name ? item.idStud.Name : "Eleve supprimé"}
                    </TableCell>
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

      {/* 📌 Modal détails */}
     <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      bgcolor: "rgba(0,0,0,0.5)",
      p: 2,
    }}
  >
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "16px",
        boxShadow: 24,
        width: "100%",
        maxWidth: "900px",
        p: 4,
        maxHeight: "80vh", // ⬅️ limite de hauteur
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Titre */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
      >
        📋 Détails des absences de {selectedStudent?.idStud?.Name}
      </Typography>

      {/* Table scrollable */}
      {selectedStudent && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            flexGrow: 1,
            overflowY: "auto", // ⬅️ scroll vertical
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Cause
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Matières
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStudent.Abcenses.map((Abcens: any, idx: number) => (
                <TableRow
                  key={idx}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9fafb" },
                    "&:hover": { backgroundColor: "#e0f2fe" },
                  }}
                >
                  <TableCell>{Abcens.Date.split("T")[0]}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {Abcens.cause}
                  </TableCell>
                  <TableCell>
                    {Abcens.matieres.map((m: any) => m.idMat.name).join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Footer */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => setSelectedStudent(null)}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
          }}
        >
          Fermer
        </Button>
      </Box>
    </Box>
  </Box>
</Modal>



      {/* 📌 Modal ajout */}
     <Modal open={showModal} onClose={() => setShowModal(false)}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      bgcolor: "rgba(0,0,0,0.4)",
      p: 2,
    }}
  >
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "16px",
        boxShadow: 24,
        width: "100%",
        maxWidth: 600,
        p: 4,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
      >
        ➕ Ajouter une absence
      </Typography>

      <form onSubmit={Addabcens} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <Select
          inputRef={name}
          displayEmpty
          fullWidth
          sx={{ borderRadius: "10px" }}
          input={<OutlinedInput />}
        >
          <MenuItem disabled value="">
            <em>Sélectionner un élève</em>
          </MenuItem>
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
          sx={{ borderRadius: "10px" }}
        />

        <TextField
          inputRef={caus}
          label="Cause"
          required
          fullWidth
          sx={{ borderRadius: "10px" }}
        />

        <Select
          multiple
          value={idMat}
          onChange={hadnlModules}
          fullWidth
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          sx={{ borderRadius: "10px" }}
        >
          {mat.map((name) => (
            <MenuItem value={name._id} key={name._id}>
              {name.name}
            </MenuItem>
          ))}
        </Select>

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="outlined"
            onClick={() => setShowModal(false)}
            sx={{ borderRadius: "10px" }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "10px",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Enregistrer
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
