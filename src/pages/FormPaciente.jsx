import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPacienteById, upsertPaciente, buildPacienteVacio, deletePaciente } from '../utils/storage';

const DESENCADENANTES = ['Frío', 'Estrés', 'Vibración', 'Ejercicio', 'Cambio brusco de temperatura', 'Tabaco'];
const DIGITOS = ['Pulgar D', 'Índice D', 'Medio D', 'Anular D', 'Meñique D', 'Pulgar I', 'Índice I', 'Medio I', 'Anular I', 'Meñique I'];

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const selectCls = inputCls;

function CheckGroup({ items, checked, onChange }) {
  const toggle = (item) => {
    if (checked.includes(item)) {
      onChange(checked.filter((x) => x !== item));
    } else {
      onChange([...checked, item]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <label
          key={item}
          className={`cursor-pointer text-xs px-3 py-1.5 rounded-full border transition select-none ${
            checked.includes(item)
              ? 'bg-blue-700 border-blue-700 text-white'
              : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'
          }`}
        >
          <input type="checkbox" className="sr-only" checked={checked.includes(item)} onChange={() => toggle(item)} />
          {item}
        </label>
      ))}
    </div>
  );
}

export default function FormPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esNuevo = !id;

  const [paciente, setPaciente] = useState(buildPacienteVacio());
  const [tab, setTab] = useState('datos');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (id) {
      const p = getPacienteById(id);
      if (p) setPaciente(p);
    }
  }, [id]);

  const set = (key, value) => setPaciente((prev) => ({ ...prev, [key]: value }));
  const setR = (key, value) =>
    setPaciente((prev) => ({ ...prev, raynaud: { ...prev.raynaud, [key]: value } }));
  const setCC = (key, value) =>
    setPaciente((prev) => ({
      ...prev,
      raynaud: { ...prev.raynaud, cambiosColor: { ...prev.raynaud.cambiosColor, [key]: value } },
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    upsertPaciente(paciente);
    setGuardado(true);
    setTimeout(() => {
      navigate(`/paciente/${paciente.id}`);
    }, 800);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar a ${paciente.nombre} ${paciente.apellido}? Esta acción no se puede deshacer.`)) {
      deletePaciente(paciente.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-sm">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {esNuevo ? 'Nuevo paciente' : `${paciente.apellido}, ${paciente.nombre}`}
        </h1>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {['datos', 'raynaud'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
              tab === t ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'datos' ? 'Datos del paciente' : 'Raynaud'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {tab === 'datos' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-2">Datos personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Apellido" required>
                <input className={inputCls} value={paciente.apellido} onChange={(e) => set('apellido', e.target.value)} required />
              </Field>
              <Field label="Nombre" required>
                <input className={inputCls} value={paciente.nombre} onChange={(e) => set('nombre', e.target.value)} required />
              </Field>
              <Field label="Fecha de nacimiento">
                <input type="date" className={inputCls} value={paciente.fechaNacimiento} onChange={(e) => set('fechaNacimiento', e.target.value)} />
              </Field>
              <Field label="Sexo">
                <select className={selectCls} value={paciente.sexo} onChange={(e) => set('sexo', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro</option>
                </select>
              </Field>
              <Field label="DNI">
                <input className={inputCls} value={paciente.dni} onChange={(e) => set('dni', e.target.value)} />
              </Field>
              <Field label="Teléfono">
                <input className={inputCls} value={paciente.telefono} onChange={(e) => set('telefono', e.target.value)} />
              </Field>
              <Field label="Email">
                <input type="email" className={inputCls} value={paciente.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="Fecha de registro">
                <input type="date" className={inputCls} value={paciente.fechaRegistro} onChange={(e) => set('fechaRegistro', e.target.value)} />
              </Field>
            </div>

            <h2 className="text-base font-semibold text-gray-700 border-b pb-2 pt-2">Cobertura médica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Obra social / Prepaga">
                <input className={inputCls} value={paciente.obraSocial} onChange={(e) => set('obraSocial', e.target.value)} />
              </Field>
              <Field label="N° de afiliado">
                <input className={inputCls} value={paciente.nroAfiliado} onChange={(e) => set('nroAfiliado', e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {tab === 'raynaud' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-2">Fenómeno de Raynaud</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tipo">
                <select className={selectCls} value={paciente.raynaud.tipo} onChange={(e) => setR('tipo', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>Primario</option>
                  <option>Secundario</option>
                </select>
              </Field>
              <Field label="Año de inicio">
                <input type="number" min="1900" max={new Date().getFullYear()} className={inputCls} value={paciente.raynaud.anioInicio} onChange={(e) => setR('anioInicio', e.target.value)} />
              </Field>
              <Field label="Severidad">
                <select className={selectCls} value={paciente.raynaud.severidad} onChange={(e) => setR('severidad', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Severo</option>
                </select>
              </Field>
              <Field label="Frecuencia de episodios">
                <select className={selectCls} value={paciente.raynaud.frecuenciaEpisodios} onChange={(e) => setR('frecuenciaEpisodios', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>Diaria</option>
                  <option>Varias veces por semana</option>
                  <option>Semanal</option>
                  <option>Mensual</option>
                  <option>Ocasional</option>
                </select>
              </Field>
              <Field label="Duración de episodios">
                <select className={selectCls} value={paciente.raynaud.duracionEpisodios} onChange={(e) => setR('duracionEpisodios', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>{'< 15 min'}</option>
                  <option>15–30 min</option>
                  <option>30–60 min</option>
                  <option>{'> 1 hora'}</option>
                </select>
              </Field>
              <Field label="Enfermedad asociada (si secundario)">
                <input className={inputCls} value={paciente.raynaud.enfermedadAsociada} onChange={(e) => setR('enfermedadAsociada', e.target.value)} placeholder="Esclerodermia, LES, AR..." />
              </Field>
            </div>

            <Field label="Cambios de color">
              <div className="flex gap-4 mt-1">
                {[['blanco', 'Blanquecino'], ['azul', 'Cianótico'], ['rojo', 'Eritematoso']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600"
                      checked={paciente.raynaud.cambiosColor[key]}
                      onChange={(e) => setCC(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Dígitos afectados">
              <CheckGroup
                items={DIGITOS}
                checked={paciente.raynaud.digitosAfectados}
                onChange={(v) => setR('digitosAfectados', v)}
              />
            </Field>

            <Field label="Desencadenantes">
              <CheckGroup
                items={DESENCADENANTES}
                checked={paciente.raynaud.desencadenantes}
                onChange={(v) => setR('desencadenantes', v)}
              />
            </Field>

            <Field label="Tratamiento actual">
              <input className={inputCls} value={paciente.raynaud.tratamiento} onChange={(e) => setR('tratamiento', e.target.value)} placeholder="Nifedipina, amlodipina, sildenafil..." />
            </Field>

            <Field label="Notas clínicas">
              <textarea rows={3} className={inputCls} value={paciente.raynaud.notas} onChange={(e) => setR('notas', e.target.value)} />
            </Field>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          {!esNuevo && (
            <button type="button" onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm underline">
              Eliminar paciente
            </button>
          )}
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition ${guardado ? 'bg-green-600' : 'bg-blue-700 hover:bg-blue-800'}`}>
              {guardado ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
