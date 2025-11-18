// src/components/Ajustes.jsx
import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Ajustes({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); // cerrar modal al cerrar sesión
      alert("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-right z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2] relative">
        {/* Botón cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-[#7a1a0a] mb-4">
          Ajustes de cuenta
        </h2>

        {/* Foto y datos */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c] mb-3">
            <img
              src={
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-[#7a1a0a]">
            {user?.displayName || user?.user || "Usuario"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>

        {/* Opciones */}
        <div className="space-y-3 text-left">
          <Link
            to="/compras"
            onClick={onClose}
            className="block w-full px-4 py-3 rounded-xl border border-[#f5bfb2] bg-white hover:bg-[#fbe1e7] transition font-semibold text-[#7a1a0a]"
          >
            Mis compras
            <span className="block text-xs text-[#d8718c] mt-1">
              Ver historial
            </span>
          </Link>

          <Link
            to="/editarperfil"
            onClick={onClose}
            className="block w-full px-4 py-3 rounded-xl border border-[#f5bfb2] bg-white hover:bg-[#fbe1e7] transition font-semibold text-[#7a1a0a]"
          >
            Editar perfil
            <span className="block text-xs text-[#d8718c] mt-1">
              Cambiar datos
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
