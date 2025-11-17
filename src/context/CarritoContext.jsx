import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "./authContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { usuarioActual: user } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // 🔹 ID temporal si no hay usuario (guest)
  const getGuestId = () => {
    let guestId = sessionStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest-" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  // 🔹 Escuchar carrito desde Firestore
  useEffect(() => {
    const uid = user ? user.uid : getGuestId();
    console.log("🟢 Escuchando carrito para:", uid);

    const q = query(collection(db, "carrito"), where("userId", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🔥 Snapshot recibido de Firestore:", productos);
      setCarrito(productos);
    });

    return () => {
      console.log("🧹 Cancelando suscripción del carrito");
      unsubscribe();
    };
  }, [user]);

  // 🔹 Fusionar carrito de invitado con el del usuario al iniciar sesión
  useEffect(() => {
    const fusionarCarritos = async () => {
      if (!user) return;
      const guestId = sessionStorage.getItem("guestId");
      if (!guestId) return;

      const guestQ = query(collection(db, "carrito"), where("userId", "==", guestId));
      const guestSnap = await getDocs(guestQ);

      for (const d of guestSnap.docs) {
        const data = d.data();
        const q = query(
          collection(db, "carrito"),
          where("userId", "==", user.uid),
          where("id", "==", data.id)
        );
        const userSnap = await getDocs(q);

        if (userSnap.empty) {
          await setDoc(doc(collection(db, "carrito")), {
            ...data,
            userId: user.uid,
          });
        } else {
          userSnap.forEach(async (docUser) => {
            const prod = docUser.data();
            await updateDoc(doc(db, "carrito", docUser.id), {
              cantidad: (prod.cantidad || 1) + (data.cantidad || 1),
            });
          });
        }
        // 🗑 Eliminar del carrito guest
        await deleteDoc(doc(db, "carrito", d.id));
      }
      console.log("✅ Carrito guest fusionado con el de usuario.");
      sessionStorage.removeItem("guestId");
    };

    fusionarCarritos();
  }, [user]);

  // 🔹 Agregar producto
  const agregarProducto = async (producto) => {
    const id = producto.id || producto.productoId || producto.nombre;
    if (!id) return console.error("⚠️ Producto sin ID");

    const uid = user ? user.uid : getGuestId();
    console.log("🛒 Agregando producto:", producto, "para", uid);

    const q = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      const ref = doc(collection(db, "carrito"));
      await setDoc(ref, {
        ...producto,
        cantidad: 1,
        userId: uid,
        id,
      });
    } else {
      snap.forEach(async (d) => {
        const data = d.data();
        await updateDoc(doc(db, "carrito", d.id), {
          cantidad: (data.cantidad || 1) + 1,
        });
      });
    }
  };

  // 🔹 Cambiar cantidad
  const cambiarCantidad = async (id, delta) => {
    const uid = user ? user.uid : getGuestId();
    const q = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(q);
    snap.forEach(async (d) => {
      const prod = d.data();
      const nuevaCantidad = Math.max(1, (prod.cantidad || 1) + delta);
      await updateDoc(doc(db, "carrito", d.id), { cantidad: nuevaCantidad });
    });
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    const uid = user ? user.uid : getGuestId();
    const q = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(q);
    snap.forEach(async (d) => await deleteDoc(doc(db, "carrito", d.id)));
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = async () => {
    const uid = user ? user.uid : getGuestId();
    const q = query(collection(db, "carrito"), where("userId", "==", uid));
    const snap = await getDocs(q);
    snap.forEach(async (d) => await deleteDoc(doc(db, "carrito", d.id)));
  };

  // 🔹 Totales
  const total = carrito.reduce((s, p) => s + (p.precio || 0) * (p.cantidad || 1), 0);
  const totalProductos = carrito.reduce((s, p) => s + (p.cantidad || 0), 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        cambiarCantidad,
        vaciarCarrito,
        total,
        totalProductos,
        mostrarCarrito,
        setMostrarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);
