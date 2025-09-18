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
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton, // Added for icons
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule'; // Icon for schedule/calendar
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

// For TimePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs'; // Make sure dayjs is installed

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

const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function Classes() {
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null); // To store which class's schedule is being edited

  // State for scheduling form
  const [scheduleLabel, setScheduleLabel] = useState('');
  const [startTime, setStartTime] = useState(null); // dayjs object
  const [endTime, setEndTime] = useState(null);     // dayjs object
  const [scheduleColor, setScheduleColor] = useState('#C2185BFF'); // Default color
  const [selectedDays, setSelectedDays] = useState([]); // Array of selected days

  // Dummy class data (replace with actual data fetching)
  const [classes, setClasses] = useState([
    { id: 1, name: 'الحجرة رقم 01', students: 40, notes: 'يحتوي على 40 تلميذ' },
    { id: 2, name: 'الحجرة رقم 02', students: 20, notes: 'يحتوي على 20 تلميذ' },
    { id: 3, name: 'الحجرة رقم 03', students: 20, notes: 'يحتوي على 20 تلميذ' },
  ]);

  const handleOpenScheduleModal = (classData) => {
    setSelectedClass(classData);
    setShowScheduleModal(true);
    // Reset schedule form states when opening for a new class
    setScheduleLabel('');
    setStartTime(null);
    setEndTime(null);
    setScheduleColor('#C2185BFF');
    setSelectedDays([]);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    // Here you would typically send this schedule data to your backend
    console.log("Adding schedule for class:", selectedClass.name);
    console.log("Schedule details:", {
      label: scheduleLabel,
      startTime: startTime ? startTime.format('HH:mm') : null,
      endTime: endTime ? endTime.format('HH:mm') : null,
      color: scheduleColor,
      days: selectedDays,
    });
    // Close modal and possibly show a success message
    setShowScheduleModal(false);
    // You would then refresh the calendar view for this class (not implemented here)
  };

  const handleDaysChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDays(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    // LocalizationProvider is needed for TimePicker to work
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={Styles.page} p={3}>
        <Typography variant="h4" className={Styles.title} gutterBottom>
          الأقسام
        </Typography>
        <Box mb={2} display="flex" gap={2}>
          <TextField
            label="🔍 البحث باسم القسم"
            variant="outlined"
            size="small"
            sx={{
              width: 250,
              background: "#f9fafb",
              borderRadius: "10px"
            }}
          />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            sx={{ borderRadius: "10px", textTransform: "none" }}
            onClick={() => setShowAddClassModal(true)}
          >
            إضافة قسم
          </Button>
        </Box>

        <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
          <Table className={Styles.table}>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم القسم</TableCell>
                <TableCell>ملاحظات</TableCell>
                <TableCell>الإجراءات</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Modal for adding a new class (existing) */}
        <Modal open={showAddClassModal} onClose={() => setShowAddClassModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>إضافة قسم جديد</Typography>
              <form className={Styles.form}>
                <TextField label="اسم القسم" required fullWidth margin="normal" />
                <TextField type='number' label="الحد الأقصى للتلاميذ" required fullWidth margin="normal" />
                <TextField type='number' label="رسوم الدراسة" required fullWidth margin="normal" />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" type="submit">حفظ</Button>
                  <Button variant="outlined" onClick={() => setShowAddClassModal(false)}>إلغاء</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        {/* Modal for scheduling a class (new) */}
        <Modal open={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
          <Box className={Styles.modalOverlay}>
            <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                جدولة لـ {selectedClass ? selectedClass.name : ''}
              </Typography>
              <form onSubmit={handleAddSchedule} className={Styles.form}>
                <FormLabel component="legend" sx={{ mt: 2, mb: 1 }}>التسمية</FormLabel>
                <Select
                  fullWidth
                  value={scheduleLabel}
                  onChange={(e) => setScheduleLabel(e.target.value)}
                  input={<OutlinedInput />}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>اختر تسمية</em>;
                    }
                    return selected;
                  }}
                  MenuProps={MenuProps}
                  sx={{ mb: 2 }}
                >
                  <MenuItem disabled value="">
                    <em>اختر تسمية</em>
                  </MenuItem>
                  {classNames.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>

                <Box display="flex" gap={2} mb={2}>
                  <TimePicker
                    label="وقت البداية"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    sx={{ flex: 1 }}
                  />
                  <TimePicker
                    label="وقت النهاية"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    sx={{ flex: 1 }}
                  />
                  {/* Simple text field for color for now, can be replaced by a color picker */}
                  <TextField
                    label="اللون"
                    value={scheduleColor}
                    onChange={(e) => setScheduleColor(e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                  />
                </Box>

                <FormLabel component="legend" sx={{ mb: 1 }}>الأيام</FormLabel>
                <Select
                  fullWidth
                  multiple
                  value={selectedDays}
                  onChange={handleDaysChange}
                  input={<OutlinedInput id="select-multiple-chip" label="الأيام" />}
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
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>

                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="contained" type="submit">حفظ</Button>
                  <Button variant="outlined" onClick={() => setShowScheduleModal(false)}>إلغاء</Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Modal>

        {/* This Snackbar is for general messages, like "تم حفظ معلومات القسم" */}
        <Snackbar
          open={false} // You'll manage this state
          autoHideDuration={6000}
          onClose={() => {}}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
            تم حفظ معلومات القسم
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}