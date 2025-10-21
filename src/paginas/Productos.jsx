import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { Postres } from "../assets/postres";


export default function Productos() {
  const { agregarProducto } = useCarrito();

  const handleComprar = (producto) => {
    agregarProducto(producto);
  };

  return (
    <>
      {/* === SECCIÓN PRINCIPAL === */}
      <section className="bg-gradient-to-b from-rose-50 to-pink-100 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6">
          <div className="w-full md:w-1/2">
            <img
              src="https://i.postimg.cc/WzQ2jJjC/lol.png"
              alt="Torta decorada"
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-rose-800 mb-4">
              Haz tu pedido favorito
            </h1>
            <p className="text-gray-700 leading-relaxed text-lg">
              Cada postre es una combinación de sabor, ternura y frescura.
              Hechos con pasión para disfrutar en familia o regalar con cariño.
              <span className="font-semibold text-rose-700"> BOM BOCADO </span>
              convierte lo dulce en una experiencia única.
            </p>
          </div>
        </div>
      </section>

      {/* === PRODUCTOS === */}
      <section className="py-10 max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {Postres.map((p) => (
          <div
            key={p.nombre}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={p.imagen}
              alt={p.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-rose-800">{p.nombre}</h3>
              <p className="text-gray-600">S/{p.precio}</p>
              <button
                onClick={() => handleComprar(p)}
                className="mt-3 bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* === FOOTER === */}
      <footer className="bg-rose-100 mt-16 py-6 border-t border-rose-200">
        <div className="text-center text-gray-700 space-y-2">
          <p className="font-medium text-rose-800">
            © 2025 BOM BOCADO - Repostería Fina. Todos los derechos reservados.
          </p>
          <p className="text-sm">
            Síguenos en{" "}
            <a href="#" className="text-rose-600 hover:underline">
              Instagram
            </a>{" "}
            |{" "}
            <a href="#" className="text-rose-600 hover:underline">
              Facebook
            </a>{" "}
            |{" "}
            <a href="#" className="text-rose-600 hover:underline">
              TikTok
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
