import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Ajustes({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); 
      // La alerta se podría quitar para una mejor UX, pero la mantengo por ahora
      alert("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    // FONDO OSCURO
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* CONTENEDOR DEL MODAL */}
      <div className="bg-[#fff3f0] rounded-3xl shadow-xl w-[90%] max-w-sm p-6 border border-[#f5bfb2] relative text-center">
        
        {/* BOTÓN DE CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* HEADER CON FOTO Y NOMBRE */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col text-center mt-3">
            <span className="text-xl font-bold text-[#8f2133]">
              {user?.displayName || "Usuario"}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {user?.email}
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="space-y-3">
          <Link
            to="/perfil"
            onClick={onClose}
            className="block w-full text-center px-4 py-3 rounded-xl border-2 border-[#f5bfb2] bg-white hover:bg-[#fdecea] transition-all duration-300 font-semibold text-[#8f2133] shadow-sm"
          >
            Gestionar Perfil
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition-all duration-300 font-semibold shadow-md"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
