import React, { useRef, useState } from 'react';
import Styles from '../Styles/Etudiantes.module.css';
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
  TableContainer,
  Paper,
  Modal,
  Select,
  OutlinedInput,
  MenuItem,
  Snackbar,
  Alert,
  type SelectChangeEvent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  TablePagination,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { CalendarToday, Class, DateRange, Diversity3, Person, Phone, School, Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export function Etudiantes() {
  const [modules, setModules] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showModal, setShowModal] = useState(false);
  const [showModalup, setShowModalup] = useState<string | null>(null);
  const [idASupprimer, setIdsupprimer] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" })
  const [Nivuea, setniveau] = useState<any>("")
  const [Spécialité, setspecialite] = useState<any>("")
  const [Groupe, setGroupe] = useState<string[]>([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handlnivuea = (event: SelectChangeEvent) => {
    const { value } = event.target
    setniveau(value)
  }
  const handlspecialite = (event: SelectChangeEvent) => {
    const { value } = event.target
    setspecialite(value)
  }
  const hadnlGroups = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setGroupe(typeof (value) === "string" ? value.split(',') : value)
  }
  const handleChangeModules = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setModules(typeof (value) === 'string' ? value.split(',') : value)
  };
  const { mat, tocken, getStudentes, stude, seracheStud, groupe, getgroupes } = usAuth();
  const { t } = useLanguage();
  const name = useRef<HTMLInputElement>(null)
  const age = useRef<HTMLInputElement>(null)
  const phone = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)
  const [Genre, setgenre] = useState<any>("")
  const handleGenre = (event: SelectChangeEvent) => {
    const { value } = event.target
    setgenre(value)
  }
  const add = async (event: React.FormEvent) => {
    event.preventDefault()
    const Name = name.current?.value
    const Age = age.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
    
    // Vérification: empêcher les noms dupliqués
    const nameExists = stude.some((student: any) => 
      student.Name?.toLowerCase().trim() === Name?.toLowerCase().trim()
    );
    
    if (nameExists) {
      setToast({ open: true, msg: "Un élève avec ce nom existe déjà!", type: "error" });
      return;
    }
    
    const RegisterStud = await fetch("http://localhost:3000/Student", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Name, Age, Nivuea, Telephone, Date, modules, Genre, Spécialité, Groupe })
    })
    if (!RegisterStud.ok) {
      setToast({ open: true, msg: "Échec de l'ajout", type: "error" })
      return
    }
    const reponse = await RegisterStud.json()
    console.log("hada data ji more Add eleve", reponse.data)
    setToast({ open: true, msg: "Élève ajouté avec succès", type: "success" })
    name.current!.value = "",
      age.current!.value = "",
      phone.current!.value = "",
      date.current!.value = ""
    setModules([])
    setShowModal(false)
    setspecialite("")
    setniveau("")
    setGroupe([])
    getStudentes()
    getgroupes()
  }
  const getOneStud = async (id: string) => {
    let GetOne = await fetch(`http://localhost:3000/Student/${id}`, {
      headers: { "Authorization": `Bearer ${tocken}` }
    })
    if (!GetOne.ok) {
      setToast({ open: true, msg: "Échec de récupération", type: "error" })
      return
    }
    const response = await GetOne.json()
    name.current!.value = response.data.Name
    age.current!.value = response.data.Age
    phone.current!.value = response.data.Telephone
    date.current!.value = new Date(response.data.Date).toISOString().split('T')[0]
    // in sqlite, modules and Groupe are arrays of ids
    setModules(response.data.modules || [])
    setgenre(response.data.Genre)
    setniveau(response.data.Nivuea)
    setspecialite(response.data.Spécialité)
    setGroupe(response.data.Groupe || [])
  }
  const DeleteStud = async () => {
    const remove = await fetch(`http://localhost:3000/Student/${idASupprimer}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      }
    })
    const response = await remove.json()
    if (response.StatusCode != 200) {
      setToast({ open: true, msg: "Suppression échouée", type: "error" })
      return
    }
    setToast({ open: true, msg: "Élève supprimé", type: "success" })
    getStudentes()
    setIdsupprimer(null)
    getgroupes()
  }
  const updatOne = async (e: React.FormEvent) => {
    e.preventDefault()
    const Name = name.current?.value
    const Age = age.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
    
    // Vérification: empêcher les noms dupliqués (sauf pour l'élève actuel)
    const nameExists = stude.some((student: any) => 
      student.id !== showModalup && // Ignorer l'élève en cours de modification
      student.Name?.toLowerCase().trim() === Name?.toLowerCase().trim()
    );
    
    if (nameExists) {
      setToast({ open: true, msg: "Un élève avec ce nom existe déjà!", type: "error" });
      return;
    }
    
    if (modules.length == 0) {
      setToast({ open: true, msg: "Aucun module sélectionné", type: "error" })
      return
    }
    const Update = await fetch(`http://localhost:3000/Student/${showModalup}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      },
      body: JSON.stringify({ Name, Age, Nivuea, Telephone, Date, modules, Genre, Spécialité, Groupe })
    })
    if (!Update.ok) {
      setToast({ open: true, msg: "Échec de la mise à jour", type: "error" })
      return
    }
    setToast({ open: true, msg: "Élève modifié", type: "success" })
    getStudentes()
    setShowModalup(null)
    setModules([])
    getgroupes()
  }
  return (
    <Box className={Styles.page} p={3}>
      {/* Snackbar */}
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        {t('studentManagement')}
      </Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e: any) => seracheStud(e.target.value)}
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
          placeholder={`${t('search')} ${t('name')}, ${t('phone')}, ${t('specialty')}...`}
          sx={{
            width: 300,
            background: "#f9fafb",
            borderRadius: "10px"
          }}
        />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          sx={{ borderRadius: "10px", textTransform: "none" }}
        >
          {t('addStudent')}
        </Button>
      </Box>
      {stude.length == 0 ? <Typography variant="body1"
        align="center"
        color="textSecondary"
        style={{ marginTop: "29px" }}>{t('noData')}</Typography> :
        <Paper sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
          <Table className={Styles.table}>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow >
                <TableCell sx={{
                  width: "18%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('name')}</TableCell>
                <TableCell sx={{
                  width: "8%",
                  textAlign: "center",
                  fontWeight: "bold"
                }}>{t('age')}</TableCell>
                <TableCell sx={{
                  width: "12%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('level')}</TableCell>
                <TableCell sx={{
                  width: "12%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('specialty')}</TableCell>
                <TableCell sx={{
                  width: "13%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('phone')}</TableCell>
                <TableCell sx={{
                  width: "12%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('modules')}</TableCell>
                <TableCell sx={{
                  width: "10%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold"
                }}>{t('date')}</TableCell>
                <TableCell sx={{
                  width: "8%",
                  textAlign: "center",
                  fontWeight: "bold"
                }}>{t('gender')}</TableCell>
                <TableCell sx={{
                  width: "17%",
                  textAlign: "center",
                  fontWeight: "bold"
                }}>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {(stude ?? [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any) => (
                <TableRow key={(item as any).id} hover>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis",
                    fontWeight: "500"
                  }}>{item.Name}</TableCell>
                  <TableCell sx={{ 
                    textAlign: "center"
                  }}>{item.Age}</TableCell>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis"
                  }}>{item.Nivuea}</TableCell>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis"
                  }}>{item.Spécialité ?? "rien"}</TableCell>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis"
                  }}>{item.Telephone}</TableCell>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis"
                  }}>{(item.modules || []).map((mid: string) => (mat.find((mm:any)=> mm.id === mid)?.name) || "").filter(Boolean).join(",")}</TableCell>
                  <TableCell sx={{ 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis"
                  }}>{(item.Date || "").split("T")[0]}</TableCell>
                  <TableCell sx={{ 
                    textAlign: "center"
                  }}>{item.Genre}</TableCell>
                  <TableCell sx={{ 
                    textAlign: "center"
                  }}>
                    <Box display="flex" gap={0.3} justifyContent="center" flexDirection="column">
                      <Button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModalup((item as any).id); getOneStud((item as any).id) }} 
                        startIcon={<Update />} 
                        size="small" 
                        variant="outlined"
                        sx={{ minWidth: "auto", px: 0.5, fontSize: "0.7rem" }}
                      >
                        {t('edit')}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdsupprimer((item as any).id) }} 
                        startIcon={<DeleteIcon />} 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        sx={{ minWidth: "auto", px: 0.5, fontSize: "0.7rem" }}
                      >
                        {t('delete')}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedStudent(item) }} 
                        startIcon={<VisibilityIcon />} 
                        size="small" 
                        variant="outlined"
                        sx={{ minWidth: "auto", px: 0.5, fontSize: "0.7rem" }}
                      >
                        {t('view')}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={stude?.length || 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage={`${t('rowsPerPage')}:`}
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} ${t('of')} ${count !== -1 ? count : `${t('moreThan')} ${to}`}`
            }
          />
        </Paper>}
      {/* === Modals === */}
      {/* Voir */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box className={Styles.modalOverlay}>
          <Box
            className={Styles.modalContent}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              p: 3,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              mb={3}
              sx={{ color: "#111827", textAlign: "center", fontFamily: "'Inter', sans-serif" }}
            >
              Détails de {selectedStudent?.Name}
            </Typography>
            {selectedStudent && (
              <Card
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "#f9fafb",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Nom
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Âge
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Age}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <School sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Niveau
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Nivuea}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Class sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Spécialité
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Spécialité}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Class sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Groups
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {(selectedStudent.Groupe || [])
                            .map((gid: string) => {
                              const groupName = (groupe.find((gg:any)=> gg.id === gid)?.name) || "";
                              // إزالة النص الإضافي من اسم المجموعة
                              return groupName.split(' – ')[0] || groupName;
                            })
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Diversity3 sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Genre
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Genre}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Téléphone
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {selectedStudent.Telephone}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DateRange sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {(selectedStudent.Date || "").split("T")[0]}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Class sx={{ color: "#6b7280", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="#6b7280">
                          Modules
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="#111827">
                          {(selectedStudent.modules || [])
                            .map((mid: string) => (mat.find((m:any)=> m.id === mid)?.name) || "")
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
            <Box mt={3} textAlign="center">
              <Button
                variant="outlined"
                onClick={() => setSelectedStudent(null)}
                sx={{
                  borderRadius: "8px",
                  borderColor: "#6b7280",
                  color: "#111827",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "500",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#111827",
                    backgroundColor: "#f3f4f6",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Fermer
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* AddStudents */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent1} >
            <Typography variant="h6" fontWeight="bold" mb={2}>{t('addStudent')}</Typography>
            <form onSubmit={add} className={Styles.form}>
              <TextField inputRef={name} label={t('studentName')} required fullWidth margin="normal" />
              <TextField inputRef={age} label={t('age')} type="number" required fullWidth margin="normal" />
              <Typography>{t('specialty')}</Typography>
              <Select onChange={handlspecialite} value={Spécialité} >
                <MenuItem value={"Fileua"}>Philo</MenuItem>
                <MenuItem value={"Scientifique"}>Scientifique</MenuItem>
                <MenuItem value={"Matechnique"}>Matechnique</MenuItem>
                <MenuItem value={"Mathématiques"}>Mathématiques</MenuItem>
                <MenuItem value={"Langues"}>Langues</MenuItem>
                <MenuItem value={"Gestion & économie"}>Gestion & économie</MenuItem>
              </Select>
              <Typography >Groupe</Typography>
              <Select multiple value={Groupe} onChange={hadnlGroups} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                {groupe.map((item) => (
                  <MenuItem key={(item as any).id} value={(item as any).id}>{item.name}</MenuItem>
                ))}
              </Select>
              <Typography>Niveau</Typography>
              <Select onChange={handlnivuea} value={Nivuea}>
                <MenuItem value={"Première moyenne"}>Première moyenne</MenuItem>
                <MenuItem value={"Seconde moyenne"}>Seconde moyenne</MenuItem>
                <MenuItem value={"Troisième moyenne"}>Troisième moyenne</MenuItem>
                <MenuItem value={"quatrième moyenne"}>quatrième moyenne</MenuItem>
                <MenuItem value={"Première secondaire"}>Première secondaire</MenuItem>
                <MenuItem value={"Seconde secondaire"}>Seconde secondaire</MenuItem>
                <MenuItem value={"Terminale"}>Terminale</MenuItem>
              </Select>
              <TextField inputRef={phone} label="Téléphone" required fullWidth margin="normal" />
              <Typography variant="subtitle1">Modules :</Typography>
              <Select multiple value={modules} onChange={handleChangeModules} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                {(mat ?? []).map((item:any) => (
                  <MenuItem key={item.id} value={item.id} >{item.name} de {item.Niveau}</MenuItem>
                ))}
              </Select>
              <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={handleGenre}
              >
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
              </RadioGroup>
              <Typography variant="subtitle1">Date :</Typography>
              <TextField type="date" inputRef={date} required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">{t('save')}</Button>
                <Button variant="outlined" onClick={() => setShowModal(false)}>{t('cancel')}</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      {/* Modifier */}
      <Modal open={!!showModalup} onClose={() => setShowModalup(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent1} >
            <Typography variant="h6" fontWeight="bold" mb={2}>{t('editStudent')}</Typography>
            <form onSubmit={updatOne} className={Styles.form}>
              <TextField inputRef={name} required fullWidth margin="normal" />
              <TextField inputRef={age} type="number" required fullWidth margin="normal" />
              <Typography>{t('level')}</Typography>
              <Select onChange={handlnivuea} value={Nivuea} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                <MenuItem value={"Première moyenne"}>Première moyenne</MenuItem>
                <MenuItem value={"Seconde moyenne"}>Seconde moyenne</MenuItem>
                <MenuItem value={"Troisième moyenne"}>Troisième moyenne</MenuItem>
                <MenuItem value={"quatrième moyenne"}>quatrième moyenne</MenuItem>
                <MenuItem value={"Première secondaire"}>Première secondaire</MenuItem>
                <MenuItem value={"Seconde secondaire"}>Seconde secondaire</MenuItem>
                <MenuItem value={"Terminale"}>Terminale</MenuItem>
              </Select>
              <Typography>Spécialité</Typography>
              <Select onChange={handlspecialite} value={Spécialité} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                <MenuItem value={"Fileua"}>Philo</MenuItem>
                <MenuItem value={"Scientifique"}>Scientifique</MenuItem>
                <MenuItem value={"Matechnique"}>Matechnique</MenuItem>
                <MenuItem value={"Mathématiques"}>Mathématiques</MenuItem>
                <MenuItem value={"Langues"}>Langues</MenuItem>
                <MenuItem value={"Gestion & économie"}>Gestion & économie</MenuItem>
              </Select>
              <Typography >Groupe</Typography>
              <Select multiple onChange={hadnlGroups} value={Groupe} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                {groupe.map((item) => (
                  <MenuItem key={(item as any).id} value={(item as any).id}>{item.name}</MenuItem>
                ))}
              </Select>
              <TextField inputRef={phone} required fullWidth margin="normal" />
              <Typography variant="subtitle1">Modules :</Typography>
              <Select multiple value={modules} onChange={handleChangeModules} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                {(mat ?? []).map((item:any) => (
                  <MenuItem key={item.id} value={item.id}>{item.name} de {item.Niveau}</MenuItem>
                ))}
              </Select>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                onChange={handleGenre}
                value={Genre}
              >
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
              </RadioGroup>
              <Typography variant="subtitle1">Date :</Typography>
              <TextField type="date" inputRef={date} required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">{t('edit')}</Button>
                <Button variant="outlined" onClick={() => { setShowModalup(null), setModules([]), setspecialite(""), setniveau("") }}>{t('cancel')}</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      {/* Supprimer */}
      <Modal open={idASupprimer !== null} onClose={() => setIdsupprimer(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "400px", borderRadius: "16px", textAlign: "center" }}>
            <Typography variant="h6" mb={2}>{t('confirmDelete')}</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button onClick={() => DeleteStud()} variant="contained" color="error">{t('yes')}</Button>
              <Button onClick={() => setIdsupprimer(null)} variant="outlined">{t('no')}</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
