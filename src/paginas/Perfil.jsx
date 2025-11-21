import React from "react";
import { useAuth } from "../context/authContext";

// Componentes
import PerfilForm from "../componentes/PerfilForm";
import ComprasList from "../componentes/ComprasList";

export default function PerfilPage() {
  const { usuarioActual, cargando } = useAuth();
  const user = usuarioActual;

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">
          Debes iniciar sesión para ver tu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-[#8f2133] mb-6 text-center">
          Mi perfil
        </h1>

        {/* ===========================
            HEADER FUSIONADO AQUÍ
        ============================ */}
        <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mb-8 shadow-sm">

          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c]">
            <img
              src={
                user.fotoURL ||
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#7a1a0a]">
              {user.user || user.displayName || "Usuario"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {user.correo || user.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              UID: <span className="font-mono">{user.uid}</span>
            </p>
          </div>

        </div>
        {/* ===========================
            FIN DEL HEADER
        ============================ */}

        {/* DOS COLUMNAS */}
        <div className="grid md:grid-cols-2 gap-6">
          <PerfilForm user={user} />
          <ComprasList user={user} />
        </div>
      </div>
    </div>
  );
}
