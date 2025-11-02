// مساعدات لمعالجة النصوص العربية في PDF
export const processArabicTextForPDF = (text: string): string => {
  if (!text) return text;
  
  // التحقق من وجود أحرف عربية
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(text)) {
    return text; // إذا لم يكن هناك نص عربي، إرجاع النص كما هو
  }
  
  // معالجة النص العربي
  try {
    // تحويل النص لـ UTF-8 encoding
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8');
    const encoded = encoder.encode(text);
    const decoded = decoder.decode(encoded);
    
    return decoded;
  } catch (error) {
    console.warn('Error processing Arabic text:', error);
    // في حالة الخطأ، إرجاع النص مع استبدال الأحرف المشكلة
    return text.replace(/[\u0600-\u06FF]/g, '?');
  }
};

// دالة لإنشاء اسم ملف آمن
export const createSafeFileName = (baseName: string, extension: string = 'pdf'): string => {
  const date = new Date().toISOString().split('T')[0];
  const safeName = baseName
    .replace(/[^\u0600-\u06FF\w\s-]/g, '_') // الحفاظ على الأحرف العربية والإنجليزية
    .replace(/\s+/g, '_') // استبدال المسافات بـ underscore
    .substring(0, 50); // تحديد طول الاسم
  
  return `${safeName}_${date}.${extension}`;
};

// دالة لتحسين عرض النصوص العربية في الجداول
export const formatTextForTable = (text: string): string => {
  if (!text) return '';
  
  // إزالة المسافات الزائدة
  const cleaned = text.trim();
  
  // التحقق من النص العربي
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(cleaned)) {
    // للنصوص العربية، التأكد من الترميز الصحيح
    return processArabicTextForPDF(cleaned);
  }
  
  return cleaned;
};
