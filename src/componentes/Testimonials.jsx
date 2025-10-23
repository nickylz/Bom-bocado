// Testimonials.jsx

import React, { useState, useEffect } from "react";
import RatingSummary from "./RatingSummary"; // 1. IMPORTA EL GRÁFICO

// Array con los 10 comentarios
const testimonials = [
  {
    name: "Ana Lucía P.",
    comment:
      "¡Los macarons son una verdadera delicia! Se nota la calidad de los ingredientes. Súper recomendados.",
    stars: 5,
  },
  {
    name: "Javier Mendoza",
    comment:
      "El 'Strawberry Cloud Croissant' es de otro mundo. Esponjoso, fresco y nada empalagoso. ¡Volveré por más!",
    stars: 5,
  },
  {
    name: "María Fernanda T.",
    comment:
      "Hice un pedido grande para un cumpleaños y todos quedaron fascinados con la presentación y el sabor. ¡Gracias Bom Bocado!",
    stars: 5,
  },
  {
    name: "Carlos Gutiérrez",
    comment:
      "La calidad de la repostería fina es excepcional. El 'Cherry Kiss Pie' es mi nuevo postre favorito. Excelente.",
    stars: 5,
  },
  {
    name: "Sofía L.",
    comment:
      "¡Las 'Heartful Bites' son las galletas más lindas y ricas que he probado! Perfectas para un detalle especial.",
    stars: 5,
  },
  {
    name: "Miguel Ángel R.",
    comment:
      "La atención al cliente es de primera. Mi pedido llegó impecable y a tiempo. Se han vuelto mi pastelería de cabecera.",
    stars: 5,
  },
  {
    name: "Valeria Campos",
    comment:
      "Perfecto para un regalo. La presentación de los postres es hermosa y el sabor es simplemente inolvidable. ¡10/10!",
    stars: 5,
  },
  {
    name: "Diego S.",
    comment:
      "Un sabor único y postres muy creativos. Se nota el amor y la dedicación que le ponen a cada producto.",
    stars: 5,
  },
  {
    name: "Laura V.",
    comment:
      "¡Todo es exquisito! Compré una torta decorada y superó mis expectativas. Definitivamente la mejor tienda virtual de postres.",
    stars: 5,
  },
  {
    name: "Esteban D.",
    comment:
      "Los detalles únicos marcan la diferencia. No son solo postres, son experiencias. ¡Felicitaciones por tan buen trabajo!",
    stars: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Configuramos el intervalo para el carrusel
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Incrementamos el índice de 2 en 2
        const nextIndex = prevIndex + 2;
        // Si el próximo índice supera o iguala la longitud, reinicia a 0
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
    }, 5000); // Cambia cada 5 segundos

    // Limpiamos el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El array vacío asegura que esto solo se ejecute al montar

  // Obtenemos los dos comentarios actuales para mostrar
  const displayedComments = [
    testimonials[currentIndex],
    testimonials[currentIndex + 1],
  ];

  return (
    // Usamos un Fragment (<>) para envolver ambas secciones
    <>
      {/* SECCIÓN 1: CARRUSEL DE COMENTARIOS */}
      <section className="text-center px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-14">
          Lo que dicen nuestros clientes
        </h2>

        {/* Contenedor del carrusel */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl mx-auto min-h-[250px]">
          {displayedComments.map((comment, index) => (
            <div
              key={currentIndex + index}
              className="bg-white rounded-2xl p-6 shadow-lg w-full md:w-1/2 flex flex-col justify-between text-left animate-fadeIn"
            >
              <div>
                <div className="text-2xl text-[#d16170] mb-3">
                  {"⭐".repeat(comment.stars)}
                </div>
                <p className="text-gray-600 italic text-base leading-relaxed mb-4">
                  "{comment.comment}"
                </p>
              </div>
              <h4 className="font-semibold text-lg text-[#7a1a0a] text-right">
                - {comment.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: NUEVO RESUMEN DE CALIFICACIONES */}
      <RatingSummary />
      {/* 2. ESTA LÍNEA "LLAMA" E INSERTA EL GRÁFICO AQUÍ */}
    </>
  );
}