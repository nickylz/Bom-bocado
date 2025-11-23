import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PerfilForm({ user }) {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoURL, setFotoURL] = useState("");
  const [nuevaFoto, setNuevaFoto] = useState(null);
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
      const usernameLower = username.toLowerCase();
      if (usernameLower !== user.username) {
        const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          throw new Error("El nombre de usuario ya está en uso.");
        }
      }

      let finalFotoURL = fotoURL;

      if (nuevaFoto) {
        const storageRef = ref(storage, `fotos-perfil/${user.uid}`);
        await uploadBytes(storageRef, nuevaFoto);
        finalFotoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        username: usernameLower,
        correo,
        fotoURL: finalFotoURL,
      });

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: nombre,
          photoURL: finalFotoURL,
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

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">Editar perfil</h2>

      <form onSubmit={handleGuardar} className="space-y-4 text-left">

        <div>
          <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
            Nombre completo
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
            Nombre de usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            disabled
            title="El correo no se puede cambiar desde aquí por seguridad."
            className="w-full bg-gray-100 border border-[#f5bfb2] px-4 py-2.5 rounded-xl cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
            Subir nueva foto de perfil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNuevaFoto(e.target.files[0])}
            className="w-full text-sm text-[#7a1a0a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f5bfb2] file:text-[#7a1a0a] hover:file:bg-[#e6a89a]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#d16170] text-white py-2.5 rounded-xl hover:bg-[#b84c68] transition-colors disabled:bg-gray-400"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

      </form>
    </div>
  );
}
