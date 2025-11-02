import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  TablePagination
} from '@mui/material';
import { Close as CloseIcon, Payment } from '@mui/icons-material';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';

type Student = {
  id: string;
  Name: string;
  modules?: string[];
};

type Group = {
  id: string;
  name: string;
  students: Student[];
};

type Subject = {
  id: string;
  name: string;
  price: number;
};

type PaymentRecord = {
  id: string;
  studentId: string[];
  subjectId: string;
  month: string;
  year: string;
  amount: number;
  montantTotal?: number;
  montantPaye?: number;
  montantRestant?: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'overdue' | 'paye' | 'en_attente' | 'en_retard' | 'partiel';
  invoiceNumber?: string;
};

export function Paimentes() {
  const { t } = useLanguage();
  const { groupe, stude, tocken, mat, getgroupes, getStudentes } = usAuth() as {
    groupe: Group[];
    stude: Student[];
    tocken: string;
    mat: any[];
    getgroupes: () => void;
    getStudentes: () => void;
  };

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    if (getgroupes) getgroupes();
    if (getStudentes) getStudentes();
  }, []);
  
  // تحميل كل الطلاب في البداية
  useEffect(() => {
    if (stude && stude.length > 0) {
      console.log('تحميل كل الطلاب في البداية:', stude);
      setStudents(stude);
    }
  }, [stude]);

  // Debug: طباعة البيانات للتحقق من البنية
  console.log('Auth Context Data:');
  console.log('Groups (groupe):', groupe);
  console.log('Students (stude):', stude);
  console.log('Materials (mat):', mat);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // المواد من الـ Context مع الأسعار
  const subjects: Subject[] = useMemo(() => {
    return mat.map(matiere => ({
      id: matiere._id || matiere.id,
      name: matiere.name,
      price: matiere.prix
    }));
  }, [mat]);

  // الأشهر (مستخدمة في Modal)
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // التلاميذ مع موادهم من الـ Context
  const studentsWithModules = useMemo(() => {
    return stude.map((student: any) => ({
      id: student._id || student.id,
      Name: student.Name,
      modules: student.modules?.map((mod: any) => {
        if (typeof mod === 'string') return mod;
        if (mod.matid) return mod.matid._id || mod.matid;
        return mod._id || mod.id;
      }) || subjects.map(s => s.id)
    }));
  }, [stude, subjects]);

  // المواد التي يدرسها التلميذ المختار
  const studentSubjects = useMemo(() => {
    if (!selectedStudent) return [];
    const student = studentsWithModules.find(s => s.id === selectedStudent);
    if (!student || !student.modules) return [];
    return subjects.filter(subject => student.modules!.includes(subject.id));
  }, [selectedStudent, studentsWithModules, subjects]);

  // تحميل التلاميذ عند اختيار مجموعة
  useEffect(() => {
    console.log('Selected group ID:', selectedGroup);
    console.log('Available groups:', groupe);
    console.log('All students:', stude);
    
    // إذا اختار "جميع التلاميذ" أو لم يختر شيء
    if (!selectedGroup || selectedGroup === '' || selectedGroup === 'all') {
      console.log('Showing all students');
      setStudents(stude || []);
      return;
    }
    
    if (selectedGroup) {
      
      // البحث في المجموعات
      const group = groupe?.find(g => g.id === selectedGroup);
      
      if (group) {
        console.log('Found group:', group);
        console.log('Group Studentid:', (group as any).Studentid);
        
        // استخراج التلاميذ بناء على Studentid
        let groupStudents = [];
        
        if ((group as any).Studentid && Array.isArray((group as any).Studentid) && (group as any).Studentid.length > 0) {
          // فلترة التلاميذ بناء على معرفاتهم في المجموعة
          groupStudents = stude?.filter((student: any) => {
            const studentId = student.id || student._id;
            return (group as any).Studentid.includes(studentId);
          }) || [];
        } else {
          // إذا لم توجد معرفات تلاميذ، جرب طرق أخرى
          groupStudents = stude?.filter((student: any) => {
            // فلترة بناء على groupId في بيانات التلميذ
            return student.groupId === selectedGroup || 
                   student.groupe === selectedGroup ||
                   student.GroupeId === selectedGroup;
          }) || [];
        }
        
        console.log('Filtered group students:', groupStudents);
        setStudents(groupStudents);
      } else {
        console.log('Group not found');
        setStudents([]);
      }
    }
  }, [selectedGroup, groupe, stude]);

  // تحميل مدفوعات التلميذ
  const fetchStudentPayments = async (studentId: string) => {
    if (!studentId || !tocken) return;
    
    try {
      const response = await fetch(`http://localhost:3000/paiements/etudiant/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${tocken}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
        const payments = result.data?.map((p: any) => ({
          id: p._id || p.id,
          studentId: [studentId],
          subjectId: p.matiereId || p.matiere?._id,
          month: p.mois || '',
          year: p.annee || '2025',
          amount: p.montant || 0,
          montantTotal: p.montantTotal || 0,
          montantPaye: p.montantPaye || 0,
          montantRestant: p.montantRestant || 0,
          date: p.datePaiement || p.dateCreation || '',
          method: p.methodePaiement || 'نقداً',
          status: p.statut || p.statutCalcule || 'pending',
          invoiceNumber: p.numeroFacture
        })) || [];
        setStudentPayments(payments);
      }
    } catch (error) {
      console.error('خطأ في تحميل المدفوعات:', error);
    }
  };

  // تحديث مدفوعات التلميذ عند اختياره
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentPayments(selectedStudent);
    }
  }, [selectedStudent]);

  // حالة دفع المادة لشهر معين (مع حساب جميع الدفعات)
  const getSubjectPaymentStatus = (subjectId: string, month: string) => {
    const payments = studentPayments.filter(p => 
      p.subjectId === subjectId && p.month === month
    );
    
    if (payments.length === 0) return 'pending';
    
    // حساب إجمالي المدفوعات لهذا الشهر
    const totalPaid = payments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
    const subject = subjects.find(s => s.id === subjectId);
    const subjectPrice = subject?.price || 0;
    
    if (totalPaid >= subjectPrice) return 'paye';
    if (totalPaid > 0) return 'partiel';
    return 'pending';
  };
  
  // حساب إجمالي المدفوع لمادة في شهر معين
  const getTotalPaidForSubjectMonth = (subjectId: string, month: string) => {
    const payments = studentPayments.filter(p => 
      p.subjectId === subjectId && p.month === month
    );
    return payments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedSubject('');
    setSelectedMonth('');
    setSelectedYear('');
    setPaymentMethod('cash');
    setPaymentAmount(0);
  };

  const handleSavePayment = async () => {
    if (!selectedSubject || !selectedMonth || !selectedYear || !selectedStudent || !paymentAmount) {
      setToast({ open: true, message: t('fillAllRequiredFields'), severity: 'error' });
      return;
    }
    
    // Vérifications supplémentaires
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) {
      setToast({ open: true, message: t('subjectNotFound'), severity: 'error' });
      return;
    }
    
    // Calculer le montant déjà payé pour cette matière/mois
    const existingPayments = studentPayments.filter(p => 
      p.subjectId === selectedSubject && p.month === selectedMonth
    );
    const totalAlreadyPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
    const remainingAmount = Math.max(0, subject.price - totalAlreadyPaid);
    
    // Vérification 1: Le module est déjà entièrement payé
    if (remainingAmount === 0) {
      setToast({ 
        open: true, 
        message: `Cette matière est déjà entièrement payée pour ${selectedMonth}. Aucun paiement supplémentaire n'est nécessaire.`, 
        severity: 'warning' 
      });
      return;
    }
    
    // Vérification 2: Le montant saisi dépasse le prix du module
    if (paymentAmount > subject.price) {
      setToast({ 
        open: true, 
        message: `Le montant saisi (${paymentAmount} DA) dépasse le prix de la matière (${subject.price} DA)`, 
        severity: 'error' 
      });
      return;
    }
    
    // Vérification 3: Le montant saisi dépasse le montant restant
    if (paymentAmount > remainingAmount) {
      setToast({ 
        open: true, 
        message: `Le montant saisi (${paymentAmount} DA) dépasse le montant restant (${remainingAmount} DA)`, 
        severity: 'error' 
      });
      return;
    }
    
    // Vérification 4: Montant doit être positif
    if (paymentAmount <= 0) {
      setToast({ 
        open: true, 
        message: 'Le montant doit être supérieur à zéro', 
        severity: 'error' 
      });
      return;
    }

    try {
      // أولاً: تحقق من وجود الحقول الجديدة في الجدول
      console.log('Attempting to save payment:', {
        etudiantId: selectedStudent,
        matiereId: selectedSubject,
        mois: selectedMonth,
        annee: selectedYear,
        montant: paymentAmount,
        methodePaiement: paymentMethod
      });
      
      const response = await fetch('http://localhost:3000/paiements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tocken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          etudiantId: selectedStudent,
          matiereId: selectedSubject,
          mois: selectedMonth,
          annee: selectedYear,
          montant: paymentAmount,
          methodePaiement: paymentMethod,
          datePaiement: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      console.log('Payment response:', result);
      
      if (response.ok) {
        setToast({ open: true, message: 'تم حفظ الدفعة بنجاح', severity: 'success' });
        closeModal();
        fetchStudentPayments(selectedStudent);
      } else {
        // إذا كان الخطأ متعلق بالجدول، حاول إعادة إنشائه
        if (result.message && result.message.includes('no column named montantTotal')) {
          setToast({ 
            open: true, 
            message: 'يتم تحديث بنية قاعدة البيانات... يرجى إعادة المحاولة', 
            severity: 'warning' 
          });
          
          // محاولة إعادة إنشاء الجدول
          try {
            await fetch('http://localhost:3000/paiements/recreate-table', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${tocken}`,
                'Content-Type': 'application/json'
              }
            });
            setToast({ 
              open: true, 
              message: 'تم تحديث قاعدة البيانات. يرجى إعادة المحاولة', 
              severity: 'info' 
            });
          } catch (recreateError) {
            console.error('Error recreating table:', recreateError);
          }
        } else {
          setToast({ open: true, message: result.message || 'خطأ في حفظ الدفعة', severity: 'error' });
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setToast({ open: true, message: 'خطأ في الاتصال بالخادم', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paye': return 'success';
      case 'pending':
      case 'en_attente': return 'warning';
      case 'overdue':
      case 'en_retard': return 'error';
      case 'partiel': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
      case 'paye': return 'Payé';
      case 'pending':
      case 'en_attente': return 'En attente';
      case 'overdue':
      case 'en_retard': return 'En retard';
      case 'partiel': return 'Partiel';
      default: return status;
    }
  };
  
  // تنسيق التاريخ بدون رموز
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }).replace(/\//g, ' ');
    } catch {
      return dateString;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Payment sx={{ fontSize: 35, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4">{t('paymentManagement')}</Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            color="error"
            onClick={async () => {
              if (!window.confirm('⚠️ ATTENTION: Voulez-vous vraiment supprimer TOUS les paiements? Cette action est irréversible!')) {
                return;
              }
              
              try {
                const response = await fetch('http://localhost:3000/paiements/delete-all', {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${tocken}`
                  }
                });
                
                if (response.ok) {
                  const data = await response.json();
                  setToast({ open: true, message: data.message || 'Tous les paiements supprimés', severity: 'success' });
                  window.location.reload();
                } else {
                  setToast({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
                }
              } catch (error) {
                console.error('Error deleting payments:', error);
                setToast({ open: true, message: 'Erreur de connexion au serveur', severity: 'error' });
              }
            }}
          >
            Supprimer tous les paiements
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:3000/paiements/recreate-table', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${tocken}`
                  }
                });
                
                if (response.ok) {
                  setToast({ open: true, message: 'Table recréée avec succès', severity: 'success' });
                  window.location.reload();
                } else {
                  setToast({ open: true, message: 'Erreur lors de la recréation de la table', severity: 'error' });
                }
              } catch (error) {
                console.error('Error recreating table:', error);
                setToast({ open: true, message: 'Erreur de connexion au serveur', severity: 'error' });
              }
            }}
          >
            {t('updateDatabase')}
          </Button>
        </Box>
      </Box>

      {/* اختيار المجموعة والتلميذ */}
      <Box display="flex" gap={2} mb={4}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('selectGroup')}</InputLabel>
          <Select
            value={selectedGroup}
            label={t('selectGroup')}
            onChange={e => {
              setSelectedGroup(e.target.value);
              setSelectedStudent('');
            }}
          >
            {/* إضافة خيار لعرض جميع التلاميذ */}
            <MenuItem value="">{t('allGroups')}</MenuItem>
            {groupe && groupe.length > 0 ? (
              groupe.map((g: any) => {
                const groupId = g.id || g._id;
                const groupName = g.name || g.Name || `Groupe ${groupId}`;
                return (
                  <MenuItem key={groupId} value={groupId}>{groupName}</MenuItem>
                );
              })
            ) : (
              <MenuItem disabled>{t('noGroupsAvailable')}</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={students.length === 0}>
          <InputLabel>{t('selectStudent')}</InputLabel>
          <Select
            value={selectedStudent}
            label={t('selectStudent')}
            onChange={e => setSelectedStudent(e.target.value)}
          >
            {students.length > 0 ? (
              students.map((s: any) => {
                const studentId = s.id || s._id;
                const studentName = s.Name || s.name || `${t('student')} ${studentId}`;
                return (
                  <MenuItem key={studentId} value={studentId}>{studentName}</MenuItem>
                );
              })
            ) : (
              <MenuItem disabled>{t('selectGroupFirst')}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      {/* عرض مواد التلميذ مع الأسعار والألوان */}
      {selectedStudent && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {t('subject')} {studentsWithModules.find(s => s.id === selectedStudent)?.Name}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setSelectedMonth('');
                setSelectedSubject('');
                setPaymentAmount(0);
                setOpenModal(true);
              }}
            >
              {t('addNewPayment')}
            </Button>
          </Box>
          
          {/* عرض معلومات التلميذ */}
          <Box mb={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>{t('numberOfSubjects')}:</strong> {studentSubjects.length} {t('subject')}
            </Typography>
            <Typography variant="body2">
              <strong>{t('totalMonthlyAmount')}:</strong> {studentSubjects.reduce((sum, s) => sum + s.price, 0)} DA
            </Typography>
          </Box>
          
          {/* جدول المواد والأشهر - النصف الأول */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {t('paymentStatusAllMonths')} - 2025
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Matière</strong></TableCell>
                  {months.slice(0, 6).map(month => (
                    <TableCell key={month} align="center"><strong>{month}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {subject.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subject.price} DA/mois
                        </Typography>
                      </Box>
                    </TableCell>
                    {months.slice(0, 6).map(month => {
                      const status = getSubjectPaymentStatus(subject.id, month);
                      
                      return (
                        <TableCell key={month} align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(status) as any}
                            disabled={status === 'paye'}
                            onClick={() => {
                              // Vérifier si la matière est déjà entièrement payée
                              const totalPaid = getTotalPaidForSubjectMonth(subject.id, month);
                              const remainingAmount = Math.max(0, subject.price - totalPaid);
                              
                              if (remainingAmount === 0) {
                                setToast({ 
                                  open: true, 
                                  message: `${subject.name} est déjà entièrement payée pour ${month}`, 
                                  severity: 'info' 
                                });
                                return;
                              }
                              
                              setSelectedSubject(subject.id);
                              setSelectedMonth(month);
                              setSelectedYear('2025');
                              setPaymentAmount(remainingAmount);
                              setOpenModal(true);
                            }}
                            sx={{ 
                              minWidth: '80px',
                              fontSize: '0.7rem',
                              textTransform: 'none'
                            }}
                          >
                            {getStatusText(status)}
                            {(() => {
                              const totalPaid = getTotalPaidForSubjectMonth(subject.id, month);
                              if (totalPaid > 0) {
                                return (
                                  <Box component="span" sx={{ display: 'block', fontSize: '0.6rem' }}>
                                    {totalPaid}/{subject.price} DA
                                  </Box>
                                );
                              }
                              return null;
                            })()}
                          </Button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* جدول المواد والأشهر - النصف الثاني */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Matière</strong></TableCell>
                  {months.slice(6).map(month => (
                    <TableCell key={month} align="center"><strong>{month}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentSubjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {subject.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subject.price} DA/mois
                        </Typography>
                      </Box>
                    </TableCell>
                    {months.slice(6).map(month => {
                      const status = getSubjectPaymentStatus(subject.id, month);
                      
                      return (
                        <TableCell key={month} align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(status) as any}
                            disabled={status === 'paye'}
                            onClick={() => {
                              // Vérifier si la matière est déjà entièrement payée
                              const totalPaid = getTotalPaidForSubjectMonth(subject.id, month);
                              const remainingAmount = Math.max(0, subject.price - totalPaid);
                              
                              if (remainingAmount === 0) {
                                setToast({ 
                                  open: true, 
                                  message: `${subject.name} est déjà entièrement payée pour ${month}`, 
                                  severity: 'info' 
                                });
                                return;
                              }
                              
                              setSelectedSubject(subject.id);
                              setSelectedMonth(month);
                              setSelectedYear('2025');
                              setPaymentAmount(remainingAmount);
                              setOpenModal(true);
                            }}
                            sx={{ 
                              minWidth: '80px',
                              fontSize: '0.7rem',
                              textTransform: 'none'
                            }}
                          >
                            {getStatusText(status)}
                            {(() => {
                              const totalPaid = getTotalPaidForSubjectMonth(subject.id, month);
                              if (totalPaid > 0) {
                                return (
                                  <Box component="span" sx={{ display: 'block', fontSize: '0.6rem' }}>
                                    {totalPaid}/{subject.price} DA
                                  </Box>
                                );
                              }
                              return null;
                            })()}
                          </Button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* قائمة مدفوعات التلميذ */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            {t('paymentHistory')} ({studentPayments.length} {t('payment')})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('subject')}</TableCell>
                  <TableCell>{t('monthYear')}</TableCell>
                  <TableCell>{t('amountPaid')}</TableCell>
                  <TableCell>{t('remaining')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(payment => {
                    const subject = subjects.find(s => s.id === payment.subjectId);
                    const subjectPrice = subject?.price || 0;
                    const paidAmount = payment.montantPaye || payment.amount || 0;
                    const remainingAmount = Math.max(0, subjectPrice - paidAmount);
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {subject?.name || 'Non défini'}
                        </TableCell>
                        <TableCell>{payment.month} {payment.year}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {paidAmount} DA
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={remainingAmount > 0 ? "warning.main" : "success.main"}
                          >
                            {remainingAmount} DA
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(payment.status)} 
                            color={getStatusColor(payment.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {formatDate(payment.date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={studentPayments.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Nombre de lignes par page:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
              }
            />
          </TableContainer>
        </Box>
      )}

      {/* Modal ajout paiement */}
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">{t('paymentConfirmation')}</Typography>
            <IconButton onClick={closeModal}><CloseIcon /></IconButton>
          </Box>

          {selectedStudent && (
            <Box mb={3}>
              <Typography variant="body1" gutterBottom>
                <strong>{t('student')}:</strong> {stude.find(s => s.id === selectedStudent)?.Name}
              </Typography>
            </Box>
          )}

          {/* Sélection de la matière */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('selectSubject')} *</InputLabel>
            <Select
              value={selectedSubject}
              label={`${t('selectSubject')} *`}
              onChange={e => {
                setSelectedSubject(e.target.value);
                const subject = subjects.find(s => s.id === e.target.value);
                if (subject) {
                  setPaymentAmount(subject.price);
                }
              }}
            >
              {studentSubjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name} - {subject.price} DA
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sélection du mois */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('selectMonth')} *</InputLabel>
            <Select
              value={selectedMonth}
              label={`${t('selectMonth')} *`}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Affichage des informations de la matière sélectionnée */}
          {selectedSubject && selectedMonth && (
            <Box mb={3} p={2} sx={{ backgroundColor: '#f0f8ff', borderRadius: 2, border: '1px solid #e3f2fd' }}>
              <Typography variant="body1" gutterBottom>
                <strong>{t('subject')}:</strong> {subjects.find(s => s.id === selectedSubject)?.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('month')}:</strong> {selectedMonth} {selectedYear}
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.main', mt: 1 }}>
                <strong>{t('totalPrice')}:</strong> {subjects.find(s => s.id === selectedSubject)?.price} DA
              </Typography>
              
              {/* Affichage de l'état du paiement actuel */}
              {(() => {
                const existingPayments = studentPayments.filter(p => 
                  p.subjectId === selectedSubject && p.month === selectedMonth
                );
                if (existingPayments.length > 0) {
                  const subjectPrice = subjects.find(s => s.id === selectedSubject)?.price || 0;
                  const totalPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
                  const remaining = Math.max(0, subjectPrice - totalPaid);
                  
                  return (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#fff3e0', borderRadius: 1 }}>
                      <Typography variant="body2" color="warning.main">
                        <strong>Attention:</strong> {existingPayments.length} paiement(s) déjà effectué(s)
                      </Typography>
                      <Typography variant="body2">
                        Total payé: {totalPaid} DA
                      </Typography>
                      <Typography variant="body2" color={remaining > 0 ? "warning.main" : "success.main"}>
                        Restant: {remaining} DA
                      </Typography>
                      {existingPayments.length > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          Paiements multiples détectés pour ce mois
                        </Typography>
                      )}
                    </Box>
                  );
                }
                return null;
              })()}
            </Box>
          )}

          <TextField
            fullWidth
            label={`${t('amountToPay')} (DA)`}
            type="number"
            value={paymentAmount}
            onChange={e => {
              const newAmount = Number(e.target.value);
              
              // Vérifications en temps réel
              if (selectedSubject) {
                const subject = subjects.find(s => s.id === selectedSubject);
                const existingPayments = studentPayments.filter(p => 
                  p.subjectId === selectedSubject && p.month === selectedMonth
                );
                const totalAlreadyPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
                const remainingAmount = Math.max(0, (subject?.price || 0) - totalAlreadyPaid);
                
                // Limiter le montant au montant restant
                if (newAmount > remainingAmount) {
                  setPaymentAmount(remainingAmount);
                  setToast({ 
                    open: true, 
                    message: `Montant ajusté au maximum possible: ${remainingAmount} DA`, 
                    severity: 'info' 
                  });
                } else {
                  setPaymentAmount(newAmount);
                }
              } else {
                setPaymentAmount(newAmount);
              }
            }}
            sx={{ mb: 3 }}
            helperText={(() => {
              if (selectedSubject && selectedMonth) {
                const subject = subjects.find(s => s.id === selectedSubject);
                const existingPayments = studentPayments.filter(p => 
                  p.subjectId === selectedSubject && p.month === selectedMonth
                );
                const totalAlreadyPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
                const remainingAmount = Math.max(0, (subject?.price || 0) - totalAlreadyPaid);
                
                if (remainingAmount === 0) {
                  return "Cette matière est déjà entièrement payée";
                }
                return `Montant restant: ${remainingAmount} DA (Maximum autorisé)`;
              }
              return "Vous pouvez payer un montant partiel et compléter plus tard";
            })()
            }
            inputProps={{
              min: 0,
              max: (() => {
                if (selectedSubject && selectedMonth) {
                  const subject = subjects.find(s => s.id === selectedSubject);
                  const existingPayments = studentPayments.filter(p => 
                    p.subjectId === selectedSubject && p.month === selectedMonth
                  );
                  const totalAlreadyPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
                  return Math.max(0, (subject?.price || 0) - totalAlreadyPaid);
                }
                return undefined;
              })()
            }}
            error={(() => {
              if (selectedSubject && selectedMonth && paymentAmount > 0) {
                const subject = subjects.find(s => s.id === selectedSubject);
                const existingPayments = studentPayments.filter(p => 
                  p.subjectId === selectedSubject && p.month === selectedMonth
                );
                const totalAlreadyPaid = existingPayments.reduce((sum, p) => sum + (p.montantPaye || p.amount || 0), 0);
                const remainingAmount = Math.max(0, (subject?.price || 0) - totalAlreadyPaid);
                
                return paymentAmount > remainingAmount || remainingAmount === 0;
              }
              return false;
            })()
            }
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('paymentMethod')}</InputLabel>
            <Select
              value={paymentMethod}
              label={t('paymentMethod')}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">{t('cash')}</MenuItem>
              <MenuItem value="bank">{t('bankTransfer')}</MenuItem>
              <MenuItem value="check">{t('check')}</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={closeModal}>{t('cancel')}</Button>
            <Button variant="contained" onClick={handleSavePayment} color="success">
              {t('confirmPayment')}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Toast للرسائل */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={() => setToast({...toast, open: false})}
      >
        <Alert severity={toast.severity} onClose={() => setToast({...toast, open: false})}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
