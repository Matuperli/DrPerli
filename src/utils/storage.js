const KEY = 'drperli_pacientes';

export function getPacientes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function savePacientes(pacientes) {
  localStorage.setItem(KEY, JSON.stringify(pacientes));
}

export function getPacienteById(id) {
  return getPacientes().find((p) => p.id === id) || null;
}

export function upsertPaciente(paciente) {
  const all = getPacientes();
  const idx = all.findIndex((p) => p.id === paciente.id);
  if (idx >= 0) {
    all[idx] = paciente;
  } else {
    all.push(paciente);
  }
  savePacientes(all);
}

export function deletePaciente(id) {
  savePacientes(getPacientes().filter((p) => p.id !== id));
}

export function buildPacienteVacio() {
  return {
    id: crypto.randomUUID(),
    fechaRegistro: new Date().toISOString().slice(0, 10),
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    sexo: '',
    dni: '',
    telefono: '',
    email: '',
    obraSocial: '',
    nroAfiliado: '',
    raynaud: {
      tipo: '',
      anioInicio: '',
      severidad: '',
      frecuenciaEpisodios: '',
      duracionEpisodios: '',
      digitosAfectados: [],
      cambiosColor: { blanco: false, azul: false, rojo: false },
      desencadenantes: [],
      enfermedadAsociada: '',
      tratamiento: '',
      notas: '',
    },
    capilaroscopias: [],
  };
}

export function buildCapilaroscopia() {
  return {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString().slice(0, 10),
    patron: '',
    megacapilares: false,
    hemorragias: false,
    areasAvasculares: false,
    densidadCapilar: '',
    angiogenesis: false,
    desorientacion: false,
    dilataciones: false,
    notas: '',
  };
}
