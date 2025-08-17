import  React, { useRef, useState  } from 'react';
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
  type SelectChangeEvent,
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
   const [selectedStudent,setSelectedStudent]=useState<any>(null)
   console.log(selectedStudent)
 const handleChangeModules = (event: SelectChangeEvent<string[]>) => {
  const {value} = event.target
  setModules(typeof(value)==='string'? value.split(','):value)
 };
  const [showModal, setShowModal] = useState(false);
  const [showModalup, setShowModalup] = useState<number | null>(null);
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const {mat,tocken,getStudentes,stude,seracheStud} = usAuth()
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
    getStudentes()
    return
  }
  const getOneStud = async(id:string)=>{
       let GetOne = await fetch(`http://localhost:3000/Student/${id}`,{
      headers:{
        "Authorization":`Bearer ${tocken}`
      }
    })
    if(!GetOne.ok){
      alert("FAiled get onStudent")
      return
    }
   const response = await GetOne.json()
   console.log(response.data)
    name.current!.value=response.data.Name
    age.current!.value=response.data.Age
    niveau.current!.value=response.data.Nivuea
    phone.current!.value=response.data.Telephone
    date.current!.value=new Date(response.data.Date).toISOString().split('T')[0]
    setModules(response.data.modules.map((nam:any)=>nam.matid.name))
  }
    const DeleteStud =async()=>{
const remove = await fetch(`http://localhost:3000/Student/${idASupprimer}`,{
  method:"DELETE",
  headers:{
    "Content-Type":"appliation/json",
    "Authorization":`Bearer ${tocken}`
  }
})
if(!remove.ok){
  alert("Deleted failed")
  return
}
getStudentes()  
setIdsupprimer(null)
}
const updatOne = async(e:React.FormEvent)=>{
  e.preventDefault()
   const Name = name.current?.value
    const Age = age.current?.value
    const Nivuea = niveau.current?.value
    const Telephone = phone.current?.value
    const Date = date.current?.value
    if(modules.length==0){
      alert("no matieres")
      return
    }
    console.log(modules)
  const Update = await fetch(`http://localhost:3000/Student/${showModalup}`,{
    method:"PUT",
    headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${tocken}`
    },
    body:JSON.stringify({Name,Age,Nivuea,Telephone,Date,modules})
  })
  if(!Update.ok){
    alert("failed update")
    return
  }
  getStudentes()  
  setShowModalup(null)
}

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des élèves
      </Typography>
      <Box className={Styles.actions} mb={2} display="flex" gap={2}>
        <TextField
        onChange={(e:any)=>seracheStud(e.target.value)}
          label="Rechercher par nom"
          variant="outlined"
          size="small"
          className={Styles.searche}
        />
        <Button
        startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={Styles.btnAjouter}
        >
        Ajouter un élève
        </Button>
      </Box>

      {stude.length==0? <h1 >no data</h1>:
      <Paper>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Âge</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Modules</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
               {(stude??[]).map((item:any)=>(
            <TableRow key={item._id}>
              <TableCell>{item.Name}</TableCell>
              <TableCell>{item.Age}</TableCell>
              <TableCell>{item.Nivuea}</TableCell>
              <TableCell>{item.Telephone}</TableCell>
              <TableCell>{item.modules.map((modul:any)=>modul.matid.name).join(",")}</TableCell>
              <TableCell>{item.Date.split("T")[0]}</TableCell>
              <TableCell sx={{display:"flex",gap:"4px"}}>
                <Button  onClick={()=>{setShowModalup(item._id);getOneStud(item._id)}} startIcon={<Update />}>Modifier</Button>
                <Button  onClick={()=>setIdsupprimer(item._id)} startIcon={<DeleteIcon />}>Supprimer</Button>
                <Button  onClick={()=> setSelectedStudent(item)}  startIcon={<VisibilityIcon />}>Voir</Button>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </Paper>
      
    }
    {/* Modal Selectioner */}
    <Modal open={!!selectedStudent} onClose={()=>setSelectedStudent(null)}>
      <Box className={Styles.modalOverlay}>
        <Box className={Styles.modalContent} sx={{maxWidth:"730px",maxHeight:"200px"}}>
        <Typography>Detailles de {selectedStudent?.Name}</Typography>
       {selectedStudent && (
                     <Table>
                       <TableHead>
                         <TableRow>
                           <TableCell>Nom</TableCell>
                           <TableCell>Âge</TableCell>
                           <TableCell>Niveau</TableCell>
                           <TableCell>Téléphone</TableCell>
                           <TableCell>Date d'inscription</TableCell>
                           <TableCell>Modules</TableCell>
                         </TableRow>
                       </TableHead>
                       <TableBody>
                        <TableRow>
                          <TableCell>{selectedStudent.Name}</TableCell>
                          <TableCell>{selectedStudent.Age}</TableCell>
                          <TableCell>{selectedStudent.Nivuea}</TableCell>
                          <TableCell>{selectedStudent.Telephone}</TableCell>
                          <TableCell>{selectedStudent.Date.split("T")[0]}</TableCell>
                          <TableCell>{selectedStudent.modules.map((name:any)=>name.matid.name).join(",")}</TableCell>
                        </TableRow>
                       </TableBody>
                     </Table>
                   )}
       
                   <Box mt={2} display="flex" justifyContent="flex-end">
                     <Button
                       variant="outlined"
                       onClick={() => setSelectedStudent(null)}
                     >
                       Fermer
                     </Button>
                   </Box>
        </Box>
      </Box>
    </Modal>
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
  {(mat??[]).map((item) => (
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
      {/* Modal update */}
      <Modal open={!!showModalup} onClose={() => setShowModalup(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Modifier un élève
            </Typography>
            <form onSubmit={updatOne} className={Styles.form}>
              <TextField
              inputRef={name}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                inputRef={age}
                type="number"
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={niveau}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
              inputRef={phone}
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
  {(mat??[]).map((item) => (
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
                  Modifier
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowModalup(null)}
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
              onClick={() => DeleteStud()}
                variant="contained"
                color="error"
                className={Styles.btnConfirmer1}
              >
                Oui
              </Button>
              <Button
                variant="outlined"
                onClick={()=>setIdsupprimer(null)}
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
