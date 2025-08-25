import  React, {  useEffect, useRef, useState  } from 'react';
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
  TableContainer,
  
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { usAuth } from '../Context/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
export function Paimentes() {
const [showModal, setShowModal] = useState(false);
const {stude,tocken} = usAuth()
const Moise = ['janvier','fevrier','marse','avrile','mey','joine','juillet','aute','september','october','november','december']
const [modlesStud,setmodlesStud]=useState<any>({})
let modelsSelect = (modlesStud.modules?.map((name:any)=>name.matid))
const [Mois,setmois]=useState<any>([])
const [Montante,setmontante]=useState<any>("")  
const [prix,setprix]=useState<number>(0)
const [color,setcolor]= useState<any>("") 
const [getpaimentes,setgetpaimentes]=useState([])
const [modalPaimetes,setmodalPaimetes]=useState<any>(null)
const [onPaimentsget,setonPaimentsget]=useState<any>({})
const hadnlMois =(e:SelectChangeEvent<any[]>)=>{
 const {value} = e.target 
 setmois(value)
}
const [idMate,setmodles] = useState<any[]>([])
const handlModels = (e:SelectChangeEvent<any>)=>{
   const {value} = e.target 
   setmodles(typeof(value)==="string"? value.split(","):value)
}
let somme=idMate.reduce((curr,next)=>{
    return (curr+next.prix)
  },0)  
  useEffect(()=>{
      let prixe = Montante? Montante-(somme*Mois?.length || somme*1) : (somme*Mois?.length || somme*1)
     setprix(prixe)     
  },[Mois,idMate,Montante])
useEffect(() => {
  if (prix < 0) {
    setcolor({
      bg: "#fee2e2",  // Rouge clair
      border: "#dc2626", // Rouge foncé
      text: "#dc2626"
    });
  } else if (prix === 0) {
    setcolor({
      bg: "#fef9c3",  // Jaune clair
      border: "#facc15", // Jaune foncé
      text: "#f59e0b"
    });
  } else {
    setcolor({
      bg: "#dcfce7",  // Vert clair
      border: "#22c55e", // Vert foncé
      text: "#16a34a"
    });
  }
}, [prix]);
const date = useRef<any>(null)
{/* API d'ajout */}
const sendData = async(event:React.FormEvent)=>{
  event.preventDefault()
  const idMat = idMate.map((matieres)=>matieres._id)
  const idStud = modlesStud._id
  const Date = date.current?.value
const SendPaimente = await  fetch("http://localhost:3000/Paimentes",{
    "method":"POST",
    headers:{
      "Authorization": `Bearer ${tocken}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({idStud,idMat,Mois,Montante,Date})
})
  const response = await SendPaimente.json()
if(response.StatusCode!=200){
  alert(response.data)
  return
}
 alert("paiment Register succed")
 setShowModal(false)
 console.log(response.data)
 setmodlesStud({})
 setmodles([])
 setmois([])
 setprix(0)
 setmontante("")
 date.current!.value="" 
GetPaimentes()} 
{/* API GetAbcenses*/}
const GetPaimentes = async ()=>{
  const getpaim = await fetch("http://localhost:3000/Paimentes",{
    headers:{
      "Authorization":`Bearer ${tocken}`
    }
  })
  const response = await getpaim.json()
  if(!response) {
    alert(response.data)
    return
  }
  console.log(response.data)
  setgetpaimentes(response.data)
}
useEffect(()=>{
  GetPaimentes()
},[])
const GetOnestudePaim = async(id:any)=>{
  const getStudents = await fetch(`http://localhost:3000/Paimentes/${id}`,{
    "headers":{
      "Authorization":`Bearer ${tocken}`
    }
  })
  const response = await getStudents.json()
  if(!response){
    alert(response.data)
    return
  }
  setonPaimentsget(response.data)
}
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
       <TableContainer>
         <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Élève</TableCell>
              <TableCell>	Nombre d'Paimentes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getpaimentes.map((item:any)=>(
               <TableRow>
                <TableCell>{item.idStud.Name}</TableCell>
                <TableCell>{item.paimentes.length}</TableCell>
                <TableCell>
                  <Button
                  onClick={()=>setmodalPaimetes(item)}
                  variant='outlined'
                  size='small'
                  startIcon={<VisibilityIcon/>}>
                   Voir Detaille
                  </Button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       </TableContainer>
      </Paper>
      {/**Modal pour ajouter */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} >
            <Typography variant="h6" className={Styles.titre}>
              Ajouter Paiement
            </Typography>
           <form onSubmit={sendData} className={Styles.form}>
  {/* Eleve */}
  <Typography>Élève</Typography>
  <Select 
  value={modlesStud}
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
      required
      onChange={handlModels}
      value={idMate}
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
    bgcolor: color.bg,
    border: `1px solid ${color.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  }}
>
  <Typography sx={{ color: color.text, fontWeight: "bold",display:"flex",gap:"4px" }}>
    <MonetizationOnIcon/> {prix}.00 DA
  </Typography>
</Box>
  </Box>
  {/* Mois */}
  <Typography>Mois</Typography>
  <Select
    required
    onChange={hadnlMois}
    value={Mois}
    multiple
    input={<OutlinedInput id="select-multiple-chip" />}
  >
    {Moise.map((mois) => (
      <MenuItem sx={{ height: "29px" }} key={mois} value={mois}>
        {mois}
      </MenuItem>
    ))}
  </Select>

  {/* Montant */}
  <TextField
   value={Montante}
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
  inputRef={date}
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
      {/**Modal pour voir detailles */}
      <Modal open={!!modalPaimetes} onClose={()=>setmodalPaimetes(null)}>
       <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContentD} sx={{maxHeight:"500px", overflowY:"auto"}}>
            <Typography variant="h6" gutterBottom>
              Détails des Paimentes de {modalPaimetes?.idStud?.Name}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                 <TableCell>Modules Paiees</TableCell>
                 <TableCell>Date Paiees</TableCell>
                 <TableCell>Mounth Paiees</TableCell>
                 <TableCell>Status</TableCell>
                 <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {modalPaimetes?.paimentes?.map((Items:any)=>( 
                <TableRow>
                  <TableCell>{Items.matieres.map((name:any)=>name.idMat.name).join(",")}</TableCell>
                  <TableCell>{Items.Date.split("T")[0]}</TableCell>
                  <TableCell>{Items.Mois.map((mounth:any)=>mounth).join(",")}</TableCell>
                  <TableCell>{typeof(Items.status)=="number"? `il reste ${Items.status}.00 DA`: Items.status  }</TableCell>
                  <TableCell>{typeof(Items.status)=="number"?<Button onClick={()=>GetOnestudePaim(modalPaimetes.idStud._id)} variant="outlined">Completer payees</Button>:""}</TableCell>
                </TableRow>
               ))}
              </TableBody>
            </Table>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={()=>setmodalPaimetes(null)}
              >
                Fermer
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
