import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { TablBoard } from "./Pages/TablBoard";
import { Etudiantes } from "./Pages/Etudiantes";
import { Matires } from "./Pages/Matires";
import { Paimentes } from "./Pages/PaimentsComplete";
import PaymentReport from "./Pages/PaymentReport";
import { Sidebar } from "./componetes/Sidebare";
import { Logine } from "./Pages/Logine";
import Abcenses from "./Pages/Abcenses";
import { AuthProvider } from "./Context/AuthContext";
import { LanguageProvider } from "./Context/LanguageContext";
import { SchoolProvider } from "./Context/SchoolContext";
import { ProtectedRoute } from "./Pages/ProtectedRoute";
import { Groupe } from "./Pages/Groupe";
import Classes from './Pages/Classes'
import  {Temps}  from './Pages/Temps'
import { Settings } from './Pages/Settings'
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SchoolProvider>
          <BrowserRouter>
          <Routes>
          <Route path="/" element={<Logine />} />
          <Route
            element={
              <ProtectedRoute>
                <div className="container">
                  <Sidebar />
                  <Outlet /> {/* يعرض الـ Nested Routes */}
                </div>
              </ProtectedRoute>
            }
          >
            <Route path="TBoard" element={<TablBoard />} />
            <Route path="Etudiantes" element={<Etudiantes />} />
            <Route path="Matires" element={<Matires />} />
            <Route path="Groupe" element={<Groupe />} />
            <Route path="Classes" element={<Classes />} />
            <Route path="Paimentes" element={<Paimentes />} />
            <Route path="PaymentReport" element={<PaymentReport />} />
            <Route path="Temps" element={<Temps />} />
            <Route path="Settings" element={<Settings />} />
            <Route path="Abcenses" element={<Abcenses />} />
          </Route>
          </Routes>
        </BrowserRouter>
        </SchoolProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;