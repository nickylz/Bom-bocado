import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/authContext";

export default function Intranet() {
  const { usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la", // ANEL
    "zanadrianzenbohorquez@crackthecode.la", // NICOLL
    "marandersonsantillan@crackthecode.la",  // SABRINA
    "shavalerianoblas@crackthecode.la",      // SHARON
  ];

  // calculamos el acceso aquí, sin returns todavía
  const correoUsuario = usuarioActual?.email
    ?.toLowerCase()
    .trim();

  const accesoPermitido = correoUsuario
    ? correosPermitidos.some(
        (correo) => correo.toLowerCase().trim() === correoUsuario
      )
    : false;

  // hook SIEMPRE se llama, solo que dentro decide si hace algo o no
  useEffect(() => {
    if (!accesoPermitido) return;

    const coleccionRef = collection(db, "usuarios"); // cambia el nombre si tu colección es otra
    const q = query(coleccionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(data);
        setCargando(false);
      },
      (error) => {
        console.error("Error al obtener usuarios:", error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, [accesoPermitido]);

  // 🔻 A PARTIR DE AQUÍ recién hacemos returns condicionales 🔻

  // si no hay usuario logueado, no mostramos nada
  if (!usuarioActual) {
    return null;
  }

  // si el usuario no es admin, no mostramos nada (no sabe que existe)
  if (!accesoPermitido) {
    return null;
  }

  // vista solo para administradores
  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 text-[#ff5c39]">
          Intranet - Administración
        </h1>
        <p className="text-gray-600 mb-6">
          Bienvenido, {usuarioActual.email}. Aquí puedes ver la lista de usuarios.
        </p>

        {cargando ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#fff3f0]">
                  <th className="border px-3 py-2 text-left text-sm font-semibold">
                    #
                  </th>
                  <th className="border px-3 py-2 text-left text-sm font-semibold">
                    Nombre
                  </th>
                  <th className="border px-3 py-2 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="border px-3 py-2 text-left text-sm font-semibold">
                    Fecha registro
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, index) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-sm">{index + 1}</td>
                    <td className="border px-3 py-2 text-sm">
                      {u.nombre || "Sin nombre"}
                    </td>
                    <td className="border px-3 py-2 text-sm">{u.email}</td>
                    <td className="border px-3 py-2 text-sm">
                      {u.createdAt?.toDate
                        ? u.createdAt.toDate().toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
