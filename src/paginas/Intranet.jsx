import { useAuth } from "../context/authContext";
import FormProductos from "../componentes/FormProductos";
import GestionUsuarios from "../componentes/GestionUsuarios";

export default function Intranet() {
  const { usuarioActual } = useAuth();

  const esAdmin = usuarioActual?.rol === "admin";
  const esEditor = usuarioActual?.rol === "editor";

  if (!esAdmin && !esEditor) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center text-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h1 className="text-3xl font-bold text-pink-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-4">No tienes los permisos necesarios para ver esta página. Por favor, contacta a un administrador si crees que esto es un error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-[#8f2133]">
            Bienvenido a la Intranet, {usuarioActual.nombre || usuarioActual.correo}!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Tu rol actual es: <span className={`font-bold ${esAdmin ? 'text-red-500' : 'text-pink-600'}`}>{usuarioActual.rol}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg py-8 px-8">
           <h2 className="text-3xl font-bold text-[#8f2133] mb-6 text-center">Gestión de Productos</h2>
           <FormProductos />
        </div>

        {/* -- SECCIÓN DE GESTIÓN DE USUARIOS CON ESTILO COHERENTE -- */}
        {esAdmin ? (
          <div className="bg-white rounded-2xl shadow-lg py-8 px-8">
            <GestionUsuarios />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg py-8 px-8 text-center">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-4">Gestión de Usuarios</h2>
            <div className="bg-[#fff3f0] border border-[#f5bfb2] text-[#d16170] p-4 rounded-xl">
                Tu rol de <span className="font-bold">editor</span> no tiene permiso para gestionar usuarios. Esta función está reservada para los administradores.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
