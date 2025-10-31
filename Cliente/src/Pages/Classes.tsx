import React, { useEffect, useState } from "react";
import Styles from "../Styles/Groupe.module.css";
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
  Select,
  OutlinedInput,
  MenuItem,
  FormLabel,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Update } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { usAuth } from "../Context/AuthContext";

type Day =
  | "Dimanche"
  | "Lundi"
  | "Mardi"
  | "Mercredi"
  | "Jeudi"
  | "Vendredi"
  | "Samedi";

interface Classe {
  _id: string;
  name: string;
  notes?: string;
}

interface GroupeItem {
  _id: string;
  name: string;
  heureDebut: string;
  heureFin: string;
  jours: Day[];
  groupeId: any
}

type ClassGroupsState = Record<string, GroupeItem[]>;

const daysOfWeek: Day[] = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const Classes: React.FC = () => {
  const { tocken, groupe } = usAuth();
  const [classes, setClasses] = useState<Classe[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroupsState>({});
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  // modals
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // class form
  const [newClassName, setNewClassName] = useState("");
  const [newClassNotes, setNewClassNotes] = useState("");
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [editClassId, setEditClassId] = useState<string | null>(null);

  // group form
  const [groupName, setGroupName] = useState("");
  const [heureDebut, setHeureDebut] = useState<Dayjs | null>(null);
  const [heureFin, setHeureFin] = useState<Dayjs | null>(null);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const API_URL = "http://localhost:3000";

  // === Fetch All Classes ===
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/AllClasses`, {
        headers: { Authorization: `Bearer ${tocken}` },
      });
      const data = await res.json();
      if (data.StatusCode === 200) setClasses(data.data);
    } catch (err) {
      console.error("Erreur chargement classes:", err);
    }
  };

  // === Fetch groupes for one class ===
  const fetchGroupesByClasse = async (classeId: string) => {
    try {
      const res = await fetch(`${API_URL}/Classe/${classeId}/groupes`, {
        headers: { Authorization: `Bearer ${tocken}` },
      });
      const data = await res.json();
      if (data.StatusCode === 200) {
        setClassGroups((prev) => ({ ...prev, [classeId]: data.data }));
      }
      console.log(classGroups)
    } catch (err) {
      console.error("Erreur chargement groupes:", err);
    }
  };

  // === Add or Update Class ===
  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // prevent duplicate class name
    const isDuplicate = classes.some(
      (c) =>
        c.name.toLowerCase() === newClassName.trim().toLowerCase() &&
        (c as any).id !== editClassId
    );
    if (isDuplicate) {
      setSnackbar({
        open: true,
        message: "⚠️ Ce nom de classe existe déjà !",
        severity: "error",
      });
      return;
    }

    const method = isEditingClass ? "PUT" : "POST";
    const url = isEditingClass
      ? `${API_URL}/UpdateClasse/${editClassId}`
      : `${API_URL}/AddClasse`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tocken}`,
        },
        body: JSON.stringify({ nom: newClassName, description: newClassNotes }),
      });
      const data = await res.json();
      if (data.StatusCode === 200) {
        if (isEditingClass) {
          setClasses((prev) =>
            prev.map((c: any) => ((c as any).id === editClassId ? data.data : c))
          );
        } else {
          setClasses((prev) => [...prev, data.data]);
        }
        setShowAddClassModal(false);
        setNewClassName("");
        setNewClassNotes("");
        setEditClassId(null);
        setIsEditingClass(false);
        setSnackbar({
          open: true,
          message: isEditingClass
            ? "Classe modifiée avec succès ✅"
            : "Classe ajoutée avec succès ✅",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "❌ Erreur lors de l'envoi de la classe.",
        severity: "error",
      });
    }
  };

  // === Delete Class ===
  const handleDeleteClass = async (id: string) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      const res = await fetch(`${API_URL}/DeleteClasse/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tocken}` },
      });
      const data = await res.json();
      if (data.StatusCode === 200) {
        setClasses((prev) => prev.filter((c: any) => (c as any).id !== id));
        setSnackbar({
          open: true,
          message: "Classe supprimée ✅",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "❌ Erreur suppression classe",
        severity: "error",
      });
    }
  };

  // === Edit Class ===
  const handleEditClass = (classe: Classe) => {
    setNewClassName(classe.name);
    setNewClassNotes(classe.notes || "");
    setEditClassId((classe as any).id);
    setIsEditingClass(true);
    setShowAddClassModal(true);
  };

  // === Groups Section ===
  const handleOpenGroupsModal = async (classData: Classe) => {
    setSelectedClass(classData);
    setShowGroupsModal(true);
    await fetchGroupesByClasse((classData as any).id);
  };

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !groupName || !heureDebut || !heureFin) return;
    const selectedG = groupe.find((g: any) => g.name === groupName);
    console.log(selectedG)
    if (!selectedG)
      return setSnackbar({
        open: true,
        message: "⚠️ Groupe non trouvé",
        severity: "error",
      });

    const method = isEditingGroup ? "PUT" : "POST";
    const url = isEditingGroup
      ? `${API_URL}/UpdateGroupeTim/${editGroupId}`
      : `${API_URL}/AddGroupe`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tocken}`,
        },
        body: JSON.stringify({
          groupeId: (selectedG as any).id,
          classeId: (selectedClass as any).id,
          heureDebut: heureDebut.format("HH:mm"),
          heureFin: heureFin.format("HH:mm"),
          jours: selectedDays,
        }),
      });
      const data = await res.json();
      if (data.StatusCode === 200) {
        await fetchGroupesByClasse((selectedClass as any).id);
        setShowAddGroupModal(false);
        setIsEditingGroup(false);
        setSnackbar({
          open: true,
          message: isEditingGroup
            ? "Groupe modifié avec succès ✅"
            : "Groupe ajouté avec succès ✅",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "❌ Erreur lors de l'ajout/modification du groupe",
        severity: "error",
      });
    }
  };

  const handleDeleteGroup = async (groupeId: string) => {
    if (!window.confirm("Supprimer ce groupe ?")) return;
    try {
      const res = await fetch(`${API_URL}/DeleteGroupe/${groupeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tocken}` },
      });
      const data = await res.json();
      if (data.StatusCode === 200 && selectedClass) {
        await fetchGroupesByClasse((selectedClass as any).id);
        setSnackbar({
          open: true,
          message: "Groupe supprimé ✅",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "❌ Erreur suppression groupe",
        severity: "error",
      });
    }
  };

  const handleEditGroup = (grp: GroupeItem) => {
    setGroupName(grp.groupeId.name);
    setHeureDebut(dayjs(grp.heureDebut, "HH:mm"));
    setHeureFin(dayjs(grp.heureFin, "HH:mm"));
    setSelectedDays(grp.jours);
    setEditGroupId((grp as any).id);
    setIsEditingGroup(true);
    setShowAddGroupModal(true);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Box display="flex" justifyContent="flex" mb={2} gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowAddClassModal(true);
              setIsEditingClass(false);
              setNewClassName("");
              setNewClassNotes("");
            }}
          >
            Ajouter Classe
          </Button>
        </Box>

        {/* Table des classes */}
        <Paper>
          <Table>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nom Classe</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((c: any, i) => (
                <TableRow key={(c as any).id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.notes}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenGroupsModal(c)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleEditClass(c)}>
                      <Update />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClass((c as any).id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* === Modal Add/Edit Classe === */}
        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" mb={2}>
                {isEditingClass ? "Modifier la Classe" : "Ajouter une nouvelle Classe"}
              </Typography>
              <form onSubmit={handleSubmitClass}>
                <TextField
                  fullWidth
                  label="Nom Classe"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Notes"
                  value={newClassNotes}
                  onChange={(e) => setNewClassNotes(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => setShowAddClassModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditingClass ? "Modifier" : "Ajouter"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        {/* === Modal Groupes === */}
        <Modal open={showGroupsModal} onClose={() => setShowGroupsModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" mb={2}>
                Groupes de {selectedClass?.name}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setShowAddGroupModal(true);
                  setIsEditingGroup(false);
                  setGroupName("");
                  setSelectedDays([]);
                  setHeureDebut(null);
                  setHeureFin(null);
                }}
              >
                Ajouter Groupe
              </Button>

              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Début</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Jours</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedClass &&
                    classGroups[(selectedClass as any).id]?.map((g: any) => (
                      <TableRow key={(g as any).id}>
                        <TableCell>{g.groupeId.name}</TableCell>
                        <TableCell>{g.heureDebut}</TableCell>
                        <TableCell>{g.heureFin}</TableCell>
                        <TableCell>{g.jours.join(", ")}</TableCell>
                        <TableCell>
                          <IconButton color="secondary" onClick={() => handleEditGroup(g)}>
                            <Update />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteGroup((g as any).id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="outlined" onClick={() => setShowGroupsModal(false)}>
                  Fermer
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* === Modal Add/Edit Groupe === */}
        <Modal open={showAddGroupModal} onClose={() => setShowAddGroupModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" mb={2}>
                {isEditingGroup
                  ? `Modifier Groupe ${groupName}`
                  : `Ajouter Groupe à ${selectedClass?.name}`}
              </Typography>

              <form onSubmit={handleSubmitGroup}>
                {/* === Nom du groupe === */}
                {!isEditingGroup && ( // 👈 نخبي الـ Select كي نكون في وضع Modifier
                  <>
                    <FormLabel>Nom du groupe</FormLabel>
                    <Select
                      fullWidth
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    >
                      {groupe?.map((g: any) => (
                        <MenuItem key={(g as any).id} value={g.name}>
                          {g.name} — ({g.Nbrmax} élèves)
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}

                {/* === Time pickers === */}
                <Box display="flex" gap={2} mt={2}>
                  <TimePicker
                    label="Heure début"
                    value={heureDebut}
                    onChange={(v) => setHeureDebut(v)}
                  />
                  <TimePicker
                    label="Heure fin"
                    value={heureFin}
                    onChange={(v) => setHeureFin(v)}
                  />
                </Box>

                {/* === Jours === */}
                <FormLabel sx={{ mt: 2 }}>Jours</FormLabel>
                <Select
                  fullWidth
                  multiple
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(e.target.value as Day[])}
                  input={<OutlinedInput />}
                  renderValue={(s) => (s as Day[]).join(", ")}
                >
                  {daysOfWeek.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>

                {/* === Boutons === */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                  <Button variant="outlined" onClick={() => setShowAddGroupModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditingGroup ? "Modifier" : "Ajouter"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Classes;
