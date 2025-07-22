import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";
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
function App() {
  return (
    <>
  
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Logine/>}/>
      <Route path="/*" element={
        <div className="container">
          <Sidebar/>
          <Routes>
            <Route path="/TBoard" element={<TablBoard />} />
            <Route path="/Etudiantes" element={<Etudiantes />} />
            <Route path="/Matires" element={<Matires />} />
            <Route path="/Paimentes" element={<Paimentes />} />
            <Route path="/RapportPaiements" element={<RapportPaiements />} />
            <Route path="/RapportEleves" element={<RapportEleves />} />
            <Route path="/RapportAbsences" element={<RapportAbsences />} />
            <Route path="/RapportGeneral" element={<RapportGeneral />} />
            <Route path="/Parametres" element={<Parametres />} />
            <Route path="/Abcenses" element={<Abcenses />} />
          </Routes>
        </div>
      }/>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
