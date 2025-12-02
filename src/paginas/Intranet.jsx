import { useState } from "react";
import { useAuth } from "../context/authContext";
import FormProductos from "../componentes/FormProductos";
import GestionUsuarios from "../componentes/GestionUsuarios";
import EstadoCompra from "../componentes/EstadoCompra";
import AdminProductos from "../componentes/AdminProductos";

export default function Intranet() {
  const { usuarioActual } = useAuth();

  const esAdmin = usuarioActual?.rol === "admin";
  const esEditor = usuarioActual?.rol === "editor";

  // ahora el default será "productos" (form) pero agregamos "listaProductos"
  const [seccionActiva, setSeccionActiva] = useState("productos");
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!esAdmin && !esEditor) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center text-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h1 className="text-3xl font-bold text-pink-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-4">
            No tienes los permisos necesarios para ver esta página. Por favor,
            contacta a un administrador si crees que esto es un error.
          </p>
        </div>
      </div>
    );
  }

  const renderContenido = () => {
    if (seccionActiva === "productos") {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-4 sm:mb-6 text-center">
            Crear / Editar Producto
          </h2>
          <FormProductos />
        </div>
      );
    }

    if (seccionActiva === "listaProductos") {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-full">
          {/* El título ya lo tiene AdminProductos, pero si quieres puedes dejar este o quitarlo */}
          {/* <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-4 sm:mb-6 text-center">
            Lista y Gestión de Productos
          </h2> */}
          <AdminProductos />
        </div>
      );
    }

    if (seccionActiva === "compras") {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-4 sm:mb-6 text-center">
            Gestión de Compras
          </h2>
          <EstadoCompra />
        </div>
      );
    }

    if (seccionActiva === "usuarios") {
      if (!esAdmin) {
        return (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 text-center w-full max-w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-4">
              Gestión de Usuarios
            </h2>
            <div className="bg-[#fff3f0] border border-[#f5bfb2] text-[#d16170] p-4 rounded-xl">
              Tu rol de <span className="font-bold">editor</span> no tiene
              permiso para gestionar usuarios. Esta función está reservada para
              los administradores.
            </div>
          </div>
        );
      }
      return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8f2133] mb-4 text-center">
            Gestión de Usuarios
          </h2>
          <GestionUsuarios />
        </div>
      );
    }

    return null;
  };

  const handleClickOpcion = (seccion) => {
    setSeccionActiva(seccion);
    setMenuAbierto(false);
  };

  return (
    <div className="min-h-screen bg-[#fff3f0] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#8f2133]">
            Bienvenido a la Intranet,{" "}
            {usuarioActual.nombre || usuarioActual.correo}!
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Tu rol actual es:{" "}
            <span
              className={`font-bold ${
                esAdmin ? "text-red-500" : "text-pink-600"
              }`}
            >
              {usuarioActual.rol}
            </span>
          </p>
        </div>

        {/* HEADER MOBILE MENU */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold text-[#8f2133]">Gestiones</h2>
          <button
            onClick={() => setMenuAbierto((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-[#8f2133] text-white text-sm font-medium"
          >
            {menuAbierto ? "Cerrar" : "Abrir menú"}
          </button>
        </div>

        <div className="flex gap-6 items-stretch min-h-[70vh]">
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden md:block w-64 bg-white rounded-2xl shadow-sm p-6 h-screen">
            <h2 className="text-2xl font-bold text-[#8f2133] mb-4">
              Gestiones
            </h2>
            <nav className="space-y-3">
              {(esAdmin || esEditor) && (
                <button
                  onClick={() => handleClickOpcion("productos")}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition
                    ${
                      seccionActiva === "productos"
                        ? "bg-[#8f2133] text-white"
                        : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                    }`}
                >
                  Gestión de Productos
                </button>
              )}
              {(esAdmin || esEditor) && (
                <button
                  onClick={() => handleClickOpcion("listaProductos")}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition
                    ${
                      seccionActiva === "listaProductos"
                        ? "bg-[#8f2133] text-white"
                        : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                    }`}
                >
                  Almacen de Productos
                </button>
              )}
              {(esAdmin || esEditor) && (
                <button
                  onClick={() => handleClickOpcion("compras")}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                    ${
                      seccionActiva === "compras"
                        ? "bg-[#8f2133] text-white"
                        : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                    }`}
                >
                  Gestión de Compras
                </button>
              )}

              {esAdmin && (
                <button
                  onClick={() => handleClickOpcion("usuarios")}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                    ${
                      seccionActiva === "usuarios"
                        ? "bg-[#8f2133] text-white"
                        : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                    }`}
                >
                  Gestión de Usuarios
                </button>
              )}
            </nav>
          </aside>

          {/* SIDEBAR MOBILE SLIDE */}
          {menuAbierto && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div
                className="flex-1 bg-black/40"
                onClick={() => setMenuAbierto(false)}
              />
              <aside className="w-64 bg-white rounded-l-2xl shadow-lg p-6 h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#8f2133] mb-4">
                  Gestiones
                </h2>
                <nav className="space-y-3">
                  {(esAdmin || esEditor) && (
                    <button
                      onClick={() => handleClickOpcion("productos")}
                      className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                        ${
                          seccionActiva === "productos"
                            ? "bg-[#8f2133] text-white"
                            : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                        }`}
                    >
                      Crear / Editar Producto
                    </button>
                  )}

                  {(esAdmin || esEditor) && (
                    <button
                      onClick={() => handleClickOpcion("listaProductos")}
                      className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                        ${
                          seccionActiva === "listaProductos"
                            ? "bg-[#8f2133] text-white"
                            : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                        }`}
                    >
                      Lista y Gestión de Productos
                    </button>
                  )}

                  {(esAdmin || esEditor) && (
                    <button
                      onClick={() => handleClickOpcion("compras")}
                      className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                        ${
                          seccionActiva === "compras"
                            ? "bg-[#8f2133] text-white"
                            : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                        }`}
                    >
                      Gestión de Compras
                    </button>
                  )}

                  {esAdmin && (
                    <button
                      onClick={() => handleClickOpcion("usuarios")}
                      className={`w-full text-left px-4 py-2 rounded-xl font-medium transition 
                        ${
                          seccionActiva === "usuarios"
                            ? "bg-[#8f2133] text-white"
                            : "bg-[#fff3f0] text-[#8f2133] hover:bg-[#fcd1c8]"
                        }`}
                    >
                      Gestión de Usuarios
                    </button>
                  )}
                </nav>
              </aside>
            </div>
          )}

          {/* CONTENIDO DERECHA */}
          <main className="flex-1">
            <div className="w-full max-w-full">{renderContenido()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
