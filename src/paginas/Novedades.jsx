import React from "react";

export default function Novedades() {
  return (
    <section className="bg-[#fff3f0] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-[#9c2007] mb-12">
          Novedades
        </h1>

        {/* ======= SECCIÓN: PRODUCTOS NUEVOS ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Productos Nuevos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Producto nuevo 1 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/3f/6d/a0/3f6da06c7f4d3c91c9f3b0462c5861ee.jpg"
                alt="Cheesecake de Arándanos"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Cheesecake de Arándanos
                </h3>
                <p className="text-gray-600 text-sm mt-1">Cremoso y fresco</p>
                <p className="text-[#d8718c] font-bold mt-2">S/48.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>

            {/* Producto nuevo 2 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/9a/07/03/9a0703aa2f7d8c7b03a4e236d0f9c879.jpg"
                alt="Mini Tartas de Frutas"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Mini Tartas de Frutas
                </h3>
                <p className="text-gray-600 text-sm mt-1">Coloridas y naturales</p>
                <p className="text-[#d8718c] font-bold mt-2">S/40.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>

            {/* Producto nuevo 3 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/2e/58/10/2e5810ac24cc0db3c4ed6e53e9f2e4b7.jpg"
                alt="Cupcakes de Vainilla Rosa"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Cupcakes de Vainilla Rosa
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Delicados y decorados a mano
                </p>
                <p className="text-[#d8718c] font-bold mt-2">S/35.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* ======= SECCIÓN: PASTELES ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Pasteles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "https://i.pinimg.com/736x/2d/5b/47/2d5b47e3ce22fc5ee3a40e8f70f30b4c.jpg",
                name: "Charlotte de Fresas",
                desc: "Suave y frutal",
                price: "S/55.00",
              },
              {
                img: "https://i.pinimg.com/736x/07/2a/44/072a44e67a1fae45c9c4c75bba129b76.jpg",
                name: "Clásico Fresas & Crema",
                desc: "Dulce y esponjoso",
                price: "S/65.00",
              },
              {
                img: "https://i.pinimg.com/736x/4b/d5/20/4bd5202b7c3a60e77a847af8b731f4db.jpg",
                name: "Red Velvet con Fresas",
                desc: "Suave y elegante",
                price: "S/70.00",
              },
            ].map((item, index) => (
              <article
                key={index}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  <p className="text-[#d8718c] font-bold mt-2">{item.price}</p>
                  <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ======= SECCIÓN: GALLETAS ======= */}
        <section>
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Galletas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "https://i.pinimg.com/736x/5a/fc/62/5afc6252e32c60b52b7bb3daeb7da0da.jpg",
                name: "Galletas de Mantequilla",
                desc: "Crocantes y suaves a la vez",
                price: "S/25.00",
              },
              {
                img: "https://i.pinimg.com/736x/da/7a/22/da7a22b8db08d5470ff99f50cb41c55e.jpg",
                name: "Galletas con Chispas",
                desc: "Rellenas de amor",
                price: "S/30.00",
              },
              {
                img: "https://i.pinimg.com/736x/3e/77/7c/3e777c6bb32b5b1f495ae7d75a437f2c.jpg",
                name: "Galletas Decoradas",
                desc: "Hechas a mano con diseño especial",
                price: "S/35.00",
              },
            ].map((item, index) => (
              <article
                key={index}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  <p className="text-[#d8718c] font-bold mt-2">{item.price}</p>
                  <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
