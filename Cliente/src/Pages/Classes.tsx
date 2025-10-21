import React, { useState } from "react";
import Styles from "../Styles/Groupe.module.css";
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
  Select,
  OutlinedInput,
  MenuItem,
  FormLabel,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Update } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type Day = "Dimanche" | "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";

interface Classe {
  id: number | string;
  name: string;
  notes?: string;
}

interface GroupeItem {
  id: number | string;
  name: string;
  dateDebut: string;
  dateFin: string;
  jours: Day[];
}

type ClassGroupsState = Record<string | number, GroupeItem[]>;

const daysOfWeek: Day[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const Classes: React.FC = () => {
  // === Classes ===
  const [classes, setClasses] = useState<Classe[]>([
    { id: 1, name: "الحجرة رقم 01", notes: "يحتوي على 40 تلميذ" },
    { id: 2, name: "الحجرة رقم 02", notes: "يحتوي على 20 تلميذ" },
    { id: 3, name: "الحجرة رقم 03", notes: "يحتوي على 20 تلميذ" },
  ]);

  // === Groups ===
  const [classGroups, setClassGroups] = useState<ClassGroupsState>({});
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  // === Add group states ===
  const [groupName, setGroupName] = useState("");
  const [dateDebut, setDateDebut] = useState<Dayjs | null>(null);
  const [dateFin, setDateFin] = useState<Dayjs | null>(null);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);

  // === Add class states ===
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassNotes, setNewClassNotes] = useState("");

  // === Functions ===
  const handleOpenGroupsModal = (classData: Classe) => {
    setSelectedClass(classData);
    setShowGroupsModal(true);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !groupName || !dateDebut || !dateFin || selectedDays.length === 0) return;

    const newGroup: GroupeItem = {
      id: Date.now(),
      name: groupName,
      dateDebut: dateDebut.toISOString(),
      dateFin: dateFin.toISOString(),
      jours: selectedDays,
    };

    setClassGroups((prev) => ({
      ...prev,
      [selectedClass.id]: [...(prev[selectedClass.id] || []), newGroup],
    }));

    setGroupName("");
    setDateDebut(null);
    setDateFin(null);
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

    setClasses(prev => [...prev, newClasse]);
    setNewClassName("");
    setNewClassNotes("");
    setShowAddClassModal(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" className={Styles.title}>Classes</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={Styles.btnAjouter}
            onClick={() => setShowAddClassModal(true)}
          >
            Ajouter une classe
          </Button>
        </Box>

        {/* === Classes Table === */}
        <Paper sx={{ borderRadius: 2, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <Table>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nom Classe</TableCell>
                <TableCell>Commentaires</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Calendrier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.id}</TableCell>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.notes}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenGroupsModal(classItem)} title="Voir les groupes">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="info" title="Modifier">
                      <Update />
                    </IconButton>
                    <IconButton color="error" title="Supprimer">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>

                  {/* === Calendar preview === */}
                  <TableCell>
                    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} p={1}>
                      {daysOfWeek.map((day) => {
                        const groups = classGroups[classItem.id] || [];
                        const groupsForDay = groups.filter((gr) => gr.jours.includes(day));
                        return (
                          <Box key={day} sx={{ textAlign: "center" }}>
                            <Typography variant="caption">{day}</Typography>
                            <Box sx={{ height: 80, background: "#f0f0f0", borderRadius: 2, p: 1, overflowY: "auto" }}>
                              {groupsForDay.length > 0 ? (
                                groupsForDay.map((g) => (
                                  <Typography key={g.id} variant="body2" sx={{ fontWeight: 700 }}>
                                    {g.name} ({dayjs(g.dateDebut).format("DD/MM")} → {dayjs(g.dateFin).format("DD/MM")})
                                  </Typography>
                                ))
                              ) : (
                                <Typography variant="caption" color="text.secondary">—</Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* === Add Class Modal === */}
        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter une classe</Typography>
              <form onSubmit={handleAddClass} className={Styles.form}>
                <TextField
                  label="Nom de la classe"
                  fullWidth
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <TextField
                  label="Commentaires"
                  fullWidth
                  value={newClassNotes}
                  onChange={(e) => setNewClassNotes(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => setShowAddClassModal(false)}>Annuler</Button>
                  <Button variant="contained" type="submit">Sauvegarder</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        {/* === Voir Groups Modal === */}
        <Modal open={showGroupsModal} onClose={() => setShowGroupsModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Groupes de {selectedClass?.name}</Typography>
                <Button variant="outlined" onClick={() => setShowGroupsModal(false)}>Annuler</Button>
              </Box>

              <Box mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddGroupModal(true)}>
                  Ajouter un groupe
                </Button>
              </Box>

              {(selectedClass && (classGroups[selectedClass.id] || []).length === 0) ? (
                <Typography color="text.secondary">Aucun groupe ajouté.</Typography>
              ) : (
                selectedClass && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Date début</TableCell>
                        <TableCell>Date fin</TableCell>
                        <TableCell>Jours</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classGroups[selectedClass.id].map((grp) => (
                        <TableRow key={grp.id}>
                          <TableCell>{grp.name}</TableCell>
                          <TableCell>{dayjs(grp.dateDebut).format("DD/MM/YYYY")}</TableCell>
                          <TableCell>{dayjs(grp.dateFin).format("DD/MM/YYYY")}</TableCell>
                          <TableCell>{grp.jours.join(", ")}</TableCell>
                          <TableCell>
                            <Button size="small" color="primary" onClick={() => alert(JSON.stringify(grp, null, 2))}>
                              Voir
                            </Button>
                            <IconButton color="error" onClick={() => handleDeleteGroup(selectedClass.id, grp.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              )}
            </Box>
          </Box>
        </Modal>

        {/* === Add Group Modal === */}
        <Modal open={showAddGroupModal} onClose={() => setShowAddGroupModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Ajouter un groupe à {selectedClass?.name}
              </Typography>

              <form onSubmit={handleAddGroup} className={Styles.form}>
                <TextField
                  label="Nom du groupe"
                  fullWidth
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <Box display="flex" gap={2} mt={1}>
                  <DatePicker
                    label="Date début"
                    value={dateDebut}
                    onChange={(newValue) => setDateDebut(newValue)}
                    slots={{ textField: TextField }}
                    enableAccessibleFieldDOMStructure={false}
                  />
                  <DatePicker
                    label="Date fin"
                    value={dateFin}
                    onChange={(newValue) => setDateFin(newValue)}
                    slots={{ textField: TextField }}
                    enableAccessibleFieldDOMStructure={false}
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
                  {daysOfWeek.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => setShowAddGroupModal(false)}>Annuler</Button>
                  <Button variant="contained" type="submit">Sauvegarder</Button>
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
