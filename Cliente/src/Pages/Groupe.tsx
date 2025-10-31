import React, { useEffect, useRef, useState, } from 'react';
import Styles from '../Styles/Groupe.module.css';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  Snackbar,
  Alert,
  TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usAuth } from '../Context/AuthContext';
import { Button, Stack } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export function Groupe() {
  const [idgroupe, setidgroupe] = useState<any>(null)
  const [idliste, setidlist] = useState<any>(null)
  const { groupe, tocken, setgroupe, stude } = usAuth()
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [liste, setliste] = useState<String[] | null>(null)
  const [namgroupe, setnamegroupe] = useState("")
  const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" })
  useEffect(() => {
    setgroupe(groupe)
  }, [groupe])
  const Name = useRef<HTMLInputElement>(null)
  const nbr = useRef<HTMLInputElement>(null)
  const Friase = useRef<HTMLInputElement>(null)
  const addnewGroupe = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = Name.current?.value
    const nbrmax = nbr.current?.value
    const fraise = Friase.current?.value
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
    setgroupe((prev) => [...prev, response.data])
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
    if (!response) {
      return
    }
    setnamegroupe(response.data.name)
    if (Name.current) Name.current.value = response.data.name
    if (nbr.current) nbr.current.value = response.data.Nbrmax
    if (Friase.current) Friase.current.value = response.data.fraisscolaire
    // Studentid is array of student IDs in SQLite; map to names from context 'stude'
    setliste(
      (response.data.Studentid || [])
        .map((sid: string) => (stude || []).find((s: any) => (s as any).id === sid)?.Name || null)
        .filter(Boolean)
    )
    console.log(response.data)

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
    setgroupe((prev) => prev.map((item) => item.id == idgroupe ? reponse.data : item))
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
    setgroupe((preve) => preve.filter((item) => item.id !== idASupprimer))
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
    setgroupe(response.data)
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(liste.map((student, i) => ({
      "#": i + 1,
      "Nom": student
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Etudiants");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Liste_Etudiants_${namgroupe}.xlsx`);
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Liste des Étudiants ${namgroupe}`, 14, 15);
    const tableData = liste.map((student, i) => [i + 1, student]);
    autoTable(doc, {
      head: [["#", "Nom de l'étudiant"]],
      body: tableData,
      startY: 25,
    });

    doc.save(`Liste_Etudiants_${namgroupe}.pdf`);
  };
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
        groupe.length == 0 ?
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
                {groupe.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.Studentid.length}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{item.Nbrmax}</TableCell>
                    <TableCell>{item.fraisscolaire}.00DA</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button onClick={() => { setidgroupe(item.id), getOnegroupe(item.id) }} startIcon={<Update />} size="small" variant="outlined">Modifier</Button>
                        <Button onClick={() => setIdsupprimer(item.id)} startIcon={<DeleteIcon />} size="small" variant="outlined" color="error">Supprimer</Button>
                        <Button onClick={() => { setidlist(item.id), getOnegroupe(item.id) }} startIcon={<VisibilityIcon />} size="small" variant="outlined">Voir</Button>
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
      {/* See List studnts */}
      <Modal
        open={!!idliste}
        onClose={() => setidlist(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 700,
            maxHeight: 450,
            overflowY: "auto",
            borderRadius: 3,
            boxShadow: 8,
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Liste des étudiants
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FileDownload />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Stack>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Nom de l'étudiant
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {liste && liste.length > 0 ? (
                liste.map((student: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#e8f0fe" },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Aucun étudiant trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </Box>
  );
}
