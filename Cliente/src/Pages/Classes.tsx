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
  TablePagination,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Search } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Update } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { usAuth } from "../Context/AuthContext";
import { useLanguage } from "../Context/LanguageContext";

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
  const { tocken, groupe, stude } = usAuth();
  const { t } = useLanguage();
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
  const [salle, setSalle] = useState("");
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");
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
    if (!window.confirm(t('confirmDeleteClass'))) return;
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
    const selectedG = groupe.find((g: any) => {
      const cleanName = g.name.split(' – ')[0] || g.name;
      return cleanName === groupName || g.name === groupName;
    });
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
    if (!window.confirm(t('confirmDeleteGroup'))) return;
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
    // تنظيف اسم المجموعة عند التحرير واستخدامه
    const cleanGroupName = grp.groupeId.name.split(' – ')[0] || grp.groupeId.name;
    setGroupName(cleanGroupName); // استخدام الاسم المنظف
    setHeureDebut(dayjs(grp.heureDebut, "HH:mm"));
    setHeureFin(dayjs(grp.heureFin, "HH:mm"));
    setSelectedDays(grp.jours);
    setEditGroupId((grp as any).id);
    setIsEditingGroup(true);
    setShowAddGroupModal(true);
  };

  // Filtrage et pagination
  const filteredClasses = classes.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginatedClasses = filteredClasses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Typography variant="h4" className={Styles.title} gutterBottom>
          {t('classManagement')}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
          <TextField
            label={`${t('search')}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
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
            {t('addClass')}
          </Button>
        </Box>

        {/* Table des classes */}
        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('className')}</TableCell>
                <TableCell>{t('groups')}</TableCell>
                <TableCell>{t('notes')}</TableCell>
                <TableCell align="center">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      {searchTerm ? t('noData') : t('noData')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedClasses.map((c: any, i) => {
                  const groupCount = classGroups[c.id]?.length || 0;
                  return (
                    <TableRow key={c.id}>
                      <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {c.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${groupCount} groupe${groupCount > 1 ? 's' : ''}`}
                          color={groupCount > 0 ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {c.notes || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleOpenGroupsModal(c)}
                          >
                            {t('view')}
                          </Button>
                          <IconButton color="secondary" onClick={() => handleEditClass(c)}>
                            <Update />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteClass(c.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredClasses.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={`${t('rowsPerPage')}:`}
          />
        </Paper>

        {/* === Modal Add/Edit Classe === */}
        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent}>
              <Typography variant="h6" mb={2}>
                {isEditingClass ? t('edit') + ' ' + t('classes') : t('addClass')}
              </Typography>
              <form onSubmit={handleSubmitClass}>
                <TextField
                  fullWidth
                  label={t('className')}
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label={`${t('notes')} (${t('optional')})`}
                  value={newClassNotes}
                  onChange={(e) => setNewClassNotes(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => setShowAddClassModal(false)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditingClass ? t('edit') : t('add')}
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
                {t('groups')} {selectedClass?.name}
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
                {t('add')} {t('groups')}
              </Button>

              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('name')}</TableCell>
                    <TableCell>{t('start')}</TableCell>
                    <TableCell>{t('end')}</TableCell>
                    <TableCell>{t('days')}</TableCell>
                    <TableCell>{t('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedClass &&
                    classGroups[(selectedClass as any).id]?.map((g: any) => (
                      <TableRow key={(g as any).id}>
                        <TableCell>
                          {g.groupeId.name.split(' – ')[0] || g.groupeId.name}
                        </TableCell>
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
                  {t('close')}
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
                  ? `${t('edit')} ${t('groups')} ${groupName.split(' – ')[0] || groupName}`
                  : `${t('add')} ${t('groups')} ${selectedClass?.name}`}
              </Typography>

              <form onSubmit={handleSubmitGroup}>
                {/* === Nom du groupe === */}
                {!isEditingGroup && ( // 👈 نخبي الـ Select كي نكون في وضع Modifier
                  <>
                    <FormLabel>{t('groupName')}</FormLabel>
                    <Select
                      fullWidth
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    >
                      {groupe?.map((g: any) => {
                        // حساب العدد الفعلي للطلاب في المجموعة من بيانات الطلاب
                        const actualStudentCount = stude ? 
                          stude.filter((student: any) => 
                            student.Groupe && student.Groupe.includes(g.id)
                          ).length : 0;
                        const maxStudents = g.Nbrmax || 0;
                        
                        // تنظيف اسم المجموعة من النص الإضافي
                        const cleanGroupName = g.name.split(' – ')[0] || g.name;
                        
                        return (
                          <MenuItem key={(g as any).id} value={cleanGroupName}>
                            {cleanGroupName} — ({actualStudentCount}/{maxStudents} {t('students')})
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </>
                )}

                {/* === Time pickers === */}
                <Box display="flex" gap={2} mt={2}>
                  <TimePicker
                    label={t('startTime')}
                    value={heureDebut}
                    onChange={(v) => setHeureDebut(v)}
                  />
                  <TimePicker
                    label={t('endTime')}
                    value={heureFin}
                    onChange={(v) => setHeureFin(v)}
                  />
                </Box>

                {/* === Salle === */}
                <TextField
                  fullWidth
                  label={t('room')}
                  value={salle}
                  onChange={(e) => setSalle(e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Ex: A1, B2, C3..."
                />

                {/* === Jours === */}
                <FormLabel sx={{ mt: 2 }}>{t('days')}</FormLabel>
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
                    {t('cancel')}
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditingGroup ? t('edit') : t('add')}
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
