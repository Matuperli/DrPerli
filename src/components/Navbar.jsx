import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <span className="text-2xl">🩺</span>
          <span>DrPerli</span>
          <span className="text-blue-300 text-sm font-normal">· Raynaud & Capilaroscopía</span>
        </Link>
        <div className="ml-auto flex gap-4 text-sm">
          <Link
            to="/"
            className={`px-3 py-1 rounded-full transition ${
              pathname === '/' ? 'bg-white text-blue-800 font-medium' : 'hover:bg-blue-700'
            }`}
          >
            Pacientes
          </Link>
          <Link
            to="/nuevo"
            className={`px-3 py-1 rounded-full transition ${
              pathname === '/nuevo' ? 'bg-white text-blue-800 font-medium' : 'hover:bg-blue-700'
            }`}
          >
            + Nuevo
          </Link>
        </div>
      </div>
    </nav>
  );
}
