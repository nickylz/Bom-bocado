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
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  //  Escucha los cambios en la sesión de Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Referencia al documento del usuario en Firestore
        const refUser = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refUser);

        if (snap.exists()) {
          // Si el documento existe, usamos sus datos
          const data = snap.data();
          setUsuarioActual({
            uid: user.uid,
            correo: data.correo || user.email,
            user: data.user || user.displayName,
            fotoURL: data.fotoURL || user.photoURL,
            rol: data.rol || "usuario",
            fechaCreacion: data.fechaCreacion || null,
          });
        } else {
          // Si no existe, creamos el doc mínimo con datos del Auth
          const fechaCreacion = Timestamp.now();

          await setDoc(refUser, {
            correo: user.email,
            user: user.displayName || "Usuario",
            fotoURL: user.photoURL || "",
            uid: user.uid,
            rol: "usuario",
            fechaCreacion, // se guarda solo una vez
          });

          setUsuarioActual({
            uid: user.uid,
            correo: user.email,
            user: user.displayName || "Usuario",
            fotoURL: user.photoURL || "",
            rol: "usuario",
            fechaCreacion,
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

    const fechaCreacion = Timestamp.now();

    // Se actualiza el perfil de Firebase Auth
    await updateProfile(cred.user, { displayName: user, photoURL: fotoURL });

    // Se guarda también en Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      correo,
      user,
      fotoURL,
      uid: cred.user.uid,
      rol: "usuario", // por defecto rol usuario
      fechaCreacion,
    });
  };

  //  Login normal con correo y contraseña
  const iniciarSesion = (correo, contrasena) =>
    signInWithEmailAndPassword(auth, correo, contrasena);

  //  Login con Google
  const iniciarConGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const refUser = doc(db, "usuarios", user.uid);
    const snap = await getDoc(refUser);

    if (!snap.exists()) {
      const fechaCreacion = Timestamp.now();

      await setDoc(refUser, {
        correo: user.email,
        user: user.displayName,
        fotoURL: user.photoURL,
        uid: user.uid,
        rol: "usuario",
        fechaCreacion,
      });
    } else {
      //  Si el doc ya existe, actualiza datos básicos (no tocamos rol ni fechaCreacion)
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
        cargando,
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
