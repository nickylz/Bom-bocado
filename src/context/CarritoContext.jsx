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
import { useAuth } from "../context/AuthContext";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { usuarioActual: user } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // 🔹 Escuchar carrito en tiempo real desde Firestore
  useEffect(() => {
    console.log("🟢 useEffect ejecutado. Usuario:", user ? user.uid : "sin usuario");

    if (!user) {
      console.log("⚠️ No hay usuario, cargando carrito desde localStorage...");
      const saved = localStorage.getItem("carrito");
      if (saved) {
        console.log("📦 Carrito cargado de localStorage:", JSON.parse(saved));
        setCarrito(JSON.parse(saved));
      } else {
        console.log("🕳 No había carrito guardado localmente.");
      }
      return;
    }

    console.log("✅ Usuario detectado. Escuchando carrito desde Firestore...");

    const q = query(collection(db, "carrito"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🔥 Snapshot recibido de Firestore:", productos);
      setCarrito(productos);
    });

    return () => {
      console.log("🧹 Cancelando suscripción a Firestore (logout o cambio de usuario)");
      unsubscribe();
    };
  }, [user]);

  // 🔹 Guardar carrito local si no hay usuario
  useEffect(() => {
    if (!user) {
      console.log("💾 Guardando carrito local:", carrito);
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  }, [carrito, user]);

  // 🔹 Agregar producto
  const agregarProducto = async (producto) => {
    const id = producto.id || producto.productoId || producto.nombre;
    if (!id) {
      console.error("⚠️ Producto sin ID o nombre, no se puede agregar correctamente");
      return;
    }

    console.log("🛒 Agregando producto:", producto, "Usuario:", user ? user.uid : "sin usuario");

    if (!user) {
      // solo localStorage
      setCarrito((prev) => {
        const existente = prev.find((p) => p.id === id);
        if (existente) {
          return prev.map((p) =>
            p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
          );
        } else {
          return [...prev, { ...producto, id, cantidad: 1 }];
        }
      });
      return;
    }

    const q = query(
      collection(db, "carrito"),
      where("userId", "==", user.uid),
      where("id", "==", id)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const ref = doc(collection(db, "carrito"));
      console.log("📤 Guardando nuevo producto en Firestore:", { ...producto, id });
      await setDoc(ref, {
        ...producto,
        cantidad: 1,
        userId: user.uid,
        id,
      });
    } else {
      snapshot.forEach(async (d) => {
        const data = d.data();
        console.log("🔄 Actualizando cantidad en Firestore:", d.id);
        await updateDoc(doc(db, "carrito", d.id), {
          cantidad: (data.cantidad || 1) + 1,
        });
      });
    }
  };

  // 🔹 Cambiar cantidad (+/-)
  const cambiarCantidad = async (id, delta) => {
    console.log("🔧 Cambiar cantidad de", id, "en", delta, "Usuario:", user ? user.uid : "sin usuario");

    if (!user) {
      setCarrito((prev) =>
        prev
          .map((p) =>
            p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
          )
          .filter((p) => p.cantidad > 0)
      );
      return;
    }

    const q = query(
      collection(db, "carrito"),
      where("userId", "==", user.uid),
      where("id", "==", id)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (d) => {
      const producto = d.data();
      const nuevaCantidad = Math.max(1, (producto.cantidad || 1) + delta);
      console.log("⚙️ Actualizando producto", id, "a cantidad", nuevaCantidad);
      await updateDoc(doc(db, "carrito", d.id), { cantidad: nuevaCantidad });
    });
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    console.log("❌ Eliminando producto", id, "Usuario:", user ? user.uid : "sin usuario");

    if (!user) {
      setCarrito((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    const q = query(
      collection(db, "carrito"),
      where("userId", "==", user.uid),
      where("id", "==", id)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (d) => {
      console.log("🗑 Eliminando documento de Firestore:", d.id);
      await deleteDoc(doc(db, "carrito", d.id));
    });
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = async () => {
    console.log("🚽 Vaciando carrito completo del usuario:", user ? user.uid : "sin usuario");

    if (!user) {
      setCarrito([]);
      return;
    }

    const q = query(collection(db, "carrito"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (d) => await deleteDoc(doc(db, "carrito", d.id)));
  };

  const total = carrito.reduce((sum, p) => sum + (p.precio || 0) * (p.cantidad || 1), 0);
  const totalProductos = carrito.reduce((sum, p) => sum + (p.cantidad || 0), 0);

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

export const useCarrito = () => useContext(CarritoContext);
