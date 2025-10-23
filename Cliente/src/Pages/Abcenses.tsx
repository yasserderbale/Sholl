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
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { usAuth } from "../Context/AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP },
  },
};

export const Abcenses = () => {

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const { stude, mat, tocken, groupe } = usAuth()
  const uniqueMats = Array.from(
    new Map(mat.map((mats) => [mats.name, mats])).values()
  )

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [idMat, setmodules] = useState<string[]>([]);
  const [abcense, setabcense] = useState<any[]>([]);
  const [namsstud, setnamsstud] = useState<any[]>([]); // array of student objects populated from backend
  const date = useRef<HTMLInputElement>(null);
  const caus = useRef<HTMLInputElement>(null);

  // multiple selected student IDs (strings)
  const [manystud, setmanystud] = useState<string[]>([]);

  useEffect(() => {
    if (tocken) {
      GetAbcense();
    }
  }, [tocken]);

  // GET all absences (backend returns populated idStud and matieres.idMat)
  const GetAbcense = async () => {
    try {
      const getabcenses = await fetch("http://localhost:3000/Abcenses", {
        headers: { Authorization: `Bearer ${tocken}` },
      });
      if (!getabcenses.ok) {
        setToast({ open: true, message: "Fetch failed", severity: "error" });
        return;
      }
      const response = await getabcenses.json();
      setabcense(response.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Server error", severity: "error" });
    }
  };

  // Add absence — NOTE: we send idStud as array of IDs (strings)
  const Addabcens = async (event: React.FormEvent) => {
    event.preventDefault();

    if (manystud.length === 0) {
      setToast({ open: true, message: "Sélectionnez au moins un élève", severity: "warning" });
      return;
    }
    const idStud = manystud; // already array of ids
    const Date = date.current?.value;
    const cause = caus.current?.value;

    if (!Date) {
      setToast({ open: true, message: "Choisissez une date", severity: "warning" });
      return;
    }

    try {
      const Abcense = await fetch(`http://localhost:3000/Abcenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tocken}`,
        },
        // NOTE: we DO NOT send identifaite here (you said it's provided from context / backend)
        body: JSON.stringify({ idStud, Date, cause, idMat }),
      });

      const response = await Abcense.json();

      if (response.StatusCode !== 200) {
        setToast({ open: true, message: "Échec lors de l'ajout de l'absence", severity: "error" });
        return;
      }

      // reset inputs
      setmanystud([]);
      date.current!.value = "";
      caus.current!.value = "";
      setmodules([]);
      setShowModal(false);
      await GetAbcense();

      setToast({ open: true, message: "Absences ajoutées avec succès", severity: "success" });
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: "Erreur serveur ❌", severity: "error" });
    }
  };

  // Search (use query param 'search' to match backend)
  const Searche = async (term: string) => {
    try {
      const getOne = await fetch(`http://localhost:3000/SearchAbc?search=${encodeURIComponent(term)}`, {
        headers: { Authorization: `Bearer ${tocken}` },
      });
      if (!getOne.ok) {
        console.log("failed getone");
        return;
      }
      const response = await getOne.json();
      setabcense(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const hadnlModules = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setmodules(typeof value === "string" ? value.split(",") : value);
  };

  const hadnlStudentes = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target;
    setmanystud(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <Box p={3} className={styles.page}>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" className={styles.title} gutterBottom>
        Gestion des Absences
      </Typography>

      {/* Search + Ajouter */}
      <Box className={styles.actions} mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e) => Searche(e.target.value)}
          label="🔍 Rechercher par nom"
          variant="outlined"
          size="small"
          sx={{ width: 250, background: "#f9fafb", borderRadius: "10px" }}
        />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          sx={{ borderRadius: "10px", textTransform: "none" }}
          onClick={() => {
            setShowModal(true);
            setnamsstud([]); // reset students list until group chosen
            setmanystud([]);
          }}
        >
          Ajouter une absence
        </Button>
      </Box>

      {/* Table */}
      {abcense.length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary" style={{ marginTop: "20px" }}>
          Aucun résultat trouvé.
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Nom (élèves)</TableCell>
                  <TableCell>Nombre d&apos;absences</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(abcense ?? []).map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {Array.isArray(item.idStud) && item.idStud.length > 0
                        ? item.idStud.map((s: any) => s.Name).join(", ")
                        : "Eleve supprimé"}
                    </TableCell>

                    <TableCell>{Array.isArray(item.Abcenses) ? item.Abcenses.length : 0}</TableCell>

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

      {/* Modal détails */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", p: 2 }}>
          <Box sx={{ bgcolor: "white", borderRadius: "16px", boxShadow: 24, width: "100%", maxWidth: "900px", p: 4, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
              📋 Détails des absences de{" "}
              {Array.isArray(selectedStudent?.idStud) && selectedStudent.idStud.length > 0
                ? selectedStudent.idStud.map((s: any) => s.Name).join(", ")
                : "—"}
            </Typography>

            {selectedStudent && (
              <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", flexGrow: 1, overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "primary.main" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cause</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Matières</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedStudent.Abcenses.map((Abcens: any, idx: number) => (
                      <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9fafb" }, "&:hover": { backgroundColor: "#e0f2fe" } }}>
                        <TableCell>{new Date(Abcens.Date).toISOString().split("T")[0]}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>{Abcens.cause || "—"}</TableCell>
                        <TableCell>{(Abcens.matieres || []).map((m: any) => m.idMat?.name ?? "—").join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="outlined" onClick={() => setSelectedStudent(null)} sx={{ borderRadius: "10px", textTransform: "none", px: 3 }}>
                Fermer
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Modal ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "rgba(0,0,0,0.4)", p: 2 }}>
          <Box sx={{ bgcolor: "white", borderRadius: "16px", boxShadow: 24, width: "100%", maxWidth: 600, p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
              ➕ Ajouter une absence
            </Typography>

            <form onSubmit={Addabcens} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Typography>Groupe</Typography>
              <Select
                displayEmpty
                fullWidth
                sx={{ borderRadius: "10px" }}
                input={<OutlinedInput />}
              >
                <MenuItem disabled value="">
                  <em>Sélectionner un Groupe</em>
                </MenuItem>
                {groupe.map((grp: any) => (
                  // when selecting group, set namsstud to the populated student objects (grp.Studentid or grp.idStud depending on your group response)
                  <MenuItem
                    onClick={() => {
                      // if your groupe object uses Studentid populated:
                      if (grp.Studentid && Array.isArray(grp.Studentid)) {
                        setnamsstud(grp.Studentid);
                      } else if (grp.idStud && Array.isArray(grp.idStud)) {
                        setnamsstud(grp.idStud);
                      } else {
                        setnamsstud([]);
                      }
                      setmanystud([]); // reset selection
                    }}
                    key={grp._id}
                    value={grp._id}
                  >
                    {grp.name}
                  </MenuItem>
                ))}
              </Select>

              <Typography>Eleves</Typography>
              <Select
                multiple
                onChange={hadnlStudentes}
                value={manystud}
                fullWidth
                sx={{ borderRadius: "10px" }}
                input={<OutlinedInput />}
                MenuProps={MenuProps}
              >
                <MenuItem disabled value="">
                  <em>Sélectionner des élèves</em>
                </MenuItem>

                {namsstud.map((eleve: any) => (
                  // each eleve is an object (populated): use _id as value, show Name
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

              <TextField inputRef={caus} label="Cause" fullWidth sx={{ borderRadius: "10px" }} />

              <Typography>Modules</Typography>
              <Select multiple value={idMat} onChange={hadnlModules} fullWidth input={<OutlinedInput />} MenuProps={MenuProps} sx={{ borderRadius: "10px" }}>
                {uniqueMats.map((name: any) => (
                  <MenuItem value={name._id} key={name._id}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>
              {/* Actions */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="outlined" onClick={() => setShowModal(false)} sx={{ borderRadius: "10px" }}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained" sx={{ borderRadius: "10px", bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}>
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
