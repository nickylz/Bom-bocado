import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../componentes/NavBar";

export default function Inicio() {
  return (
    <>
 

      <main className="space-y-12">
        {/* Sección principal */}
        <section className="ola bg-white rounded-xl shadow-md p-6 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="imagen flex-1">
            <img
              src="https://i.postimg.cc/WzQ2jJjC/lol.png"
              alt="Torta decorada"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="textito flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7a1a0a]">
              Postres únicos
            </h1>
            <p className="text-gray-700 text-lg">
              En BOM BOCADO creamos repostería fina con amor, ingredientes
              seleccionados y detalles únicos. Perfectos para regalar o
              disfrutar en familia.
            </p>
            <Link
              to="/contacto"
              className="inline-block px-6 py-3 bg-[#7a1a0a] text-white font-semibold rounded-lg shadow hover:bg-[#9c2007] transition"
            >
              Hacer pedido
            </Link>
          </div>
        </section>

        {/* Colecciones destacadas */}
        <section className="colecciones">
          <h2
            className="colecciones-titulo text-2xl md:text-3xl font-bold mb-6"
            style={{ color: "#7a1a0a" }}
          >
            ¡Lo más Vendido!
          </h2>

          <div className="colecciones-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Item 1 */}
            <div className="coleccion-item bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src="https://i.pinimg.com/1200x/a5/75/8c/a5758c95cfd57b1c1d1292f0a0be02ec.jpg"
                alt="Chocolate Bar"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold">Macaloves - Macarons de Amor</h3>
                <Link
                  to="/novedades"
                  className="mt-2 text-[#7a1a0a] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* Item 2 */}
            <div className="coleccion-item bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/d1/8f/da/d18fdaa9cd95c431e6fb77c53cda987d.jpg"
                alt="Truffles"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold">Strawberry Cloud Croissant</h3>
                <Link
                  to="/novedades"
                  className="mt-2 text-[#7a1a0a] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* Item 3 */}
            <div className="coleccion-item bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src="https://i.pinimg.com/1200x/02/a1/00/02a10030eaed821b1525560b18e4b7b8.jpg"
                alt="Galletas de amor"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold">Heartful Bites - Galletas de Amor</h3>
                <Link
                  to="/novedades"
                  className="mt-2 text-[#7a1a0a] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>

            {/* Item 4 */}
            <div className="coleccion-item bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/e0/99/63/e099634012685ea760aa16416f208467.jpg"
                alt="Cherry Kiss Pie"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold">Cherry Kiss Pie</h3>
                <Link
                  to="/novedades"
                  className="mt-2 text-[#7a1a0a] font-medium hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
