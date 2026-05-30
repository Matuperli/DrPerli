import { useState } from 'react';
import { buildCapilaroscopia } from '../utils/storage';

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const selectCls = inputCls;

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const PATRON_INFO = {
  Normal: 'Distribución regular, sin alteraciones.',
  'SD temprano': 'Megacapilares aislados, sin zonas avasculares.',
  'SD activo': 'Megacapilares frecuentes, hemorragias, áreas avasculares moderadas.',
  'SD tardío': 'Áreas avasculares extensas, reducción marcada de capilares.',
};

export default function FormCapilaroscopia({ inicial, onGuardar, onCancelar }) {
  const [capi, setCapi] = useState(inicial || buildCapilaroscopia());

  const set = (key, value) => setCapi((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(capi);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Fecha del estudio">
          <input type="date" className={inputCls} value={capi.fecha} onChange={(e) => set('fecha', e.target.value)} required />
        </Field>
        <Field label="Patrón capilaroscópico">
          <select className={selectCls} value={capi.patron} onChange={(e) => set('patron', e.target.value)} required>
            <option value="">Seleccionar...</option>
            <option>Normal</option>
            <option>SD temprano</option>
            <option>SD activo</option>
            <option>SD tardío</option>
          </select>
          {capi.patron && (
            <p className="text-xs text-gray-500 mt-1 italic">{PATRON_INFO[capi.patron]}</p>
          )}
        </Field>
        <Field label="Densidad capilar">
          <select className={selectCls} value={capi.densidadCapilar} onChange={(e) => set('densidadCapilar', e.target.value)}>
            <option value="">Seleccionar...</option>
            <option>Normal (&gt;7/mm)</option>
            <option>Reducida (4–7/mm)</option>
            <option>Muy reducida (&lt;4/mm)</option>
          </select>
        </Field>
      </div>

      <Field label="Hallazgos">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
          {[
            ['megacapilares', 'Megacapilares'],
            ['hemorragias', 'Hemorragias'],
            ['areasAvasculares', 'Áreas avasculares'],
            ['angiogenesis', 'Angiogénesis'],
            ['desorientacion', 'Desorientación'],
            ['dilataciones', 'Dilataciones'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                checked={capi[key]}
                onChange={(e) => set(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Observaciones">
        <textarea
          rows={3}
          className={inputCls}
          value={capi.notas}
          onChange={(e) => set('notas', e.target.value)}
          placeholder="Descripción libre del estudio..."
        />
      </Field>

      <div className="flex gap-3 justify-end pt-2">
        {onCancelar && (
          <button type="button" onClick={onCancelar} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
        )}
        <button type="submit" className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition">
          Guardar capilaroscopía
        </button>
      </div>
    </form>
  );
}
