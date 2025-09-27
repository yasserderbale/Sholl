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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usAuth } from '../Context/AuthContext';
import { Update } from '@mui/icons-material';
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
  const [showModalup, setShowModalup] = useState<number | null>(null);
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" })
  const [Nivuea, setniveau] = useState<any>("")
  const [Spécialité, setspecialite] = useState<any>("")
  const handlnivuea = (event: SelectChangeEvent) => {
    const { value } = event.target
    setniveau(value)
  }
  const handlspecialite = (event: SelectChangeEvent) => {
    const { value } = event.target
    setspecialite(value)
  }
  const { mat, tocken, getStudentes, stude, seracheStud, groupe } = usAuth()
  const name = useRef<HTMLInputElement>(null)
  const age = useRef<HTMLInputElement>(null)
  const phone = useRef<HTMLInputElement>(null)
  const date = useRef<HTMLInputElement>(null)
  const [Genre, setgenre] = useState<any>("")
  const handleGenre = (event: SelectChangeEvent) => {
    const { value } = event.target
    setgenre(value)
  }
  const handleChangeModules = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setModules(typeof (value) === 'string' ? value.split(',') : value)
  };
  const add = async (event: React.FormEvent) => {
    event.preventDefault()
    const Name = name.current?.value
    const Age = age.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
    const RegisterStud = await fetch("http://localhost:3000/Student", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Name, Age, Nivuea, Telephone, Date, modules, Genre, Spécialité })
    })
    if (!RegisterStud.ok) {
      setToast({ open: true, msg: "Échec de l'ajout", type: "error" })
      return
    }
    setToast({ open: true, msg: "Élève ajouté avec succès", type: "success" })
    name.current!.value = "",
      age.current!.value = "",
      phone.current!.value = "",
      date.current!.value = ""
    setModules([])
    setShowModal(false)
    setspecialite("")
    setniveau("")
    getStudentes()
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
    setModules(response.data.modules.map((nam: any) => nam.matid._id))
    setgenre(response.data.Genre)
    setniveau(response.data.Nivuea)
    setspecialite(response.data.Spécialité)
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
  }
  const updatOne = async (e: React.FormEvent) => {
    e.preventDefault()
    const Name = name.current?.value
    const Age = age.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
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
      body: JSON.stringify({ Name, Age, Nivuea, Telephone, Date, modules, Genre, Spécialité })
    })
    if (!Update.ok) {
      setToast({ open: true, msg: "Échec de la mise à jour", type: "error" })
      return
    }
    setToast({ open: true, msg: "Élève modifié", type: "success" })
    getStudentes()
    setShowModalup(null)
    setModules([])
  }
  return (
    <Box className={Styles.page} p={3}>
      {/* Snackbar */}
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des élèves
      </Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e: any) => seracheStud(e.target.value)}
          label="🔍 Rechercher par nom"
          variant="outlined"
          size="small"
          sx={{
            width: 250,
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
          Ajouter un élève
        </Button>
      </Box>
      {stude.length == 0 ? <Typography variant="body1"
        align="center"
        color="textSecondary"
        style={{ marginTop: "29px" }}>Aucune donnée</Typography> :
        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          <Table className={Styles.table}>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow >
                <TableCell>Nom</TableCell>
                <TableCell >Âge</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Niveau</TableCell>
                <TableCell>specialite</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Modules</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>genre</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {(stude ?? []).map((item: any) => (
                <TableRow key={item._id} hover>
                  <TableCell >{item.Name}</TableCell>
                  <TableCell >{item.Age}</TableCell>
                  <TableCell >{item.Nivuea}</TableCell>
                  <TableCell>{item.Spécialité ?? "rien"}</TableCell>
                  <TableCell>{item.Telephone}</TableCell>
                  <TableCell>{item.modules.map((m: any) => m.matid.name).join(",")}</TableCell>
                  <TableCell >{item.Date.split("T")[0]}</TableCell>
                  <TableCell>{item.Genre}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button onClick={() => { setShowModalup(item._id); getOneStud(item._id) }} startIcon={<Update />} size="small" variant="outlined">Modifier</Button>
                      <Button onClick={() => setIdsupprimer(item._id)} startIcon={<DeleteIcon />} size="small" variant="outlined" color="error">Supprimer</Button>
                      <Button onClick={() => setSelectedStudent(item)} startIcon={<VisibilityIcon />} size="small" variant="outlined">Voir</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>}

      {/* === Modals === */}

      {/* Voir */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "930px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Détails de {selectedStudent?.Name}
            </Typography>
            {selectedStudent && (
              <Table size="small">
                <TableHead >
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Âge</TableCell>
                    <TableCell>Niveau</TableCell>
                    <TableCell>specialite</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Modules</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedStudent.Name}</TableCell>
                    <TableCell>{selectedStudent.Age}</TableCell>
                    <TableCell>{selectedStudent.Nivuea}</TableCell>
                    <TableCell>{selectedStudent.Spécialité}</TableCell>
                    <TableCell>{selectedStudent.Genre}</TableCell>
                    <TableCell>{selectedStudent.Telephone}</TableCell>
                    <TableCell>{selectedStudent.Date.split("T")[0]}</TableCell>
                    <TableCell>{selectedStudent.modules.map((n: any) => n.matid.name).join(",")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            <Box mt={2} textAlign="right">
              <Button variant="outlined" onClick={() => setSelectedStudent(null)}>Fermer</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* Ajouter */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "900px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter un élève</Typography>
            <form onSubmit={add} className={Styles.form}>
              <TextField inputRef={name} label="Nom complet" required fullWidth margin="normal" />
              <TextField inputRef={age} label="Âge" type="number" required fullWidth margin="normal" />
              <Typography>Spécialité</Typography>
              <Select onChange={handlspecialite} value={Spécialité}>
                <MenuItem value={"Fileua"}>Philo</MenuItem>
                <MenuItem value={"Scientifique"}>Scientifique</MenuItem>
                <MenuItem value={"Matechnique"}>Matechnique</MenuItem>
                <MenuItem value={"Mathématiques"}>Mathématiques</MenuItem>
                <MenuItem value={"Langues"}>Langues</MenuItem>
                <MenuItem value={"Gestion & économie"}>Gestion & économie</MenuItem>
              </Select>
              <Typography>Groupe</Typography>
              <Select>
                {groupe.map((item) => (
                  <MenuItem>{item.name}</MenuItem>
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
                {(mat ?? []).map((item) => (
                  <MenuItem key={item._id} value={item._id} >{item.name} de {item.Niveau}</MenuItem>
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
                <Button variant="contained" type="submit">Enregistrer</Button>
                <Button variant="outlined" onClick={() => setShowModal(false)}>Annuler</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Modifier */}
      <Modal open={!!showModalup} onClose={() => setShowModalup(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "900px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Modifier un élève</Typography>
            <form onSubmit={updatOne} className={Styles.form}>
              <TextField inputRef={name} required fullWidth margin="normal" />
              <TextField inputRef={age} type="number" required fullWidth margin="normal" />
              <Typography>Niveau</Typography>
              <Select value={Nivuea} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                <MenuItem value={"Première moyenne"}>Première moyenne</MenuItem>
                <MenuItem value={"Seconde moyenne"}>Seconde moyenne</MenuItem>
                <MenuItem value={"Troisième moyenne"}>Troisième moyenne</MenuItem>
                <MenuItem value={"quatrième moyenne"}>quatrième moyenne</MenuItem>
                <MenuItem value={"Première secondaire"}>Première secondaire</MenuItem>
                <MenuItem value={"Seconde secondaire"}>Seconde secondaire</MenuItem>
                <MenuItem value={"Terminale"}>Terminale</MenuItem>
              </Select>
              <Typography>Spécialité</Typography>
              <Select value={Spécialité} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                <MenuItem value={"Fileua"}>Philo</MenuItem>
                <MenuItem value={"Scientifique"}>Scientifique</MenuItem>
                <MenuItem value={"Matechnique"}>Matechnique</MenuItem>
                <MenuItem value={"Mathématiques"}>Mathématiques</MenuItem>
                <MenuItem value={"Langues"}>Langues</MenuItem>
                <MenuItem value={"Gestion & économie"}>Gestion & économie</MenuItem>
              </Select>
              <TextField inputRef={phone} required fullWidth margin="normal" />
              <Typography variant="subtitle1">Modules :</Typography>
              <Select multiple value={modules} onChange={handleChangeModules} input={<OutlinedInput />} MenuProps={MenuProps} fullWidth>
                {(mat ?? []).map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name} de {item.Niveau}</MenuItem>
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
                <Button variant="contained" type="submit">Modifier</Button>
                <Button variant="outlined" onClick={() => { setShowModalup(null), setModules([]) }}>Annuler</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Supprimer */}
      <Modal open={idASupprimer !== null} onClose={() => setIdsupprimer(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "400px", borderRadius: "16px", textAlign: "center" }}>
            <Typography variant="h6" mb={2}>Êtes-vous sûr ?</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button onClick={() => DeleteStud()} variant="contained" color="error">Oui</Button>
              <Button onClick={() => setIdsupprimer(null)} variant="outlined">Non</Button>
            </Box>
          </Box>
        </Box>
      </Modal>


    </Box>
  );
}
