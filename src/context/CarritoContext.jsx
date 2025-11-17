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
  const [cargandoPago, setCargandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);

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
      const productos = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      console.log(" Snapshot recibido de Firestore:", productos);
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

      const guestQ = query(
        collection(db, "carrito"),
        where("userId", "==", guestId)
      );
      const guestSnap = await getDocs(guestQ);

      for (const d of guestSnap.docs) {
        const data = d.data();
        const qUser = query(
          collection(db, "carrito"),
          where("userId", "==", user.uid),
          where("id", "==", data.id)
        );
        const userSnap = await getDocs(qUser);

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
      console.log("Carrito guest fusionado con el de usuario.");
      sessionStorage.removeItem("guestId");
    };

    fusionarCarritos();
  }, [user]);

  // 🔹 Agregar producto
  const agregarProducto = async (producto) => {
    const id = producto.id || producto.productoId || producto.nombre;
    if (!id) return console.error(" Producto sin ID");

    const uid = user ? user.uid : getGuestId();
    console.log("🛒 Agregando producto:", producto, "para", uid);

    const qExistente = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(qExistente);

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
    const qCarrito = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(qCarrito);

    snap.forEach(async (d) => {
      const prod = d.data();
      const nuevaCantidad = Math.max(1, (prod.cantidad || 1) + delta);
      await updateDoc(doc(db, "carrito", d.id), {
        cantidad: nuevaCantidad,
      });
    });
  };

  // 🔹 Eliminar producto
  const eliminarProducto = async (id) => {
    const uid = user ? user.uid : getGuestId();
    const qCarrito = query(
      collection(db, "carrito"),
      where("userId", "==", uid),
      where("id", "==", id)
    );
    const snap = await getDocs(qCarrito);

    snap.forEach(async (d) => {
      await deleteDoc(doc(db, "carrito", d.id));
    });
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = async () => {
    const uid = user ? user.uid : getGuestId();
    const qCarrito = query(
      collection(db, "carrito"),
      where("userId", "==", uid)
    );
    const snap = await getDocs(qCarrito);

    snap.forEach(async (d) => {
      await deleteDoc(doc(db, "carrito", d.id));
    });
  };

  // 🔹 Totales
  const total = carrito.reduce(
    (s, p) => s + (p.precio || 0) * (p.cantidad || 1),
    0
  );
  const totalProductos = carrito.reduce(
    (s, p) => s + (p.cantidad || 0),
    0
  );

  // 🔹 Registrar la compra en Firestore
  const realizarPago = async ({ nombre, direccion, metodoPago }) => {
    if (!user) {
      throw new Error("Debes iniciar sesión para realizar el pago");
    }
    if (carrito.length === 0) {
      throw new Error("Tu carrito está vacío");
    }

    setCargandoPago(true);
    setErrorPago(null);

    try {
      const  delivery= 5; // fijo, como en tu modal
      const totalFinal = total + delivery;

      const pedidoRef = doc(collection(db, "pedidos"));
      await setDoc(pedidoRef, {
        id: pedidoRef.id,
        userId: user.uid,
        nombreCliente: nombre,
        direccionEnvio: direccion,
        metodoPago,
        items: carrito.map((item) => ({
          id: item.id,
          nombre:
            item.nombre || item.nombreProducto || "Producto sin nombre",
          precio: item.precio || 0,
          cantidad: item.cantidad || 1,
          imagen: item.imagen || null,
        })),
        delivery,
        totalProductos,
        subtotal: total,
        totalFinal,
        fechaCreacion: new Date(),
      });

      // Vaciar carrito en Firestore
      await vaciarCarrito();

      setCargandoPago(false);
      return pedidoRef.id;
    } catch (error) {
      console.error(" Error al registrar pedido:", error);
      setErrorPago(error.message);
      setCargandoPago(false);
      throw error;
    }
  };

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
        realizarPago,
        cargandoPago,
        errorPago,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);
