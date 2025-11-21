import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function PerfilForm({ user }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoURL, setFotoURL] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);

      if (snap.exists()) {
        const data = snap.data();
        setNombre(data.user || "");
        setCorreo(data.correo || user.email || "");
        setFotoURL(data.fotoURL || "");
      }
      setCargando(false);
    };
    cargar();
  }, [user]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    setGuardando(true);
    try {
      await updateDoc(doc(db, "usuarios", user.uid), {
        user: nombre,
        correo,
        fotoURL,
      });
      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert("Error al guardar");
    }
    setGuardando(false);
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">Editar perfil</h2>

      <form onSubmit={handleGuardar} className="space-y-4 text-left">

        <div>
          <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
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
            className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
            Foto de perfil (URL)
          </label>
          <input
            type="text"
            value={fotoURL}
            onChange={(e) => setFotoURL(e.target.value)}
            className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#d16170] text-white py-2.5 rounded-xl"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

      </form>
    </div>
  );
}
