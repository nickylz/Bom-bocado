import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { format } from 'date-fns';
import { Edit2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const getInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function PerfilForm({ user }) {
  const { actualizarFotoPerfil } = useAuth();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      if (user) {
        const refUser = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refUser);

        if (snap.exists()) {
          const data = snap.data();
          setNombre(data.nombre || "");
          setUsername(data.username || "");
          setCorreo(data.correo || user.email || "");
          setImagePreview(data.fotoURL || user.fotoURL || null); // Corregido a fotoURL
        }
      }
      setCargando(false);
    };
    cargar();
  }, [user]);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newPhotoURL = await actualizarFotoPerfil(file);
      setImagePreview(newPhotoURL);
    } catch (error) {
      // El toast de error ya se maneja en el contexto
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const toastId = toast.loading('Guardando cambios...');

    try {
      const usernameLower = username.toLowerCase();
      if (user.username && usernameLower !== user.username) {
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
        await updateProfile(currentUser, { displayName: nombre });
      }

      toast.success("Perfil actualizado correctamente", { id: toastId });
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(`Error al guardar: ${error.message}`, { id: toastId });
    } finally {
      setGuardando(false);
    }
  };
  
  const fechaFormateada = user.fechaCreacion?.toDate ? format(user.fechaCreacion.toDate(), 'dd/MM/yyyy') : 'No disponible';

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 border border-rose-200">
        {/* Avatar UI con lógica de iniciales */}
        <div className="relative group w-32 h-32 flex-shrink-0">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#d16170] flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-4xl font-bold">{getInitials(nombre)}</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={handleFileSelect}
            disabled={isUploading}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {isUploading ? <Loader className="animate-spin" /> : <Edit2 size={24} />}
          </button>
        </div>

        <div className="text-center sm:text-left w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-[#7a1a0a] break-words">{nombre || 'Usuario'}</h2>
          <p className="text-gray-600 break-all">{correo}</p>
          <div className="text-gray-400 text-sm mt-2 space-y-1">
             <p className="break-all">UID: {user.uid}</p>
             <p>Miembro desde: {fechaFormateada}</p>
          </div>
        </div>
      </div>

      {/* Formulario para Editar Perfil */}
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
              disabled={guardando || isUploading}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
