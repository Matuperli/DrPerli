# DrPerli · Raynaud & Capilaroscopía

App web para registro y seguimiento de pacientes con fenómeno de Raynaud y capilaroscopía.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- React Router 6
- Persistencia en `localStorage`

## Funcionalidades

- **Lista de pacientes** con buscador por nombre/apellido/DNI
- **Registro de datos personales** y cobertura médica
- **Formulario de Raynaud:** tipo (primario/secundario), severidad, dígitos afectados, desencadenantes, cambios de color, tratamiento
- **Capilaroscopías:** patrón (Normal / SD temprano / SD activo / SD tardío), densidad capilar, hallazgos (megacapilares, hemorragias, áreas avasculares, angiogénesis, etc.)
- **Vista de detalle** con resumen clínico

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
