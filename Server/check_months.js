const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'data/database.sqlite');
console.log('Database path:', dbPath);
const db = new Database(dbPath);

try {
  // Get all tables first
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('=== TABLES ===');
  tables.forEach(t => console.log(`  - ${t.name}`));
  
  // Check groups
  console.log('\n=== GROUPES ===');
  const groups = db.prepare('SELECT * FROM groupes').all();
  console.log('Nombre de groupes:', groups.length);
  groups.forEach(g => {
    console.log('\nGroupe complet:', JSON.stringify(g, null, 2));
    console.log(`  Studentid (raw): ${g.Studentid}`);
    if (g.Studentid) {
      try {
        const students = JSON.parse(g.Studentid);
        console.log(`  Étudiants (${students.length}):`, students);
      } catch (e) {
        console.log('  Erreur parsing:', e.message);
      }
    }
  });
  
  // Check students
  console.log('\n=== STUDENTS ===');
  const students = db.prepare('SELECT id, Name FROM students LIMIT 5').all();
  console.log('Premiers 5 étudiants:');
  students.forEach(s => {
    console.log(`  - ${s.Name} (ID: ${s.id})`);
  });
  
} catch (e) {
  console.log('Error:', e.message);
}

db.close();
