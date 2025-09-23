import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { TablBoard } from "./Pages/TablBoard";
import { Etudiantes } from "./Pages/Etudiantes";
import { Matires } from "./Pages/Matires";
import { RapportPaiements } from "./Pages/RapportPaiements";
import { RapportEleves } from "./Pages/RapportEleves";
import { RapportAbsences } from "./Pages/RapportAbsences";
import { RapportGeneral } from "./Pages/RapportGeneral";
import { Paimentes } from "./Pages/Paimentes";
import { Parametres } from "./Pages/Parametres";
import { Sidebar } from "./componetes/Sidebare";
import { Logine } from "./Pages/Logine";
import { Abcenses } from "./Pages/Abcenses";
import { AuthProvider } from "./Context/AuthContext";
import { ProtectedRoute } from "./Pages/ProtectedRoute";
import { Groupe } from "./Pages/Groupe";
import {Classes} from './Pages/Classes'
import {Temps} from './Pages/Temps'
import {Profes} from './Pages/Profes'
function App() {
  return (
    <AuthProvider>
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
            <Route path="Profes" element={<Profes/>}/>
            <Route path="Matires" element={<Matires />} />
            <Route path="Groupe" element={<Groupe/>}/>
            <Route path="Classes" element={<Classes/>}/>
            <Route path="Paimentes" element={<Paimentes />} />
            <Route path="RapportPaiements" element={<RapportPaiements />} />
            <Route path="RapportEleves" element={<RapportEleves />} />
            <Route path="RapportAbsences" element={<RapportAbsences />} />
            <Route path="RapportGeneral" element={<RapportGeneral />} />
            <Route path="Parametres" element={<Parametres />} />
            <Route path="Temps" element={<Temps />} />
            <Route path="Abcenses" element={<Abcenses />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;