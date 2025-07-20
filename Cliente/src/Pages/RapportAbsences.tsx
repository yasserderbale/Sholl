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

export  function RapportAbsences() {
  return (
    <Box sx={{width:'80%'}} p={3}>
      <Typography variant="h4" gutterBottom>
        📅 Rapport Absences
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="Nom élève" size="small" />
        <Select size="small" defaultValue="">
          <MenuItem value="">Matière</MenuItem>
          <MenuItem value="Maths">Maths</MenuItem>
        </Select>
        <TextField type="date" size="small" />
        <Button variant="contained" color="primary">
          Filtrer
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Motif</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Ahmed</TableCell>
              <TableCell>2025-07-07</TableCell>
              <TableCell>Maths</TableCell>
              <TableCell>Malade</TableCell>
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
