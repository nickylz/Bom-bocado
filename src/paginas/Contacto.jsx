import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaCommentDots, FaStar } from "react-icons/fa";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast'; // 1. Importar toast

export default function Contacto() {
  const { usuarioActual } = useAuth();
  // Se elimina useModal

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  useEffect(() => {
    if (usuarioActual) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuarioActual.displayName || "",
        correo: usuarioActual.email || "",
      }));
    }
  }, [usuarioActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mensaje") {
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      // 2. Reemplazar modal por toast de error
      toast.error("Por favor, selecciona una calificación de estrellas.");
      return;
    }

    try {
      const promise = addDoc(collection(db, "testimonios"), {
        nombre: formData.nombre,
        correo: formData.correo,
        mensaje: formData.mensaje,
        estrellas: rating,
        createdAt: serverTimestamp(),
        userUid: usuarioActual?.uid || null,
        userPhotoURL: usuarioActual?.photoURL || null, 
        userCorreo: usuarioActual?.email || null,
      });

      // 3. Usar toast.promise para una UX increíble
      await toast.promise(promise, {
         loading: 'Enviando tu comentario...',
         success: '¡Gracias por tu opinión!',
         error: 'No se pudo enviar tu comentario.',
      });

      setFormData({ nombre: "", correo: "", mensaje: "" });
      setRating(0);
      setHover(0);
    } catch (error) {
      console.error("Error al enviar testimonio:", error);
      // El toast.promise ya maneja el mensaje de error
    }
  };

  return (
    <section className="bg-[#fff3f0] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
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

        <form
          aria-label="Formulario de contacto y calificación"
          onSubmit={handleSubmit}
          className="bg-white border border-[#f5bfb2] rounded-3xl shadow-xl p-8 space-y-5 transform hover:-translate-y-2 transition-all duration-500 ease-out hover:shadow-2xl cursor-pointer"
        >
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

          <div className="text-center">
            <label className="block text-lg font-semibold text-[#9c2007] mb-3">
              ¡Califícanos!
            </label>
            <div className="flex justify-center text-4xl text-gray-300 cursor-pointer">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      color={
                        ratingValue <= (hover || rating) ? "#d16170" : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform duration-200 hover:scale-110"
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
              Enviar comentario y calificación
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
