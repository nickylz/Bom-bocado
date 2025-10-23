// RatingSummary.jsx

import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserFriends } from "react-icons/fa"; // Importamos los iconos correctos

// Componente para mostrar las estrellas de promedio (sin sombra, con medias estrellas)
const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating); // Número de estrellas completas
  const hasHalfStar = rating % 1 >= 0.5; // Hay una media estrella si el decimal es .5 o más
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías restantes

  return (
    <div className="flex text-4xl text-yellow-400">
      {/* Estrellas completas */}
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}
      {/* Media estrella (si aplica) */}
      {hasHalfStar && <FaStarHalfAlt key="half" />}
      {/* Estrellas vacías */}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

// --- LÓGICA PARA SUMAR VOTOS BASE + VOTOS NUEVOS ---

// 1. Definimos los votos "base" que quieres mostrar siempre
const baseDistribution = { 5: 100, 4: 20, 3: 2, 2: 2, 1: 1 };

export default function RatingSummary() {
  const [stats, setStats] = useState({
    total: 0,
    average: 0.0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  // Esta función lee y calcula los datos
  const loadStats = () => {
    // 2. Obtenemos los votos NUEVOS (reales) de localStorage
    const newRatings = JSON.parse(localStorage.getItem("bomBocadoRatings")) || [];

    // 3. Contamos solo los votos NUEVOS
    const newDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    newRatings.forEach((r) => {
      if (newDistribution[r] !== undefined) {
        newDistribution[r]++;
      }
    });

    // 4. Creamos la distribución FINAL sumando los votos base + los nuevos
    const finalDistribution = {
      5: baseDistribution[5] + newDistribution[5],
      4: baseDistribution[4] + newDistribution[4],
      3: baseDistribution[3] + newDistribution[3],
      2: baseDistribution[2] + newDistribution[2],
      1: baseDistribution[1] + newDistribution[1],
    };

    // 5. Calculamos el total y el promedio en base a la suma FINAL
    const finalTotal = Object.values(finalDistribution).reduce(
      (a, b) => a + b,
      0
    );

    const finalSum =
      finalDistribution[5] * 5 +
      finalDistribution[4] * 4 +
      finalDistribution[3] * 3 +
      finalDistribution[2] * 2 +
      finalDistribution[1] * 1;

    // Convertimos a float para que el cálculo de medias estrellas funcione
    const finalAverage =
      finalTotal > 0 ? parseFloat((finalSum / finalTotal).toFixed(1)) : 0.0;

    // 6. Actualizamos el estado con los números finales
    setStats({
      total: finalTotal,
      average: finalAverage,
      distribution: finalDistribution,
    });
  };

  useEffect(() => {
    loadStats(); // Carga las estadísticas al iniciar

    // Escucha si otra pestaña (Contacto) actualiza los datos
    window.addEventListener("storage", loadStats);

    return () => {
      window.removeEventListener("storage", loadStats);
    };
  }, []); // El array vacío asegura que solo se ejecute al montar

  const { total, average, distribution } = stats;

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-12 mt-16">
      <div className="bg-white rounded-3xl shadow-xl border border-[#f5bfb2] p-6 md:p-8">
        <h3 className="text-2xl font-bold text-[#8f2133] mb-6 text-center">
          Nuestras Calificaciones
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* LADO IZQUIERDO: Promedio */}
          <div className="flex flex-col items-center p-6 bg-[#fff3f0] rounded-2xl w-full md:w-1/3">
            <div className="text-7xl font-bold text-[#9c2007] mb-2">
              {average}
            </div>
            
            {/* Aquí se usa el componente de estrellas sin sombra */}
            <StarRatingDisplay rating={average} />
            
            <div className="text-gray-600 flex items-center justify-center gap-2 mt-3">
              <FaUserFriends className="text-[#d8718c]" />
              <span>{total} calificaciones</span>
            </div>
          </div>

          {/* LADO DERECHO: Barras de Gráfico */}
          <div className="w-full md:w-2/3 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentage =
                total > 0 ? (distribution[stars] / total) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-3 group">
                  <span className="text-sm font-semibold text-[#a34d5f] w-12 text-right">
                    {stars}
                  </span>
                  <FaStar className="text-yellow-400" />

                  <div className="w-full bg-[#fdd2d7] rounded-full h-5 overflow-hidden border border-[#f5bfb2]">
                    <div
                      className="bg-[#d16170] h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {distribution[stars]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}