import React, { useEffect, useRef, useState, } from 'react';
import Styles from '../Styles/Groupe.module.css';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
  Snackbar,
  Alert,
  TableContainer,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { useSchool } from "../Context/SchoolContext";
import { Button, Stack } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
export function Groupe() {
  const [idgroupe, setidgroupe] = useState<any>(null)
  const [idliste, setidlist] = useState<any>(null)
  const { t, language } = useLanguage();
  const { settings } = useSchool();
  const { groupe, tocken, setgroupe, stude } = usAuth()
  const [idASupprimer, setIdsupprimer] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [liste, setliste] = useState<string[] | null>(null)
  const [namgroupe, setnamegroupe] = useState("")
  const [toast, setToast] = useState<{ open: boolean, msg: string, type: 'success' | 'error' }>({ open: false, msg: "", type: "success" })
  useEffect(() => {
    setgroupe(groupe)
  }, [groupe])
  const Name = useRef<HTMLInputElement>(null)
  const addnewGroupe = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = Name.current?.value
    if (!name) {
      setToast({ open: true, msg: "Veuillez saisir le nom du groupe", type: "error" })
      return
    }
    const newGroupe = await fetch("http://localhost:3000/Groupes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name }),
    })
    const response = await newGroupe.json()
    if (response.StatusCode != 200) {
      setToast({ open: true, msg: `${response.data}`, type: "error" })
      setShowModal(false)
      return
    }
    setgroupe((prev) => [...prev, response.data])
    Name.current!.value = ""
    setShowModal(false)
    setToast({ open: true, msg: "Groupe ajouté avec succès", type: "success" })

  }
  const getOnegroupe = async (ID: any) => {
    const Fetchgroupe = await fetch(`http://localhost:3000/Groupes/${ID}`, {
      headers: {
        "Authorization": `Bearer ${tocken}`,
        "Content-Type": 'application/json'
      }
    })
    const response = await Fetchgroupe.json()
    if (!response) {
      return
    }
    setnamegroupe(response.data.name)
    if (Name.current) Name.current.value = response.data.name
    // Studentid is array of student IDs in SQLite; map to names from context 'stude'
    setliste(
      (response.data.Studentid || [])
        .map((sid: string) => (stude || []).find((s: any) => (s as any).id === sid)?.Name || null)
        .filter(Boolean)
    )
    console.log(response.data)

  }
  const updateOne = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = Name.current!.value
    const update = await fetch(`http://localhost:3000/Groupes/${idgroupe}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      },
      body: JSON.stringify({ name })
    })
    const reponse = await update.json()
    if (reponse.StatusCode !== 200) {
      setToast({ open: true, msg: `${reponse.data}`, type: "error" })

      return
    }
    setgroupe((prev) => prev.map((item) => item.id == idgroupe ? reponse.data : item))
    setidgroupe(null)
    setToast({ open: true, msg: "Groupe modifié avec succès", type: "success" })
  }
  const Deleteongroupe = async () => {
    const Delete = await fetch(`http://localhost:3000/Groupes/${idASupprimer}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      }
    })
    const response = await Delete.json()
    if (response.StatusCode != 200) {
      setToast({ open: true, msg: `${response.data}`, type: "error" })
      return
    }
    setgroupe((preve) => preve.filter((item) => item.id !== idASupprimer))
    setIdsupprimer(null)
    setToast({ open: true, msg: "Groupe supprimé avec succès", type: "success" })
  }
  const Searchgroupe = async (Text: string) => {
    const searchone = await fetch(`http://localhost:3000/SeatcheGroupe?name=${Text}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tocken}`
      }

    })
    const response = await searchone.json()
    setgroupe(response.data)
  }

  const handleExportExcel = () => {
    if (!liste || liste.length === 0) {
      setToast({ open: true, msg: "لا توجد بيانات للتصدير", type: "error" });
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(liste.map((student, i) => ({
      "#": i + 1,
      "Nom": student
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Etudiants");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Liste_Etudiants_${namgroupe}.xlsx`);
  };

  const handleExportPDF = async () => {
    if (!liste || liste.length === 0) {
      setToast({ open: true, msg: "لا توجد بيانات للتصدير", type: "error" });
      return;
    }

    try {
      // استخدام html2canvas لتحويل الجدول إلى صورة للحفاظ على النص العربي
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      
      // إنشاء جدول HTML مؤقت للتصدير
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.background = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.width = '1000px'; // عرض ثابت كبير
      tempDiv.style.minHeight = '800px'; // ارتفاع أدنى
      
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
          <h1 style="color: #1976d2; margin: 0; font-size: 28px; font-weight: bold;">${language === 'ar' ? settings.schoolNameAr : settings.schoolNameFr}</h1>
          <h2 style="color: #666; margin: 10px 0; font-size: 20px;">${language === 'ar' ? 'للتعليم المتميز والتربية الحديثة' : 'For Excellence in Education and Modern Training'}</h2>
          <h3 style="color: #333; margin: 15px 0; font-size: 18px; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">قائمة طلاب مجموعة: ${namgroupe}</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); color: white;">
              <th style="border: 2px solid #1565c0; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; width: 15%;">الرقم</th>
              <th style="border: 2px solid #1565c0; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; width: 85%;">اسم الطالب</th>
            </tr>
          </thead>
          <tbody>
            ${liste.map((student, i) => `
              <tr style="background-color: ${i % 2 === 0 ? '#f8f9fa' : 'white'}; transition: background-color 0.3s;">
                <td style="border: 1px solid #dee2e6; padding: 15px; text-align: center; font-size: 16px; font-weight: bold; color: #1976d2;">${i + 1}</td>
                <td style="border: 1px solid #dee2e6; padding: 15px; text-align: right; font-size: 16px; color: #333;">${student}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #1976d2;">
          <p style="margin: 5px 0; font-size: 16px; color: #333; font-weight: bold;">📊 عدد الطلاب: ${liste.length}</p>
          <p style="margin: 5px 0; font-size: 16px; color: #333; font-weight: bold;">📅 تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-DZ')}</p>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // تحويل إلى صورة
      const canvas = await html2canvas(tempDiv, {
        scale: 3, // جودة أعلى
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1200, // عرض أكبر
        height: tempDiv.scrollHeight + 60
      });
      
      // إزالة العنصر المؤقت
      document.body.removeChild(tempDiv);
      
      // إنشاء PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // حساب الأبعاد لتملأ الصفحة
      const imgWidth = pageWidth - 20; // هوامش 10mm من كل جهة
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // توسيط الصورة
      const x = (pageWidth - imgWidth) / 2;
      const y = 10;
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // حفظ الملف
      const fileName = `قائمة_طلاب_${namgroupe}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      setToast({ open: true, msg: "تم تصدير PDF بنجاح مع دعم العربية", type: "success" });
      
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
      setToast({ open: true, msg: "حدث خطأ في التصدير", type: "error" });
    }
  };
  return (
    <Box className={Styles.page} p={3}>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
      <Typography variant="h4" className={Styles.title} gutterBottom>
        {t('groupManagement')}
      </Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField
          onChange={(e) => Searchgroupe(e.target.value)}
          label={`${t('search')}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
          }}
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
          onClick={() => setShowModal(true)}
        >
          {t('addGroup')}
        </Button>
      </Box>
      {
        groupe.length == 0 ?
          <Typography variant="body1"
            align="center"
            color="textSecondary"
            style={{ marginTop: "29px" }}>{t('noData')}</Typography>
          :
          <Paper sx={{ borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
            <Table className={Styles.table}>
              <TableHead sx={{ background: "#f1f5f9" }}>
                <TableRow >
                  <TableCell>{t('groupName')}</TableCell>
                  <TableCell>{t('numberOfStudents')}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {groupe.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {item.Studentid?.length || 0} étudiant{(item.Studentid?.length || 0) > 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button onClick={() => { setidgroupe(item.id), getOnegroupe(item.id) }} startIcon={<Update />} size="small" variant="outlined">{t('edit')}</Button>
                        <Button onClick={() => setIdsupprimer(item.id)} startIcon={<DeleteIcon />} size="small" variant="outlined" color="error">{t('delete')}</Button>
                        <Button onClick={() => { setidlist(item.id), getOnegroupe(item.id) }} startIcon={<VisibilityIcon />} size="small" variant="outlined">{t('view')}</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Paper>}
      {/*Modals addGroup*/}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>{t('addGroup')}</Typography>
            <form onSubmit={addnewGroupe} className={Styles.form}>
              <TextField inputRef={Name} label="Nom du groupe" required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">{t('save')}</Button>
                <Button variant="outlined" onClick={() => setShowModal(false)}>{t('cancel')}</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      {/**Modals update */}
      <Modal open={!!idgroupe} onClose={() => setidgroupe(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "600px", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>{t('editGroup')}</Typography>
            <form onSubmit={updateOne} className={Styles.form}>
              <TextField inputRef={Name} label="Nom du groupe" required fullWidth margin="normal" />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" type="submit">{t('edit')}</Button>
                <Button variant="outlined" onClick={() => setidgroupe("")}>{t('cancel')}</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      {/* Supprimer */}
      <Modal open={idASupprimer !== null} onClose={() => setIdsupprimer(null)}>
        <Box className={Styles.modalOverlay}>
          <Box className={Styles.modalContent} sx={{ maxWidth: "400px", borderRadius: "16px", textAlign: "center" }}>
            <Typography variant="h6" mb={2}>{t('confirmDelete')}</Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              <Button onClick={() => Deleteongroupe()} variant="contained" color="error">{t('yes')}</Button>
              <Button onClick={() => setIdsupprimer(null)} variant="outlined">{t('no')}</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* See List studnts */}
      <Modal
        open={!!idliste}
        onClose={() => setidlist(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 700,
            maxHeight: 450,
            overflowY: "auto",
            borderRadius: 3,
            boxShadow: 8,
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Liste des étudiants
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<FileDownload />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Stack>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  Nom de l'étudiant
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {liste && liste.length > 0 ? (
                liste.map((student: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#e8f0fe" },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Aucun étudiant trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </Box>
  );
}
