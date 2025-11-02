import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Person, 
  Group, 
  CheckCircle, 
  Warning, 
  Cancel,
  School,
  Payment,
  Assessment,
  Search,
  CalendarMonth,
  Refresh
} from '@mui/icons-material';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { useSchool } from '../Context/SchoolContext';

interface PaymentStatus {
  studentId: string;
  studentName: string;
  groupName?: string;
  subjects: {
    subjectId: string;
    subjectName: string;
    price: number;
    totalPaid: number;
    remaining: number;
    status: 'paye' | 'partiel' | 'non_paye';
    paymentsCount: number;
  }[];
  totalExpected: number;
  totalPaid: number;
  totalRemaining: number;
  overallStatus: 'paye' | 'partiel' | 'non_paye';
}

const PaymentReport: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings } = useSchool();
  const { groupe: groups, stude: students, getStudentes, getgroupes, tocken } = usAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('tous');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [studentSearch, setStudentSearch] = useState<string>('');
  
  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    if (getStudentes) getStudentes();
    if (getgroupes) getgroupes();
  }, []);
  
  // Debug: عرض بيانات المجموعات
  useEffect(() => {
    if (groups && groups.length > 0) {
      console.log('المجموعات المتاحة:', groups);
      console.log('أول مجموعة:', groups[0]);
    }
  }, [groups]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // تصفية التلاميذ حسب المجموعة المختارة
  const filteredStudents = useMemo(() => {
    if (selectedGroup === 'tous') {
      return students || [];
    }
    
    const group = groups?.find(g => g._id === selectedGroup);
    if (!group || !group.Studentid) {
      return [];
    }
    
    return (students || []).filter((student: any) => 
      group.Studentid.includes(student._id || student.id)
    );
  }, [students, groups, selectedGroup]);

  // جلب بيانات المدفوعات من الباك إند
  const fetchPaymentData = async () => {
    if (!selectedMonth) {
      setPaymentStatuses([]);
      return;
    }
    
    if (!tocken) {
      alert('Session expirée. Veuillez vous reconnecter.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);

    try {
      // استدعاء الـ endpoint الجديد مع المعاملات (بدون year)
      const params = new URLSearchParams();
      if (selectedMonth) params.set('month', selectedMonth);
      if (selectedGroup) params.set('groupId', selectedGroup);
      const url = `http://localhost:3000/paiements/report?${params.toString()}`;
      console.log('طلب التقرير:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${tocken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('بيانات التقرير من الباك إند:', data);
        
        if (data.success && data.data) {
          // حفظ الإحصائيات من الباك إند
          if (data.data.stats) {
            setBackendStats(data.data.stats);
          }
          
          // تحويل البيانات إلى التنسيق المطلوب
          const formattedStatuses: PaymentStatus[] = data.data.students.map((student: any) => {
            // حماية من null/undefined
            const subjects = Array.isArray(student.subjects) ? student.subjects : [];
            
            return {
              studentId: student.studentId || '',
              studentName: student.studentName || 'غير محدد',
              groupName: cleanGroupName(student.groupName || 'Non assigné'),
              subjects: subjects.map((sub: any) => ({
                subjectId: sub.subjectId || '',
                subjectName: sub.subjectName || 'غير محدد',
                price: sub.price || 0,
                totalPaid: sub.totalPaid || 0,
                remaining: sub.remaining || 0,
                status: sub.status || 'non_paye',
                paymentsCount: sub.paymentsCount || 0
              })),
              totalExpected: student.totalExpected || 0,
              totalPaid: student.totalPaid || 0,
              totalRemaining: student.totalRemaining || 0,
              overallStatus: student.overallStatus || 'non_paye'
            };
          });

          setPaymentStatuses(formattedStatuses);
        } else {
          console.error('Erreur dans la réponse du serveur:', data.message);
          setPaymentStatuses([]);
        }
      } else {
        console.error('Erreur dans la réponse:', response.status);
        if (response.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/login';
        }
        setPaymentStatuses([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de paiement:', error);
      setPaymentStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [selectedGroup, selectedMonth, filteredStudents]);

  // دوال المساعدة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paye': return 'success';
      case 'partiel': return 'warning';
      case 'non_paye': return 'error';
      default: return 'default';
    }
  };

  // دالة لتنظيف أسماء المجموعات من النص الإضافي
  const cleanGroupName = (groupName: string) => {
    if (!groupName) return groupName;
    // إزالة النص الإضافي بعد "–" مثل "– (2/22 Gestion des élèves)"
    if (groupName.includes(' – ')) {
      return groupName.split(' – ')[0].trim();
    }
    // إزالة الأرقام مثل /22 أو /6 من نهاية اسم المجموعة (للحالات القديمة)
    return groupName.replace(/\s*\/\d+.*$/, '').trim();
  };


  const getStatusText = (status: string) => {
    switch (status) {
      case 'paye': return 'Payé';
      case 'partiel': return 'Partiel';
      case 'non_paye': return 'Non payé';
      default: return status;
    }
  };

  // إحصائيات من الباك إند أو محسوبة محلياً
  const [backendStats, setBackendStats] = useState<any>(null);
  
  // فلترة البيانات حسب البحث
  const filteredStatuses = useMemo(() => {
    if (!studentSearch.trim()) {
      return paymentStatuses;
    }
    
    const searchTerm = studentSearch.toLowerCase();
    return paymentStatuses.filter(status => 
      status.studentName.toLowerCase().includes(searchTerm) ||
      status.groupName?.toLowerCase().includes(searchTerm)
    );
  }, [paymentStatuses, studentSearch]);
  
  const stats = useMemo(() => {
    // إذا كانت هناك إحصائيات من الباك إند، استخدمها
    if (backendStats) {
      return {
        total: backendStats.total,
        paye: backendStats.paye,
        partiel: backendStats.partiel,
        nonPaye: backendStats.nonPaye,
        totalExpected: backendStats.totalExpected,
        totalCollected: backendStats.totalCollected,
        totalRemaining: backendStats.totalExpected - backendStats.totalCollected,
        collectionRate: backendStats.collectionRate
      };
    }
    
    // وإلا احسبها محلياً من البيانات المفلترة
    const total = filteredStatuses.length;
    const paye = filteredStatuses.filter(s => s.overallStatus === 'paye').length;
    const partiel = filteredStatuses.filter(s => s.overallStatus === 'partiel').length;
    const nonPaye = filteredStatuses.filter(s => s.overallStatus === 'non_paye').length;
    
    const totalExpected = filteredStatuses.reduce((sum, s) => sum + s.totalExpected, 0);
    const totalCollected = filteredStatuses.reduce((sum, s) => sum + s.totalPaid, 0);
    const totalRemaining = totalExpected - totalCollected;

    return {
      total,
      paye,
      partiel,
      nonPaye,
      totalExpected,
      totalCollected,
      totalRemaining,
      collectionRate: totalExpected > 0 ? (totalCollected / totalExpected * 100).toFixed(1) : '0'
    };
  }, [paymentStatuses, backendStats, filteredStatuses]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStatuses = filteredStatuses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  return (
    <Box p={3}>
      {/* اسم المدرسة */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: '15px',
          p: 3,
          mb: 4,
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <School sx={{ fontSize: 50, mr: 2 }} />
          <Typography variant="h3" fontWeight="bold">
            {language === 'ar' ? settings.schoolNameAr : settings.schoolNameFr}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {language === 'ar' ? 'للتعليم المتميز والتربية الحديثة' : 'For Excellence in Education and Modern Training'}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
          {language === 'ar' ? 'نبني جيل المستقبل' : 'Building the Future Generation'}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Assessment sx={{ fontSize: 35, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" gutterBottom>
            {t('paymentReportsTitle')}
          </Typography>
        </Box>
      </Box>

      {/* فلاتر التحكم */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "flex-start"
          }}
        >
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <TextField
              fullWidth
              label={`${t('search')} ${t('student')}`}
              variant="outlined"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder={`${t('search')} ${t('name')}, ${t('phone')}...`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'action.active' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                background: "#f9fafb",
                borderRadius: "10px"
              }}
            />
          </Box>
          
          <Box sx={{ flex: "1 1 250px", minWidth: "200px" }}>
            <FormControl fullWidth>
              <InputLabel>
                <Box display="flex" alignItems="center">
                  <Group sx={{ mr: 1, fontSize: 20 }} />
                  {t('group')}
                </Box>
              </InputLabel>
              <Select
                value={selectedGroup}
                label={t('group')}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <MenuItem value="tous">
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1, fontSize: 18 }} />
                    Tous les étudiants
                  </Box>
                </MenuItem>
                {(groups || []).map((group: any) => {
                  const groupId = group.id || group._id || '';
                  const rawGroupName = group.Name || group.name || group.nom || `Groupe ${groupId}`;
                  const groupName = cleanGroupName(rawGroupName);
                  return (
                    <MenuItem key={groupId} value={groupId}>
                      <Box display="flex" alignItems="center">
                        <Group sx={{ mr: 1, fontSize: 18 }} />
                        {groupName}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <FormControl fullWidth>
              <InputLabel>
                <Box display="flex" alignItems="center">
                  <CalendarMonth sx={{ mr: 1, fontSize: 20 }} />
                  {t('month')}
                </Box>
              </InputLabel>
              <Select
                value={selectedMonth}
                label={t('month')}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(month => (
                  <MenuItem key={month} value={month}>
                    <Box display="flex" alignItems="center">
                      <CalendarMonth sx={{ mr: 1, fontSize: 18 }} />
                      {month}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={loading ? <Refresh className="animate-spin" /> : <Refresh />}
              onClick={fetchPaymentData}
              disabled={loading || !selectedMonth}
              sx={{ 
                height: '56px',
                borderRadius: "10px",
                textTransform: "none"
              }}
            >
              {loading ? t('loading') : t('refreshReport')}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* الإحصائيات السريعة */}
      {selectedMonth && paymentStatuses.length > 0 && (
        <Box 
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  <Person sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('totalStudents')}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  <CheckCircle sx={{ fontSize: 30, color: 'success.main', mr: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {stats.paye}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fullyPaid')}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  <Warning sx={{ fontSize: 30, color: 'warning.main', mr: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {stats.partiel}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('partiallyPaid')}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                  <Cancel sx={{ fontSize: 30, color: 'error.main', mr: 1 }} />
                  <Typography variant="h4" color="error.main">
                    {stats.nonPaye}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('notPaid')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* جدول التقرير */}
      {selectedMonth && (
        <Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <strong>{t('student')}</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Group sx={{ mr: 1, color: 'primary.main' }} />
                    <strong>{t('group')}</strong>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                    <strong>{t('generalStatus')}</strong>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Payment sx={{ mr: 1, color: 'success.main' }} />
                    <strong>{t('paid')}</strong>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Payment sx={{ mr: 1, color: 'error.main' }} />
                    <strong>{t('remaining')}</strong>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <School sx={{ mr: 1, color: 'primary.main' }} />
                    <strong>{t('subjectDetails')}</strong>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Chargement des données...
                  </TableCell>
                </TableRow>
              ) : paginatedStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {selectedMonth ? 'Aucune donnée pour le mois sélectionné' : 'Veuillez sélectionner un mois'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStatuses.map((status) => (
                  <TableRow key={status.studentId}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {status.studentName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {status.studentName}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {cleanGroupName(status.groupName || 'Non assigné')}
                      </Typography>
                    </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      icon={
                        status.overallStatus === 'paye' ? <CheckCircle /> :
                        status.overallStatus === 'partiel' ? <Warning /> : <Cancel />
                      }
                      label={getStatusText(status.overallStatus)}
                      color={getStatusColor(status.overallStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="success.main">
                      {status.totalPaid.toLocaleString()} DA
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / {status.totalExpected.toLocaleString()} DA
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      color={status.totalRemaining > 0 ? "error.main" : "success.main"}
                    >
                      {status.totalRemaining.toLocaleString()} DA
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
                      {status.subjects && status.subjects.length > 0 ? status.subjects.map((subject) => (
                        <Chip
                          key={subject.subjectId}
                          icon={
                            subject.status === 'paye' ? <CheckCircle /> :
                            subject.status === 'partiel' ? <Warning /> : <Cancel />
                          }
                          label={`${subject.subjectName}: ${getStatusText(subject.status)}`}
                          color={getStatusColor(subject.status) as any}
                          size="small"
                          variant="outlined"
                          title={`${subject.totalPaid}/${subject.price} DA`}
                        />
                      )) : (
                        <Typography variant="body2" color="text.secondary">
                          Aucune matière assignée
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
          </TableContainer>
        
        {paymentStatuses.length > 0 && (
          <TablePagination
            component="div"
            count={paymentStatuses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
            }
          />
        )}
        </Paper>
      )}
    </Box>
  );
};

export default PaymentReport;
