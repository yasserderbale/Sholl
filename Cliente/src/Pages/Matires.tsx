import React, { useRef, useState } from 'react';
import Styles from '../Styles/Matieres.module.css';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
  TextField,
} from '@mui/material';



export function Matires() {
 const matref = useRef<HTMLInputElement>(null)
 const prixref = useRef<HTMLInputElement>(null)

  const [showModal, setShowModal] = useState(false);
  const [idASupprimer, setIdASupprimer] = useState<number | null>(null);

  const addMat  =async (e:any)=>{
    e.preventDefault()
    const name = matref.current?.value
    const prix = prixref.current?.value
    const data = await fetch("http://localhost:3000/newMatire",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,prix})
    })
    const response = await data.json()
    if(response.StatusCode!==200) {
      alert(response.message)
       return } 
      alert("ajouter novue matiere")
    console.log(response)
  }

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Gestion des matières
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
        className={Styles.btnAjouter}
      >
        ➕ Ajouter une matière
      </Button>

      <Paper sx={{ mt: 3 }}>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prix mensuel (DA)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
          </TableBody>
        </Table>
      </Paper>

      {/* Modal Ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Ajouter une matière
            </Typography>
            <form onSubmit={addMat}  className={Styles.form}>
              <TextField
              ref={matref}
                label="Nom de la matière"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              ref={prixref}
                label="Prix mensuel"
                type="number"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button variant="contained" type="submit" className={Styles.Enregistrer}>
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={Styles.btnAnnuler}
                >
                  Annuler
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Modal Confirmation Supprimer */}
      <Modal open={idASupprimer !== null} onClose={() => setIdASupprimer(null)}>
        <Box className={Styles.modalOverlay1}>
          <Box className={Styles.modalContent1}>
            <Typography variant="h6">Êtes-vous sûr de vouloir supprimer ?</Typography>
            <Box className={Styles.modalActions1} display="flex" gap={2}>
              <Button
                variant="contained"
                color="error"
                className={Styles.btnConfirmer1}
              >
                Oui
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIdASupprimer(null)}
                className={Styles.btnAnnuler1}
              >
                Non
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
