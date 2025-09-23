import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Pour supporter le français
import Styles from '../Styles/Temps.module.css';

// Données initiales basées sur la capture d'écran
const initialGroups = [
  { id: 1, name: 'Salle 01', schedule: { 'Dimanche': { start: '08:00', end: '10:00' }, 'Lundi': { start: '14:00', end: '16:00' } } },
  { id: 2, name: 'Salle 02', schedule: { 'Mardi': { start: '10:30', end: '12:30' }, 'Mercredi': { start: '14:00', end: '16:00' } } },
  { id: 3, name: 'Salle 03', schedule: { 'Dimanche': { start: '08:00', end: '10:00' }, 'Jeudi': { start: '14:00', end: '16:00' } } },
];

const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const Temps = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [newGroup, setNewGroup] = useState({ name: '' });
  const [selectedDate, setSelectedDate] = useState(dayjs('2025-09-21')); // Date par défaut aujourd'hui
  const [editing, setEditing] = useState({ groupId: null, day: null });

  const handleAddGroup = () => {
    if (newGroup.name) {
      setGroups([...groups, { id: groups.length + 1, name: newGroup.name, schedule: {} }]);
      setNewGroup({ name: '' });
    }
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const handleEditSchedule = (groupId, day) => {
    setEditing({ groupId, day });
  };

  const handleSaveSchedule = (groupId, day, start, end) => {
    setGroups(groups.map(group =>
      group.id === groupId ? { ...group, schedule: { ...group.schedule, [day]: { start, end } } } : group
    ));
    setEditing({ groupId: null, day: null });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <Box className={Styles.page} p={3} dir="ltr">
        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", mb: 2 }}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" className={Styles.title}>
              Emploi du Temps
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} size="small" className={Styles.searche} />}
                sx={{ width: '200px' }}
              />
            
          
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          <Table className={Styles.table}>
            <TableHead sx={{ background: "#f3f4f6" }}>
              <TableRow>
                <TableCell>Nom du groupe</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption">{day}</Typography>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  {daysOfWeek.map((day) => (
                    <TableCell key={day} sx={{ position: 'relative', height: '60px', padding: '8px' }}>
                      {editing.groupId === group.id && editing.day === day ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            size="small"
                            defaultValue={group.schedule[day]?.start || '08:00'}
                            onBlur={(e) => handleSaveSchedule(group.id, day, e.target.value, group.schedule[day]?.end || '10:00')}
                            sx={{ width: '60px' }}
                          />
                          <TextField
                            size="small"
                            defaultValue={group.schedule[day]?.end || '10:00'}
                            onBlur={(e) => handleSaveSchedule(group.id, day, group.schedule[day]?.start || '08:00', e.target.value)}
                            sx={{ width: '60px' }}
                          />
                        </Box>
                      ) : (
                        group.schedule[day] && (
                          <Box
                            className={Styles['schedule-event']}
                            sx={{
                              backgroundColor: '#9c27b0',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                            }}
                            onClick={() => handleEditSchedule(group.id, day)}
                          >
                            {group.schedule[day].start} - {group.schedule[day].end}
                          </Box>
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      className={Styles['delete-btn']}
                      color="error"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};