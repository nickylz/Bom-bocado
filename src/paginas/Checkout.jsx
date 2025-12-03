import { useCarrito } from "../context/CarritoContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import qrYape from "../componentes/img/qr-bom-bocado.png";

const COSTO_ENVIO_FIJO = 10.00;

export default function Checkout() {
  const {
    carrito,
    total,
    realizarPago,
    cargandoPago,
    errorPago: errorDePago,
    cambiarCantidad,
    eliminarProducto,
  } = useCarrito();
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  // Estado para abrir/cerrar el modal de Yape
  const [mostrarModalYape, setMostrarModalYape] = useState(false);

  // Estado para la imagen del comprobante
  const [comprobante, setComprobante] = useState(null);


  // ULTIMATE FIX v3: Estado local para bloquear la redirección durante el proceso de pago.
  const [intentoDePago, setIntentoDePago] = useState(false);

  useEffect(() => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para continuar.");
      navigate("/productos");
      return;
    }

    // Si el carrito está vacío y NUNCA se ha intentado pagar, redirigir.
    // Esto previene la redirección si el carrito se vacía como resultado de un pago exitoso.
    if (carrito.length === 0 && !intentoDePago) {
      console.warn("El carrito está vacío, redirigiendo...");
      navigate("/productos");
      return;
    }

    if (usuarioActual) {
      setNombre(usuarioActual.displayName || "");
    }
  }, [usuarioActual, carrito, navigate, intentoDePago]);

  const finalizarCompra = async (e) => {
    e.preventDefault();
    if (!direccion.trim()) {
      alert("Por favor, ingresa tu dirección de entrega.");
      return;
    }

    // Levantar la bandera local INMEDIATAMENTE para prevenir la carrera.
    setIntentoDePago(true);

    try {
      const idPedido = await realizarPago({
        nombre,
        direccion,
        metodoPago,
        comprobante,
        costoEnvio: COSTO_ENVIO_FIJO,
      });
      // La navegación a la página de gracias ahora es la única que puede ocurrir.
      navigate(`/gracias?pedido=${idPedido}`);
    } catch (err) {
      console.error("Fallo al finalizar la compra:", err);
      alert(`¡Uy! Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo o contacta a soporte si el problema persiste. (Error: ${err.message})`);
      // Si el pago falla, bajamos la bandera para permitir un nuevo intento.
      setIntentoDePago(false);
    }
  };

  const totalFinal = total + COSTO_ENVIO_FIJO;

  // No renderizar el formulario si ya se completó la compra, 
  // esto previene interacciones mientras se redirige.
  if (intentoDePago && cargandoPago) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#fff3f0]">
        <h1 className="text-2xl text-[#9c2007]">Finalizando tu compra...</h1>
        <p className="text-gray-600 mb-4">Espera un momento, estamos registrando tu pedido.</p>
      </div>
    )
  }

  const pagarDesdeModal = () => {
    if (!comprobante) {
      alert("Por favor, sube un comprobante antes de continuar.");
      return;
    }
    
    setMostrarModalYape(false);
    document.getElementById("formCheckout").requestSubmit();
  };

  return (
    <div className="bg-[#fff3f0] min-h-screen py-8 sm:py-12">

      {/* MODAL DE YAPE */}
      {mostrarModalYape && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 relative border border-[#f5bfb2]">

            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarModalYape(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center text-[#9c2007] mb-3">
              Paga con Yape
            </h2>

            {/* QR */}
            <img
              src={qrYape}
              alt="QR Yape"
              className="w-56 mx-auto rounded-lg shadow-md border-2 border-[#f5bfb2]"
            />

            <p className="text-center text-[#7a1a0a] mt-3 font-semibold">
              Monto: S/{totalFinal.toFixed(2)}
            </p>

            <p className="text-center text-sm text-gray-600">
              Número Yape: <span className="font-bold">987 654 321</span>
            </p>

            {/* Subir comprobante */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#8f2133] mb-1">
                Subir comprobante
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setComprobante(e.target.files[0])}
                className="w-full border border-[#f5bfb2] rounded-xl p-2 bg-white"
              />
            </div>

            <button
              onClick={pagarDesdeModal}
              className="mt-4 w-full bg-[#d16170] text-white py-3 rounded-xl font-bold hover:bg-[#b84c68] transition"
            >
              Ya pagué
            </button>

          </div>
        </div>
      )}
      {/* fin */}

      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/productos")}
          className="flex items-center gap-2 text-[#9c2007] font-semibold mb-6 hover:text-[#d16170]"
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna de Formulario */}
          <div className="bg-white/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-[#f5bfb2]">
            <h1 className="text-3xl font-bold text-[#9c2007] mb-6">
              Completa tu pedido
            </h1>
            <form id="formCheckout" onSubmit={finalizarCompra} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-[#8f2133]">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#8f2133]">Dirección de Entrega</label>
                <textarea
                  placeholder="Ej: Av. Siempre Viva 123, Sprinfield"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  rows={3}
                  className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none resize-y"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#8f2133]">Método de Pago</label>
                <select
                  required
                  value={metodoPago}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMetodoPago(val);

                  }}

                  className="mt-1 border border-[#f5bfb2] bg-white rounded-xl w-full p-3 focus:ring-2 focus:ring-[#d8718c] outline-none cursor-pointer"
                >
                  <option value="">Selecciona un método</option>
                  <option value="tarjeta">Tarjeta (Próximamente)</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="contraentrega">Pago Contra Entrega</option>
                </select>
              </div>

              {errorDePago && <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-lg">{errorDePago}</p>}

              <button
                type="button"
                disabled={cargandoPago || intentoDePago}
                onClick={() => {
                  if (metodoPago === "yape") {
                    // Abrir modal y NO pagar aún
                    setMostrarModalYape(true);
                  } else {
                    // Pagar normal si no es Yape
                    document.getElementById("formCheckout").requestSubmit();
                  }
                }}
                className="w-full bg-[#d16170] text-white py-4 rounded-xl hover:bg-[#b84c68] transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargandoPago ? "Procesando..." : `Pagar S/${totalFinal.toFixed(2)}`}
              </button>

            </form>
          </div>

          {/* Columna de Resumen */}
          <div className="bg-white/80 p-6 sm:p-8 rounded-2xl shadow-lg border border-[#f5bfb2]">
            <h2 className="text-2xl font-bold text-[#9c2007] mb-6">Resumen de tu compra</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {carrito.map(p => (
                <div key={p.id} className="flex items-center gap-4">
                  <img src={p.imagen} alt={p.nombre} className="w-20 h-20 object-cover rounded-lg border-2 border-[#f5bfb2]" />
                  <div className="flex-1">
                    <p className="font-bold text-[#7a1a0a]">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => cambiarCantidad(p.id, -1)} className="px-2 py-0.5 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-md transition text-lg">-</button>
                      <span className="font-semibold w-5 text-center">{p.cantidad}</span>
                      <button onClick={() => cambiarCantidad(p.id, 1)} className="px-2 py-0.5 bg-[#f5bfb2] hover:bg-[#d8718c]/50 rounded-md transition text-lg">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch">
                    <p className="font-semibold text-gray-800">S/{(p.precio * p.cantidad).toFixed(2)}</p>
                    <button onClick={() => eliminarProducto(p.id)} className="p-1.5 rounded-lg hover:bg-red-100 transition text-[#d16170]" title="Eliminar producto">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t-2 border-dashed border-[#f5bfb2] pt-6 space-y-3 text-lg">
              <div className="flex justify-between">
                <p className="text-[#7a1a0a]">Subtotal:</p>
                <p className="font-semibold text-[#7a1a0a]">S/{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#7a1a0a]">Envío:</p>
                <p className="font-semibold text-[#7a1a0a]">S/{COSTO_ENVIO_FIJO.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-xl">
                <p className="font-bold text-[#9c2007]">Total:</p>
                <p className="font-bold text-[#9c2007]">S/{totalFinal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
