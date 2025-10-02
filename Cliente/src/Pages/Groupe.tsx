import React, { useEffect, useRef, useState, } from 'react';
import Styles from '../Styles/Groupe.module.css';
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
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usAuth } from '../Context/AuthContext';
export function Groupe() {
  const [idgroupe, setidgroupe] = useState<any>(null)
  const { groupe, tocken } = usAuth()
  const [Groupe, setGroupe] = useState<any[]>(groupe)
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" })
  useEffect(() => {
    setGroupe(groupe)
  }, [groupe])
  const Name = useRef<HTMLInputElement>(null)
  const nbr = useRef<HTMLInputElement>(null)
  const Friase = useRef<HTMLInputElement>(null)
  const addnewGroupe = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = Name.current?.value
    const nbrmax = nbr.current?.value
    const fraise = Friase.current?.value
    console.log("avante", name, nbrmax, fraise)
    if (!name || !nbrmax || !fraise) {
      setToast({ open: true, msg: "saisr tous informations", type: "error" })

      return
    }
    const newGroupe = await fetch("http://localhost:3000/Groupes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, nbrmax, fraise }),
    })
    const response = await newGroupe.json()
    if (response.StatusCode != 200) {
      setToast({ open: true, msg: `${response.data}`, type: "error" })
      setShowModal(false)
      return
    }
    setGroupe((prev) => [...prev, response.data])
    Name.current!.value = ""
    nbr.current!.value = ""
    Friase.current!.value = ""
    setShowModal(false)
    setToast({ open: true, msg: "new Groupe succed", type: "success" })

  }
  const getOnegroupe = async (ID: any) => {
    const Fetchgroupe = await fetch(`http://localhost:3000/Groupes/${ID}`, {
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": 'application/json'
      }
    })
    const response = await Fetchgroupe.json()
    Name.current!.value = response.data.name
    nbr.current!.value = response.data.Nbrmax
    Friase.current!.value = response.data.fraisscolaire
    //  setongroupe(response.data)
  }
  const updateOne = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = Name.current!.value
    const Nbrmax = nbr.current!.value
    const fraisscolaire = Friase.current!.value
    const update = await fetch(`http://localhost:3000/Groupes/${idgroupe}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      },
      body: JSON.stringify({ name, Nbrmax, fraisscolaire })
    })
    const reponse = await update.json()
    if (reponse.StatusCode !== 200) {
      setToast({ open: true, msg: `${reponse.data}`, type: "error" })

      return
    }
    setGroupe((prev) => prev.map((item) => item._id == idgroupe ? reponse.data : item))
    setidgroupe(null)
    setToast({ open: true, msg: "updating succed", type: "success" })
  }
  const Deleteongroupe = async () => {
    const Delete = await fetch(`http://localhost:3000/Groupes/${idASupprimer}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      }
    })
    const response = await Delete.json()
    if (response.StatusCode != 200) {
      setToast({ open: true, msg: `${response.data}`, type: "error" })
      return
    }
    setGroupe((preve) => preve.filter((item) => item._id !== response.data._id))
    setIdsupprimer(null)
    setToast({ open: true, msg: "delete succed", type: "success" })
  }
  const Searchgroupe = async (Text: string) => {
    const searchone = await fetch(`http://localhost:3000/SeatcheGroupe?name=${Text}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      }

    })
    const response = await searchone.json()
    setGroupe(response.data)
  }
  return (
    <Box className={Styles.page} p={3}>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des groupe
      </Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e) => Searchgroupe(e.target.value)}
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
          sx={{ borderRadius: "10px", textTransform: "none" }}
          onClick={() => setShowModal(true)}
        >
          Ajouter un groupe
        </Button>
      </Box>
      {
        Groupe.length == 0 ?
          <Typography variant="body1"
            align="center"
            color="textSecondary"
            style={{ marginTop: "29px" }}>Aucune donnée</Typography>
          :
          <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
            <Table className={Styles.table}>
              <TableHead sx={{ background: "#f1f5f9" }}>
                <TableRow >
                  <TableCell>Nom du groupe</TableCell>
                  <TableCell >Étudiants</TableCell>
                  <TableCell>Professeurs</TableCell>
                  <TableCell>NombrmaxEtudiantes</TableCell>
                  <TableCell>Frais de scolarité </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {Groupe.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{item.Nbrmax}</TableCell>
                    <TableCell>{item.fraisscolaire}.00DA</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button onClick={() => { setidgroupe(item._id), getOnegroupe(item._id) }} startIcon={<Update />} size="small" variant="outlined">Modifier</Button>
                        <Button onClick={() => setIdsupprimer(item._id)} startIcon={<DeleteIcon />} size="small" variant="outlined" color="error">Supprimer</Button>
                        <Button startIcon={<VisibilityIcon />} size="small" variant="outlined">Voir</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Paper>}
      {/*Modals addGroup*/}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter un groupe</Typography>
            <form onSubmit={addnewGroupe} className={Styles.form}>
              <TextField inputRef={Name} label="Nom du groupe" required fullWidth margin="normal" />
              <TextField inputRef={nbr} type='number' label="Nbr Max Eleves" required fullWidth margin="normal" />
              <TextField inputRef={Friase} type='number' label="Frais de scolarité" required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">Enregistrer</Button>
                <Button variant="outlined" onClick={() => setShowModal(false)}>Annuler</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      {/**Modals update */}
      <Modal open={!!idgroupe} onClose={() => setidgroupe(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>modifier un groupe</Typography>
            <form onSubmit={updateOne} className={Styles.form}>
              <TextField inputRef={Name} label="Nom du groupe" required fullWidth margin="normal" />
              <TextField inputRef={nbr} type='number' label="Nbr Max Eleves" required fullWidth margin="normal" />
              <TextField inputRef={Friase} type='number' label="Frais de scolarité" required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">modifier</Button>
                <Button variant="outlined" onClick={() => setidgroupe("")}>Annuler</Button>
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
              <Button onClick={() => Deleteongroupe()} variant="contained" color="error">Oui</Button>
              <Button onClick={() => setIdsupprimer(null)} variant="outlined">Non</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
