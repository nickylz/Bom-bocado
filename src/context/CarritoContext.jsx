import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const usuarioId = "anonimo"; // <-- cámbialo cuando tengas autenticación

  // 🔹 Escuchar los productos del carrito en tiempo real (solo de este usuario)
  useEffect(() => {
    const q = query(collection(db, "carrito"), where("usuarioId", "==", usuarioId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCarrito(items);
    });

    return () => unsubscribe();
  }, []);

  // === FUNCIONES ===

  const agregarProducto = async (producto) => {
    try {
      // Buscar si ya existe ese producto en el carrito de este usuario
      const existente = carrito.find((p) => p.productoId === producto.id);

      if (existente) {
        // Si ya existe, aumentar cantidad
        const nuevoValor = existente.cantidad + 1;
        await updateDoc(doc(db, "carrito", existente.id), {
          cantidad: nuevoValor,
        });
      } else {
        // Si no existe, agregar nuevo producto
        await addDoc(collection(db, "carrito"), {
          usuarioId,
          productoId: producto.id,
          nombreProducto: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          imagen: producto.imagen || "",
          fechaAgregado: serverTimestamp(),
        });
      }

      console.log("✅ Producto agregado al carrito");
    } catch (error) {
      console.error("❌ Error agregando producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "carrito", id));
      console.log("🗑️ Producto eliminado del carrito");
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
    }
  };

  const cambiarCantidad = async (id, delta) => {
    const producto = carrito.find((p) => p.id === id);
    if (!producto) return;

    const nuevaCantidad = Math.max(1, producto.cantidad + delta);
    try {
      await updateDoc(doc(db, "carrito", id), {
        cantidad: nuevaCantidad,
      });
    } catch (error) {
      console.error("❌ Error cambiando cantidad:", error);
    }
  };

  const vaciarCarrito = async () => {
    try {
      const promesas = carrito.map((p) => deleteDoc(doc(db, "carrito", p.id)));
      await Promise.all(promesas);
      console.log("🧹 Carrito vaciado");
    } catch (error) {
      console.error("❌ Error vaciando carrito:", error);
    }
  };

  // === TOTALES ===
  const total = carrito.reduce(
    (sum, p) => sum + (p.precio || 0) * (p.cantidad || 0),
    0
  );
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
