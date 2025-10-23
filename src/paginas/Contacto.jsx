// Contacto.jsx

import React, { useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots, FaStar } from "react-icons/fa";

export default function Contacto() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  // Manejador para actualizar el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenimos el envío real del formulario

    // 1. Validar que se haya dado una calificación
    if (rating === 0) {
      alert("Por favor, selecciona una calificación de estrellas.");
      return;
    }

    // 2. Obtener las calificaciones existentes de localStorage
    // Usamos una clave específica solo para las calificaciones
    const existingRatings = JSON.parse(localStorage.getItem("bomBocadoRatings")) || [];

    // 3. Agregar la nueva calificación (solo el número)
    existingRatings.push(rating);

    // 4. Guardar el array actualizado en localStorage
    localStorage.setItem("bomBocadoRatings", JSON.stringify(existingRatings));

    // 5. Mostrar mensaje y limpiar el formulario
    alert("¡Muchas gracias por tu calificación!");
    
    // 6. Limpiamos el formulario
    setFormData({ nombre: "", correo: "", mensaje: "" });
    setRating(0);
    setHover(0);
  };

  return (
    <section className="bg-[#fff3f0] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        {/* ======= COLUMNA IZQUIERDA ======= */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-[#9c2007] mb-4">¡Hablemos!</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            ¿Tienes alguna pregunta, deseas hacer un pedido especial o solo
            quieres saludarnos? En{" "}
            <span className="font-semibold text-[#d8718c]">Bom Bocado</span>,
            nos encanta escucharte.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            También valoramos mucho tu opinión. ¡Déjanos una calificación y
            ayúdanos a seguir mejorando!
          </p>
        </div>

        {/* ======= FORMULARIO ======= */}
        <form
          aria-label="Formulario de contacto y calificación"
          onSubmit={handleSubmit} // <--- MANEJADOR AÑADIDO
          className="bg-white border border-[#f5bfb2] rounded-3xl shadow-xl p-8 space-y-5"
        >
          {/* ... campos de nombre, correo y mensaje (igual que antes) ... */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-[#d8718c]" />
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              required
              value={formData.nombre} 
              onChange={handleChange} 
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
              value={formData.correo} 
              onChange={handleChange} 
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
            />
          </div>

          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3.5 text-[#d8718c]" />
            <textarea
              id="mensaje"
              name="mensaje"
              rows="4"
              placeholder="Escríbenos un mensaje..."
              required
              value={formData.mensaje} 
              onChange={handleChange} 
              className="w-full border border-rose-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] resize-none transition"
            ></textarea>
          </div>

          {/* Sistema de Calificación */}
          <div className="text-center">
            <label className="block text-lg font-semibold text-[#9c2007] mb-3">
              ¡Califícanos!
            </label>
            <div className="flex justify-center text-4xl text-gray-300 cursor-pointer">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                      required // <-- Importante para la validación
                    />
                    <FaStar
                      className="star transition-colors duration-200"
                      color={
                        ratingValue <= (hover || rating)
                          ? "#ffc107"
                          : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="bg-[#a34d5f] text-white font-semibold px-10 py-3 rounded-xl hover:bg-[#9c2007] transition duration-300 shadow-lg"
            >
              Enviarnos tu comentario y Calificación
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}