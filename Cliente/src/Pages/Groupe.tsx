import  React, { useRef, useState  } from 'react';
import Styles from '../Styles/Groupe.module.css';
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
export function Groupe() {
 const [showModal, setShowModal] = useState(false);
  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        Gestion des groupe
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
          onClick={() => setShowModal(true)}
        >
          Ajouter un groupe
        </Button>
      </Box>
      
      <Paper sx={{ borderRadius:"12px", boxShadow:"0 6px 20px rgba(0,0,0,0.1)" }}>
        <Table className={Styles.table}>
          <TableHead sx={{ background:"#f1f5f9" }}>
            <TableRow >
              <TableCell>Nom du groupe</TableCell>
              <TableCell >Étudiants</TableCell>
              <TableCell>Professeurs</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
         
          </TableBody>
        </Table>
      </Paper>

            {/*Modals */}
            <Modal open={showModal} onClose={()=>setShowModal(false)}>
                    <Box className={Styles.modalOverlay}>
                      <Box className={Styles.modalContent} sx={{ maxWidth:"600px", borderRadius:"16px" }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter un groupe</Typography>
                        <form  className={Styles.form}>
                          <TextField   label="Nom du groupe" required fullWidth margin="normal"/>
                          <TextField  type='number' label="Nbr Max Eleves" required fullWidth margin="normal"/>
                          <TextField  type='number' label="Frais de scolarité" required fullWidth margin="normal"/>
                          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="contained" type="submit">Enregistrer</Button>
                            <Button variant="outlined" onClick={()=>setShowModal(false)}>Annuler</Button>
                          </Box>
                        </form>
                      </Box>
                    </Box>
                  </Modal>
     
    </Box>
  );
}
