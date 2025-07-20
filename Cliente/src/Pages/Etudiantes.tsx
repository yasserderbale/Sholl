import React, { useState } from 'react';
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
} from '@mui/material';

interface Etudiant {
  id: number;
  nom: string;
  age: number;
  niveau: string;
  telephone: string;
  modules: string[];
  etat: 'Actif' | 'Archivé';
  dateInscription: string;
}

export function Etudiantes() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([
    {
      id: 1,
      nom: 'Ahmed',
      age: 16,
      niveau: '1ère année',
      telephone: '0555...',
      modules: ['Maths', 'Physique'],
      etat: 'Actif',
      dateInscription: '2024-09-01',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);

  const [nouveauNom, setNouveauNom] = useState('');
  const [nouvelAge, setNouvelAge] = useState<number | ''>('');
  const [nouveauNiveau, setNouveauNiveau] = useState('');
  const [nouveauTel, setNouveauTel] = useState('');
  const [nouveauxModules, setNouveauxModules] = useState<string[]>([]);
  const [nouvelEtat, setNouvelEtat] = useState<'Actif' | 'Archivé'>('Actif');
  const [nouvelleDate, setNouvelleDate] = useState('');
  const [searchNom, setSearchNom] = useState('');

  const modulesDisponibles = ['Maths', 'Physique', 'SVT', 'Français'];

  const ajouterEtudiant = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelEtudiant: Etudiant = {
      id: etudiants.length + 1,
      nom: nouveauNom,
      age: Number(nouvelAge),
      niveau: nouveauNiveau,
      telephone: nouveauTel,
      modules: nouveauxModules,
      etat: nouvelEtat,
      dateInscription: nouvelleDate,
    };
    setEtudiants([...etudiants, nouvelEtudiant]);
    setNouveauNom('');
    setNouvelAge('');
    setNouveauNiveau('');
    setNouveauTel('');
    setNouveauxModules([]);
    setNouvelEtat('Actif');
    setNouvelleDate('');
    setShowModal(false);
  };

  const supprimerEtudiant = (id: number) => {
    setEtudiants(etudiants.filter((e) => e.id !== id));
    setIdsupprimer(null);
  };

  const toggleModule = (module: string) => {
    if (nouveauxModules.includes(module)) {
      setNouveauxModules(nouveauxModules.filter((m) => m !== module));
    } else {
      setNouveauxModules([...nouveauxModules, module]);
    }
  };

  const etudiantsFiltres = etudiants.filter((e) =>
    e.nom.toLowerCase().includes(searchNom.toLowerCase())
  );

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
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
          className={Styles.searche}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          className={Styles.btnAjouter}
        >
          ➕ Ajouter un élève
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
            {etudiantsFiltres.map((etu) => (
              <TableRow key={etu.id}>
                <TableCell>{etu.nom}</TableCell>
                <TableCell>{etu.age}</TableCell>
                <TableCell>{etu.niveau}</TableCell>
                <TableCell>{etu.telephone}</TableCell>
                <TableCell>{etu.modules.join(', ')}</TableCell>
                <TableCell>{etu.etat}</TableCell>
                <TableCell>{etu.dateInscription}</TableCell>
                <TableCell>
                  <Button size="small" className={Styles.btnModifier}>
                    ✏️ Modifier
                  </Button>
                  <Button
                    size="small"
                    className={Styles.btnSupprimer}
                    onClick={() => setIdsupprimer(etu.id)}
                  >
                    🗑️ Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
            <form onSubmit={ajouterEtudiant} className={Styles.form}>
              <TextField
                label="Nom complet"
                value={nouveauNom}
                onChange={(e) => setNouveauNom(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Âge"
                type="number"
                value={nouvelAge}
                onChange={(e) => setNouvelAge(Number(e.target.value))}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Niveau"
                value={nouveauNiveau}
                onChange={(e) => setNouveauNiveau(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Téléphone"
                value={nouveauTel}
                onChange={(e) => setNouveauTel(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Typography variant="subtitle1">Modules :</Typography>
              <Box className={Styles.modulesList}>
                {modulesDisponibles.map((module) => (
                  <FormControlLabel
                    key={module}
                    control={
                      <Checkbox
                        checked={nouveauxModules.includes(module)}
                        onChange={() => toggleModule(module)}
                      />
                    }
                    label={module}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1">Date d'inscription :</Typography>
              <TextField
                type="date"
                value={nouvelleDate}
                onChange={(e) => setNouvelleDate(e.target.value)}
                className={Styles.input}
                required
                fullWidth
                margin="normal"
              />

              <Box className={Styles.modalActions} display="flex" gap={2}>
                <Button variant="contained" type="submit">
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
                onClick={() => supprimerEtudiant(idASupprimer!)}
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
