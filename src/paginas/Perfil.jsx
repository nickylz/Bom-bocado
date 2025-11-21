import React from "react";
import { useAuth } from "../context/authContext";

// Componentes
import PerfilHeader from "../componentes/PerfilHeader";
import PerfilForm from "../componentes/PerfilForm";
import ComprasList from "../componentes/ComprasList";

export default function PerfilPage() {
  const { usuarioActual, cargando } = useAuth();
  const user = usuarioActual;

  //  Mientras Firebase carga el usuario
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  //  Si no hay usuario
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">
          Debes iniciar sesión para ver tu perfil.
        </p>
      </div>
    );
  }

  //  Si ya cargó Firebase y hay usuario
  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-[#8f2133] mb-6 text-center">
          Mi perfil
        </h1>

        {/* Cabecera */}
        <PerfilHeader user={user} />

        {/* Dos columnas */}
        <div className="grid md:grid-cols-2 gap-6">
          <PerfilForm user={user} />
          <ComprasList user={user} />
        </div>
      </div>
    </div>
  );
}
