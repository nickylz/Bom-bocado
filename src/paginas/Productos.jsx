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
    <>
      {/* Encabezado */}
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
              Cada postre es una combinación de sabor, ternura y frescura.{" "}
              <span className="font-semibold text-rose-700">BOM BOCADO</span> convierte lo dulce en una experiencia única.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <Filtros filtro={filtro} setFiltro={setFiltro} />

      {/* Productos */}
      <section className="py-10 mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {postresFiltrados.length > 0 ? (
          postresFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-rose-800">{p.nombre}</h3>
                <p className="text-gray-600">S/{p.precio.toFixed(2)}</p>
                <button
                  onClick={() => handleComprar(p)}
                  className="mt-3 bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No se encontraron postres con esos filtros 
          </p>
        )}
      </section>
    </>
  );
}