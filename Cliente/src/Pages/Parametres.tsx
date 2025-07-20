import React, { useState } from 'react';
import Styles from '../Styles/Parametres.module.css';

import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

export function Parametres() {
  const [nomEcole, setNomEcole] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [devise, setDevise] = useState('DA');
  const [langue, setLangue] = useState('Fr');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nomEcole,
      adresse,
      telephone,
      logo,
      devise,
      langue,
    });
  };

  return (
    <Box className={Styles.page} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Paramètres
      </Typography>

      <form onSubmit={handleSave} className={Styles.form}>
        <TextField
          label="Nom de l'établissement"
          value={nomEcole}
          onChange={(e) => setNomEcole(e.target.value)}
          className={Styles.input}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className={Styles.input}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Numéro de téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className={Styles.input}
          fullWidth
          margin="normal"
          required
        />

        <Box mt={2} mb={2}>
          <InputLabel>Logo (optionnel)</InputLabel>
          <input
            type="file"
            onChange={(e) =>
              setLogo(e.target.files ? e.target.files[0] : null)
            }
            className={Styles.input}
          />
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel>Devise</InputLabel>
          <Select
            value={devise}
            label="Devise"
            onChange={(e) => setDevise(e.target.value)}
            className={Styles.input}
          >
            <MenuItem value="DA">DA</MenuItem>
            <MenuItem value="€">€</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Langue</InputLabel>
          <Select
            value={langue}
            label="Langue"
            onChange={(e) => setLangue(e.target.value)}
            className={Styles.input}
          >
            <MenuItem value="Fr">Française</MenuItem>
            <MenuItem value="Ar">Arabe</MenuItem>
          </Select>
        </FormControl>

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={Styles.btnConfirmer}
          >
            Enregistrer les modifications
          </Button>
        </Box>
      </form>
    </Box>
  );
}
