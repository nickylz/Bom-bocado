// src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db, storage } from "../lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

// Hook personalizado para acceder fácilmente al contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  //  Escucha los cambios en la sesión de Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Referencia al documento del usuario
        const refUser = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refUser);

        //  Usa los datos de Firestore si existen, pero con respaldo desde Auth
        if (snap.exists()) {
          const data = snap.data();
          setUsuarioActual({
            uid: user.uid,
            correo: data.correo || user.email,
            user: data.user || user.displayName,
            fotoURL: data.fotoURL || user.photoURL, 
          });
        } else {
          //  Si no existe, crea el doc mínimo con datos del Auth
          await setDoc(refUser, {
            correo: user.email,
            user: user.displayName || "Usuario",
            fotoURL: user.photoURL || "",
            uid: user.uid,
          });

          setUsuarioActual({
            uid: user.uid,
            correo: user.email,
            user: user.displayName,
            fotoURL: user.photoURL,
          });
        }
      } else {
        setUsuarioActual(null);
      }
      setCargando(false);
    });

    return () => unsub();
  }, []);

  //  Registro con correo, usuario, contraseña y foto personalizada
  const registrarUsuario = async (correo, user, contrasena, foto) => {
    const cred = await createUserWithEmailAndPassword(auth, correo, contrasena);

    let fotoURL = "";
    if (foto) {
      const storageRef = ref(storage, `perfiles/${cred.user.uid}`);
      await uploadBytes(storageRef, foto);
      fotoURL = await getDownloadURL(storageRef);
    }

    // Se actualiza el perfil de Firebase Auth
    await updateProfile(cred.user, { displayName: user, photoURL: fotoURL });

    // Se guarda también en Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      correo,
      user,
      fotoURL,
      uid: cred.user.uid,
    });
  };

  //  Login normal con correo y contraseña
  const iniciarSesion = (correo, contrasena) =>
    signInWithEmailAndPassword(auth, correo, contrasena);

  //  Login con Google (corregido)
  const iniciarConGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const refUser = doc(db, "usuarios", user.uid);
    const snap = await getDoc(refUser);

    if (!snap.exists()) {
      await setDoc(refUser, {
        correo: user.email,
        user: user.displayName,
        fotoURL: user.photoURL,
        uid: user.uid,
      });
    } else {
      //  Si el doc ya existe, actualiza datos por si cambian
      await updateDoc(refUser, {
        user: user.displayName,
        fotoURL: user.photoURL,
      });
    }
  };

  //  Cierra sesión
  const cerrarSesion = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        registrarUsuario,
        iniciarSesion,
        iniciarConGoogle,
        cerrarSesion,
      }}
    >
      {/* No se renderiza nada hasta que termine de cargar el estado del usuario */}
      {!cargando && children}
    </AuthContext.Provider>
  );
}
