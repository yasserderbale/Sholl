import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  OutlinedInput
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Search,
  Receipt,
  Payment,
  Visibility as VisibilityIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { useSchool } from '../Context/SchoolContext';
import Styles from '../Styles/Paimentes.module.css';

export function Paimentes() {
   const [toast, setToast] = useState<{open:boolean, message:string, severity:"success"|"error"|"info"|"warning"}>({
    open: false,
    message: "",
    severity: "success",
  });
const [showModal, setShowModal] = useState(false);
const {stude,tocken} = usAuth();
const { t, language, setLanguage } = useLanguage();
const { settings } = useSchool();
const Moise = ['janvier','fevrier','marse','avrile','mey','joine','juillet','aute','september','october','november','december']
const [modlesStud,setmodlesStud]=useState<any>({})
let modelsSelect = (modlesStud.modules?.map((name:any)=>name.matid))
const [Mois,setmois]=useState<any>([])
const [Montante,setmontante]=useState<any>("")  
const [prix,setprix]=useState<number>(0)
const [color,setcolor]= useState<any>("") 
const [getpaimentes,setgetpaimentes]=useState([])
const [modalPaimetes,setmodalPaimetes]=useState<any>(null)
const [completepaymodal,setcompletepaymodal]=useState(false)
const [idstudent,setidstudent]=useState(null)
const [idpaimente,setidpaimente]=useState(null)
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
  setToast({ open: true, message: `${response.data}`, severity: "error" })
  return
}
 setToast({ open: true, message: "paiment Register succed ", severity: "success" });
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
  setgetpaimentes(response.data)
}
useEffect(()=>{
  GetPaimentes()
},[])
const GetOnestudePaim = async (idPaiment:any,idStud:any)=>{
  if(!idPaiment || !idStud) {
    alert("not founf idpai and idStudente")
    return
  }
  const getStudents = await fetch(`http://localhost:3000/Paimentes/${idStud}/${idPaiment}`,{
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
  setcompletepaymodal(true)
  setidstudent(idStud)
  setidpaimente(idPaiment)
}
const completepayeer = async(event:React.FormEvent)=>{
  event.preventDefault()
  const addPrice = valPrice.current?.value
  console.log('value of price',addPrice)
  if(!addPrice) {
    alert("there isn`t value of price")
    return
  }
   if(!idstudent || !idpaimente) {
    alert("there isn`t value of idstudent or idpaimente")
    return
  }
  const complete = await fetch(`http://localhost:3000/Paimentes/${idstudent}/complete/${idpaimente}`,{
    method:"PUT",
    headers:{
      "Authorization":`Bearer ${tocken}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({addPrice})
  })
  const response = await complete.json()
  if(!response){
    alert(response.data)
    return
  }
  setcompletepaymodal(false)
  setmodalPaimetes(false)
  GetPaimentes()
}
const SearchePai = async(search:any)=>{
  const searchStudPai = await fetch(`http://localhost:3000/PaimentesSearch?nam=${search}`,{
    headers:{
      "Authorization":`Bearer ${tocken}`
    } 
  })
  const response = await searchStudPai.json()
  setgetpaimentes(response.data)
  
}
const valPrice = useRef<any>(null)
  return (
    <Box className={Styles.page} p={3}>
      {/* العنوان وحقل البحث */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Payment sx={{ fontSize: 35, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" gutterBottom>
            Gestion des Paiements
          </Typography>
        </Box>
        
        {/* مبدل اللغة */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Langue / اللغة:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#f5f5f5',
              borderRadius: '20px',
              p: 0.5
            }}
          >
            <Button
              size="small"
              onClick={() => setLanguage('fr')}
              sx={{
                minWidth: '60px',
                borderRadius: '15px',
                backgroundColor: language === 'fr' ? 'primary.main' : 'transparent',
                color: language === 'fr' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: language === 'fr' ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              FR
            </Button>
            <Button
              size="small"
              onClick={() => setLanguage('ar')}
              sx={{
                minWidth: '60px',
                borderRadius: '15px',
                backgroundColor: language === 'ar' ? 'primary.main' : 'transparent',
                color: language === 'ar' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: language === 'ar' ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              عر
            </Button>
          </Box>
        </Box>
      </Box>

      {/* حقل البحث المحسن */}
      <Box 
        mb={3} 
        display="flex" 
        gap={2} 
        alignItems="center"
        sx={{
          backgroundColor: '#f8f9fa',
          padding: 2,
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}
      >
        <TextField
          onChange={(e) => SearchePai(e.target.value)}
          label="🔍 Rechercher un étudiant"
          variant="outlined"
          size="medium"
          placeholder="Tapez le nom de l'étudiant..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'primary.main', fontSize: 24 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '10px',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
            '& .MuiInputLabel-root': {
              color: 'primary.main',
              fontWeight: 'bold'
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowModal(true)}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            height: "40px"
          }}
        >
          Ajouter Paiement
        </Button>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* جدول المدفوعات المحسن */}
      {getpaimentes && getpaimentes.length > 0 ? (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'center' }}>
              <Receipt sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Liste des Paiements ({getpaimentes.length} étudiants)
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9, 
                textAlign: 'center',
                direction: language === 'ar' ? 'rtl' : 'ltr'
              }}
            >
              {language === 'ar' ? settings.schoolNameAr : settings.schoolNameFr}
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>👤 Étudiant</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>📚 Matières</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>💰 Montant</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>📊 Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>⚙️ Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getpaimentes.map((item: any, index: number) => (
                  <TableRow 
                    key={item._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {item.idStud?.Name}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {item.paimentes?.map((p: any) => 
                        p.matieres?.map((m: any) => m.idMat?.name).join(", ")
                      ).join(", ")}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: 'success.light',
                          color: 'success.dark',
                          px: 2,
                          py: 0.5,
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}
                      >
                        {item.paimentes?.reduce((sum: number, p: any) => sum + (p.Montante || 0), 0)} DA
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.paimentes?.some((p: any) => typeof p.status === 'number') ? 'Partiel' : 'Complet'}
                        color={item.paimentes?.some((p: any) => typeof p.status === 'number') ? 'warning' : 'success'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setmodalPaimetes(item)}
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        Voir Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #dee2e6'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Aucun paiement trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Utilisez la recherche pour trouver des étudiants ou ajoutez un nouveau paiement
          </Typography>
        </Box>
      )}
      
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
                <TableRow >
                 <TableCell>Modules Paiees</TableCell>
                 <TableCell>Date Paiees</TableCell>
                 <TableCell>Mounth Paiees</TableCell>
                 <TableCell>Montante</TableCell>
                 <TableCell sx={{textAlign:'center'}}>Status</TableCell>
                 <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody> 
               {modalPaimetes?.paimentes?.map((Items:any)=>( 
                <TableRow key={Items._id}>
                  <TableCell>{Items.matieres.map((name:any)=>name.idMat.name).join(",")}</TableCell>
                  <TableCell>{Items.Date.split("T")[0]}</TableCell>
                  <TableCell>{Items.Mois.map((mounth:any)=>mounth).join(",")}</TableCell>
                  <TableCell>{Items.Montante}</TableCell>
                  <TableCell>{typeof(Items.status)=="number"? `il reste ${Items.status}.00 DA`: Items.status  }</TableCell>
                  <TableCell>{typeof(Items.status)=="number"?<Button onClick={()=>GetOnestudePaim(Items._id,modalPaimetes.idStud._id)}  variant="outlined">Completer payees</Button>:""}</TableCell>
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
      {/* Modal pour contenuier le reste paymentes */}
      <Modal open={completepaymodal} onClose={()=>setcompletepaymodal(false)}>
               <Box className={Styles.modalOverlay}>
                <Box className={Styles.modalContent} >
                  <form onSubmit={completepayeer} className={Styles.form} >
                       <Typography sx={{marginBottom:'-4px'}} variant="h6"gutterBottom>
                         Entrer le Reste Argente
                       </Typography>
                        <TextField
                        inputRef={valPrice}
                    type='number'
                    className={Styles.input}
                     label="Entrer Le Reste argente"
                     required
                     fullWidth
                     margin="normal"
                    />
                  <Box sx={{display:'flex',justifyContent:'space-between'}}>
                      <Button variant='outlined' onClick={()=>setcompletepaymodal(false)}>Fermer</Button>
                     <Button type='submit' variant='outlined'>Submit</Button>
                  </Box>
                  </form>
                  
                </Box>
                  
               </Box>
      </Modal>
    </Box>
  );
}
