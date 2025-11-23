import React from 'react';

export default function ComprasList({ compras, cargando }) {

  // ==========================
  //   FORMATEAR FECHA
  // ==========================
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
    <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">Mis compras</h2>
      <p className="text-sm text-[#7a1a0a] mb-4">
        Aquí puedes ver tus pedidos realizados.
      </p>

      {cargando ? (
        <p className="text-[#7a1a0a] font-semibold">Cargando compras...</p>
      ) : compras.length === 0 ? (
        <p className="text-gray-600 mt-2">Aún no has realizado ninguna compra.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-3 text-left mt-2 pr-1">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="bg-[#fff7f6] border border-[#f5bfb2] rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                {/* IZQUIERDA */}
                <div>
                  <p className="text-[#7a1a0a] font-semibold">
                    Pedido #{compra.id.slice(0, 6)}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatearFecha(compra.fechaCreacion)}
                  </p>

                  {/* ESTADO DEL PEDIDO */}
                  <p className="text-xs mt-1">
                    Estado:{" "}
                    <span className="font-semibold text-[#d16170]">
                      {compra.estado || "pendiente"}
                    </span>
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Método de pago:{" "}
                    <span className="font-semibold text-[#d16170]">
                      {compra.metodoPago || "No especificado"}
                    </span>
                  </p>
                </div>

                {/* DERECHA */}
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

              {/* LISTADO DE PRODUCTOS */}
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
  );
}