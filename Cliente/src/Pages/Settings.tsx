import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';
import LanguageIcon from '@mui/icons-material/Language';
// import { useLanguage } from '../Context/LanguageContext'; // غير مستخدم حالياً
import { useSchool } from '../Context/SchoolContext';
import { usAuth } from '../Context/AuthContext';

interface SchoolSettings {
  schoolNameFr: string;
  schoolNameAr: string;
  address: string;
  phone: string;
  email: string;
}

export const Settings: React.FC = () => {
  const { tocken } = usAuth();
  const { settings: schoolSettings, updateSettings } = useSchool();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [settings, setSettings] = useState<SchoolSettings>({
    schoolNameFr: schoolSettings.schoolNameFr,
    schoolNameAr: schoolSettings.schoolNameAr,
    address: schoolSettings.address,
    phone: schoolSettings.phone,
    email: schoolSettings.email,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Translations
  const t = {
    fr: {
      title: 'Paramètres',
      schoolInfo: 'Informations de l\'École',
      schoolNameFr: 'Nom de l\'école (Français)',
      schoolNameAr: 'اسم المدرسة (العربية)',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      save: 'Sauvegarder',
      saving: 'Sauvegarde...',
      preview: 'Aperçu',
      successMsg: 'Paramètres sauvegardés avec succès ✅',
      errorMsg: 'Erreur lors de la sauvegarde ❌',
      notDefined: 'Non défini',
    },
    ar: {
      title: 'الإعدادات',
      schoolInfo: 'معلومات المدرسة',
      schoolNameFr: 'اسم المدرسة (بالفرنسية)',
      schoolNameAr: 'اسم المدرسة (بالعربية)',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      preview: 'معاينة',
      successMsg: 'تم حفظ الإعدادات بنجاح ✅',
      errorMsg: 'خطأ في الحفظ ❌',
      notDefined: 'غير محدد',
    }
  };

  // Fetch settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  // تحديث الإعدادات المحلية عند تغيير إعدادات المدرسة من Context
  useEffect(() => {
    setSettings({
      schoolNameFr: schoolSettings.schoolNameFr,
      schoolNameAr: schoolSettings.schoolNameAr,
      address: schoolSettings.address,
      phone: schoolSettings.phone,
      email: schoolSettings.email,
    });
  }, [schoolSettings]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/settings', {
        headers: {
          'Authorization': `Bearer ${tocken}`,
        },
      });
      const data = await response.json();
      if (data.StatusCode === 200 && data.data) {
        setSettings(data.data);
        // تحديث Context أيضاً
        updateSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tocken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      
      if (data.StatusCode === 200) {
        // تحديث Context ليظهر التغيير في جميع الصفحات
        updateSettings(settings);
        
        setSnackbar({
          open: true,
          message: t[language].successMsg,
          severity: 'success',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: t[language].errorMsg,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {t[language].title}
            </Typography>
          </Box>
          
          {/* Language Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon sx={{ color: '#1976d2' }} />
            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={(_, newLang) => newLang && setLanguage(newLang)}
              size="small"
            >
              <ToggleButton value="fr">FR</ToggleButton>
              <ToggleButton value="ar">العربية</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* School Information */}
          <Box sx={{ flex: '1 1 65%', minWidth: '300px' }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SchoolIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t[language].schoolInfo}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label={t[language].schoolNameFr}
                        value={settings.schoolNameFr}
                        onChange={(e) => setSettings({ ...settings, schoolNameFr: e.target.value })}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label={t[language].schoolNameAr}
                        value={settings.schoolNameAr}
                        onChange={(e) => setSettings({ ...settings, schoolNameAr: e.target.value })}
                        variant="outlined"
                        sx={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                        inputProps={{ style: { textAlign: language === 'ar' ? 'right' : 'left' } }}
                      />
                    </Box>
                  </Box>
                  
                  <Box>
                    <TextField
                      fullWidth
                      label={t[language].address}
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label={t[language].phone}
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label={t[language].email}
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        type="email"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {loading ? t[language].saving : t[language].save}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Preview */}
          <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t[language].preview}
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#1976d2', 
                color: 'white', 
                borderRadius: 2,
                mb: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🎓 {settings.schoolNameFr}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, direction: 'rtl' }}>
                  {settings.schoolNameAr}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  <strong>Adresse:</strong> {settings.address || 'Non définie'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  <strong>Téléphone:</strong> {settings.phone || 'Non défini'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {settings.email || 'Non défini'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
