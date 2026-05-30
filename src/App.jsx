import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaPacientes from './pages/ListaPacientes';
import FormPaciente from './pages/FormPaciente';
import DetallePaciente from './pages/DetallePaciente';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ListaPacientes />} />
            <Route path="/nuevo" element={<FormPaciente />} />
            <Route path="/paciente/:id" element={<DetallePaciente />} />
            <Route path="/paciente/:id/editar" element={<FormPaciente />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
