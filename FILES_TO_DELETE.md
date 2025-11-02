# ملفات يجب حذفها من المشروع

## 1. ملفات MongoDB القديمة (غير مستخدمة بعد الانتقال لـ SQLite)

### Models القديمة:
```
Server/src/models/Abcenses.ts
Server/src/models/Classe.ts
Server/src/models/Groupe.ts
Server/src/models/GroupeTimes.ts
Server/src/models/Logine.ts
Server/src/models/Matieres.ts
Server/src/models/Paimentes.ts
Server/src/models/Student.ts
```

### Services القديمة:
```
Server/src/services/Abcense.ts
Server/src/services/ClassService.ts
Server/src/services/Dachborde.ts
Server/src/services/Groupe.ts
Server/src/services/GroupeService.ts
Server/src/services/Logineadmin.ts
Server/src/services/Matieres.ts
Server/src/services/Paimentes.ts
Server/src/services/Registerstud.ts
```

## 2. ملفات مكررة:
```
Server/routes/paiements.js (مكرر مع src/routes/paiements.ts)
Server/src/services/PaiementsFrService.ts (نستخدم PaiementsFrServiceFixed.ts)
```

## 3. ملفات فارغة أو غير مستخدمة:
```
Server/school.db (ملف فارغ 0 bytes)
Server/check_months.js (غير مستخدم)
```

## 4. Routes مكررة:
```
Server/src/routes/Dachbord.ts (قديم - نستخدم Dashboard.ts)
```

---

## كيفية الحذف:

### الطريقة 1: يدوياً من VS Code
- حدد الملفات واحذفها

### الطريقة 2: باستخدام Git
```bash
# حذف ملفات MongoDB القديمة
git rm Server/src/models/Abcenses.ts
git rm Server/src/models/Classe.ts
git rm Server/src/models/Groupe.ts
git rm Server/src/models/GroupeTimes.ts
git rm Server/src/models/Logine.ts
git rm Server/src/models/Matieres.ts
git rm Server/src/models/Paimentes.ts
git rm Server/src/models/Student.ts

# حذف Services القديمة
git rm Server/src/services/Abcense.ts
git rm Server/src/services/ClassService.ts
git rm Server/src/services/Dachborde.ts
git rm Server/src/services/Groupe.ts
git rm Server/src/services/GroupeService.ts
git rm Server/src/services/Logineadmin.ts
git rm Server/src/services/Matieres.ts
git rm Server/src/services/Paimentes.ts
git rm Server/src/services/Registerstud.ts

# حذف ملفات مكررة
git rm Server/routes/paiements.js
git rm Server/src/services/PaiementsFrService.ts
git rm Server/school.db
git rm Server/check_months.js
git rm Server/src/routes/Dachbord.ts

# Commit التغييرات
git commit -m "Cleanup: Remove unused MongoDB files and duplicates"
```

---

## ملاحظات مهمة:

### ✅ الملفات المستخدمة حالياً (لا تحذف):
```
✅ Server/src/models/sqlite/* (جميع ملفات SQLite)
✅ Server/src/services/*Sqlite.ts (جميع ملفات SQLite Services)
✅ Server/src/routes/*.ts (جميع الـ routes)
✅ Server/data/database.sqlite (قاعدة البيانات الرئيسية)
```

### ⚠️ بعد الحذف:
1. تأكد من أن الـ Server يعمل بدون مشاكل
2. اختبر جميع الـ APIs
3. تأكد من عدم وجود imports للملفات المحذوفة

---

## الفوائد بعد التنظيف:

✅ تقليل حجم المشروع
✅ تحسين وضوح الكود
✅ إزالة الارتباك بين الملفات القديمة والجديدة
✅ تسهيل الصيانة المستقبلية
