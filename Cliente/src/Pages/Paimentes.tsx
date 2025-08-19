import  {  useState } from 'react';
import Styles from '../Styles/Paimentes.module.css';
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
  MenuItem,
  OutlinedInput,
  type SelectChangeEvent,
  
} from '@mui/material';
import { usAuth } from '../Context/AuthContext';
export function Paimentes() {
  const [showModal, setShowModal] = useState(false);
  const {stude} = usAuth()
const Mois = ['janvier','fevrier','marse','avrile','mey','joine','juillet','aute','september','october','november','december']
const [modlesStud,setmodlesStud]=useState({})
  let modelsSelect = (modlesStud.modules?.map((name:any)=>name.matid))
  console.log(modelsSelect)
const [mois,setmois]=useState<any>([])
const [montante,setmontante]=useState(0)
const hadnlMois =(e:SelectChangeEvent<any[]>)=>{
 const {value} = e.target 
 setmois(value)
}
const [models,setmodles] = useState<any[]>([])
const handlModels = (e:SelectChangeEvent<any>)=>{
   const {value} = e.target 
   setmodles(typeof(value)==="string"? value.split(","):value)
}
let somme=models.reduce((curr,next)=>{
    return (curr+next.prix)
  },0)  
  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Gestion des paiements
      </Typography>
      <Box className={Styles.actions} display="flex" gap={2} mb={2}>
        <TextField
          label="Rechercher par élève"
          variant="outlined"
          size="small"
          className={Styles.input}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={Styles.btnAjouter}
        >
          ➕ Ajouter Paiement
        </Button>
      </Box>

      <Paper>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Élève</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Mois</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Méthode</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </Paper>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} >
            <Typography variant="h6" className={Styles.titre}>
              Ajouter Paiement
            </Typography>
           <form className={Styles.form}>
  {/* Eleve */}
  <Typography>Élève</Typography>
  <Select
  onChange={(e:any)=>setmodlesStud(e.target.value)}
    label="Nom élève"
    input={<OutlinedInput id="select-single"  />}
    required
  >
    {stude.map((name: any) => (
      <MenuItem key={name._id} value={name}>
        {name.Name}
      </MenuItem>
    ))}
  </Select>

  {/* Modules + Prix */}
  <Typography>Modules</Typography>
  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
    <Select
      onChange={handlModels}
      value={models}
      multiple
      sx={{ flex: 1 }}
      input={<OutlinedInput id="select-multiple-chip" />}
    >
      {modelsSelect?.map((name:any) => (
          <MenuItem key={name._id} value={name}>{name.name}</MenuItem>
      ))}
    </Select>

    {/* Prix total */}
    <Box
      sx={{
        minWidth: "180px",
        p: 1.5,
        borderRadius: "8px",
        bgcolor: "#f0fdf4",
        border: "1px solid #22c55e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ color: "#16a34a", fontWeight: "bold" }}>
        💰  {(somme*mois?.length || somme*1)-montante} DA
      </Typography>
    </Box>
  </Box>

  {/* Mois */}
  <Typography>Mois</Typography>
  <Select
    onChange={hadnlMois}
    value={mois}
    multiple
    input={<OutlinedInput id="select-multiple-chip" />}
  >
    {Mois.map((mois) => (
      <MenuItem sx={{ height: "29px" }} key={mois} value={mois}>
        {mois}
      </MenuItem>
    ))}
  </Select>

  {/* Montant */}
  <TextField
    label="Montant"
    type="number"
    onChange={(e:any)=>setmontante(e.target.value)}
    className={Styles.input}
    required
    fullWidth
    margin="normal"
  />

  {/* Date */}
  <TextField
    label="Date de paiement"
    type="date"
    className={Styles.input}
    required
    fullWidth
    margin="normal"
    InputLabelProps={{
      shrink: true,
    }}
  />

  {/* Buttons */}
  <Box className={Styles.modalActions} display="flex" gap={2}>
    <Button
      variant="contained"
      type="submit"
      className={Styles.btnConfirmer}
    >
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
    </Box>
  );
}
