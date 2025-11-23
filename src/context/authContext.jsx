import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, db, storage } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 1. CREACIÓN DEL CONTEXTO
const AuthContext = createContext();

// 2. LISTA SEGURA DE ADMINISTRADORES (oculta al cliente)
const adminEmails = [
  "danportaleshinostroza@crackthecode.la",
  "zanadrianzenbohorquez@crackthecode.la",
  "marandersonsantillan@crackthecode.la",
  "shavalerianoblas@crackthecode.la",
  "pet123@gmail.com", 
];

// 3. HOOK `useAuth` para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro de un AuthProvider");
  return context;
};

// 4. EL PROVEEDOR (El cerebro de la autenticación)
export const AuthProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // --- FUNCIONES DE AUTENTICACIÓN --- 

  const registrarUsuario = async (correo, nombre, contrasena, foto) => {
    const res = await createUserWithEmailAndPassword(auth, correo, contrasena);
    const user = res.user;

    let fotoURL = "/default-user.png";
    if (foto) {
      const storageRef = ref(storage, `fotos-perfil/${user.uid}/${foto.name}`);
      await uploadBytes(storageRef, foto);
      fotoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, { displayName: nombre, photoURL: fotoURL });

    await setDoc(doc(db, "usuarios", user.uid), {
      correo: user.email,
      nombre: nombre,
      rol: "cliente", 
      fotoURL: fotoURL,
      fechaCreacion: serverTimestamp(),
    });

    return res;
  };

  const iniciarSesion = (correo, contrasena) => {
    return signInWithEmailAndPassword(auth, correo, contrasena);
  };

  const iniciarConGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const cerrarSesion = () => signOut(auth);

  // --- EFECTO DE OBSERVACIÓN DEL ESTADO DE AUTH --- 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          // Fusionamos los datos de Firebase Auth y Firestore
          setUsuarioActual({
            ...firestoreData, // Contiene rol, nombre, etc.
            uid: user.uid,
            email: user.email,
            // Aseguramos que displayName y photoURL estén disponibles para la UI
            displayName: user.displayName || firestoreData.nombre,
            photoURL: user.photoURL || firestoreData.fotoURL,
          });
        } else {
          // Si el usuario existe en Auth pero no en Firestore (ej. 1er login con Google)
          const userRole = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "cliente";
          const newUserDoc = {
            correo: user.email,
            nombre: user.displayName || 'Usuario',
            rol: userRole,
            fotoURL: user.photoURL,
            fechaCreacion: serverTimestamp(),
          };
          await setDoc(docRef, newUserDoc);
          setUsuarioActual({
            uid: user.uid,
            ...newUserDoc,
            displayName: newUserDoc.nombre,
            photoURL: newUserDoc.fotoURL,
          });
        }
      } else {
        setUsuarioActual(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // 5. VALOR QUE PROVEE EL CONTEXTO
  const value = {
    usuarioActual,
    cargando,
    registrarUsuario,
    iniciarSesion,
    iniciarConGoogle,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};