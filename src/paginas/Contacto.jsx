import React, { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaUser, FaCommentDots, FaStar } from "react-icons/fa";

export default function Contacto() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    // Aquí podrías agregar validaciones o animaciones si deseas
  }, []);

  return (
    <section className="bg-[#fff3f0] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        {/* ======= COLUMNA IZQUIERDA ======= */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-[#9c2007] mb-4">¡Hablemos!</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            ¿Tienes alguna pregunta, deseas hacer un pedido especial o solo quieres saludarnos? En{" "}
            <span className="font-semibold text-[#d8718c]">Bom Bocado</span>, nos encanta escucharte. 💖
          </p>
        </div>

        {/* ======= FORMULARIO ======= */}
        <form
          aria-label="Formulario de contacto"
          action="#"
          noValidate
          className="bg-white border border-[#f5bfb2] shadow-xl rounded-3xl p-8 md:p-10 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-[#9c2007] mb-2 text-center">
            Escríbenos
          </h2>

          {/* ======= CALIFICACIÓN POR ESTRELLAS ======= */}
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(currentRating)}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(rating)}
                  className="transition-transform transform hover:scale-110"
                >
                  <FaStar
                    size={28}
                    className={`mx-1 cursor-pointer transition-colors ${
                      currentRating <= (hover || rating)
                        ? "text-[#d8718c]"
                        : "text-[#f5bfb2]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-center text-gray-600 text-sm mb-6 flex items-center justify-center gap-1">
            {rating > 0 ? (
              <>
                Calificaste con <span className="font-medium text-[#9c2007]">{rating}</span>{" "}
                <FaStar className="text-[#d8718c]" />
              </>
            ) : (
              "¿Qué te pareció nuestra atención o sitio?"
            )}
          </p>

          {/* ======= CAMPOS DEL FORMULARIO ======= */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-[#d8718c]" />
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              required
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-3 top-3.5 text-[#d8718c]" />
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Tu teléfono"
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-[#d8718c]" />
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="Tu correo electrónico"
              required
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
            />
          </div>

          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3.5 text-[#d8718c]" />
            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              placeholder="Escríbenos un mensaje..."
              required
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] resize-none transition"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#a34d5f] text-white font-medium px-8 py-3 rounded-xl hover:bg-[#912646] transition-all shadow-md"
            >
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
