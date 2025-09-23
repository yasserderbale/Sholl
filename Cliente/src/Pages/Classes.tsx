import React, { useRef, useState } from 'react';
import Styles from '../Styles/Groupe.module.css';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  Select,
  OutlinedInput,
  MenuItem,
  Snackbar,
  Alert,
  FormLabel,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const classNames = [
  'فوج 01 علوم',
  'فوج 02 رياضيات',
  'فوج 03 آداب',
  'فوج 04 تسيير واقتصاد',
];

const daysOfWeek = ["Dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export function Classes() {
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [scheduleLabel, setScheduleLabel] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [scheduleColor, setScheduleColor] = useState('#C2185BFF');
  const [selectedDays, setSelectedDays] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});

  const [classes, setClasses] = useState([
    { id: 1, name: 'الحجرة رقم 01', students: 40, notes: 'يحتوي على 40 تلميذ' },
    { id: 2, name: 'الحجرة رقم 02', students: 20, notes: 'يحتوي على 20 تلميذ' },
    { id: 3, name: 'الحجرة رقم 03', students: 20, notes: 'يحتوي على 20 تلميذ' },
  ]);

  const handleOpenScheduleModal = (classData) => {
    setSelectedClass(classData);
    setShowScheduleModal(true);
    setScheduleLabel('');
    setStartTime(null);
    setEndTime(null);
    setScheduleColor('#C2185BFF');
    setSelectedDays([]);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    const newSchedule = {
      [scheduleLabel]: {
        startTime: startTime ? startTime.format('HH:mm') : null,
        endTime: endTime ? endTime.format('HH:mm') : null,
        days: selectedDays,
      },
    };
    setClassSchedules((prev) => ({
      ...prev,
      [selectedClass.id]: {
        ...prev[selectedClass.id],
        ...newSchedule,
      },
    }));
    setShowScheduleModal(false);
  };

  const handleDaysChange = (event) => {
    const { target: { value } } = event;
    setSelectedDays(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Typography variant="h4" className={Styles.title} gutterBottom>
          Classes
        </Typography>
        <Box mb={2} display="flex" gap={2}>
          <TextField
            label="🔍 Rechercher par nom de département"
            variant="outlined"
            size="small"
            sx={{ width: 250, background: "#f9fafb", borderRadius: "10px" }}
          />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            sx={{ borderRadius: "10px", textTransform: "none" }}
            onClick={() => setShowAddClassModal(true)}
          >
            Ajouter une classe
          </Button>
        </Box>
        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          <Table className={Styles.table}>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell> Nom Classe</TableCell>
                <TableCell>commentaires</TableCell>
                <TableCell> Actions</TableCell>
                <TableCell colSpan={7}>Calendrier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.id}</TableCell>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.notes}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenScheduleModal(classItem)}
                      title="جدولة"
                    >
                      <ScheduleIcon />
                    </IconButton>
                    <IconButton color="info" title="تعديل">
                      <Update />
                    </IconButton>
                    <IconButton color="error" title="حذف">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell colSpan={7}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, p: 1 }}>
                      {daysOfWeek.map((day, index) => (
                        <Box key={index} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption">{day}</Typography>
                          <Box sx={{ height: 100, background: '#f0f0f0', borderRadius: 4, p: 1 }}>
                            {classSchedules[classItem.id]?.[scheduleLabel]?.days?.includes(day) && (
                              <Typography>
                                {classSchedules[classItem.id]?.[scheduleLabel]?.startTime} -
                                {classSchedules[classItem.id]?.[scheduleLabel]?.endTime}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Ajouter une nouvelle classe</Typography>
              <form className={Styles.form}>
                <TextField label="Nom Clsse" required fullWidth margin="normal" />
                <TextField type='number' label="Nombre maximum d'étudiants" required fullWidth margin="normal" />
                <TextField type='number' label="Frais de scolarité" required fullWidth margin="normal" />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" type="submit">sauvegarder</Button>
                  <Button variant="outlined" onClick={() => setShowAddClassModal(false)}>annuler</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        <Modal open={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Calendare  {selectedClass ? selectedClass.name : ''}
              </Typography>
              <form onSubmit={handleAddSchedule} className={Styles.form}>
                <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>Nom</FormLabel>
                <Select
                  fullWidth
                  value={scheduleLabel}
                  onChange={(e) => setScheduleLabel(e.target.value)}
                  input={<OutlinedInput />}
                  displayEmpty
                  renderValue={(selected) => (selected.length === 0 ? <em>Choisissez une Nom</em> : selected)}
                  MenuProps={MenuProps}
                  sx={{ mb: 2 }}
                >
                  <MenuItem disabled value="">
                    <em>Choisissez une Nom</em>
                  </MenuItem>
                  {classNames.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>

                <Box display="flex" gap={2} mb={2}>
                  <TimePicker
                    label="Heure de début"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    sx={{ flex: 1 }}
                  />
                  <TimePicker
                    label="Heure de fin"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    sx={{ flex: 1 }}
                  />

                </Box>

                <FormLabel component="legend" sx={{ mb: 1 }}>Joures</FormLabel>
                <Select
                  fullWidth
                  multiple
                  value={selectedDays}
                  onChange={handleDaysChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Les jours" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Button key={value} variant="outlined" size="small" sx={{ m: 0.5 }}>
                          {value}
                        </Button>
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" type="submit">sauvegarder</Button>
                  <Button variant="outlined" onClick={() => setShowScheduleModal(false)}>annuler</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        <Snackbar
          open={false}
          autoHideDuration={6000}
          onClose={() => { }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => { }} severity="success" sx={{ width: '100%' }}>
            Les informations de la section ont été enregistrées
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}