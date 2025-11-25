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
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

const adminEmails = [
  "danportaleshinostroza@crackthecode.la",
  "zanadrianzenbohorquez@crackthecode.la",
  "marandersonsantillan@crackthecode.la",
  "shavalerianoblas@crackthecode.la",
  "pet123@gmail.com", 
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const registrarUsuario = async (correo, nombre, username, contrasena, foto) => {
    const usernameLower = username.toLowerCase();
    const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("El nombre de usuario ya está en uso.");
    }

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
      username: usernameLower,
      rol: "cliente", 
      fotoURL: fotoURL,
      fechaCreacion: serverTimestamp(),
    });

    return res;
  };

  const iniciarSesion = async (identifier, contrasena) => {
    let correo = identifier;
    if (!identifier.includes('@')) {
        const usernameLower = identifier.toLowerCase();
        const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Usuario o contraseña incorrectos.");
        }
        const userData = querySnapshot.docs[0].data();
        correo = userData.correo;
    }
    return signInWithEmailAndPassword(auth, correo, contrasena);
  };

  const iniciarConGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const userRole = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "cliente";
      const usernameFromEmail = user.email.split('@')[0].toLowerCase();
      
      const newUserDoc = {
        correo: user.email,
        nombre: user.displayName || 'Usuario Google',
        username: usernameFromEmail, // Se puede hacer más robusto para evitar colisiones
        rol: userRole,
        fotoURL: user.photoURL || "/default-user.png",
        fechaCreacion: serverTimestamp(),
      };
      await setDoc(docRef, newUserDoc);
    }
    return result;
  };

  const cerrarSesion = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          setUsuarioActual({
            ...user,
            ...firestoreData,
          });
        } else {
          console.log("Usuario autenticado pero sin datos en Firestore. Esto puede pasar si el registro con Google falló a la mitad.");
          setUsuarioActual(user);
        }
      } else {
        setUsuarioActual(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

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
