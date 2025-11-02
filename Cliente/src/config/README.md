# إعدادات المدرسة

## كيفية تغيير معلومات المدرسة

لتغيير اسم المدرسة ومعلوماتها، قم بتعديل الملف `schoolConfig.ts`:

### 1. اسم المدرسة
```typescript
name: "اسم المدرسة بالعربية",
nameEn: "School Name in English",
```

### 2. وصف المدرسة
```typescript
description: "وصف المدرسة بالعربية",
descriptionEn: "School Description in English",
```

### 3. شعار المدرسة
```typescript
slogan: "شعار المدرسة بالعربية",
sloganEn: "School Slogan in English",
```

### 4. معلومات الاتصال
```typescript
phone: "+213 XX XX XX XX",
email: "contact@school.dz",
address: "عنوان المدرسة",
```

### 5. ألوان المدرسة
```typescript
colors: {
  primary: "#1976d2",    // اللون الأساسي
  secondary: "#42a5f5"   // اللون الثانوي
}
```

## أماكن الاستخدام

هذه الإعدادات تُستخدم في:
- **صفحة التقارير** (PaymentReport.tsx) - اسم المدرسة في الأعلى
- **الشريط الجانبي** (Sidebare.tsx) - اسم المدرسة في الـ logo
- **صفحة تسجيل الدخول** (Logine.tsx) - اسم المدرسة والوصف والشعار
- **ملفات PDF المصدرة** (Groupe.tsx) - اسم المدرسة في PDF
- **صفحة الإعدادات** (Settings.tsx) - القيم الافتراضية
- **رسالة الترحيب** - عند تسجيل الدخول بنجاح

## مثال للتعديل

```typescript
export const schoolConfig = {
  name: "مدرسة النور الخاصة",
  nameEn: "Al Nour Private School",
  
  description: "للتعليم والتربية",
  descriptionEn: "For Education and Training",
  
  slogan: "نحو مستقبل أفضل",
  sloganEn: "Towards a Better Future",
  
  phone: "+213 21 XX XX XX",
  email: "info@alnour.dz",
  address: "الجزائر العاصمة",
  
  colors: {
    primary: "#2e7d32",
    secondary: "#66bb6a"
  }
};
```
