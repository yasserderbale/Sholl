import React from "react";
import Styles from "../Styles/Tableboard.module.css";

import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export function TablBoard() {
  return (
    <Box className={Styles.dashboard}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Tableau de bord
      </Typography>

      {/* Cards */}
      <Grid container spacing={2} className={Styles.cardsContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <PeopleIcon style={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="h6">Nombre d'élèves</Typography>
            <Typography variant="h4">150</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <PersonAddIcon style={{ fontSize: 40, color: "#2e7d32" }} />
            <Typography variant="h6">Nouveaux élèves ce mois</Typography>
            <Typography variant="h4">10</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <PaymentIcon style={{ fontSize: 40, color: "#ed6c02" }} />
            <Typography variant="h6">Paiements ce mois</Typography>
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <MonetizationOnIcon style={{ fontSize: 40, color: "#d32f2f" }} />
            <Typography variant="h6">Montant total encaissé</Typography>
            <Typography variant="h4">120000 DA</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Graph */}
      <Box className={Styles.graphContainer} mt={4}>
        <Typography
          variant="h6"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <ShowChartIcon color="primary" /> Évolution mensuelle des revenus
        </Typography>
        <Box className={Styles.graphPlaceholder}>
          <Typography>Graphique ici</Typography>
        </Box>
      </Box>
    </Box>
  );
}
