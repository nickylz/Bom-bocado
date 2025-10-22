import React from "react";

export default function Nosotros() {
  return (
    <section className="bg-[#fff3f0] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* ======= IMAGEN PRINCIPAL ======= */}
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://i.ibb.co/0jzcKN9s/20250805-1131-Cafeter-a-Aesthetic-Amistosa-simple-compose-01k1xh00vke1b99r54a3esvst4.png"
            alt="Equipo Bom Bocado"
            className="w-full h-[320px] sm:h-[420px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* ======= TEXTO PRINCIPAL ======= */}
        <div className="text-center mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9c2007] mb-4">
            Sobre Nosotros
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            En <span className="font-semibold text-[#d8718c]">Bom Bocado</span>,
            preparamos nuestros postres con amor, dedicación y cuidado, para que
            los disfrutes con toda tu familia.
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
            Somos una empresa peruana que convierte momentos familiares en dulces
            y especiales, elaborando postres con ingredientes selectos y frescos.
            Basamos nuestras recetas en el estilo casero tradicional, elaboradas
            artesanalmente con pasión y compromiso.
          </p>
        </div>

        {/* ======= SECCIÓN INFERIOR (Misión, Visión, Valores) ======= */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ======= MISIÓN ======= */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <img
              src="https://i.ibb.co/nqLVqQfR/94691f308486d9f0dff0c5a485f24301.jpg"
              alt="Nuestra Misión"
              className="w-full h-56 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-[#9c2007] mb-2">
                Nuestra Misión
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Alegrar a nuestros clientes con sabores únicos y artesanales,
                elaborados con ingredientes naturales y siempre con pasión y
                cuidado.
              </p>
            </div>
          </div>

          {/* ======= VISIÓN ======= */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <img
              src="https://i.postimg.cc/9QCbCxL4/unnamed.jpg"
              alt="Nuestra Visión"
              className="w-full h-56 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-[#9c2007] mb-2">
                Nuestra Visión
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ser reconocidos como la pastelería peruana que más transmite amor
                a través de cada postre, expandiendo nuestro sabor artesanal a
                todo el país.
              </p>
            </div>
          </div>

          {/* ======= QUÉ BUSCAMOS ======= */}
          <div className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <img
              src="https://i.ibb.co/6JDHv55w/20250807-1016-Equipo-de-Cafeter-a-Activo-remix-01k22hh36ven6r5y1sc28w3xws.png"
              alt="¿Qué buscamos como empresa?"
              className="w-full h-56 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-[#9c2007] mb-2">
                ¿Qué buscamos?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mantener la esencia familiar y artesanal que nos caracteriza,
                creando momentos dulces y memorables junto a nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
