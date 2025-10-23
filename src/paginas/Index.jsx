// Index.jsx

import React from "react";
import { Link } from "react-router-dom";
import Testimonials from "../componentes/Testimonials"; // <-- 1. IMPORTAMOS EL NUEVO COMPONENTE
import incono from "../componentes/Bom.png"
export default function Inicio() {
  return (
    <>
      <main className="bg-[#fff3f0] py-0 px-0 pb-20 space-y-16">
        {/* ===== SECCIÓN PRINCIPAL ===== */}
        <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
          {/* TEXTO */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Postres únicos</h1>
            <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
              En{" "}
              <span className="font-semibold text-[#f5bfb2]">Bom Bocado</span>{" "}
              creamos repostería fina con amor, ingredientes seleccionados y
              detalles únicos. Perfectos para regalar o disfrutar en familia.
            </p>
            <Link
              to="/contacto"
              className="inline-block px-8 py-3 bg-[#fff3f0] text-[#9c2007] font-semibold rounded-xl hover:bg-[#f5bfb2] transition"
            >
              Hacer pedido
            </Link>
          </div>

          {/* IMAGEN */}
          <div className="w-full md:w-1/2 flex justify-center py-10">
            <img
              src= {incono}
              alt="Torta decorada"
              className="w-[45%] md:w-[53%] h-auto object-contain"
            />
          </div>
        </section>

        {/* ===== COLECCIONES DESTACADAS ===== */}
        <section className="text-center px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-14">
            ¡Lo más Vendido!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ITEM 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out">
              <img
                src="https://i.pinimg.com/1200x/a5/75/8c/a5758c95cfd57b1c1d1292f0a0be02ec.jpg"
                alt="Macaloves - Macarons de Amor"
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-[#7a1a0a] mb-2">
                  Macaloves – Macarons de Amor
                </h3>
                <Link
                  to="/novedades"
                  className="text-[#d8718c] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out">
              <img
                src="https://i.pinimg.com/736x/d1/8f/da/d18fdaa9cd95c431e6fb77c53cda987d.jpg"
                alt="Strawberry Cloud Croissant"
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-[#7a1a0a] mb-2">
                  Strawberry Cloud Croissant
                </h3>
                <Link
                  to="/novedades"
                  className="text-[#d8718c] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out">
              <img
                src="https://i.pinimg.com/1200x/02/a1/00/02a10030eaed821b1525560b18e4b7b8.jpg"
                alt="Heartful Bites - Galletas de Amor"
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-[#7a1a0a] mb-2">
                  Heartful Bites – Galletas de Amor
                </h3>
                <Link
                  to="/novedades"
                  className="text-[#d8718c] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out">
              <img
                src="https://i.pinimg.com/736x/e0/99/63/e099634012685ea760aa16416f208467.jpg"
                alt="Cherry Kiss Pie"
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-[#7a1a0a] mb-2">
                  Cherry Kiss Pie
                </h3>
                <Link
                  to="/novedades"
                  className="text-[#d8718c] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECCIÓN DE COMENTARIOS ===== */}
        <Testimonials /> 
        {/* <-- 2. AÑADIMOS EL COMPONENTE AQUÍ */}

      </main>
    </>
  );
}