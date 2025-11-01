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
  Snackbar,
  Alert,
  TablePagination,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search } from '@mui/icons-material';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
export function Matires() { 
 const matref = useRef<HTMLInputElement>(null)
 const prixref = useRef<HTMLInputElement>(null)
 const niveau = useRef<HTMLInputElement>(null)
 const { t } = useLanguage();
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
    const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
  const hadndleAdd =(e:React.FormEvent)=>{  
    const namee = matref.current?.value || ''
  const prix = Number(prixref.current?.value ) 
  const Niveau = niveau.current?.value
    e.preventDefault()
          if(!namee || !prix ||!Niveau) {
            setToast({ open: true, msg: "Veuillez remplir tous les champs", type: "error" });
          return}
    
    // Vérification: empêcher les noms de matières dupliqués
    const nameExists = mat.some((matiere: any) => 
      matiere.name?.toLowerCase().trim() === namee?.toLowerCase().trim() &&
      matiere.Niveau?.toLowerCase().trim() === Niveau?.toLowerCase().trim()
    );
    
    if (nameExists) {
      setToast({ open: true, msg: "Une matière avec ce nom et niveau existe déjà!", type: "error" });
      return;
    }
    addMat(namee,prix,Niveau) 
     if(matref.current)matref.current.value=""
     if(prixref.current)prixref.current.value="" 
     if(niveau.current)niveau.current.value=""
     setShowModal(false)
     setToast({ open: true, msg: "Matière ajoutée avec succès", type: "success" });
     
  }
  const hadnlDelet = ()=>{
    DelatewoneMat(idASupprimer)
    setIdASupprimer(null)
    setToast({ open: true, msg: "Matière supprimée avec succès", type: "success" });
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
    const prix = Number(prixrefup.current?.value) || 0
    e.preventDefault()
    if(!prix || !Niveau) {
      setToast({ open: true, msg: "Veuillez remplir tous les champs", type: "error" });
      return;
    }
    
    // Vérification: empêcher les noms dupliqués (sauf pour la matière actuelle)
    const currentMatiere = mat.find((m: any) => (m.id || m._id) === idup);
    const nameExists = mat.some((matiere: any) => 
      (matiere.id || matiere._id) !== idup && // Ignorer la matière en cours de modification
      matiere.name?.toLowerCase().trim() === currentMatiere?.name?.toLowerCase().trim() &&
      matiere.Niveau?.toLowerCase().trim() === Niveau?.toLowerCase().trim()
    );
    
    if (nameExists) {
      setToast({ open: true, msg: "Une matière avec ce nom et niveau existe déjà!", type: "error" });
      return;
    }
    
    updateone(idup,prix,Niveau)
    setShowModalup(false)
    setToast({ open: true, msg: "Matière modifiée avec succès", type: "success" });
  }

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        {t('subjectManagement')}
      </Typography>
     <Box  mb={2} display="flex" gap={2}>
            <TextField
            onChange={(e)=>{Searchonmat(e.target.value)}}
              label={`${t('search')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
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
       {t('addSubject')}
           </Button>
      </Box>

      {mat.length==0?<Typography  variant="body1"
                    align="center"
                    color="textSecondary"
                    style={{ marginTop: "29px" }}>{t('noData')}</Typography>: <Paper sx={{ mt: 3 }}>
        <Table className={Styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('monthlyPrice')} (DA)</TableCell>
              <TableCell>{t('level')}</TableCell>
               <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
         {(mat??[])
           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
           .map((items: any)=>{
           const itemId = items.id || items._id;
           return (
      <TableRow key={itemId}>
        <TableCell>{items.name}</TableCell> 
                <TableCell>{items.prix}.00DA</TableCell>
                <TableCell>{items.Niveau}</TableCell>
                <TableCell>
                <Button onClick={()=>hadndlgetOne(itemId)} startIcon={<UpdateIcon/>}>{t('edit')}</Button>
                <Button onClick={()=>setIdASupprimer(itemId)} startIcon={<DeleteForeverIcon/>}>{t('delete')}</Button>
                 </TableCell>

      </TableRow>
    );
    })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={mat?.length || 0}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>}
     

      {/* Modal Ajout */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent}>
            <Typography variant="h6" className={Styles.titre}>
              {t('addSubject')}
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
                  {t('save')}
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
              {t('editSubject')}
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
                  {t('edit')}
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
            <Typography variant="h6">{t('confirmDelete')}</Typography>
            <Box className={Styles.modalActions1} display="flex" gap={2}>
              <Button
                variant="contained"
                color="error"
                className={Styles.btnConfirmer1}
                onClick={()=>hadnlDelet()}
              >
                {t('yes')}
              </Button>
              <Button
                variant="outlined"
                onClick={()=>setIdASupprimer(null)}
                className={Styles.btnAnnuler1}
              >
                {t('no')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      
      {/* Toast Notification */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.type}
          sx={{ width: '100%' }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
