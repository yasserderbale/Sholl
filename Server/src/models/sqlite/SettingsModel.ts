import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'database.sqlite');

// إنشاء مجلد data إذا لم يكن موجوداً
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// إنشاء جدول الإعدادات إذا لم يكن موجوداً
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schoolNameFr TEXT,
    schoolNameAr TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    logo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// إدراج إعدادات افتراضية إذا لم توجد
const existingSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (existingSettings.count === 0) {
  db.prepare(`
    INSERT INTO settings (schoolNameFr, schoolNameAr, address, phone, email)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'École Moderne',
    'المدرسة الحديثة', 
    'Adresse de l\'école',
    '+213 XX XX XX XX',
    'contact@ecole.dz'
  );
}

// الحصول على الإعدادات
export const getSettings = () => {
  try {
    const settings = db.prepare('SELECT * FROM settings ORDER BY id DESC LIMIT 1').get();
    return settings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

// تحديث الإعدادات
export const updateSettings = (settingsData: {
  schoolNameFr?: string;
  schoolNameAr?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
}) => {
  try {
    const updateQuery = db.prepare(`
      UPDATE settings 
      SET schoolNameFr = COALESCE(?, schoolNameFr),
          schoolNameAr = COALESCE(?, schoolNameAr),
          address = COALESCE(?, address),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          logo = COALESCE(?, logo),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = (SELECT MAX(id) FROM settings)
    `);
    
    const result = updateQuery.run(
      settingsData.schoolNameFr,
      settingsData.schoolNameAr,
      settingsData.address,
      settingsData.phone,
      settingsData.email,
      settingsData.logo
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
};

// إنشاء إعدادات جديدة
export const createSettings = (settingsData: {
  schoolNameFr: string;
  schoolNameAr: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}) => {
  try {
    const insertQuery = db.prepare(`
      INSERT INTO settings (schoolNameFr, schoolNameAr, address, phone, email, logo)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insertQuery.run(
      settingsData.schoolNameFr,
      settingsData.schoolNameAr,
      settingsData.address,
      settingsData.phone,
      settingsData.email,
      settingsData.logo || null
    );
    
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error creating settings:', error);
    return null;
  }
};
