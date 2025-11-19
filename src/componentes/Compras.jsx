import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Compras({ isOpen, onClose, user }) {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!isOpen || !user) return;

    const q = query(
      collection(db, "pedidos"),           
      where("userId", "==", user.uid),     
      orderBy("fechaCreacion", "desc")     
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompras(lista);
        setCargando(false);
      },
      (error) => {
        console.error("Error obteniendo compras:", error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
      return date.toLocaleString(); 
    } catch {
      return "";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-2xl p-8 text-center border border-[#f5bfb2] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#7a1a0a] mb-4">
          Mis compras
        </h2>
        <p className="text-sm text-[#7a1a0a] mb-4">
          Aquí puedes ver tus pedidos realizados.
        </p>

        {cargando ? (
          <p className="text-[#7a1a0a] font-semibold">Cargando compras...</p>
        ) : compras.length === 0 ? (
          <p className="text-gray-600 mt-4">
            Aún no has realizado ninguna compra.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 text-left mt-2">
            {compras.map((compra) => (
              <div
                key={compra.id}
                className="bg-white border border-[#f5bfb2] rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[#7a1a0a] font-semibold">
                      Pedido #{(compra.id || "").slice(0, 6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatearFecha(compra.fechaCreacion)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Método de pago:{" "}
                      <span className="font-semibold text-[#d16170]">
                        {compra.metodoPago || "No especificado"}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Productos: {compra.items?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      Delivery: S/{Number(compra.delivery || 0).toFixed(2)}
                    </p>
                    <p className="text-[#d16170] font-bold text-lg">
                      Total: S/{Number(compra.totalFinal || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {compra.items && compra.items.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    {compra.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">{item.nombre}</p>
                          <p className="text-xs text-gray-500">
                            Cantidad: {item.cantidad}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Precio: S/{Number(item.precio || 0).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
