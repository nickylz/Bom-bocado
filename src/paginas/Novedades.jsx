import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useCarrito } from "../context/CarritoContext";
import incono from "../componentes/img/Bom.png";

export default function Novedades() {
  const { agregarProducto } = useCarrito();

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "productos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  const productosTemporada = productos.filter(p => p.categoria === "Temporada");
  const favoritos = productos.filter(p => p.favorito);
  const productosNuevos = productos.filter(p => p.nuevo);

  const renderProductos = (productos, mostrarBoton = true) =>
    productos.map((item, index) => (
      <article
        key={index}
        className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden shrink-0 w-72"
      >
        <img src={item.imagen} alt={item.nombre} className="w-full h-60 object-cover" />
        <div className="p-5 text-center">
          <h3 className="text-lg font-semibold text-[#9c2007]">{item.nombre}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.descripcion}</p>
          <p className="text-[#d8718c] font-bold mt-2">
            S/{item.precio?.toFixed(2)}
          </p>

          {mostrarBoton && (
            <button
              onClick={() => agregarProducto(item)}
              className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
            >
              Comprar
            </button>
          )}
        </div>
      </article>
    ));

  const renderCarrusel = (productos, mostrarBoton = true) => (
    <div className="overflow-hidden relative">
      <div
        className="flex animate-scroll gap-6"
        style={{
          animation: "scroll 20s linear infinite",
        }}
      >
        {productos.concat(productos).map((item, index) => (
          <article
            key={index}
            className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden shrink-0 w-72"
          >
            <img src={item.imagen} alt={item.nombre} className="w-full h-60 object-cover" />
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-[#9c2007]">{item.nombre}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.descripcion}</p>
              <p className="text-[#d8718c] font-bold mt-2">
                S/{item.precio?.toFixed(2)}
              </p>

              {mostrarBoton && (
                <button
                  onClick={() => agregarProducto(item)}
                  className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
                >
                  Comprar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-20 h-full bg-linear-to-r from-[#fff3f0] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-linear-to-l from-[#fff3f0] to-transparent z-10"></div>
    </div>
  );

  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Novedades</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            Descubre las novedades más dulces y frescas de{" "}
            <span className="font-semibold text-[#f5bfb2]">Bom Bocado</span>.
            Cada creación es una experiencia deliciosa hecha con{" "}
            <span className="font-semibold text-[#f5bfb2]">amor </span>
            y{" "}
            <span className="font-semibold text-[#f5bfb2]"> dedicación</span>.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center py-10">
          <img
            src={incono}
            alt="Torta decorada"
            className="w-[45%] md:w-[53%] h-auto object-contain"
          />
        </div>
      </section>

      <section className="bg-[#fff3f0] min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
              Productos de Temporada
            </h2>
            {productosTemporada.length > 4 ? (
              renderCarrusel(productosTemporada, true)
            ) : productosTemporada.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderProductos(productosTemporada, true)}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No hay productos de temporada por ahora
              </p>
            )}
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
              Los favoritos de la casa ♡
            </h2>
            {favoritos.length > 4 ? (
              renderCarrusel(favoritos, true)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {renderProductos(favoritos, true)}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
              Proximamente
            </h2>
            {productosNuevos.length > 4 ? (
              renderCarrusel(productosNuevos, false)
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderProductos(productosNuevos, false)}
              </div>
            )}
          </section>

        </div>


        <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
      `}</style>
      </section>
    </div>
  );
}
