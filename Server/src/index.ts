import express from "express";
import cors from "cors";
import { initDatabase } from "./db/sqlite";
import { createStudentsTable } from "./models/sqlite/StudentModel";
import { createMatieresTable } from "./models/sqlite/MatieresModel";
import { createGroupesTable } from "./models/sqlite/GroupModel";
import { createGroupeTimesTable } from "./models/sqlite/GroupeTimesModel";
import { createClassesTable } from "./models/sqlite/ClasseModel";
import { createPaymentsTable } from "./models/sqlite/PaimentesModel";
import { createAbcensesTable } from "./models/sqlite/AbcensesModel";
import { createLoginTable } from "./models/sqlite/LoginModel";
import loginAdmn from "./routes/LoginAdmin";
import Student from "./routes/Students";
import Matier from "./routes/Matieres";
import Abcense from "./routes/Abcenses";
import Paimentes from "./routes/Paimentes";
import paiements from "./routes/paiements";
import Dachborde from "./routes/Dachbord";
import Dashboard from "./routes/Dashboard";
import Groupes from "./routes/Groupes";
import Classe from "./routes/ClasseRoute";
import GroupeTims from "./routes/GroupeRoute";
import Settings from "./routes/Settings";
// import Teachers from "./routes/Teachers"; // ملف غير موجود
import { createTeachersTable } from "./models/sqlite/TeacherModel";
import { createPaiementsFrTable } from "./services/PaiementsFrServiceFixed";
import { ensureAdmin } from "./services/LogineSqlite";
const app = express();
app.use(express.json());
app.use(cors());
// Initialize SQLite (replaces MongoDB for migrated models)
try {
  initDatabase();
  createStudentsTable();
  createMatieresTable();
  createGroupesTable();
  createGroupeTimesTable();
  createClassesTable();
  createPaymentsTable();
  createAbcensesTable();
  createLoginTable();
  createTeachersTable();
  createPaiementsFrTable(); // Table pour les paiements en français
  // seed default admin if missing
  ensureAdmin("Admin", "Admin");
  console.log("SQLite DB initialized");
} catch (err) {
  console.log("failed to initialize SQLite DB", err);
}

app.use(loginAdmn);
app.use(Student);
app.use(Matier);
app.use(Abcense);
app.use(Paimentes);
app.use(paiements);
app.use(Dachborde);
app.use(Dashboard); // Dashboard statistics API
app.use(Groupes);
app.use(Classe);
app.use(GroupeTims);
app.use(Settings);
// app.use(Teachers); // ملف غير موجود

const port = 3000;
app.listen(port, () => {
  console.log("server run on", port);
});
