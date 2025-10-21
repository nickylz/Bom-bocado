// src/componentes/CarritoFlotante.jsx
import { useCarrito } from "../context/CarritoContext";
import { useState } from "react";

export function CarritoFlotante() {
  const {
    carrito,
    vaciarCarrito,
    eliminarProducto,
    cambiarCantidad,
    total,
    mostrarCarrito,
    setMostrarCarrito,
  } = useCarrito();

  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarGracias, setMostrarGracias] = useState(false);

  const cerrarCarrito = () => setMostrarCarrito(false);

  const abrirPago = () => setMostrarPago(true);
  const cerrarPago = () => setMostrarPago(false);

  const finalizarCompra = (e) => {
    e.preventDefault();
    vaciarCarrito();
    setMostrarPago(false);
    setMostrarGracias(true);
    setTimeout(() => setMostrarGracias(false), 4000);
  };

  if (!mostrarCarrito) return null;

  return (
    <>
      {/* === PANEL DEL CARRITO === */}
      <div className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl border-l border-rose-200 z-50 p-4 flex flex-col animate-slide-left">
        <button
          className="text-2xl text-rose-500 self-end hover:text-rose-700"
          onClick={cerrarCarrito}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold text-rose-800 mb-4 text-center">
          Tu Carrito
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3">
          {carrito.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío</p>
          ) : (
            carrito.map((p) => (
              <div
                key={p.nombre}
                className="flex items-center justify-between border-b pb-2"
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 px-3">
                  <strong className="block text-gray-800">{p.nombre}</strong>
                  <span className="text-sm text-gray-600">
                    S/{p.precio.toFixed(2)} x {p.cantidad}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => cambiarCantidad(p.nombre, 1)}
                    className="px-2 bg-rose-200 hover:bg-rose-300 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => cambiarCantidad(p.nombre, -1)}
                    className="px-2 bg-rose-200 hover:bg-rose-300 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => eliminarProducto(p.nombre)}
                    className="text-sm text-rose-600 hover:text-rose-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-gray-800 mb-2">
              Total: S/{total.toFixed(2)}
            </p>
            <button
              onClick={abrirPago}
              className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition"
            >
              Pagar
            </button>
          </div>
        )}
      </div>

      {/* === MODAL DE PAGO === */}
      {mostrarPago && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h2 className="text-2xl font-bold text-rose-700 mb-4">
              Finaliza tu compra
            </h2>
            <form onSubmit={finalizarCompra} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                required
                className="border rounded w-full p-2"
              />
              <input
                type="text"
                placeholder="Dirección de envío"
                required
                className="border rounded w-full p-2"
              />
              <select required className="border rounded w-full p-2">
                <option value="">Método de pago</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
                <option value="contraentrega">Contra entrega</option>
              </select>

              <p className="text-gray-700">
                <strong>Subtotal:</strong> S/{total.toFixed(2)}
              </p>
              <p className="text-gray-700">
                <strong>Envío:</strong> S/5.00
              </p>
              <p className="text-gray-800 font-semibold">
                Total final: S/{(total + 5).toFixed(2)}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700"
                >
                  Finalizar compra
                </button>
                <button
                  type="button"
                  onClick={cerrarPago}
                  className="flex-1 border border-rose-500 text-rose-700 rounded-lg hover:bg-rose-100"
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
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl text-rose-700 font-bold mb-3">
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
              className="rounded-xl mx-auto w-48"
            />
          </div>
        </div>
      )}
    </>
  );
}
