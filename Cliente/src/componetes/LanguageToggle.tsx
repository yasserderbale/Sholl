import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../Context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 2, 
      borderTop: '1px solid #e0e0e0',
      mt: 'auto'
    }}>
      <LanguageIcon sx={{ color: '#1976d2', fontSize: 20 }} />
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={(_, newLang) => newLang && setLanguage(newLang)}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            border: '1px solid #1976d2',
            color: '#1976d2',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }
          }
        }}
      >
        <ToggleButton value="fr">FR</ToggleButton>
        <ToggleButton value="ar">عر</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
