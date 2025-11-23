import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore"; // Se quita orderBy

// Componentes
import PerfilForm from "../componentes/PerfilForm";
import ComprasList from "../componentes/ComprasList";

export default function PerfilPage() {
  const { usuarioActual, cargando: cargandoAuth } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargandoCompras, setCargandoCompras] = useState(true);

  useEffect(() => {
    const cargarCompras = async () => {
      if (!usuarioActual) {
        setCompras([]);
        setCargandoCompras(false);
        return;
      }

      setCargandoCompras(true);
      try {
        const q = query(
          collection(db, "pedidos"),
          where("userId", "==", usuarioActual.uid)
        );
        
        const querySnapshot = await getDocs(q);
        let lista = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        lista.sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate ? a.fechaCreacion.toDate() : 0;
            const fechaB = b.fechaCreacion?.toDate ? b.fechaCreacion.toDate() : 0;
            return fechaB - fechaA; // Orden descendente
        });

        setCompras(lista);

      } catch (error) {
        console.error("Error definitivo obteniendo compras:", error);
        setCompras([]);
      } finally {
        setCargandoCompras(false);
      }
    };

    cargarCompras();

  }, [usuarioActual]);

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
                usuarioActual.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#7a1a0a]">
              {usuarioActual.displayName || "Usuario"}
            </h2>
            <p className="text-md font-semibold text-[#d8718c]">
              @{usuarioActual.username || "username"}
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
