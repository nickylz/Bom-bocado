import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Componentes
import PerfilForm from "../componentes/PerfilForm";
import ComprasList from "../componentes/ComprasList";

export default function PerfilPage() {
  const { usuarioActual, cargando } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargandoCompras, setCargandoCompras] = useState(true);

  // ===================================
  //   CARGAR COMPRAS DEL USUARIO
  // ===================================
  useEffect(() => {
    // Si la autenticación aún está cargando o no hay usuario, reiniciamos el estado.
    if (cargando || !usuarioActual) {
      setCompras([]);
      setCargandoCompras(false);
      return;
    }

    // Si tenemos un usuario, procedemos a cargar sus compras.
    setCargandoCompras(true);
    const q = query(
      collection(db, "pedidos"),
      where("userId", "==", usuarioActual.uid),
      orderBy("fechaCreacion", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompras(lista);
        setCargandoCompras(false);
      },
      (error) => {
        console.error("Error obteniendo compras:", error);
        setCargandoCompras(false);
      }
    );

    // Limpiamos la suscripción al desmontar el componente o si el usuario cambia.
    return () => unsub();
  }, [usuarioActual, cargando]); // El efecto depende del usuario y del estado de carga.

  if (cargando) {
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

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-[#8f2133] mb-6 text-center">
          Mi perfil
        </h1>

        <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mb-8 shadow-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c]">
            <img
              src={
                usuarioActual.fotoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#7a1a0a]">
              {usuarioActual.user || "Usuario"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {usuarioActual.correo || ""}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              UID: <span className="font-mono">{usuarioActual.uid}</span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PerfilForm user={usuarioActual} />
          <ComprasList
            compras={compras}
            cargando={cargandoCompras}
          />
        </div>
      </div>
    </div>
  );
}
