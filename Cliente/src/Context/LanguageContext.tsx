import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Sidebar
    dashboard: 'Dashboard',
    absences: 'Gestion des Absences',
    students: 'Gestion des élèves',
    subjects: 'Gestion des matières',
    payments: 'Paiements',
    paymentReports: 'Rapports de Paiement',
    groups: 'Groupes',
    classes: 'Classes',
    schedule: 'Emploi de temps',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    
    // Common
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    search: 'Rechercher',
    loading: 'Chargement...',
    noData: 'Aucune donnée',
    success: 'Succès',
    error: 'Erreur',
    name: 'Nom',
    actions: 'Actions',
    total: 'Total',
    
    // Dashboard
    welcomeMessage: 'Bienvenue dans votre système de gestion scolaire',
    totalStudents: 'Nombre d\'élèves',
    totalClasses: 'Total des Classes',
    totalPayments: 'Total des paiements',
    recentActivities: 'Activités Récentes',
    newStudentsThisMonth: 'Nouveaux élèves ce mois',
    totalAmountCollected: 'Montant total encaissé (tout)',
    numberOfGroups: 'Nombre de groupes',
    numberOfSubjects: 'Nombre de matières',
    monthlyRevenueEvolution: 'Évolution mensuelle des revenus (12 derniers mois)',
    
    // Students
    studentManagement: 'Gestion des élèves',
    addStudent: 'Ajouter un élève',
    editStudent: 'Modifier un élève',
    studentName: 'Nom complet',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    age: 'Âge',
    gender: 'Genre',
    male: 'Masculin',
    female: 'Féminin',
    birthDate: 'Date de naissance',
    level: 'Niveau',
    specialty: 'Spécialité',
    confirmDelete: 'Êtes-vous sûr ?',
    yes: 'Oui',
    no: 'Non',
    
    // Classes
    classManagement: 'Gestion des Classes',
    addClass: 'Ajouter une Classe',
    className: 'Nom de la classe',
    notes: 'Notes',
    optional: 'optionnel',
    rowsPerPage: 'Lignes par page',
    groupName: 'Nom du groupe',
    days: 'Jours',
    view: 'Voir',
    close: 'Fermer',
    start: 'Début',
    end: 'Fin',
    startTime: 'Heure début',
    endTime: 'Heure fin',
    room: 'Salle',
    
    // Payments
    paymentManagement: 'Gestion des Paiements',
    addPayment: 'Ajouter Paiement',
    student: 'Étudiant',
    subject: 'Matière',
    month: 'Mois',
    amount: 'Montant',
    status: 'Statut',
    paid: 'Payé',
    unpaid: 'Non payé',
    pending: 'En attente',
    paymentDate: 'Date de paiement',
    selectStudent: 'Sélectionner étudiant',
    selectSubject: 'Sélectionner matière',
    selectMonth: 'Sélectionner mois',
    paymentConfirmation: 'Confirmation du paiement',
    paymentStatusAllMonths: 'État des paiements pour tous les mois',
    payment: 'paiement',
    totalPrice: 'Prix total',
    monthYear: 'Mois/Année',
    amountPaid: 'Montant payé',
    amountToPay: 'Montant à payer',
    
    // Payment Reports
    paymentReportsTitle: 'Rapports de Paiements',
    paymentStatus: 'État des Paiements',
    totalDue: 'Total Dû',
    totalPaid: 'Total Payé',
    remaining: 'Restant',
    paymentHistory: 'Historique des Paiements',
    group: 'Groupe',
    refreshReport: 'Actualiser le Rapport',
    totalStudents: 'Total Étudiants',
    fullyPaid: 'Entièrement Payé',
    partialPayment: 'Paiement Partiel',
    expectedAmount: 'Montant Attendu',
    collectedAmount: 'Montant Collecté',
    collectionRate: 'Taux de Recouvrement',
    generalStatus: 'Statut Général',
    subjectDetails: 'Détails Matières',
    numberOfSubjects: 'Nombre de matières',
    totalMonthlyAmount: 'Montant total mensuel',
    confirmDeleteClass: 'Supprimer cette classe ?',
    confirmDeleteGroup: 'Supprimer ce groupe ?',
    addNewPayment: 'Ajouter un nouveau paiement',
    subjectNotFound: 'Matière non trouvée',
    selectGroup: 'Sélectionner un Groupe',
    confirmPayment: 'Confirmer le paiement',
    allGroups: 'Tous les Groupes',
    noGroupsAvailable: 'Aucun groupe disponible',
    paymentMethod: 'Méthode de paiement',
    cash: 'Espèces',
    bankTransfer: 'Virement bancaire',
    check: 'Chèque',
    fillAllRequiredFields: 'Veuillez remplir tous les champs requis',
    updateDatabase: 'Mettre à jour la base de données',
    selectGroupFirst: 'Sélectionnez d\'abord un groupe',
    
    // Subjects
    subjectManagement: 'Gestion des Matières',
    addSubject: 'Ajouter Matière',
    editSubject: 'Modifier Matière',
    subjectName: 'Nom de la matière',
    price: 'Prix',
    subjectLevel: 'Niveau de la matière',
    description: 'Description',
    monthlyPrice: 'Prix mensuel',
    modules: 'Modules',
    of: 'sur',
    moreThan: 'plus de',
    
    // Groups
    groupManagement: 'Gestion des Groupes',
    addGroup: 'Ajouter Groupe',
    editGroup: 'Modifier Groupe',
    groupName: 'Nom du groupe',
    numberOfStudents: 'Nombre d\'étudiants',
    
    // Absences
    absenceManagement: 'Gestion des Absences',
    addAbsence: 'Ajouter Absence',
    date: 'Date',
    reason: 'Raison',
    justified: 'Justifiée',
    unjustified: 'Non justifiée',
    singleAbsence: 'absence',
    absences: 'Absences',
    new: 'Nouvelle',
    studentList: 'Liste des élèves',
    studentListByGroup: 'Liste des élèves par groupe',
    numberOfAbsences: 'Nombre d\'absences',
    lastAbsence: 'Dernière absence',
    
    // Schedule
    scheduleTitle: 'Emploi du Temps',
    selectClass: 'Sélectionner une classe',
    
    // Settings
    schoolSettings: 'Paramètres de l\'École',
    schoolNameFr: 'Nom de l\'école (Français)',
    schoolNameAr: 'اسم المدرسة (العربية)',
    
    // Days
    sunday: 'Dimanche',
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    
    // Days short
    sun: 'Dim',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mer',
    thu: 'Jeu',
    fri: 'Ven',
    sat: 'Sam',
  },
  ar: {
    // Sidebar
    dashboard: 'لوحة التحكم',
    absences: 'إدارة الغيابات',
    students: 'إدارة الطلاب',
    subjects: 'إدارة المواد',
    payments: 'المدفوعات',
    paymentReports: 'تقارير المدفوعات',
    groups: 'المجموعات',
    classes: 'الأقسام',
    schedule: 'جدول الحصص',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    success: 'نجح',
    error: 'خطأ',
    name: 'الاسم',
    actions: 'الإجراءات',
    total: 'المجموع',
    
    // Dashboard
    welcomeMessage: 'مرحباً بك في نظام إدارة المدرسة',
    totalStudents: 'عدد الطلاب',
    totalClasses: 'إجمالي الأقسام',
    totalPayments: 'إجمالي المدفوعات',
    recentActivities: 'الأنشطة الأخيرة',
    newStudentsThisMonth: 'طلاب جدد هذا الشهر',
    totalAmountCollected: 'المبلغ الإجمالي المحصل (الكل)',
    numberOfGroups: 'عدد المجموعات',
    numberOfSubjects: 'عدد المواد',
    monthlyRevenueEvolution: 'تطور الإيرادات الشهرية (آخر 12 شهر)',
    
    // Students
    studentManagement: 'إدارة الطلاب',
    addStudent: 'إضافة طالب',
    editStudent: 'تعديل طالب',
    studentName: 'الاسم الكامل',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    age: 'العمر',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    birthDate: 'تاريخ الميلاد',
    level: 'المستوى',
    specialty: 'التخصص',
    confirmDelete: 'هل أنت متأكد؟',
    yes: 'نعم',
    no: 'لا',
    
    // Classes
    classManagement: 'إدارة الأقسام',
    addClass: 'إضافة قسم',
    className: 'اسم القسم',
    notes: 'ملاحظات',
    optional: 'اختياري',
    rowsPerPage: 'صفوف لكل صفحة',
    groupName: 'اسم المجموعة',
    days: 'الأيام',
    view: 'عرض',
    close: 'إغلاق',
    start: 'البداية',
    end: 'النهاية',
    startTime: 'وقت البداية',
    endTime: 'وقت النهاية',
    room: 'القاعة',
    
    // Payments
    paymentManagement: 'إدارة المدفوعات',
    addPayment: 'إضافة دفعة',
    student: 'الطالب',
    subject: 'المادة',
    month: 'الشهر',
    amount: 'المبلغ',
    status: 'الحالة',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    pending: 'في الانتظار',
    paymentDate: 'تاريخ الدفع',
    selectStudent: 'اختر طالب',
    selectSubject: 'اختر مادة',
    selectMonth: 'اختر شهر',
    paymentConfirmation: 'تأكيد الدفع',
    paymentStatusAllMonths: 'حالة المدفوعات لجميع الأشهر',
    payment: 'دفعة',
    totalPrice: 'السعر الإجمالي',
    monthYear: 'الشهر/السنة',
    amountPaid: 'المبلغ المدفوع',
    amountToPay: 'المبلغ المطلوب دفعه',
    
    // Payment Reports
    paymentReportsTitle: 'تقارير المدفوعات',
    paymentStatus: 'حالة المدفوعات',
    totalDue: 'إجمالي المستحق',
    totalPaid: 'إجمالي المدفوع',
    remaining: 'المتبقي',
    paymentHistory: 'سجل المدفوعات',
    group: 'المجموعة',
    refreshReport: 'تحديث التقرير',
    totalStudents: 'إجمالي الطلاب',
    fullyPaid: 'مدفوع بالكامل',
    partialPayment: 'دفع جزئي',
    expectedAmount: 'المبلغ المتوقع',
    collectedAmount: 'المبلغ المحصل',
    collectionRate: 'معدل التحصيل',
    generalStatus: 'الحالة العامة',
    subjectDetails: 'تفاصيل المواد',
    numberOfSubjects: 'عدد المواد',
    totalMonthlyAmount: 'إجمالي المبلغ الشهري',
    confirmDeleteClass: 'حذف هذا الفصل؟',
    confirmDeleteGroup: 'حذف هذه المجموعة؟',
    addNewPayment: 'إضافة دفعة جديدة',
    subjectNotFound: 'المادة غير موجودة',
    selectGroup: 'اختر مجموعة',
    confirmPayment: 'تأكيد الدفع',
    allGroups: 'جميع المجموعات',
    noGroupsAvailable: 'لا توجد مجموعات متاحة',
    paymentMethod: 'طريقة الدفع',
    cash: 'نقداً',
    bankTransfer: 'تحويل بنكي',
    check: 'شيك',
    fillAllRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    updateDatabase: 'تحديث قاعدة البيانات',
    selectGroupFirst: 'اختر مجموعة أولاً',
    
    // Subjects
    subjectManagement: 'إدارة المواد',
    addSubject: 'إضافة مادة',
    editSubject: 'تعديل مادة',
    subjectName: 'اسم المادة',
    price: 'السعر',
    subjectLevel: 'مستوى المادة',
    description: 'الوصف',
    monthlyPrice: 'السعر الشهري',
    modules: 'المواد',
    of: 'من',
    moreThan: 'أكثر من',
    
    // Groups
    groupManagement: 'إدارة المجموعات',
    addGroup: 'إضافة مجموعة',
    editGroup: 'تعديل مجموعة',
    groupName: 'اسم المجموعة',
    numberOfStudents: 'عدد الطلاب',
    
    // Absences
    absenceManagement: 'إدارة الغيابات',
    addAbsence: 'إضافة غياب',
    date: 'التاريخ',
    reason: 'السبب',
    justified: 'مبرر',
    unjustified: 'غير مبرر',
    singleAbsence: 'غياب',
    absences: 'الغيابات',
    new: 'جديد',
    studentList: 'قائمة الطلاب',
    studentListByGroup: 'قائمة الطلاب حسب المجموعة',
    numberOfAbsences: 'عدد الغيابات',
    lastAbsence: 'آخر غياب',
    
    // Schedule
    scheduleTitle: 'جدول الحصص',
    selectClass: 'اختر قسم',
    
    // Settings
    schoolSettings: 'إعدادات المدرسة',
    schoolNameFr: 'اسم المدرسة (بالفرنسية)',
    schoolNameAr: 'اسم المدرسة (بالعربية)',
    
    // Days
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
    
    // Days short
    sun: 'أحد',
    mon: 'إثن',
    tue: 'ثلا',
    wed: 'أرب',
    thu: 'خمي',
    fri: 'جمع',
    sat: 'سبت',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  // Apply RTL/LTR to document
  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
