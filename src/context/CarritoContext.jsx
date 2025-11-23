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
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./authContext";

const CarritoContext = createContext();

const reminderMessages = [
  "¡No dejes que se enfríe! Tus productos te esperan.",
  "Tu carrito te extraña. ¿Listo para finalizar tu compra?",
  "¡Psst! Esos bocaditos en tu carrito se ven deliciosos.",
  "Estás a un paso de la felicidad. ¡Completa tu pedido!",
  "¡No te lo pierdas! Finaliza tu compra antes de que se agoten."
];

export const CarritoProvider = ({ children }) => {
  const { usuarioActual: user } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  const [showFirstItemToast, setShowFirstItemToast] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const getGuestId = () => {
    let guestId = sessionStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest-" + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const uid = user ? user.uid : getGuestId();
    const q = query(collection(db, "carrito"), where("userId", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      setCarrito(productos);
    });
    return () => unsubscribe();
  }, [user]);

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
  
          await deleteDoc(doc(db, "carrito", d.id));
        }
        sessionStorage.removeItem("guestId");
      };
  
      fusionarCarritos();
  }, [user]);
  
  const totalProductos = carrito.reduce((s, p) => s + (p.cantidad || 0), 0);
  
  const agregarProducto = async (producto) => {
    const isFirstProduct = totalProductos === 0;
    const id = producto.id || producto.productoId || producto.nombre;
    if (!id) return console.error("Producto sin ID");

    const uid = user ? user.uid : getGuestId();
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

    if (isFirstProduct) {
      setShowFirstItemToast(true);
      setTimeout(() => setShowFirstItemToast(false), 4000);
    }
  };

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

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (carrito.length > 0) {
        inactivityTimer = setTimeout(() => {
          const randomMsg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
          setReminderMessage(randomMsg);
          setShowReminder(true);
        }, 180000); // 3 minutos
      }
    };

    const handleActivity = () => {
      if (showReminder) return;
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);
    
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [carrito, showReminder]);

  const closeReminder = () => {
    setShowReminder(false);
  };

  const total = carrito.reduce(
    (s, p) => s + (p.precio || 0) * (p.cantidad || 1),
    0
  );
  
  const realizarPago = async ({ nombre, direccion, metodoPago, costoEnvio }) => {
    if (!user) {
        throw new Error("Debes iniciar sesión para realizar el pago");
      }
      if (carrito.length === 0) {
        throw new Error("Tu carrito está vacío");
      }
  
      setCargandoPago(true);
      setErrorPago(null);
  
      try {
        const totalFinal = total + costoEnvio;
  
        const pedidoRef = doc(collection(db, "pedidos"));
        await setDoc(pedidoRef, {
          id: pedidoRef.id,
          userId: user.uid,
          correoUsuario: user.correo,
          nombreCliente: nombre,
          direccionEnvio: direccion,
          metodoPago,
          items: carrito.map((item) => ({
            id: item.id,
            nombre: item.nombre || item.nombreProducto || "Producto sin nombre",
            precio: item.precio || 0,
            cantidad: item.cantidad || 1,
            imagen: item.imagen || null,
          })),
          delivery: costoEnvio,
          totalProductos,
          subtotal: total,
          totalFinal,
          fechaCreacion: serverTimestamp(),
          estado: "pendiente",
        });
  
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
        showFirstItemToast,
        showReminder,
        reminderMessage,
        closeReminder,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
