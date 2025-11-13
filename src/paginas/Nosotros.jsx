import React from "react";
import incono from "../componentes/img/Bom.png";

export default function Nosotros() {
  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      {/* SECCIÓN PRINCIPAL */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white mb-16">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Conoce Bom Bocado</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            En{" "}
            <span className="font-semibold text-[#f5bfb2]">Bom Bocado</span> cada
            postre se prepara con{" "}
            <span className="font-semibold text-[#f5bfb2]">
              amor, dedicación
            </span>{" "}
            y los ingredientes más frescos.
          </p>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            Únete a nuestra familia de amantes del dulce y descubre por qué cada
            bocado es especial.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center py-10 px-6">
          <img
            src={incono}
            alt="Equipo Bom Bocado"
            className="w-[45%] md:w-[53%] h-auto object-contain"
          />
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#9c2007] tracking-tight">
            Nuestra Historia
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Desde nuestros inicios, en{" "}
            <span className="font-semibold text-[#d8718c]">Bom Bocado</span> nos
            enfocamos en crear postres artesanales que transformen momentos
            cotidianos en experiencias inolvidables. Cada receta está hecha con
            pasión, tradición y creatividad.
          </p>
        </div>

        {/* Grid de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Imagen 1 */}
          <div className="overflow-hidden rounded-3xl shadow-xl border border-[#f5bfb2] bg-white group">
            <img
              src="/Centro.png"
              alt="Equipo Bom Bocado"
              className="w-full h-80 md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Imagen 2 */}
          <div className="overflow-hidden rounded-3xl shadow-xl border border-[#f5bfb2] bg-white group">
            <img
              src="/Centro2.png"
              alt="Taller de postres"
              className="w-full h-80 md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      <div className="my-10 flex justify-center">
        <div className="w-2/3 h-0.5 bg-[#d8718c] rounded-full opacity-70"></div>
      </div>

      {/* MISIÓN - VISIÓN - VALORES */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* MISIÓN */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden">
            <img
              src="/Mision.png"
              alt="Nuestra Misión"
              className="w-full h-60 object-cover rounded-t-3xl"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-[#9c2007] mb-3">
                Nuestra Misión
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Alegrar a nuestros clientes con postres artesanales, frescos y
                deliciosos, preparados con pasión, amor y cuidado.
              </p>
            </div>
          </div>

          {/* VISIÓN */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden">
            <img
              src="/Vision.jpg"
              alt="Nuestra Visión"
              className="w-full h-60 object-cover rounded-t-3xl"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-[#9c2007] mb-3">
                Nuestra Visión
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Ser la pastelería peruana que más transmite amor y dedicación en
                cada creación, llevando el dulce a todos los rincones del país.
              </p>
            </div>
          </div>

          {/* VALORES */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden">
            <img
              src="/Buscamos.png"
              alt="Nuestros Valores"
              className="w-full h-60 object-cover rounded-t-3xl"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-[#9c2007] mb-3">
                Nuestros Valores
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Compromiso, creatividad y pasión en cada detalle. Mantener la
                esencia artesanal que nos caracteriza y crear momentos dulces
                memorables.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
