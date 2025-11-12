import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useCarrito } from "../context/CarritoContext";

export default function Novedades() {
  const { agregarProducto } = useCarrito();

  const [productosTemporada, setProductosTemporada] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "productos"), where("categoria", "==", "Temporada"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductosTemporada(lista);
    });
    return () => unsubscribe();
  }, []);

  const lomasvendido = [
    {
      nombre: "Tarta Mix",
      descripcion: "Refrescante y cremosa",
      precio: 40.00,
      categoria: "Tartas",
      imagen:
        "https://i.pinimg.com/736x/4c/07/44/4c07447203a816cbb5a470fbe7d14ee9.jpg",
    },
    {    
      nombre: "Tiramisú Clásico",
      descripcion: "Con café y mascarpone",
      precio: 28.00,
      categoria: "Postres fríos",
      imagen:
        "https://www.tasteofhome.com/wp-content/uploads/2024/11/EXPS_TOHD24_25469_EricKleinberg_6.jpg",
    },
    {
      nombre: "Fresas Glaseadas",
      descripcion: "Suaves y crocantes",
      precio: 12.00,
      categoria: "Galletas",
      imagen:
        "https://i.pinimg.com/1200x/3d/1e/ca/3d1eca4db29ad0f033fbb03c2165132e.jpg",
    },
    {
      nombre: "Bombones de Frambuesa",
      descripcion: "Rellenos con centro frutal",
      precio: 18.00,
      categoria: "Bombones",
      imagen:
        "https://i.pinimg.com/736x/83/27/51/832751dc0d1881d6467a3ec67e9501c8.jpg",
    },
    {
      nombre: "Mousse de Fresa",
      descripcion: "Ligero y tropical",
      precio: 22.00,
      categoria: "Postres fríos",
      imagen:
        "https://images.getrecipekit.com/20220607111638-mousse-de-fresa.jpg?aspect_ratio=4:3&quality=90&",
    },
  ];

  const productosNuevos = [
    {
      nombre: "Besitos de Coco",
      descripcion: "Suaves, doradas y con un toque tropical",
      precio: 28,
      imagen:
        "https://i.pinimg.com/736x/be/07/61/be076160d1f41af3bfcd47f41caa6efb.jpg",
    },
    {
      nombre: "Dulce Tentación de Cacao",
      descripcion: "Crujientes con trocitos de chocolate",
      precio: 32,
      imagen:
        "https://i.pinimg.com/736x/b5/02/ca/b502ca43e9eca3dcb5bf1cfc7914f13b.jpg",
    },
    {
      nombre: "Estrellitas de Vainilla",
      descripcion: "Decoradas con glasé rosa pastel",
      precio: 36,
      imagen:
        "https://i.pinimg.com/736x/1c/58/4f/1c584f91ef88fb4425aa3d355827534c.jpg",
    },
  ];

  const renderProductos = (productos) =>
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
          <button
            onClick={() => agregarProducto(item)}
            className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
          >
            Comprar
          </button>
        </div>
      </article>
    ));

  const renderCarrusel = (productos) => (
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
              <button
                onClick={() => agregarProducto(item)}
                className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
              >
                Comprar
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-20 h-full bg-linear-to-r from-[#fff3f0] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-linear-to-l from-[#fff3f0] to-transparent z-10"></div>
    </div>
  );

  return (
    <section className="bg-[#fff3f0] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-[#9c2007] mb-12">
          Novedades
        </h1>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Productos Nuevos
          </h2>
          {productosNuevos.length > 4 ? (
            renderCarrusel(productosNuevos)
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderProductos(productosNuevos)}
            </div>
          )}
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Productos de Temporada
          </h2>
          {productosTemporada.length > 4 ? (
            renderCarrusel(productosTemporada)
          ) : productosTemporada.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderProductos(productosTemporada)}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No hay productos de temporada por ahora 🌸
            </p>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Los favoritos de la casa ♡
          </h2>
          {lomasvendido.length > 4 ? (
            renderCarrusel(lomasvendido)
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderProductos(lomasvendido)}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
