import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
} from "@mui/material";

export function RapportPaiements() {
  // مثال بيانات التلميذ
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<any>(null);

  // بيانات وهمية: لو تربطها بالداتابيز تبدلها
  const detailsExample = {
    eleve: "Ahmed",
    paiements: [
      { mois: "Janvier", matiere: "Maths", montant: 2000, statut: "Payé" },
      { mois: "Février", matiere: "Maths", montant: 2000, statut: "Non payé" },
      { mois: "Mars", matiere: "Physique", montant: 2500, statut: "Payé" },
    ],
  };

  const handleVoirClick = () => {
    setSelectedEleve(detailsExample);
    setDetailsOpen(true);
  };

  return (
    <Box sx={{ width: "80%" }} p={3}>
      <Typography variant="h4" gutterBottom>
        📑 Rapport Paiements
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="Nom élève" size="small" />
        <Select size="small" defaultValue="">
          <MenuItem value="">Matière</MenuItem>
          <MenuItem value="Maths">Maths</MenuItem>
          <MenuItem value="Physique">Physique</MenuItem>
        </Select>
        <Select size="small" defaultValue="">
          <MenuItem value="">Mois</MenuItem>
          <MenuItem value="Janvier">Janvier</MenuItem>
          <MenuItem value="Février">Février</MenuItem>
        </Select>
        <Button variant="contained" color="primary">
          Filtrer
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Élève</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Mois</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Méthode</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Détails</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Ahmed</TableCell>
              <TableCell>Maths</TableCell>
              <TableCell>Janvier</TableCell>
              <TableCell>2000 DA</TableCell>
              <TableCell>2025-07-07</TableCell>
              <TableCell>Cash</TableCell>
              <TableCell>Payé</TableCell>
              <TableCell>
                <Button onClick={handleVoirClick}>Voir</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Box mt={2} display="flex" gap={2}>
        <Button variant="outlined" color="success">
          Export PDF
        </Button>
        <Button variant="outlined" color="secondary">
          Export Excel
        </Button>
      </Box>

      {/* Modal Détails */}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <Box
          sx={{
            background: "#fff",
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            margin: "100px auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Détails de {selectedEleve?.eleve}
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mois</TableCell>
                <TableCell>Matière</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedEleve?.paiements.map((p: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{p.mois}</TableCell>
                  <TableCell>{p.matiere}</TableCell>
                  <TableCell>{p.montant} DA</TableCell>
                  <TableCell>{p.statut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={2} textAlign="right">
            <Button onClick={() => setDetailsOpen(false)} variant="outlined">
              Fermer
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
