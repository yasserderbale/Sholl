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
import { usAuth } from '../Context/AuthContext';
export function Matires() { 
 const matref = useRef<HTMLInputElement>(null)
 const prixref = useRef<HTMLInputElement>(null)
 const {addMat,mat,DelatewoneMat,getOneMat,updateone} = usAuth()
  const matrefup = useRef<HTMLInputElement>(null)
 const prixrefup = useRef<HTMLInputElement>(null)
  const [showModal, setShowModal] = useState(false);
    const [showModalup, setShowModalup] = useState(false);

  const [idASupprimer, setIdASupprimer] = useState(null);
    const [idup, setIdup] = useState(null);

 
  const hadndleAdd =(e:React.FormEvent)=>{  
    const name = matref.current?.value || ''
  const prix = Number(prixref.current?.value ) 
    e.preventDefault()
          if(!name || !prix) {alert("sasir tous les Champs dans Front")
          return}
    addMat(name,prix) 
     if(matref.current)matref.current.value=""
     if(prixref.current)prixref.current.value="" 
     setShowModal(false)
     
  }
  const hadnlDelet = ()=>{
    DelatewoneMat(idASupprimer)
    setIdASupprimer(null)
  }
  const hadndlgetOne = async(idmat:any)=>{
    setShowModalup(true)
     const date  =await getOneMat(idmat)  
     if(date){
      matrefup.current!.value=date.name
    prixrefup.current!.value=String(date.prix)
     }
       setIdup(idmat)
  
  }
  const handlupdatone = (e:any)=>{
    const name = matrefup.current?.value || ""
    const prix = prixrefup.current?.value || 
    e.preventDefault()
    updateone(idup,name,prix)
    setShowModalup(false)
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
    {mat.map((items)=>(
      <TableRow>
        <TableCell>{items.name}</TableCell>
                <TableCell>{items.prix}</TableCell>
                <TableCell><Button onClick={()=>hadndlgetOne(items._id)} startIcon={<UpdateIcon/>}>Modifier</Button>
                <Button onClick={()=>setIdASupprimer(items._id)} startIcon={<DeleteForeverIcon/>}>Supprimer</Button>
                 </TableCell>

      </TableRow>
    ))}
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
            <form onSubmit={hadndleAdd}  className={Styles.form}>
              <TextField
              inputRef={matref}
                label="Nom de la matière"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={prixref}
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
            {/* Modal Update */}

    <Modal open={showModalup} onClose={() => setShowModalup(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Modifier une matière
            </Typography>
            <form  onSubmit={handlupdatone} className={Styles.form}>
              <TextField
              inputRef={matrefup}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={prixrefup}
                type="number"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button  variant="contained" type="submit" className={Styles.Enregistrer}>
                  Modifier
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={()=>setShowModalup(false)}
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
      <Modal open={!!idASupprimer} onClose={() => setIdASupprimer(null)}>
        <Box className={Styles.modalOverlay1}>
          <Box className={Styles.modalContent1}>
            <Typography variant="h6">Êtes-vous sûr de vouloir supprimer ?</Typography>
            <Box className={Styles.modalActions1} display="flex" gap={2}>
              <Button
                variant="contained"
                color="error"
                className={Styles.btnConfirmer1}
                onClick={()=>hadnlDelet()}
              >
                Oui
              </Button>
              <Button
                variant="outlined"
                onClick={()=>setIdASupprimer(null)}
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
