import  React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
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
  Checkbox,
  FormControlLabel,
  Select,
  OutlinedInput,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usAuth } from '../Context/AuthContext';
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
 const handleChangeModules = (event: SelectChangeEvent<string[]>) => {
  const {value} = event.target
  setModules(typeof(value)==='string'? value.split(','):value)
 };
  const [showModal, setShowModal] = useState(false);
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const {mat,tocken,getStudentes,stude} = usAuth()
useEffect(()=>{
  getStudentes()
},[])
console.log(stude)
  const name = useRef<HTMLInputElement>(null)
  const age = useRef<HTMLInputElement>(null)
  const niveau=useRef<HTMLInputElement>(null)
  const phone = useRef<HTMLInputElement>(null)
  const date =useRef<HTMLInputElement>(null)
  const add = async (event:React.FormEvent)=>{
    event.preventDefault()
    const Name = name.current?.value
    const Age = age.current?.value
    const Nivuea = niveau.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
    const RegisterStud = await fetch("http://localhost:3000/Student",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${tocken}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({Name,Age,Nivuea,Telephone,Date,modules})

    })
    if(!RegisterStud.ok){alert("Failed Register")
      return
    }
    const response = await RegisterStud.json()
   // if(!response) {alert(response.data) 
     // return
   // }
    alert("New Student Regestraion")
    console.log(response)
    name.current!.value="",
    age.current!.value="",
    niveau.current!.value="",
    phone.current!.value="",
    name.current!.value="",
    date.current!.value=""
    setModules([])
    setShowModal(false)
    return
  }
  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des élèves
      </Typography>

      <Box className={Styles.actions} mb={2} display="flex" gap={2}>
        <TextField
          label="Rechercher par nom"
          variant="outlined"
          size="small"
          className={Styles.searche}
        />
        <Button
        startIcon={<AddIcon/>}
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={Styles.btnAjouter}
        >
        Ajouter un élève
        </Button>
      </Box>

      <Paper>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Âge</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Modules</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
          </TableBody>
        </Table>
      </Paper>

      {/* Modal ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Ajouter un élève
            </Typography>
            <form onSubmit={add} className={Styles.form}>
              <TextField
              inputRef={name}
                label="Nom complet"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                inputRef={age}
                label="Âge"
                type="number"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={niveau}
                label="Niveau"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={phone}
                label="Téléphone"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Typography variant="subtitle1">Modules :</Typography>
           <Select
   labelId="demo-multiple-chip-label"
   id="demo-multiple-chip"
     multiple 
     value={modules}
  onChange={handleChangeModules}
     input={<OutlinedInput id="select-multiple-chip" label="Modules" />}
  MenuProps={MenuProps}
>
  {mat.map((item) => (
    <MenuItem
      key={item._id}
      value={item.name} // تقدر تحط id إذا تحب
    >
      {item.name}
    </MenuItem>
  ))}
</Select>
              <Typography variant="subtitle1">Date d'inscription :</Typography>
              <TextField
                type="date"
               inputRef={date}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button  variant="contained" type="submit">
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
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

      {/* Modal suppression */}
      <Modal open={idASupprimer !== null} onClose={() => setIdsupprimer(null)}>
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
                onClick={() => setIdsupprimer(null)}
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
