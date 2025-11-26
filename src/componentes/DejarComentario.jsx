import React, { useState } from 'react';

const DejarComentario = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleGuardarComentario = () => {
    // Lógica para guardar el comentario y el rating
    console.log('Rating:', rating, 'Comentario:', comentario);
    // Aquí deberías añadir la lógica para enviar los datos a Firebase
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Escribe tu opinión</h3>
      <div className="flex items-center mb-4">
        <span className="mr-4 text-gray-700">Tu calificación:</span>
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <svg
                key={index}
                className={`w-8 h-8 cursor-pointer ${ratingValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            );
          })}
        </div>
      </div>
      <textarea
        className="w-full p-4 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#f5bfb2] focus:border-transparent"
        rows="4"
        placeholder="Escribe tu opinión aquí..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      ></textarea>
      <button
        onClick={handleGuardarComentario}
        className="mt-4 bg-[#a34d5f] text-white px-6 py-2 rounded-full hover:bg-[#912646] transition shadow-md"
      >
        Enviar Opinión
      </button>
    </div>
  );
};

export default DejarComentario;
