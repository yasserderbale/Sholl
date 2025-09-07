import React, {useRef, useState} from 'react';
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usAuth } from '../Context/AuthContext';
export function Matires() { 
 const matref = useRef<HTMLInputElement>(null)
 const prixref = useRef<HTMLInputElement>(null)
 const niveau = useRef<HTMLInputElement>(null)
 const {addMat,mat,DelatewoneMat,getOneMat,updateone,Searchonmat} = usAuth()
  const [Niveau,setnivauerefup] = useState<string>("")
  const handlChangeniveau = (event:SelectChangeEvent)=>{
    const {value} = event.target  
    setnivauerefup(value)
  }
 const prixrefup = useRef<HTMLInputElement>(null)
  const [showModal, setShowModal] = useState(false);
    const [showModalup, setShowModalup] = useState(false);
    const [idASupprimer, setIdASupprimer] = useState(null);
    const [idup, setIdup] = useState(null); 
  const hadndleAdd =(e:React.FormEvent)=>{  
    const namee = matref.current?.value || ''
  const prix = Number(prixref.current?.value ) 
  const Niveau = niveau.current?.value
    e.preventDefault()
          if(!namee || !prix ||!Niveau) {alert("sasir tous les Champs dans Front")
          return}
    addMat(namee,prix,Niveau) 
     if(matref.current)matref.current.value=""
     if(prixref.current)prixref.current.value="" 
     if(niveau.current)niveau.current.value=""
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
    prixrefup.current!.value=String(date.prix)
    setnivauerefup(date.Niveau)
     }
       setIdup(idmat)
  
  }
  const handlupdatone = (e:any)=>{
    const prix = prixrefup.current?.value || 
    e.preventDefault()
    updateone(idup,prix,Niveau)
    setShowModalup(false)
  }

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Gestion des matières
      </Typography>
     <Box  mb={2} display="flex" gap={2}>
            <TextField
            onChange={(e)=>{Searchonmat(e.target.value)}}
              label="🔍 Rechercher par nom"
              variant="outlined"
              size="small"
              sx={{
                width:250,
                background:"#f9fafb",
                borderRadius:"10px"
              }}
            />
             <Button
       startIcon={<AddIcon />}
          variant="contained"
          color="primary"
         sx={{ borderRadius:"10px", textTransform:"none" }}
        onClick={() => setShowModal(true)}
        className={Styles.btnAjouter}
      >
         Ajouter une matière
           </Button>
      </Box>

      {mat.length==0?<Typography  variant="body1"
                    align="center"
                    color="textSecondary"
                    style={{ marginTop: "29px" }}>Aucune donnée</Typography>: <Paper sx={{ mt: 3 }}>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prix mensuel (DA)</TableCell>
              <TableCell>Niveau</TableCell>
               <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
         {(mat??[]).map((items)=>(
      <TableRow key={items._id}>
        <TableCell>{items.name}</TableCell> 
                <TableCell>{items.prix}.00DA</TableCell>
                <TableCell>{items.Niveau}</TableCell>
                <TableCell>
                <Button onClick={()=>hadndlgetOne(items._id)} startIcon={<UpdateIcon/>}>Modifier</Button>
                <Button onClick={()=>setIdASupprimer(items._id)} startIcon={<DeleteForeverIcon/>}>Supprimer</Button>
                 </TableCell>

      </TableRow>
    ))}
          </TableBody>
        </Table>
      </Paper>}
     

      {/* Modal Ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              Ajouter une matière
            </Typography>
           <form onSubmit={hadndleAdd}  > 
             <FormControl className={Styles.form}>
              <Select inputRef={matref}
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Matiere"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Arabe"}>Arabe</MenuItem>
        <MenuItem value={"Math"}>Math</MenuItem>
        <MenuItem value={"Physice"}>Physice</MenuItem>
        <MenuItem value={"Science"}>Science</MenuItem>
        <MenuItem value={"Français"}>Français</MenuItem>
        <MenuItem value={"Anglais"}>Anglais</MenuItem>
        <MenuItem value={"Espagnole"}>Espagnole</MenuItem>
        <MenuItem value={"Italie"}>Italie</MenuItem>
        <MenuItem value={"Filaue"}>Filaue</MenuItem>
             </Select>
        <InputLabel id="demo-simple-select-autowidth-label">Matiere</InputLabel>
        <Select
       inputRef={niveau}
        >
           <MenuItem value="">
          <em>None</em>
        </MenuItem>
                        <MenuItem value={"Première moyenne"}>Première moyenne</MenuItem>
                        <MenuItem value={"Seconde moyenne"}>Seconde moyenne</MenuItem>
                        <MenuItem value={"Troisième moyenne"}>Troisième moyenne</MenuItem>
                        <MenuItem value={"quatrième moyenne"}>quatrième moyenne</MenuItem>
                        <MenuItem value={"Première secondaire"}>Première secondaire</MenuItem>
                        <MenuItem value={"Seconde secondaire"}>Seconde secondaire</MenuItem>
                        <MenuItem value={"Terminale"}>Terminale</MenuItem>
        </Select>
              <TextField
              className={Styles.input}
              inputRef={prixref}
                type="number"
                required
                fullWidth
                margin="normal"
                label="Prix mensuel"
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
            </FormControl>
           </form>
          </Box>
        </Box>
      </Modal>
            {/* Modal Update */}

    <Modal open={showModalup} onClose={() => setShowModalup(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" sx={{paddingBottom:"2px",textAlign:"center"}}>
              Modifier une matière
            </Typography>
            <form  onSubmit={handlupdatone} className={Styles.form}>
               <Select
       value={Niveau}
       onChange={handlChangeniveau}
        >
           <MenuItem value="">
          <em>None</em>
        </MenuItem>
                        <MenuItem value={"Première moyenne"}>Première moyenne</MenuItem>
                        <MenuItem value={"Seconde moyenne"}>Seconde moyenne</MenuItem>
                        <MenuItem value={"Troisième moyenne"}>Troisième moyenne</MenuItem>
                        <MenuItem value={"quatrième moyenne"}>quatrième moyenne</MenuItem>
                        <MenuItem value={"Première secondaire"}>Première secondaire</MenuItem>
                        <MenuItem value={"Seconde secondaire"}>Seconde secondaire</MenuItem>
                        <MenuItem value={"Terminale"}>Terminale</MenuItem>
        </Select>
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
