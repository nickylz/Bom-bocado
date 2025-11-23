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
      alert("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-transparent z-40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute top-16 right-4 z-50">
        <div className="bg-[#fff3f0] rounded-2xl shadow-xl w-72 p-4 border border-[#f5bfb2] relative">

          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>

          {/* Info de usuario */}
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d8718c]">
              <img
                src={
                  user?.fotoURL ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#7a1a0a]">
                {user?.user || "Usuario"}
              </span>
              
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/perfil" 
              onClick={onClose}
              className="block w-full text-center px-3 py-2 rounded-xl border border-[#f5bfb2] bg-white hover:bg-[#fbe1e7] transition text-sm font-semibold text-[#7a1a0a]"
            >
              Ver perfil
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-[#d16170] text-white py-2 rounded-xl hover:bg-[#b84c68] transition text-sm font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
