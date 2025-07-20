import React from 'react';
import Styles from '../Styles/Tableboard.module.css';

import {
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

export function TablBoard() {
  return (
    <Box className={Styles.dashboard} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        Tableau de bord
      </Typography>

      <Grid container spacing={2} className={Styles.cardsContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <Typography variant="h6">👥 Nombre d'élèves</Typography>
            <Typography variant="h4">150</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <Typography variant="h6">🆕 Nouveaux élèves ce mois</Typography>
            <Typography variant="h4">10</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <Typography variant="h6">💵 Paiements ce mois</Typography>
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={Styles.card} elevation={3}>
            <Typography variant="h6">💰 Montant total encaissé</Typography>
            <Typography variant="h4">120000 DA</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box className={Styles.graphContainer} mt={4}>
        <Typography variant="h6">📈 Évolution mensuelle des revenus</Typography>
        <Box className={Styles.graphPlaceholder}>
          <Typography>Graphique ici</Typography>
        </Box>
      </Box>
    </Box>
  );
}
