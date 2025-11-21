import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function ComprasList({ user }) {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "pedidos"),
      where("userId", "==", user.uid),
      orderBy("fechaCreacion", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setCompras(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    });

    return () => unsub();
  }, [user]);

  const formatearFecha = (f) => {
    try {
      return f?.toDate().toLocaleString() || "";
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">Mis compras</h2>

      {cargando ? (
        <p>Cargando compras...</p>
      ) : compras.length === 0 ? (
        <p>No tienes compras aún.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-3 mt-2 pr-1">
          {compras.map((c) => (
            <div key={c.id} className="bg-[#fff7f6] border border-[#f5bfb2] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[#7a1a0a] font-semibold">Pedido #{c.id.slice(0, 6)}</p>
                  <p className="text-xs text-gray-500">{formatearFecha(c.fechaCreacion)}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Productos: {c.items?.length || 0}</p>
                  <p className="text-[#d16170] font-bold text-lg">
                    Total: S/{Number(c.totalFinal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
