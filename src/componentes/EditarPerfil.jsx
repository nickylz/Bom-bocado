import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function EditarPerfil({ isOpen, onClose, user }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoURL, setFotoURL] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!isOpen || !user) return;
      setCargando(true);
      try {
        const refUser = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refUser);

        if (snap.exists()) {
          const data = snap.data();
          setNombre(data.user || user.displayName || "");
          setCorreo(data.correo || user.email || "");
          setFotoURL(data.fotoURL || user.photoURL || "");
        } else {
          setNombre(user.displayName || "");
          setCorreo(user.email || "");
          setFotoURL(user.photoURL || "");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("Error al cargar los datos del perfil");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!user) return;

    setGuardando(true);
    try {
      const refUser = doc(db, "usuarios", user.uid);
      await updateDoc(refUser, {
        user: nombre || "Usuario",
        correo: correo || user.email,
        fotoURL: fotoURL || "",
      });

      alert("Perfil actualizado correctamente");
      onClose();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#7a1a0a] mb-4">
          Editar perfil
        </h2>
        <p className="text-sm text-[#7a1a0a] mb-4">
          Actualiza tu información de usuario.
        </p>

        {cargando ? (
          <p className="text-[#7a1a0a] font-semibold">Cargando datos...</p>
        ) : (
          <form onSubmit={handleGuardar} className="space-y-4 text-left">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c] mb-3">
                <img
                  src={
                    fotoURL ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                Correo
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                Sube una nueva foto de perfil
              </label>
              <input
                type="text"
                value={fotoURL}
                onChange={(e) => setFotoURL(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                (Más adelante puedes cambiar esto por subida de archivo si quieres)
              </p>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full mt-4 bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
