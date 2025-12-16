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
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from 'react-hot-toast';

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

    let fotoURL = null; // Cambiado: ahora es null por defecto
    if (foto) {
      try {
        const storageRef = ref(storage, `perfiles/${user.uid}/${foto.name}`);
        await uploadBytes(storageRef, foto);
        fotoURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error al subir la foto de perfil: ", error);
        toast.error("Hubo un error al subir tu foto. Se continuará sin ella.");
      }
    }
    
    await setDoc(doc(db, "usuarios", user.uid), {
      correo: user.email,
      nombre: nombre,
      username: usernameLower,
      rol: "cliente", 
      fotoURL: fotoURL, // Se guarda null si no hay foto
      fechaCreacion: serverTimestamp(),
    });

    await updateProfile(user, { displayName: nombre, photoURL: fotoURL });

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
      
      await setDoc(docRef, {
        correo: user.email,
        nombre: user.displayName || 'Usuario Google',
        username: usernameFromEmail, 
        rol: userRole,
        fotoURL: user.photoURL, // La foto que viene de Google
        fechaCreacion: serverTimestamp(),
      });
    }
    return result;
  };

  const cerrarSesion = () => signOut(auth);

  const actualizarFotoPerfil = async (file) => {
    if (!usuarioActual) throw new Error("No hay usuario autenticado.");

    if (!file.type.startsWith('image/')) {
      throw new Error('Por favor, selecciona un archivo de imagen válido.');
    }

    const toastId = toast.loading('Subiendo imagen...');

    try {
      const fileRef = ref(storage, `avatares/${usuarioActual.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      const userDocRef = doc(db, 'usuarios', usuarioActual.uid);
      await updateDoc(userDocRef, { fotoURL: photoURL });

      const authUser = auth.currentUser;
      if (authUser) {
        await updateProfile(authUser, { photoURL });
      }
      
      toast.success('¡Icono actualizado!', { id: toastId });
      return photoURL;

    } catch (error) {
      console.error("Error al actualizar la foto de perfil:", error);
      toast.error('Error al subir la imagen. Inténtalo de nuevo.', { id: toastId });
      throw error;
    }
  };

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeFirestore();

      if (user) {
        setCargando(true);
        const docRef = doc(db, "usuarios", user.uid);
        
        unsubscribeFirestore = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            setUsuarioActual({
              ...user, 
              ...firestoreData, 
            });
          } else {
            setUsuarioActual(user);
          }
          setCargando(false);
        }, (error) => {
          console.error("Error al escuchar datos de Firestore:", error);
          setUsuarioActual(user);
          setCargando(false);
        });
      } else {
        setUsuarioActual(null);
        setCargando(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);


  const value = {
    usuarioActual,
    cargando,
    registrarUsuario,
    iniciarSesion,
    iniciarConGoogle,
    cerrarSesion,
    actualizarFotoPerfil
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};