import { useState, useEffect } from 'react';
import Styles from "../Styles/Tableboard.module.css";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';

interface DashboardStats {
  totalStudents: number;
  newStudentsThisMonth: number;
  paymentsThisMonth: number;
  totalAmountThisMonth: number;
  monthlyRevenue: { month: string; amount: number }[];
  totalSubjects: number;
  totalGroups: number;
}

export function TablBoard() {
  const { tocken } = usAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${tocken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className={Styles.dashboard} p={3}>
      <Typography variant="h4" gutterBottom className={Styles.title}>
        {t('dashboard')}
      </Typography>

      {/* Cards */}
      <Box 
        className={Styles.cardsContainer}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4
        }}
      >
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <PeopleIcon style={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="h6">{t('totalStudents')}</Typography>
            <Typography variant="h4">{stats?.totalStudents || 0}</Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <PersonAddIcon style={{ fontSize: 40, color: "#2e7d32" }} />
            <Typography variant="h6">{t('newStudentsThisMonth')}</Typography>
            <Typography variant="h4">{stats?.newStudentsThisMonth || 0}</Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <PaymentIcon style={{ fontSize: 40, color: "#ed6c02" }} />
            <Typography variant="h6">{t('totalPayments')}</Typography>
            <Typography variant="h4">{stats?.paymentsThisMonth || 0}</Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <MonetizationOnIcon style={{ fontSize: 40, color: "#d32f2f" }} />
            <Typography variant="h6">{t('totalAmountCollected')}</Typography>
            <Typography variant="h4">{(stats?.totalAmountThisMonth || 0).toLocaleString()} DA</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <SchoolIcon style={{ fontSize: 40, color: "#9c27b0" }} />
            <Typography variant="h6">{t('numberOfSubjects')}</Typography>
            <Typography variant="h4">{stats?.totalSubjects || 0}</Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Paper className={Styles.card} elevation={3}>
            <GroupsIcon style={{ fontSize: 40, color: "#00897b" }} />
            <Typography variant="h6">{t('numberOfGroups')}</Typography>
            <Typography variant="h4">{stats?.totalGroups || 0}</Typography>
          </Paper>
        </Box>
      </Box>

      {/* Graph */}
      <Box className={Styles.graphContainer} mt={4}>
        <Typography
          variant="h6"
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}
        >
          <ShowChartIcon color="primary" /> {t('monthlyRevenueEvolution')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: '300px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          {stats?.monthlyRevenue.map((item, index) => {
            const maxAmount = Math.max(...(stats?.monthlyRevenue.map(r => r.amount) || [1]));
            // إذا كل القيم 0، نعرض أعمدة صغيرة
            const height = maxAmount > 0 ? (item.amount / maxAmount) * 250 : 30;
            
            return (
              <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="primary">
                  {item.amount.toLocaleString()} DA
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: `${height}px`,
                    minHeight: '30px',
                    backgroundColor: item.amount > 0 ? '#1976d2' : '#e0e0e0',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: item.amount > 0 ? '#1565c0' : '#bdbdbd',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {item.amount === 0 && (
                    <Typography variant="caption" color="#666" fontSize="10px">
                      {t('noData')}
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" sx={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                  {item.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
