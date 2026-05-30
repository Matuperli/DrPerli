import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPacientes } from '../utils/storage';
import Badge from '../components/Badge';

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '—';
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  if (
    hoy.getMonth() < nac.getMonth() ||
    (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())
  ) {
    edad--;
  }
  return edad;
}

const patronColor = {
  Normal: 'green',
  'SD temprano': 'yellow',
  'SD activo': 'red',
  'SD tardío': 'red',
};

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setPacientes(getPacientes());
  }, []);

  const filtrados = pacientes.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.dni.includes(q)
    );
  });

  const ultimoPatron = (p) =>
    p.capilaroscopias?.slice(-1)[0]?.patron || null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <p className="text-gray-500 text-sm">{pacientes.length} registrados</p>
        </div>
        <Link
          to="/nuevo"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Nuevo paciente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, apellido o DNI..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filtrados.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔬</div>
          <p className="text-lg">No hay pacientes registrados aún.</p>
          <Link to="/nuevo" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Registrar el primer paciente
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Edad / Sexo</th>
                <th className="px-4 py-3 text-left">DNI</th>
                <th className="px-4 py-3 text-left">Raynaud</th>
                <th className="px-4 py-3 text-left">Último patrón</th>
                <th className="px-4 py-3 text-left">Capis.</th>
                <th className="px-4 py-3 text-left">Registro</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtrados.map((p) => {
                const patron = ultimoPatron(p);
                return (
                  <tr key={p.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {p.apellido}, {p.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {calcularEdad(p.fechaNacimiento)} a · {p.sexo || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.dni || '—'}</td>
                    <td className="px-4 py-3">
                      {p.raynaud?.tipo ? (
                        <Badge color={p.raynaud.tipo === 'Primario' ? 'blue' : 'purple'}>
                          {p.raynaud.tipo}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {patron ? (
                        <Badge color={patronColor[patron] || 'gray'}>{patron}</Badge>
                      ) : (
                        <span className="text-gray-400">Sin datos</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.capilaroscopias?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.fechaRegistro}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/paciente/${p.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
