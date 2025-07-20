import React from "react";
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
} from "@mui/material";

export  function RapportEleves() {
  return (
    <Box sx={{width:'80%'}} p={3}>
      <Typography variant="h4" gutterBottom>
        👥 Rapport Élèves
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="Nom élève" size="small" />
        <Select size="small" defaultValue="">
          <MenuItem value="">Niveau</MenuItem>
          <MenuItem value="1ère">1ère</MenuItem>
          <MenuItem value="2ème">2ème</MenuItem>
        </Select>
        <Select size="small" defaultValue="">
          <MenuItem value="">Matière</MenuItem>
          <MenuItem value="Maths">Maths</MenuItem>
        </Select>
        <Button variant="contained" color="primary">
          Filtrer
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Âge</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Modules</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Ahmed</TableCell>
              <TableCell>16</TableCell>
              <TableCell>1ère</TableCell>
              <TableCell>0550 00 00 00</TableCell>
              <TableCell>Maths, Physique</TableCell>
              <TableCell>Actif</TableCell>
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
    </Box>
  );
}
