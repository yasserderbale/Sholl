import { 
  Box, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab
} from "@mui/material";
import { useEffect, useState } from "react";
import { usAuth } from "../Context/AuthContext";
import { useLanguage } from "../Context/LanguageContext";
import { AccessTime, Group as GroupIcon, CalendarMonth } from '@mui/icons-material';

interface GroupeTime {
  id: string;
  groupeId: {
    id: string;
    name: string;
  };
  heureDebut: string;
  heureFin: string;
  jours: string[];
  classeId: string;
  salle?: string;
}

export const Temps = () => {
  const { tocken } = usAuth();
  const { t } = useLanguage();
  const [classesWithGroups, setClassesWithGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const jours = [
    { name: t('sunday'), short: t('sun'), key: "Dimanche" },
    { name: t('monday'), short: t('mon'), key: "Lundi" },
    { name: t('tuesday'), short: t('tue'), key: "Mardi" },
    { name: t('wednesday'), short: t('wed'), key: "Mercredi" },
    { name: t('thursday'), short: t('thu'), key: "Jeudi" },
    { name: t('friday'), short: t('fri'), key: "Vendredi" },
    { name: t('saturday'), short: t('sat'), key: "Samedi" },
  ];

  const colors = [
    "#4caf50", "#2196f3", "#ff9800", "#e91e63",
    "#9c27b0", "#00bcd4", "#ff5722", "#795548"
  ];

  // Fetch all classes with their groups
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const classesRes = await fetch("http://localhost:3000/AllClasses", {
          headers: { Authorization: `Bearer ${tocken}` },
        });
        const classesData = await classesRes.json();
        
        if (classesData.StatusCode === 200) {
          const classesWithGroupsData = await Promise.all(
            classesData.data.map(async (classe: any) => {
              try {
                const groupesRes = await fetch(`http://localhost:3000/Classe/${classe.id}/groupes`, {
                  headers: { Authorization: `Bearer ${tocken}` },
                });
                const groupesData = await groupesRes.json();
                return {
                  ...classe,
                  groupeTimes: groupesData.StatusCode === 200 ? groupesData.data : [],
                };
              } catch {
                return { ...classe, groupeTimes: [] };
              }
            })
          );
          setClassesWithGroups(classesWithGroupsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [tocken]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f5f7fa", p: 3 }}>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
        >
          <Box display="flex" alignItems="center">
            <CalendarMonth sx={{ fontSize: 35, color: '#1976d2', mr: 2 }} />
            {t('scheduleTitle')}
          </Box>
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {t('selectClass')}
        </Typography>

        {classesWithGroups.length === 0 ? (
          <Card sx={{ textAlign: "center", py: 8, backgroundColor: "white" }}>
            <Typography variant="h6" color="textSecondary">
              {t('noData')}
            </Typography>
          </Card>
        ) : (
          <Box>
            {/* Tabs pour les classes */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, backgroundColor: "white", borderRadius: 2, p: 1 }}>
              <Tabs 
                value={selectedTab} 
                onChange={(_, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }
                }}
              >
                {classesWithGroups.map((classe) => (
                  <Tab 
                    key={classe.id} 
                    label={`${classe.name} (${classe.groupeTimes.length})`}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Contenu de la classe sélectionnée */}
            {classesWithGroups.map((classe, index) => {
              if (index !== selectedTab) return null;

              const emploiParJour = jours.map((jour) => {
                const coursJour = classe.groupeTimes.filter((gt: GroupeTime) => 
                  gt.jours.includes(jour.key)
                );
                return {
                  jour: jour.name,
                  short: jour.short,
                  cours: coursJour,
                };
              });

              return (
                <Box key={classe.id}>
                  {/* Grille des jours */}
                  {classe.groupeTimes.length === 0 ? (
                    <Card sx={{ textAlign: "center", py: 4, backgroundColor: "white", mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t('noData')}
                      </Typography>
                    </Card>
                  ) : (
                    <Box 
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "flex-start",
                        alignItems: "stretch"
                      }}
                    >
                      {emploiParJour.map((jourData) => (
                        <Box 
                          key={jourData.jour} 
                          sx={{
                            flex: "1 1 300px",
                            minWidth: "280px",
                            maxWidth: "350px"
                          }}
                        >
                          <Card 
                            sx={{ 
                              height: "100%",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              }
                            }}
                          >
                            <CardContent>
                              {/* Header du jour */}
                              <Box 
                                sx={{ 
                                  backgroundColor: "#1976d2", 
                                  color: "white", 
                                  p: 1.5, 
                                  borderRadius: 1,
                                  mb: 2,
                                  textAlign: "center"
                                }}
                              >
                                <Typography variant="h6" fontWeight="bold">
                                  {jourData.short}
                                </Typography>
                                <Typography variant="caption">
                                  {jourData.jour}
                                </Typography>
                              </Box>

                              {/* Liste des cours */}
                              {jourData.cours.length === 0 ? (
                                <Box sx={{ textAlign: "center", py: 2 }}>
                                  <Typography variant="body2" color="textSecondary">
                                    -
                                  </Typography>
                                </Box>
                              ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                  {jourData.cours.map((cours: GroupeTime, idx: number) => (
                                    <Box
                                      key={cours.id}
                                      sx={{
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        backgroundColor: colors[idx % colors.length] + "15",
                                        borderLeft: `3px solid ${colors[idx % colors.length]}`,
                                      }}
                                    >
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                        <GroupIcon sx={{ fontSize: 18, color: colors[idx % colors.length] }} />
                                        <Typography variant="body2" fontWeight="bold">
                                          {cours.groupeId.name}
                                        </Typography>
                                      </Box>
                                      {cours.salle && (
                                        <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: "block" }}>
                                          📍 Salle: {cours.salle}
                                        </Typography>
                                      )}
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                                        <Typography variant="caption" color="textSecondary">
                                          {cours.heureDebut} - {cours.heureFin}
                                        </Typography>
                                      </Box>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
      </Box>
    </Box>
  );
};

export default Temps;
