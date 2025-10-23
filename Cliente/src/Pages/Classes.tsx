import React, { useState } from "react";
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
  type SelectChangeEvent,
  TextField,
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
  id: number | string;
  name: string;
  notes?: string;
}

interface GroupeItem {
  id: number | string;
  name: string;
  heureDebut: string;
  heureFin: string;
  jours: Day[];
}

type ClassGroupsState = Record<string | number, GroupeItem[]>;

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
  const { groupe } = usAuth();

  const [classes, setClasses] = useState<Classe[]>([
    { id: 1, name: "الحجرة رقم 01", notes: "يحتوي على 40 تلميذ" },
    { id: 2, name: "الحجرة رقم 02", notes: "يحتوي على 20 تلميذ" },
    { id: 3, name: "الحجرة رقم 03", notes: "يحتوي على 20 تلميذ" },
  ]);

  const [classGroups, setClassGroups] = useState<ClassGroupsState>({});
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [heureDebut, setHeureDebut] = useState<Dayjs | null>(null);
  const [heureFin, setHeureFin] = useState<Dayjs | null>(null);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);

  const [newClassName, setNewClassName] = useState("");
  const [newClassNotes, setNewClassNotes] = useState("");

  const handleOpenGroupsModal = (classData: Classe) => {
    setSelectedClass(classData);
    setShowGroupsModal(true);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !groupName || !heureDebut || !heureFin || selectedDays.length === 0)
      return;

    const newGroup: GroupeItem = {
      id: Date.now(),
      name: groupName,
      heureDebut: heureDebut.format("HH:mm"),
      heureFin: heureFin.format("HH:mm"),
      jours: selectedDays,
    };

    setClassGroups((prev) => ({
      ...prev,
      [selectedClass.id]: [...(prev[selectedClass.id] || []), newGroup],
    }));

    setGroupName("");
    setHeureDebut(null);
    setHeureFin(null);
    setSelectedDays([]);
    setShowAddGroupModal(false);
  };

  const handleDeleteGroup = (classId: string | number, groupId: number | string) => {
    setClassGroups((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).filter((g) => g.id !== groupId),
    }));
  };

  const handleDaysChange = (e: SelectChangeEvent<Day[]>) => {
    setSelectedDays(e.target.value as Day[]);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const newClasse: Classe = {
      id: Date.now(),
      name: newClassName,
      notes: newClassNotes,
    };

    setClasses((prev) => [...prev, newClasse]);
    setNewClassName("");
    setNewClassNotes("");
    setShowAddClassModal(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Box display="flex" justifyContent="flex" mb={2} gap={2}>
          <TextField
            label="🔍 Rechercher par nom"
            variant="outlined"
            size="small"
            sx={{ width: 250, background: "#f9fafb", borderRadius: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: "10px", textTransform: "none" }}
            startIcon={<AddIcon />}
            onClick={() => setShowAddClassModal(true)}
          >
            Ajouter Classe
          </Button>
        </Box>

        {/* === جدول الكلاسات === */}
        <Paper sx={{ borderRadius: 2, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <Table>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nom Classe</TableCell>
                <TableCell>Commentaires</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.id}</TableCell>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.notes}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenGroupsModal(classItem)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="info">
                      <Update />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {/* === Voir les groupes === */}
        <Modal open={showGroupsModal} onClose={() => setShowGroupsModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Groupes de {selectedClass?.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowAddGroupModal(true)}
                  startIcon={<AddIcon />}
                >
                  Ajouter un groupe
                </Button>
              </Box>

              {(selectedClass && (classGroups[selectedClass.id] || []).length === 0) ? (
                <Typography color="text.secondary" mb={3}>
                  Aucun groupe ajouté.
                </Typography>
              ) : (
                selectedClass && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Heure début</TableCell>
                        <TableCell>Heure fin</TableCell>
                        <TableCell>Jours</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classGroups[selectedClass.id].map((grp) => (
                        <TableRow key={grp.id}>
                          <TableCell>{grp.name}</TableCell>
                          <TableCell>{grp.heureDebut}</TableCell>
                          <TableCell>{grp.heureFin}</TableCell>
                          <TableCell>{grp.jours.join(", ")}</TableCell>
                          <TableCell>
                            <IconButton color="primary">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton color="info">
                              <Update />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteGroup(selectedClass.id, grp.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}

              {/* === زر الإلغاء === */}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setShowGroupsModal(false)}
                >
                  Annuler
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>


        {/* === Ajouter un groupe === */}
        <Modal open={showAddGroupModal} onClose={() => setShowAddGroupModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Ajouter un groupe à {selectedClass?.name}
              </Typography>

              <form onSubmit={handleAddGroup} className={Styles.form}>
                <FormLabel>Nom du groupe</FormLabel>
                <Select
                  fullWidth
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                >
                  {groupe && groupe.length > 0 ? (
                    groupe.map((g: any) => (
                      <MenuItem key={g._id} value={g.name}>
                        {g.name} — ({g.Nbrmax} élèves)
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Aucun groupe disponible</MenuItem>
                  )}
                </Select>

                <Box display="flex" gap={2} mt={2}>
                  <TimePicker
                    label="Heure début"
                    value={heureDebut}
                    onChange={(newValue) => setHeureDebut(newValue)}
                  />
                  <TimePicker
                    label="Heure fin"
                    value={heureFin}
                    onChange={(newValue) => setHeureFin(newValue)}
                  />
                </Box>

                <FormLabel sx={{ mt: 2 }}>Jours</FormLabel>
                <Select
                  fullWidth
                  multiple
                  value={selectedDays}
                  onChange={handleDaysChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (selected as Day[]).join(", ")}
                >
                  {daysOfWeek.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setShowAddGroupModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit">
                    Sauvegarder
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        {/* === Ajouter une Classe === */}
        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Ajouter une nouvelle Classe
              </Typography>

              <form onSubmit={handleAddClass} className={Styles.form}>
                <TextField
                  label="Nom de la Classe"
                  fullWidth
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={newClassNotes}
                  onChange={(e) => setNewClassNotes(e.target.value)}
                />

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setShowAddClassModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button variant="contained" type="submit">
                    Ajouter
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default Classes;
