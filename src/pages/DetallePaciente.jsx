import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPacienteById, upsertPaciente, buildCapilaroscopia } from '../utils/storage';
import Badge from '../components/Badge';
import FormCapilaroscopia from '../components/FormCapilaroscopia';

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '—';
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  if (
    hoy.getMonth() < nac.getMonth() ||
    (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())
  ) edad--;
  return edad + ' años';
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 text-sm min-w-[140px]">{label}:</span>
      <span className="text-gray-800 text-sm font-medium">{value}</span>
    </div>
  );
}

const patronColor = { Normal: 'green', 'SD temprano': 'yellow', 'SD activo': 'red', 'SD tardío': 'red' };
const severidadColor = { Leve: 'green', Moderado: 'yellow', Severo: 'red' };

export default function DetallePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [tab, setTab] = useState('resumen');
  const [agregarCapi, setAgregarCapi] = useState(false);
  const [editandoCapi, setEditandoCapi] = useState(null);

  useEffect(() => {
    const p = getPacienteById(id);
    if (!p) navigate('/');
    else setPaciente(p);
  }, [id, navigate]);

  if (!paciente) return null;

  const guardarCapi = (capi) => {
    const capilaroscopias = paciente.capilaroscopias || [];
    const idx = capilaroscopias.findIndex((c) => c.id === capi.id);
    let nuevas;
    if (idx >= 0) {
      nuevas = capilaroscopias.map((c) => (c.id === capi.id ? capi : c));
    } else {
      nuevas = [...capilaroscopias, capi];
    }
    const updated = { ...paciente, capilaroscopias: nuevas };
    upsertPaciente(updated);
    setPaciente(updated);
    setAgregarCapi(false);
    setEditandoCapi(null);
  };

  const eliminarCapi = (capiId) => {
    if (!window.confirm('¿Eliminar esta capilaroscopía?')) return;
    const updated = {
      ...paciente,
      capilaroscopias: paciente.capilaroscopias.filter((c) => c.id !== capiId),
    };
    upsertPaciente(updated);
    setPaciente(updated);
  };

  const r = paciente.raynaud || {};
  const capilaroscopias = (paciente.capilaroscopias || []).slice().sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-700 text-sm">← Volver</button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {paciente.apellido}, {paciente.nombre}
            </h1>
            <div className="flex gap-3 mt-1 text-sm text-gray-500">
              <span>{calcularEdad(paciente.fechaNacimiento)}</span>
              {paciente.sexo && <span>· {paciente.sexo}</span>}
              {paciente.dni && <span>· DNI {paciente.dni}</span>}
            </div>
          </div>
        </div>
        <Link
          to={`/paciente/${id}/editar`}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Editar
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {['resumen', 'raynaud', 'capilaroscopias'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
              tab === t ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'capilaroscopias' ? `Capilaroscopías (${capilaroscopias.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Resumen */}
      {tab === 'resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Datos personales</h3>
            <InfoRow label="Fecha de nacimiento" value={paciente.fechaNacimiento} />
            <InfoRow label="Sexo" value={paciente.sexo} />
            <InfoRow label="DNI" value={paciente.dni} />
            <InfoRow label="Teléfono" value={paciente.telefono} />
            <InfoRow label="Email" value={paciente.email} />
            <InfoRow label="Obra social" value={paciente.obraSocial} />
            <InfoRow label="N° afiliado" value={paciente.nroAfiliado} />
            <InfoRow label="Fecha registro" value={paciente.fechaRegistro} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Raynaud</h3>
            {r.tipo ? (
              <>
                <div className="flex gap-2 mb-2">
                  <Badge color={r.tipo === 'Primario' ? 'blue' : 'purple'}>{r.tipo}</Badge>
                  {r.severidad && <Badge color={severidadColor[r.severidad]}>{r.severidad}</Badge>}
                </div>
                <InfoRow label="Inicio" value={r.anioInicio} />
                <InfoRow label="Frecuencia" value={r.frecuenciaEpisodios} />
                <InfoRow label="Duración" value={r.duracionEpisodios} />
                {r.enfermedadAsociada && <InfoRow label="Enfermedad asociada" value={r.enfermedadAsociada} />}
                {r.tratamiento && <InfoRow label="Tratamiento" value={r.tratamiento} />}
              </>
            ) : (
              <p className="text-gray-400 text-sm">Sin datos de Raynaud cargados.</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:col-span-2">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Última capilaroscopía</h3>
            {capilaroscopias.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                <div>
                  <span className="text-gray-500 text-sm">Fecha: </span>
                  <span className="text-gray-800 text-sm font-medium">{capilaroscopias[0].fecha}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Patrón: </span>
                  <Badge color={patronColor[capilaroscopias[0].patron] || 'gray'}>{capilaroscopias[0].patron}</Badge>
                </div>
                {capilaroscopias[0].densidadCapilar && (
                  <div>
                    <span className="text-gray-500 text-sm">Densidad: </span>
                    <span className="text-gray-800 text-sm font-medium">{capilaroscopias[0].densidadCapilar}</span>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {capilaroscopias[0].megacapilares && <Badge color="red">Megacapilares</Badge>}
                  {capilaroscopias[0].hemorragias && <Badge color="red">Hemorragias</Badge>}
                  {capilaroscopias[0].areasAvasculares && <Badge color="red">Áreas avasculares</Badge>}
                  {capilaroscopias[0].angiogenesis && <Badge color="yellow">Angiogénesis</Badge>}
                  {capilaroscopias[0].desorientacion && <Badge color="yellow">Desorientación</Badge>}
                  {capilaroscopias[0].dilataciones && <Badge color="yellow">Dilataciones</Badge>}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Sin capilaroscopías registradas.</p>
            )}
          </div>
        </div>
      )}

      {/* Raynaud detail */}
      {tab === 'raynaud' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Fenómeno de Raynaud</h3>
            <Link to={`/paciente/${id}/editar`} className="text-blue-600 text-sm hover:underline">Editar</Link>
          </div>
          {r.tipo ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Badge color={r.tipo === 'Primario' ? 'blue' : 'purple'}>{r.tipo}</Badge>
                {r.severidad && <Badge color={severidadColor[r.severidad]}>{r.severidad}</Badge>}
              </div>
              <InfoRow label="Año de inicio" value={r.anioInicio} />
              <InfoRow label="Frecuencia" value={r.frecuenciaEpisodios} />
              <InfoRow label="Duración" value={r.duracionEpisodios} />
              <InfoRow label="Enfermedad asociada" value={r.enfermedadAsociada} />
              <InfoRow label="Tratamiento" value={r.tratamiento} />
              {(r.cambiosColor?.blanco || r.cambiosColor?.azul || r.cambiosColor?.rojo) && (
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500 text-sm min-w-[140px]">Cambios de color:</span>
                  <div className="flex gap-1">
                    {r.cambiosColor.blanco && <Badge color="gray">Blanquecino</Badge>}
                    {r.cambiosColor.azul && <Badge color="blue">Cianótico</Badge>}
                    {r.cambiosColor.rojo && <Badge color="red">Eritematoso</Badge>}
                  </div>
                </div>
              )}
              {r.digitosAfectados?.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Dígitos afectados:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {r.digitosAfectados.map((d) => <Badge key={d} color="blue">{d}</Badge>)}
                  </div>
                </div>
              )}
              {r.desencadenantes?.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Desencadenantes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {r.desencadenantes.map((d) => <Badge key={d} color="yellow">{d}</Badge>)}
                  </div>
                </div>
              )}
              {r.notas && (
                <div>
                  <p className="text-gray-500 text-sm">Notas:</p>
                  <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-3 rounded-lg">{r.notas}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>Sin datos de Raynaud cargados.</p>
              <Link to={`/paciente/${id}/editar`} className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                Agregar datos
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Capilaroscopías */}
      {tab === 'capilaroscopias' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setAgregarCapi(true); setEditandoCapi(null); }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              + Nueva capilaroscopía
            </button>
          </div>

          {(agregarCapi && !editandoCapi) && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Nueva capilaroscopía</h3>
              <FormCapilaroscopia
                onGuardar={guardarCapi}
                onCancelar={() => setAgregarCapi(false)}
              />
            </div>
          )}

          {capilaroscopias.length === 0 && !agregarCapi && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl mb-3">🔬</div>
              <p>No hay capilaroscopías registradas.</p>
            </div>
          )}

          {capilaroscopias.map((capi) => (
            <div key={capi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {editandoCapi === capi.id ? (
                <FormCapilaroscopia
                  inicial={capi}
                  onGuardar={guardarCapi}
                  onCancelar={() => setEditandoCapi(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3 items-center">
                      <span className="font-semibold text-gray-800">{capi.fecha}</span>
                      {capi.patron && (
                        <Badge color={patronColor[capi.patron] || 'gray'}>{capi.patron}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditandoCapi(capi.id)} className="text-gray-400 hover:text-blue-600 text-sm">Editar</button>
                      <button onClick={() => eliminarCapi(capi.id)} className="text-gray-400 hover:text-red-500 text-sm">Eliminar</button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {capi.megacapilares && <Badge color="red">Megacapilares</Badge>}
                    {capi.hemorragias && <Badge color="red">Hemorragias</Badge>}
                    {capi.areasAvasculares && <Badge color="red">Áreas avasculares</Badge>}
                    {capi.angiogenesis && <Badge color="yellow">Angiogénesis</Badge>}
                    {capi.desorientacion && <Badge color="yellow">Desorientación</Badge>}
                    {capi.dilataciones && <Badge color="yellow">Dilataciones</Badge>}
                  </div>

                  {capi.densidadCapilar && (
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-500">Densidad: </span>{capi.densidadCapilar}
                    </p>
                  )}
                  {capi.notas && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">{capi.notas}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
