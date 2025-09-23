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
  Snackbar,
  Alert,
  type SelectChangeEvent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
export const Profes= ()=> {
 
  return (
    <Box className={Styles.page} p={3}>
   
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des Profs
      </Typography>
      <Box  mb={2} display="flex" gap={2}>
        <TextField
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
        >
          Ajouter un Profe
        </Button>
      </Box>
     
      {/* === Modals === */}

      {/* Voir */}
      <Modal >
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth:"930px", borderRadius:"16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Détails de 
            </Typography>
      
            <Box mt={2} textAlign="right">
              <Button variant="outlined" >Fermer</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* Ajouter */}
      <Modal >
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth:"900px", borderRadius:"16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter un Profes</Typography>
            <form  className={Styles.form}>
              <TextField   label="Nom complet" required fullWidth margin="normal"/>
              <TextField  label="Âge" type="number" required fullWidth margin="normal"/>
              <Typography>Spécialité</Typography>
              <Select  > 
                <MenuItem  value={"Fileua"}>Philo</MenuItem>
                <MenuItem  value={"Scientifique"}>Scientifique</MenuItem>
                <MenuItem  value={"Matechnique"}>Matechnique</MenuItem>
                <MenuItem  value={"Mathématiques"}>Mathématiques</MenuItem>
                <MenuItem  value={"Langues"}>Langues</MenuItem>
                <MenuItem  value={"Gestion & économie"}>Gestion & économie</MenuItem>
              </Select>
            
             
               <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
      >
        <FormControlLabel  value="Female" control={<Radio />} label="Female" />
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                </RadioGroup>
              
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">Enregistrer</Button>
                <Button variant="outlined" onClick={()=>setShowModal(false)}>Annuler</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Modifier */}
      <Modal >
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth:"900px", borderRadius:"16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Modifier un élève</Typography>
            <form  className={Styles.form}>
              <TextField  required fullWidth margin="normal"/>
              <TextField  type="number" required fullWidth margin="normal"/>
             
             
              <TextField  required fullWidth margin="normal"/>
              <Typography variant="subtitle1">Modules :</Typography>
             
              <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
       
      >
        <FormControlLabel  value="Female" control={<Radio />} label="Female" />
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                </RadioGroup>
              <Typography variant="subtitle1">Date :</Typography>
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">Modifier</Button>
                <Button variant="outlined" >Annuler</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Supprimer */}
      <Modal >  
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth:"400px", borderRadius:"16px", textAlign:"center" }}>
            <Typography variant="h6" mb={2}>Êtes-vous sûr ?</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button  variant="contained" color="error">Oui</Button>
              <Button  variant="outlined">Non</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

     
    </Box>
  );
}
