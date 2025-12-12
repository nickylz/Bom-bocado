import { useState } from "react";
import { useAuth } from "../context/authContext";
import FormProductos from "../componentes/FormProductos";
import GestionUsuarios from "../componentes/GestionUsuarios";
import EstadoCompra from "../componentes/EstadoCompra";
import AdminProductos from "../componentes/AdminProductos";
import GestionReclamos from "../componentes/GestionReclamos"; // <-- 1. IMPORTAR

export default function Intranet() {
  const { usuarioActual } = useAuth();
  const esAdmin = usuarioActual?.rol === "admin";

  // Definición de todas las pestañas posibles
  const allTabs = [
    { id: 'productos', label: 'Gestión de Productos', roles: ['admin', 'editor'], component: <FormProductos /> },
    { id: 'listaProductos', label: 'Almacén de Productos', roles: ['admin', 'editor'], component: <AdminProductos /> },
    { id: 'compras', label: 'Gestión de Compras', roles: ['admin', 'editor'], component: <EstadoCompra /> },
    { id: 'reclamos', label: 'Gestión de Reclamos', roles: ['admin'], component: <GestionReclamos /> }, // <-- 2. AÑADIR PESTAÑA
    { id: 'usuarios', label: 'Gestión de Usuarios', roles: ['admin'], component: <GestionUsuarios /> },
  ];

  // Filtrar pestañas según el rol del usuario
  const availableTabs = allTabs.filter(tab => tab.roles.includes(usuarioActual?.rol));

  // <-- 3. MEJORAR ESTADO INICIAL
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!usuarioActual || availableTabs.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center text-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h1 className="text-3xl font-bold text-[#d16170]">Acceso Denegado</h1>
          <p className="text-gray-600 mt-4">No tienes los permisos necesarios para ver esta página.</p>
        </div>
      </div>
    );
  }

  const activeTabDetails = availableTabs.find(tab => tab.id === activeTab);

  const renderContent = () => {
    // <-- 4. AJUSTAR TÍTULO DINÁMICO
    let title = activeTabDetails?.label;
    if (activeTab === 'productos') title = "Crear / Editar Producto";
    if (activeTab === 'listaProductos') title = "Lista y Gestión de Productos";
    if (activeTab === 'reclamos') title = "Gestión de Reclamos y Quejas";

    return (
      <>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-6 sm:mb-8 text-center md:text-left">
          {title}
        </h2>
        {activeTabDetails?.component}
      </>
    )
  };

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#7a1a0a]">
            Bienvenido a la Intranet, {usuarioActual.nombre || usuarioActual.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Tu rol es: <span className={`font-bold ${esAdmin ? 'text-red-500' : 'text-pink-600'}`}>{usuarioActual.rol}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
            <div className="md:hidden mb-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-full flex justify-between items-center text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 bg-[#d16170] text-white shadow-md">
                <span>{activeTabDetails?.label}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <nav className={`flex-col space-y-2 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {availableTabs.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMenuOpen(false); }}
                  className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 w-full ${
                    activeTab === tab.id 
                      ? 'bg-[#d16170] text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-[#f5bfb2] hover:text-[#9c2007]'
                  }`}>
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
