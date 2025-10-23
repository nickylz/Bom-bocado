import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { Postres } from "../assets/postres";
import Filtros from "../componentes/Filtros";

export default function Productos() {
  const { agregarProducto } = useCarrito();

  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    min: "",
    max: "",
  });

  const postresFiltrados = Postres.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase());
    const matchCategoria = filtro.categoria ? p.categoria === filtro.categoria : true;
    const matchMin = filtro.min ? p.precio >= parseFloat(filtro.min) : true;
    const matchMax = filtro.max ? p.precio <= parseFloat(filtro.max) : true;

    return matchNombre && matchCategoria && matchMin && matchMax;
  });

  const handleComprar = (producto) => agregarProducto(producto);

  return (
    <main className="bg-[#fff3f0] min-h-screen pb-20">
      {/* ===== ENCABEZADO ===== */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Haz tu pedido favorito</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            En{" "}
            <span className="font-semibold text-[#f5bfb2]">Bom Bocado</span>{" "}
            cada postre está hecho con dedicación, frescura y amor. BOM BOCADO convierte lo dulce en momentos inolvidables.
          </p>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 flex justify-center py-10">
          <img
            src="https://i.postimg.cc/WzQ2jJjC/lol.png"
            alt="Torta decorada"
            className="w-[45%] md:w-[53%] h-auto object-contain"
          />
        </div>
      </section>

      {/* ===== FILTROS ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2 text-center md:text-left">
          Explora Nuestros Postres
        </h2>
        <Filtros filtro={filtro} setFiltro={setFiltro} />

        {/* ===== PRODUCTOS ===== */}
        {postresFiltrados.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {postresFiltrados.map((p) => (
              <article
                key={p.id}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">{p.nombre}</h3>
                  <p className="text-[#d8718c] font-bold mt-2">S/{p.precio.toFixed(2)}</p>
                  <button
                    onClick={() => handleComprar(p)}
                    className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
                  >
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16 text-lg">
            No se encontraron postres con esos filtros 🍰
          </p>
        )}
      </div>
    </main>

  );
}
