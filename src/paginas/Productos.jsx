import React, { useState } from "react";
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

  // === FILTRAR POSTRES ===
  const postresFiltrados = Postres.filter((p) => {
    const matchNombre = p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase());
    const matchCategoria = filtro.categoria ? p.categoria === filtro.categoria : true;
    const matchMin = filtro.min ? p.precio >= parseFloat(filtro.min) : true;
    const matchMax = filtro.max ? p.precio <= parseFloat(filtro.max) : true;

    return matchNombre && matchCategoria && matchMin && matchMax;
  });

  const handleComprar = (producto) => agregarProducto(producto);

  return (
    <section className="bg-[#fff3f0] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#9c2007] mb-4">
              Haz tu pedido favorito 
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              Cada postre está hecho con dedicación, frescura y amor.{" "}
              <span className="font-semibold text-[#d8718c]">BOM BOCADO</span> convierte lo dulce en momentos inolvidables.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://i.postimg.cc/WzQ2jJjC/lol.png"
              alt="Torta decorada"
              className="rounded-3xl shadow-lg border border-[#f5bfb2]"
            />
          </div>
        </div>

        {/* Filtros */}
        <Filtros filtro={filtro} setFiltro={setFiltro} />

        {/* Productos */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-2">
            Nuestros Postres
          </h2>

          {postresFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                    <h3 className="text-lg font-semibold text-[#9c2007]">
                      {p.nombre}
                    </h3>
                    <p className="text-[#d8718c] font-bold mt-2">
                      S/{p.precio.toFixed(2)}
                    </p>
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
            <p className="col-span-full text-center text-gray-500 mt-10">
              No se encontraron postres con esos filtros.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
