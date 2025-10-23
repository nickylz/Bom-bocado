import { useCarrito } from "../context/CarritoContext";
import { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

export function CarritoFlotante() {
  const {
    carrito,
    vaciarCarrito,
    eliminarProducto,
    cambiarCantidad,
    total,
    mostrarCarrito,
    setMostrarCarrito,
    totalProductos,
  } = useCarrito();

  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarGracias, setMostrarGracias] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // 🔁 Actualiza el usuario actual en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("usuarioActual");
      setUsuarioActual(saved ? JSON.parse(saved) : null);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cerrarCarrito = () => setMostrarCarrito(false);

  const abrirPago = () => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para continuar con la compra 🧁");
      return;
    }
    setMostrarPago(true);
  };

  const cerrarPago = () => setMostrarPago(false);

  const finalizarCompra = (e) => {
    e.preventDefault();
    vaciarCarrito();
    setMostrarPago(false);
    setMostrarGracias(true);
    setTimeout(() => setMostrarGracias(false), 4000);
  };

  return (
    <>
      {/* === BOTÓN FLOTANTE === */}
      <button
        onClick={() => setMostrarCarrito(!mostrarCarrito)}
        className="fixed bottom-6 right-6 bg-[#d16170] hover:bg-[#b84c68] text-white p-4 rounded-full shadow-xl transition-all duration-300 z-50"
      >
        <ShoppingCart size={26} />
        {totalProductos > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#fff3f0] text-[#9c2007] text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center border border-[#d8718c]">
            {totalProductos}
          </span>
        )}
      </button>

      {/* === PANEL DEL CARRITO === */}
      {mostrarCarrito && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={cerrarCarrito}
          ></div>

          {/* Panel flotante animado */}
          <div
            className="fixed bottom-20 right-6 bg-[#fff3f0] w-80 rounded-2xl shadow-2xl p-6 border border-[#f5bfb2] z-50 animate-slide-left"
          >
            <button
              className="text-3xl text-[#d8718c] hover:text-[#b84c68] transition absolute top-2 right-4"
              onClick={cerrarCarrito}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-[#9c2007] mb-5 text-center">
              Tu carrito
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-60">
              {carrito.length === 0 ? (
                <p className="text-center text-[#9c2007]/70 italic">
                  Tu carrito está vacío 
                </p>
              ) : (
                carrito.map((p) => (
                  <div
                    key={p.nombre}
                    className="flex items-center justify-between bg-white/70 border border-[#f5bfb2] rounded-2xl p-3 shadow-sm"
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-16 h-16 object-cover rounded-xl border border-[#f5bfb2]"
                    />
                    <div className="flex-1 px-3">
                      <strong className="block text-[#7a1a0a]">
                        {p.nombre}
                      </strong>
                      <span className="text-sm text-gray-600">
                        S/{p.precio.toFixed(2)} x {p.cantidad}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => cambiarCantidad(p.nombre, 1)}
                        className="px-2 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-lg transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => cambiarCantidad(p.nombre, -1)}
                        className="px-2 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-lg transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.nombre)}
                        className="p-1.5 rounded-lg hover:bg-[#fff3f0] transition text-[#d16170]"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className="mt-5">
                <p className="font-semibold text-[#7a1a0a] mb-2 text-center">
                  Total: S/{total.toFixed(2)}
                </p>
                <button
                  onClick={abrirPago}
                  className="w-full bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
                >
                  Ir a pagar
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* === MODAL DE PAGO === */}
      {mostrarPago && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && cerrarPago()}
        >
          <div className="bg-[#fff3f0] rounded-3xl p-8 w-[90%] max-w-md shadow-2xl border border-[#f5bfb2]">
            <h2 className="text-2xl font-bold text-[#9c2007] mb-4 text-center">
              Finaliza tu compra
            </h2>
            <form onSubmit={finalizarCompra} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                required
                className="border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c]"
              />
              <input
                type="text"
                placeholder="Dirección de envío"
                required
                className="border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c]"
              />
              <select
                required
                className="border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c]"
              >
                <option value="">Método de pago</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
                <option value="contraentrega">Contra entrega</option>
              </select>

              <div className="text-[#7a1a0a] text-sm space-y-1">
                <p>
                  <strong>Subtotal:</strong> S/{total.toFixed(2)}
                </p>
                <p>
                  <strong>Envío:</strong> S/5.00
                </p>
                <p className="font-semibold text-[#9c2007]">
                  Total final: S/{(total + 5).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
                >
                  Finalizar compra
                </button>
                <button
                  type="button"
                  onClick={cerrarPago}
                  className="flex-1 border border-[#d8718c] text-[#d8718c] rounded-xl hover:bg-[#f5bfb2]/50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL DE GRACIAS === */}
      {mostrarGracias && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-[#fff3f0] p-6 rounded-3xl shadow-xl text-center border border-[#f5bfb2]">
            <h2 className="text-2xl text-[#9c2007] font-bold mb-3">
              ¡Gracias por tu compra!
            </h2>
            <img
              src={`https://i.postimg.cc/${[
                "SsLjzJ0b/1.png",
                "50zK5WpV/2.png",
                "nrtR0Sw-Q/3.png",
                "R0HLyQt1/4.png",
                "Jz9bNDFs/5.png",
              ][Math.floor(Math.random() * 5)]}`}
              alt="Gracias"
              className="rounded-2xl mx-auto w-48"
            />
          </div>
        </div>
      )}
    </>
  );
}
