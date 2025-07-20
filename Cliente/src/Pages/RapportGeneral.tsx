import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

export  function RapportGeneral() {
  return (
    <Box sx={{width:'80%'}} p={3}>
      <Typography variant="h4" gutterBottom>
        📊 Rapport Général
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} >
          <Card>
            <CardContent>
              <Typography variant="h6">Total élèves</Typography>
              <Typography variant="h4">150</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Élèves actifs</Typography>
              <Typography variant="h4">140</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Modules</Typography>
              <Typography variant="h4">8</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Mnt total payé</Typography>
              <Typography variant="h4">500,000 DA</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* يمكن تزيد Graph هنا */}

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
