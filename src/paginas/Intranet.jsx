import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/authContext";
import FormProductos from "../componentes/FormProductos"; // Importamos el formulario

export default function Intranet() {
  const { usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la", // ANEL
    "zanadrianzenbohorquez@crackthecode.la", // NICOLL
    "marandersonsantillan@crackthecode.la",  // SABRINA
    "shavalerianoblas@crackthecode.la",      // SHARON
    "pet123@gmail.com", // PRUEBA
  ];

  const correoUsuario = usuarioActual?.correo?.toLowerCase().trim();
  const accesoPermitido = correoUsuario
    ? correosPermitidos.some(
        (correo) => correo.toLowerCase().trim() === correoUsuario
      )
    : false;

  useEffect(() => {
    if (!accesoPermitido) return;

    const coleccionRef = collection(db, "usuarios");
    const q = query(coleccionRef, orderBy("fechaCreacion", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
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
  }, [accesoPermitido, usuarioActual]);

  if (!usuarioActual || !accesoPermitido) {
    return null;
  }

  const manejarCambioRol = async (idUsuario, nuevoRol) => {
    try {
      const refUsuario = doc(db, "usuarios", idUsuario);
      await updateDoc(refUsuario, { rol: nuevoRol });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => u.rol === "usuario");

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Sección de Administración de Productos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
           <h1 className="text-3xl font-bold mb-4 text-[#ff5c39]">
            Intranet - Administración
          </h1>
          <p className="text-gray-600 mb-6">
            Bienvenido, {usuarioActual.correo}.
          </p>
          <FormProductos />
        </div>

        {/* Sección de Administración de Usuarios */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4 text-[#ff5c39]">
            Gestión de Usuarios
          </h2>
          {cargando ? (
            <p className="text-gray-500">Cargando usuarios...</p>
          ) : usuariosFiltrados.length === 0 ? (
            <p className="text-gray-500">No hay usuarios con rol "usuario".</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#fff3f0]">
                    <th className="border px-3 py-2 text-left text-sm font-semibold">#</th>
                    <th className="border px-3 py-2 text-left text-sm font-semibold">Nombre</th>
                    <th className="border px-3 py-2 text-left text-sm font-semibold">Correo</th>
                    <th className="border px-3 py-2 text-left text-sm font-semibold">Rol</th>
                    <th className="border px-3 py-2 text-left text-sm font-semibold">Fecha registro</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u, index) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 text-sm">{index + 1}</td>
                      <td className="border px-3 py-2 text-sm">{u.user || "Sin nombre"}</td>
                      <td className="border px-3 py-2 text-sm">{u.correo}</td>
                      <td className="border px-3 py-2 text-sm">
                        <select
                          value={u.rol || "usuario"}
                          onChange={(e) => manejarCambioRol(u.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="border px-3 py-2 text-sm">
                        {u.fechaCreacion?.toDate
                          ? u.fechaCreacion.toDate().toLocaleString()
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
    </div>
  );
}