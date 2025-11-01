import { initDatabase } from "../db/sqlite";

// Create settings table if not exists
const createSettingsTable = () => {
  const db = initDatabase();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      schoolNameFr TEXT DEFAULT 'Mon Logiciel',
      schoolNameAr TEXT DEFAULT 'برنامجي',
      address TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    db.exec(createTableQuery);
    
    // Insert default settings if table is empty
    const count = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
    if (count.count === 0) {
      db.prepare(`
        INSERT INTO settings (schoolNameFr, schoolNameAr, address, phone, email)
        VALUES (?, ?, ?, ?, ?)
      `).run('Mon Logiciel', 'برنامجي', '', '', '');
    }
  } catch (error) {
    console.error("Error creating settings table:", error);
  }
};

// Get settings
export const getSettings = async ({ identifaite }: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  
  try {
    createSettingsTable();
    const db = initDatabase();
    
    const settings = db.prepare(`
      SELECT schoolNameFr, schoolNameAr, address, phone, email
      FROM settings 
      ORDER BY id DESC 
      LIMIT 1
    `).get();
    
    return { StatusCode: 200, data: settings };
  } catch (error) {
    console.error("Error getting settings:", error);
    return { StatusCode: 500, data: "Internal server error" };
  }
};

// Update settings
export const updateSettings = async ({
  identifaite,
  schoolNameFr,
  schoolNameAr,
  address,
  phone,
  email,
}: any) => {
  if (!identifaite) return { StatusCode: 401, data: "no token" };
  
  if (!schoolNameFr || !schoolNameAr) {
    return { StatusCode: 400, data: "School names are required" };
  }
  
  try {
    createSettingsTable();
    const db = initDatabase();
    
    // Check if settings exist
    const existingSettings = db.prepare("SELECT id FROM settings LIMIT 1").get();
    
    if (existingSettings) {
      // Update existing settings
      db.prepare(`
        UPDATE settings 
        SET schoolNameFr = ?, schoolNameAr = ?, address = ?, phone = ?, email = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(schoolNameFr, schoolNameAr, address, phone, email, (existingSettings as any).id);
    } else {
      // Insert new settings
      db.prepare(`
        INSERT INTO settings (schoolNameFr, schoolNameAr, address, phone, email)
        VALUES (?, ?, ?, ?, ?)
      `).run(schoolNameFr, schoolNameAr, address, phone, email);
    }
    
    return { StatusCode: 200, data: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { StatusCode: 500, data: "Internal server error" };
  }
};
