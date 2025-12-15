import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { format } from 'date-fns';
import AvatarUpload from "./AvatarUpload";

export default function PerfilForm({ user }) {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);

      if (snap.exists()) {
        const data = snap.data();
        setNombre(data.nombre || "");
        setUsername(data.username || "");
        setCorreo(data.correo || user.email || "");
      }
      setCargando(false);
    };
    cargar();
  }, [user]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const usernameLower = username.toLowerCase();
      if (usernameLower !== user.username) {
        const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          throw new Error("El nombre de usuario ya está en uso.");
        }
      }

      await updateDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        username: usernameLower,
        correo,
      });

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: nombre,
        });
      }

      alert("Perfil actualizado correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(`Error al guardar el perfil: ${error.message}`);
    }
    setGuardando(false);
  };
  
  const fechaFormateada = user.fechaCreacion?.toDate ? format(user.fechaCreacion.toDate(), 'dd/MM/yyyy') : 'No disponible';

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      {/* Tarjeta de Información del Usuario (Responsive) */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 border border-rose-200">
        <AvatarUpload onUploadComplete={(newFotoURL) => {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser) {
            updateProfile(currentUser, { photoURL: newFotoURL });
          }
        }} />
        <div className="text-center sm:text-left w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-[#7a1a0a] break-words">{nombre || 'Usuario'}</h2>
          <p className="text-gray-600 break-all">{correo}</p>
          <div className="text-gray-400 text-sm mt-2 space-y-1">
             <p className="break-all">UID: {user.uid}</p>
             <p>Miembro desde: {fechaFormateada}</p>
          </div>
        </div>
      </div>

      {/* Formulario para Editar Perfil (Responsive) */}
      <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#7a1a0a] mb-4">Editar perfil</h2>
        <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
          
          <div>
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">Correo</label>
            <input
              type="email"
              value={correo}
              disabled
              title="El correo no se puede cambiar desde aquí por seguridad."
              className="w-full bg-gray-100 border border-[#f5bfb2] px-4 py-2.5 rounded-xl cursor-not-allowed"
            />
          </div>
          
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              className="w-full bg-[#d16170] text-white py-2.5 rounded-xl hover:bg-[#b84c68] transition-colors disabled:bg-gray-400"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
