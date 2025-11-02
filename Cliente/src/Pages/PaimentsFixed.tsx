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
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit,
  Delete,
  Receipt
} from '@mui/icons-material';
import { usAuth } from '../Context/AuthContext';

// Types
type Student = {
  id: string;
  Name: string;
  modules?: string[];
};

type Group = {
  id: string;
  name: string;
  Studentid: string[];
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
  const { groupe, stude, tocken, mat } = usAuth() as {
    groupe: Group[];
    stude: Student[];
    tocken: string;
    mat: any[];
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentAmount, setPaymentAmount] = useState<number>(0); // المبلغ المراد دفعه
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
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
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // التلاميذ مع موادهم من الـ Context
  const studentsWithModules = useMemo(() => {
    return stude.map((student: any) => {
      console.log('Student data:', student); // للتحقق من بنية البيانات
      return {
        id: student._id || student.id,
        Name: student.Name,
        // محاولة استخراج المواد بطرق مختلفة
        modules: student.modules?.map((mod: any) => {
          // إذا كان mod هو معرف المادة مباشرة
          if (typeof mod === 'string') return mod;
          // إذا كان كائن يحتوي على matid
          if (mod.matid) return mod.matid._id || mod.matid;
          // إذا كان كائن يحتوي على _id
          return mod._id || mod.id;
        }) || subjects.map(s => s.id) // إذا لم توجد مواد، اعطه جميع المواد
      };
    });
  }, [stude, subjects]);

  // المواد التي يدرسها التلميذ المختار
  const studentSubjects = useMemo(() => {
    if (!selectedStudent) return [];
    const student = studentsWithModules.find(s => s.id === selectedStudent);
    if (!student || !student.modules) return [];
    return subjects.filter(subject => student.modules!.includes(subject.id));
  }, [selectedStudent, studentsWithModules, subjects]);

  // تحديث قائمة التلاميذ عند اختيار مجموعة
  useEffect(() => {
    if (selectedGroup) {
      const group = groupe.find(g => g.id === selectedGroup);
      if (group) {
        setStudents(studentsWithModules.filter(s => group.Studentid.includes(s.id)));
      } else {
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  }, [selectedGroup, groupe, studentsWithModules]);

  // تحميل مدفوعات التلميذ من الباك إند
  const fetchStudentPayments = async (studentId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/paiements/etudiant/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${tocken}`
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
    } else {
      setStudentPayments([]);
    }
  }, [selectedStudent, tocken]);

  // حالة كل مادة للتلميذ المختار
  const getSubjectPaymentStatus = (subjectId: string, month: string) => {
    const payment = studentPayments.find(p => 
      p.subjectId === subjectId && p.month === month
    );
    return payment?.status || 'pending';
  };

  // لون المادة حسب حالة الدفع
  const getSubjectColor = (subjectId: string, month: string) => {
    const status = getSubjectPaymentStatus(subjectId, month);
    switch (status) {
      case 'paid':
      case 'paye': return '#dcfce7';
      case 'pending':
      case 'en_attente': return '#fef3c7';
      case 'overdue':
      case 'en_retard': return '#fee2e2';
      case 'partiel': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const getSubjectBorderColor = (subjectId: string, month: string) => {
    const status = getSubjectPaymentStatus(subjectId, month);
    switch (status) {
      case 'paid':
      case 'paye': return '#22c55e';
      case 'pending':
      case 'en_attente': return '#f59e0b';
      case 'overdue':
      case 'en_retard': return '#ef4444';
      case 'partiel': return '#3b82f6';
      default: return '#d1d5db';
    }
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
    if (!selectedSubject || !selectedMonth || !selectedYear || !selectedStudent) {
      setToast({ open: true, message: 'يرجى ملء جميع الحقول المطلوبة', severity: 'error' });
      return;
    }

    try {
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
          montant: paymentAmount || subjects.find(s => s.id === selectedSubject)?.price || 0,
          methodePaiement: paymentMethod,
          datePaiement: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        setToast({ open: true, message: 'تم حفظ الدفعة بنجاح', severity: 'success' });
        closeModal();
        fetchStudentPayments(selectedStudent);
      } else {
        setToast({ open: true, message: result.message || 'خطأ في حفظ الدفعة', severity: 'error' });
      }
    } catch (error) {
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
      case 'paye': return 'مدفوع';
      case 'pending':
      case 'en_attente': return 'معلق';
      case 'overdue':
      case 'en_retard': return 'متأخر';
      case 'partiel': return 'جزئي';
      default: return status;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">💰 إدارة المدفوعات</Typography>
      </Box>

      {/* اختيار المجموعة والتلميذ */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl fullWidth required>
          <InputLabel>اختيار المجموعة *</InputLabel>
          <Select
            value={selectedGroup}
            label="اختيار المجموعة *"
            onChange={e => {
              setSelectedGroup(e.target.value);
              setSelectedStudent('');
            }}
          >
            {groupe.map(g => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth required disabled={!selectedGroup}>
          <InputLabel>اختيار التلميذ *</InputLabel>
          <Select
            value={selectedStudent}
            label="اختيار التلميذ *"
            onChange={e => setSelectedStudent(e.target.value)}
          >
            {students.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.Name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* عرض مواد التلميذ مع الأسعار والألوان */}
      {selectedStudent && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              مواد {studentsWithModules.find(s => s.id === selectedStudent)?.Name}
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
              إضافة دفعة جديدة
            </Button>
          </Box>
          
          {/* عرض معلومات التلميذ */}
          <Box mb={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>عدد المواد:</strong> {studentSubjects.length} مادة
            </Typography>
            <Typography variant="body2">
              <strong>إجمالي المبلغ الشهري:</strong> {studentSubjects.reduce((sum, s) => sum + s.price, 0)} دج
            </Typography>
          </Box>
          
          {/* عرض جدول المواد مع جميع الأشهر */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            حالة المدفوعات لجميع الأشهر - 2025
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>المادة</strong></TableCell>
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
                          {subject.price} دج/شهر
                        </Typography>
                      </Box>
                    </TableCell>
                    {months.slice(0, 6).map(month => {
                      const status = getSubjectPaymentStatus(subject.id, month);
                      const payment = studentPayments.find(p => p.subjectId === subject.id && p.month === month);
                      
                      return (
                        <TableCell key={month} align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(status) as any}
                            onClick={() => {
                              setSelectedSubject(subject.id);
                              setSelectedMonth(month);
                              setSelectedYear('2025');
                              const remainingAmount = payment?.montantRestant || subject.price;
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
                            {payment?.montantPaye && (
                              <Box component="span" sx={{ display: 'block', fontSize: '0.6rem' }}>
                                {payment.montantPaye}/{subject.price}
                              </Box>
                            )}
                          </Button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* الأشهر الثانية */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>المادة</strong></TableCell>
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
                          {subject.price} دج/شهر
                        </Typography>
                      </Box>
                    </TableCell>
                    {months.slice(6).map(month => {
                      const status = getSubjectPaymentStatus(subject.id, month);
                      const payment = studentPayments.find(p => p.subjectId === subject.id && p.month === month);
                      
                      return (
                        <TableCell key={month} align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color={getStatusColor(status) as any}
                            onClick={() => {
                              setSelectedSubject(subject.id);
                              setSelectedMonth(month);
                              setSelectedYear('2025');
                              const remainingAmount = payment?.montantRestant || subject.price;
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
                            {payment?.montantPaye && (
                              <Box component="span" sx={{ display: 'block', fontSize: '0.6rem' }}>
                                {payment.montantPaye}/{subject.price}
                              </Box>
                            )}
                          </Button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
          
          {/* قائمة مدفوعات التلميذ */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            تاريخ المدفوعات
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>المادة</TableCell>
                  <TableCell>الشهر/السنة</TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>تاريخ الدفع</TableCell>
                  <TableCell>الطريقة</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentPayments.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center">
                    لا توجد مدفوعات
                  </TableCell></TableRow>
                ) : (
                  studentPayments.map(payment => {
                    const subject = subjects.find(s => s.id === payment.subjectId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>{subject?.name || 'مادة غير معروفة'}</TableCell>
                        <TableCell>{payment.month} {payment.year}</TableCell>
                        <TableCell>{payment.amount} دج</TableCell>
                        <TableCell>
                          {payment.date ? new Date(payment.date).toLocaleDateString('ar-SA') : '-'}
                        </TableCell>
                        <TableCell>{payment.method || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(payment.status)} 
                            color={getStatusColor(payment.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" title="تعديل">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error" title="حذف">
                            <Delete />
                          </IconButton>
                          {payment.invoiceNumber && (
                            <IconButton size="small" title="عرض الفاتورة">
                              <Receipt />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal إضافة دفعة */}
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">تأكيد الدفعة</Typography>
            <IconButton onClick={closeModal}><CloseIcon /></IconButton>
          </Box>

          {selectedStudent && (
            <Box mb={3}>
              <Typography variant="body1" gutterBottom>
                <strong>التلميذ:</strong> {stude.find(s => s.id === selectedStudent)?.Name}
              </Typography>
            </Box>
          )}

          {/* اختيار المادة */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>اختيار المادة *</InputLabel>
            <Select
              value={selectedSubject}
              label="اختيار المادة *"
              onChange={e => {
                setSelectedSubject(e.target.value);
                // تعيين المبلغ الافتراضي عند اختيار المادة
                const subject = subjects.find(s => s.id === e.target.value);
                if (subject) {
                  setPaymentAmount(subject.price);
                }
              }}
            >
              {studentSubjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name} - {subject.price} دج
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* اختيار الشهر */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>اختيار الشهر *</InputLabel>
            <Select
              value={selectedMonth}
              label="اختيار الشهر *"
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* عرض معلومات المادة المختارة */}
          {selectedSubject && selectedMonth && (
            <Box mb={3} p={2} sx={{ backgroundColor: '#f0f8ff', borderRadius: 2, border: '1px solid #e3f2fd' }}>
              <Typography variant="body1" gutterBottom>
                <strong>المادة:</strong> {subjects.find(s => s.id === selectedSubject)?.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>الشهر:</strong> {selectedMonth} {selectedYear}
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.main', mt: 1 }}>
                <strong>السعر الكامل:</strong> {subjects.find(s => s.id === selectedSubject)?.price} دج
              </Typography>
              
              {/* عرض حالة الدفع الحالية */}
              {(() => {
                const existingPayment = studentPayments.find(p => 
                  p.subjectId === selectedSubject && p.month === selectedMonth
                );
                if (existingPayment) {
                  return (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#fff3e0', borderRadius: 1 }}>
                      <Typography variant="body2" color="warning.main">
                        <strong>تنبيه:</strong> يوجد دفع سابق لهذه المادة
                      </Typography>
                      <Typography variant="body2">
                        المبلغ المدفوع: {existingPayment.montantPaye || existingPayment.amount} دج
                      </Typography>
                      <Typography variant="body2">
                        المتبقي: {existingPayment.montantRestant || 0} دج
                      </Typography>
                    </Box>
                  );
                }
                return null;
              })()}
            </Box>
          )}

          <TextField
            fullWidth
            label="المبلغ المراد دفعه (دج)"
            type="number"
            value={paymentAmount}
            onChange={e => setPaymentAmount(Number(e.target.value))}
            sx={{ mb: 3 }}
            helperText="يمكنك دفع مبلغ جزئي وإكمال الباقي لاحقاً"
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>طريقة الدفع</InputLabel>
            <Select
              value={paymentMethod}
              label="طريقة الدفع"
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">نقداً</MenuItem>
              <MenuItem value="bank">تحويل بنكي</MenuItem>
              <MenuItem value="check">شيك</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={closeModal}>إلغاء</Button>
            <Button variant="contained" onClick={handleSavePayment} color="success">
              تأكيد الدفع
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
