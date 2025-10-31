import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Snackbar,
  Alert,
  TablePagination,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search,
  Close as CloseIcon,
  Edit,
  Delete,
  Visibility,
  ArrowBack
} from '@mui/icons-material'; // Ajout de ArrowBack
import { usAuth } from '../Context/AuthContext';

// Types
type Student = {
  id: string;
  Name: string;
};

type Group = {
  id: string;
  name: string;
  Studentid: string[];
};

type Absence = {
  id: string;
  studentId: string[]; // Toujours tableau
  date: string;
  reason: string;
  idMat?: string[];
};

const Abcenses = () => {
  const { groupe, stude, tocken } = usAuth() as {
    groupe: Group[];
    stude: Student[];
    tocken: string;
  };

  const [openModal, setOpenModal] = useState(false);
  const [openStudentListModal, setOpenStudentListModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [tempSelectedGroup, setTempSelectedGroup] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [date, setDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [editingAbsence, setEditingAbsence] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // Filtrage
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupe;
    return groupe.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [groupe, searchTerm]);

  const filteredStudents = useMemo(() => {
    if (!selectedGroup) return [];
    const group = groupe.find(g => g.id === selectedGroup);
    if (!group) return [];
    let result = stude.filter(s => group.Studentid.includes(s.id));
    if (searchTerm) {
      result = result.filter(s => s.Name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return result;
  }, [selectedGroup, groupe, stude, searchTerm]);

  // Chargement des étudiants du groupe
  useEffect(() => {
    if (selectedGroup) {
      const group = groupe.find(g => g.id === selectedGroup);
      if (group) {
        setStudents(stude.filter(s => group.Studentid.includes(s.id)));
      } else {
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  }, [selectedGroup, groupe, stude]);

  // Chargement des absences
  const fetchAbsences = async () => {
    if (!tocken) return;
    try {
      const res = await fetch('http://localhost:3000/Abcenses', {
        headers: { Authorization: `Bearer ${tocken}` }
      });
      const data = await res.json();
      if (res.ok) {
        const absencesData = (data.data || []).map((a: any) => {
          // Backend returns studentId as a single string, convert to array
          const studentId = a.studentId ? [a.studentId] : [];
          return {
            id: a.id,
            studentId,
            date: a.Date || a.date,
            reason: a.cause || a.reason || '',
            idMat: a.matieres || []
          };
        });
        const sorted = absencesData.sort((a: Absence, b: Absence) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        setAbsences(sorted);
      }
    } catch (err) {
      setToast({ open: true, message: 'Erreur chargement absences', severity: 'error' });
    }
  };

  useEffect(() => {
    if (tocken) fetchAbsences();
  }, [tocken]);

  // Sauvegarde
  const handleSaveAbsence = async () => {
    if (!date || (selectedStudents.length === 0 && !editingAbsence)) {
      setToast({ open: true, message: 'Sélectionnez au moins un étudiant et une date', severity: 'error' });
      return;
    }

    const formattedDate = new Date(date).toISOString().slice(0, 19) + 'Z';
    const url = editingAbsence
      ? `http://localhost:3000/Abcenses/${selectedAbsence?.id}`
      : 'http://localhost:3000/Abcenses';

    try {
      const res = await fetch(url, {
        method: editingAbsence ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tocken}`
        },
        body: JSON.stringify({
          identifaite: tocken,
          idStud: editingAbsence ? selectedAbsence?.studentId : selectedStudents,
          Date: formattedDate,
          cause: reason,
          idMat: []
        })
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: data.message || 'Succès', severity: 'success' });
        closeModal();
        fetchAbsences();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setToast({ open: true, message: err.message || 'Erreur', severity: 'error' });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingAbsence(false);
    setSelectedAbsence(null);
    setSelectedStudents([]);
    setDate('');
    setReason('');
  };

  const openEditModal = (absence: Absence) => {
    setSelectedAbsence(absence);
    setEditingAbsence(true);
    const dateValue = absence.date ? new Date(absence.date) : new Date();
    setDate(dateValue.toISOString().split('T')[0]);
    setReason(absence.reason || '');
    setSelectedStudents(absence.studentId);
    setOpenModal(true);
  };

  const handleDeleteAbsence = async (id: string) => {
    if (!confirm('Supprimer cette absence ?')) return;
    try {
      await fetch(`http://localhost:3000/Abcenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tocken}` }
      });
      setToast({ open: true, message: 'Supprimée', severity: 'success' });
      fetchAbsences();
      if (viewMode === 'details') setViewMode('list');
    } catch {
      setToast({ open: true, message: 'Erreur suppression', severity: 'error' });
    }
  };

  // Vue liste
  const renderListView = () => {
    const groupAbsences = selectedGroup
      ? absences.filter(a => a.studentId.some(id => students.some(s => s.id === id)))
      : [];

    // Group absences by student
    const studentAbsencesMap = new Map<string, Absence[]>();
    groupAbsences.forEach(absence => {
      absence.studentId.forEach(sid => {
        if (!studentAbsencesMap.has(sid)) {
          studentAbsencesMap.set(sid, []);
        }
        studentAbsencesMap.get(sid)!.push(absence);
      });
    });

    // Filter students by search term
    const filteredStudentAbsences = Array.from(studentAbsencesMap.entries()).filter(([studentId]) => {
      const student = stude.find(s => s.id === studentId);
      return student?.Name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Gestion des Absences</Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setOpenStudentListModal(true)}
            >
              Liste des élèves
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                if (!selectedGroup) {
                  setToast({ open: true, message: 'Veuillez d\'abord sélectionner un groupe', severity: 'warning' });
                } else if (selectedStudents.length === 0) {
                  setToast({ open: true, message: 'Veuillez sélectionner au moins un élève', severity: 'warning' });
                } else {
                  setOpenModal(true);
                }
              }}
            >
              Ajouter une absence
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
          <FormControl fullWidth required>
            <InputLabel>Sélectionner un groupe *</InputLabel>
            <Select
              value={selectedGroup}
              label="Sélectionner un groupe *"
              onChange={e => {
                setSelectedGroup(e.target.value);
                setSelectedStudents([]);
              }}
            >
              {filteredGroups.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Absences par élève */}
        {selectedGroup && (
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Absences - {groupe.find(g => g.id === selectedGroup)?.name}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Élève</TableCell>
                    <TableCell align="center">Nombre d'absences</TableCell>
                    <TableCell align="center">Dernière absence</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudentAbsences.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">
                      {searchTerm ? 'Aucun élève trouvé' : 'Aucune absence'}
                    </TableCell></TableRow>
                  ) : (
                    filteredStudentAbsences.map(([studentId, studentAbsences]) => {
                      const student = stude.find(s => s.id === studentId);
                      const lastAbsence = studentAbsences.sort((a, b) => 
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                      )[0];
                      
                      return (
                        <TableRow key={studentId}>
                          <TableCell>{student?.Name || 'Élève inconnu'}</TableCell>
                          <TableCell align="center">
                            <Chip label={studentAbsences.length} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            {lastAbsence?.date ? new Date(lastAbsence.date).toLocaleDateString('fr-FR') : '-'}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => {
                                // Show all absences for this student
                                setSelectedAbsence(lastAbsence);
                                setViewMode('details');
                              }}
                            >
                              Voir détails ({studentAbsences.length})
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Liste étudiants - Hidden, will use modal instead */}
        <Box id="student-list-section" sx={{ display: 'none' }}>
          <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length}
                    onChange={() => {
                      if (selectedStudents.length === filteredStudents.length) {
                        setSelectedStudents([]);
                      } else {
                        setSelectedStudents(filteredStudents.map(s => s.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Dernière absence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => {
                const last = absences
                  .filter(a => a.studentId.includes(s.id))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                return (
                  <TableRow key={s.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => {
                          setSelectedStudents(prev =>
                            prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{s.Name}</TableCell>
                    <TableCell>{last ? new Date(last.date).toLocaleDateString('fr-FR') : 'Aucune'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            labelRowsPerPage="Lignes par page :"
          />
        </TableContainer>
        </Box>
      </>
    );
  };

  // Vue détails
  const renderDetailsView = () => {
    if (!selectedAbsence) return null;
    const studentsList = stude.filter(s => selectedAbsence.studentId.includes(s.id));
    
    // Get all absences for this student
    const studentId = selectedAbsence.studentId[0];
    const allStudentAbsences = absences.filter(a => a.studentId.includes(studentId));

    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => setViewMode('list')} sx={{ mb: 2 }}>
          Retour à la liste
        </Button>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Historique des absences - {studentsList[0]?.Name || 'Élève inconnu'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total: {allStudentAbsences.length} absence(s)
          </Typography>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Motif</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allStudentAbsences.map(absence => (
                <TableRow key={absence.id}>
                  <TableCell>
                    {absence.date ? new Date(absence.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </TableCell>
                  <TableCell>{absence.reason || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => openEditModal(absence)} title="Modifier">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteAbsence(absence.id)} title="Supprimer">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box p={3}>
      {viewMode === 'list' ? renderListView() : renderDetailsView()}

      {/* Modal */}
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">{editingAbsence ? 'Modifier' : 'Nouvelle'} absence</Typography>
            <IconButton onClick={closeModal}><CloseIcon /></IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Étudiants</InputLabel>
            <Select
              multiple
              value={selectedStudents}
              label="Étudiants"
              onChange={e => setSelectedStudents(e.target.value as string[])}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(id => (
                    <Chip key={id} label={stude.find(s => s.id === id)?.Name || id} />
                  ))}
                </Box>
              )}
            >
              {students.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox checked={selectedStudents.includes(s.id)} />
                  {s.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth label="Date" type="date" value={date} onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }} sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Motif (optionnel)" multiline rows={3} value={reason} onChange={e => setReason(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={closeModal}>Annuler</Button>
            <Button variant="contained" onClick={handleSaveAbsence}>Enregistrer</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Modal Liste des élèves */}
      <Modal open={openStudentListModal} onClose={() => setOpenStudentListModal(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, maxHeight: '90vh', overflow: 'auto'
        }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">Liste des élèves par groupe</Typography>
            <IconButton onClick={() => setOpenStudentListModal(false)}><CloseIcon /></IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sélectionner un groupe</InputLabel>
            <Select
              value={tempSelectedGroup}
              label="Sélectionner un groupe"
              onChange={e => setTempSelectedGroup(e.target.value)}
            >
              {groupe.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {tempSelectedGroup && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedStudents.length === 
                          stude.filter(s => groupe.find(g => g.id === tempSelectedGroup)?.Studentid.includes(s.id)).length &&
                          stude.filter(s => groupe.find(g => g.id === tempSelectedGroup)?.Studentid.includes(s.id)).length > 0
                        }
                        onChange={() => {
                          const groupStudents = stude.filter(s => 
                            groupe.find(g => g.id === tempSelectedGroup)?.Studentid.includes(s.id)
                          );
                          if (selectedStudents.length === groupStudents.length) {
                            setSelectedStudents([]);
                          } else {
                            setSelectedStudents(groupStudents.map(s => s.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Dernière absence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stude
                    .filter(s => groupe.find(g => g.id === tempSelectedGroup)?.Studentid.includes(s.id))
                    .map(s => {
                      const last = absences
                        .filter(a => a.studentId.includes(s.id))
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                      return (
                        <TableRow key={s.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedStudents.includes(s.id)}
                              onChange={() => {
                                setSelectedStudents(prev =>
                                  prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>{s.Name}</TableCell>
                          <TableCell>{last ? new Date(last.date).toLocaleDateString('fr-FR') : 'Aucune'}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button onClick={() => setOpenStudentListModal(false)}>Fermer</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                if (tempSelectedGroup) {
                  setSelectedGroup(tempSelectedGroup);
                }
                setOpenStudentListModal(false);
              }}
              disabled={!tempSelectedGroup}
            >
              Confirmer ({selectedStudents.length} sélectionné(s))
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Abcenses;