import { Box, Typography } from "@mui/material";

export const Temps = () => {
  const jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  const couleursGroupes = {
    ISIL1: "#4caf50",
    ISIL2: "#2196f3",
    ISIL3: "#ff9800",
    ISIL4: "#e91e63",
  };

  const emploiData = {
    Dimanche: [
      { heure: "05:00", salle: "B1", groupe: "ISIL1" },
      { heure: "10:00", salle: "C2", groupe: "ISIL3" },
    ],
    Lundi: [
      { heure: "09:00", salle: "A1", groupe: "ISIL2" },
      { heure: "14:00", salle: "B3", groupe: "ISIL4" },
    ],
    Mardi: [
      { heure: "11:00", salle: "C1", groupe: "ISIL1" },
      { heure: "15:00", salle: "B2", groupe: "ISIL2" },
    ],
    Mercredi: [
      { heure: "08:00", salle: "A3", groupe: "ISIL4" },
      { heure: "13:00", salle: "C4", groupe: "ISIL3" },
    ],
    Jeudi: [
      { heure: "09:00", salle: "A2", groupe: "ISIL2" },
      { heure: "11:00", salle: "B1", groupe: "ISIL1" },
    ],
    Vendredi: [
      { heure: "08:00", salle: "C3", groupe: "ISIL3" },
      { heure: "10:00", salle: "A1", groupe: "ISIL4" },
    ],
  };

  const groupes = Object.keys(couleursGroupes);

  // تجهيز البيانات: لكل يوم ولكل مجموعة نلقاو heure début و fin و salles
  const emploiParJour = jours.map((jour) => {
    const data = emploiData[jour] || [];
    const groupesData: any = {};
    groupes.forEach((g) => {
      const coursGroupe = data.filter((c) => c.groupe === g);
      if (coursGroupe.length > 0) {
        const heures = coursGroupe.map((c) => c.heure).sort();
        const salles = coursGroupe.map((c) => c.salle);
        groupesData[g] = {
          debut: heures[0],
          fin: heures[heures.length - 1],
          salles,
        };
      }
    });
    return groupesData;
  });

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#fafafa", p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
      >
        Emploi du Temps
      </Typography>

      {/* Header: Jours */}
      <Box sx={{ display: "flex", borderBottom: "3px solid #1976d2" }}>
        <Box sx={{ width: "150px", textAlign: "center", fontWeight: "bold", color: "#333" }}>
          Groupes
        </Box>
        {jours.map((jour) => (
          <Box key={jour} sx={{ flex: 1, textAlign: "center", fontWeight: "bold", color: "#333" }}>
            {jour}
          </Box>
        ))}
      </Box>

      {/* Rows: Chaque groupe */}
      {groupes.map((groupe) => (
        <Box key={groupe} sx={{ display: "flex", borderBottom: "1px solid #ddd" }}>
          {/* Nom du groupe */}
          <Box sx={{
            width: "150px",
            textAlign: "center",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #ddd",
            backgroundColor: "#f5f5f5",
          }}>
            {groupe}
          </Box>

          {/* Cases pour chaque jour */}
          {emploiParJour.map((jourData, idx) => {
            const cours = jourData[groupe];
            return (
              <Box
                key={groupe + idx}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "1px solid #eee",
                  backgroundColor: cours ? couleursGroupes[groupe] : "#fff",
                  color: cours ? "#fff" : "#777",
                  fontWeight: cours ? "bold" : "normal",
                  p: 1,
                  textAlign: "center",
                }}
              >
                {cours ? (
                  <>
                    <Typography variant="body2">{groupe}</Typography>
                    <Typography variant="caption">Salle: {cours.salles.join(", ")}</Typography>
                    <Typography variant="caption" display="block">
                      {cours.debut} - {cours.fin}
                    </Typography>
                  </>
                ) : (
                  "-"
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
