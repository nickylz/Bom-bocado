import { useState } from "react";
import { useAuth } from "../context/authContext";
import PerfilForm from '../componentes/PerfilForm';
import ComprasList from '../componentes/ComprasList';
import FavoritosList from '../componentes/FavoritosList';

export default function Perfil() {
  const { usuarioActual, cargandoAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');

  if (cargandoAuth) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  if (!usuarioActual) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">
          Debes iniciar sesión para ver tu perfil.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil' },
    { id: 'favoritos', label: 'Mis Favoritos' },
    { id: 'compras', label: 'Mis Compras' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilForm user={usuarioActual} />;
      case 'favoritos':
        return <FavoritosList />;
      case 'compras':
        return <ComprasList />;
      default:
        return <PerfilForm user={usuarioActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
            <nav className="flex flex-col space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-[#d16170] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-[#f5bfb2] hover:text-[#9c2007]'}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
