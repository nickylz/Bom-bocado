import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/authContext';

export default function ComprasList() {
  const { usuarioActual } = useAuth();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioActual) {
      setCargando(false);
      return;
    }

    setCargando(true);
    const q = query(collection(db, 'pedidos'), where("userId", "==", usuarioActual.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      setCompras(pedidos.sort((a, b) => b.fechaCreacion - a.fechaCreacion));
      setCargando(false);
    }, (error) => {
      console.error("Error al cargar las compras: ", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [usuarioActual]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return date.toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' });
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, 'pedidos', pedidoId));
        // The onSnapshot listener will automatically update the UI
      } catch (error) {
        console.error("Error al cancelar el pedido:", error);
        alert("Hubo un error al cancelar el pedido.");
      }
    }
  };

  const puedeCancelar = (estado) => {
    return estado === 'pendiente';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-4">
        Mis Compras
      </h2>

      {cargando ? (
        <p className="text-center text-gray-500">Cargando tus compras...</p>
      ) : compras.length === 0 ? (
        <div className="text-center py-10">
            <p className="text-gray-600">Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white border border-[#f5bfb2] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg text-[#7a1a0a]">
                    Pedido #{compra.id.substring(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatearFecha(compra.fechaCreacion)}
                  </p>
                  <div className="text-sm space-y-1">
                      <p><strong>Estado:</strong> <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${compra.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{compra.estado}</span></p>
                      <p><strong>Método de pago:</strong> {compra.metodoPago}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-[#d16170]">Total: S/{Number(compra.totalFinal || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Delivery: S/{Number(compra.delivery || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#f5bfb2]">
                <h4 className="font-semibold text-[#7a1a0a] mb-2">Productos:</h4>
                <ul className="space-y-2 text-sm">
                    {compra.items?.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span>{item.nombre} (x{item.cantidad})</span>
                            <span>S/{(item.precio * item.cantidad).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
              </div>

              {puedeCancelar(compra.estado) && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleCancelarPedido(compra.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Cancelar Pedido
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
