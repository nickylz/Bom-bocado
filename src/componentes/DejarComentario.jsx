import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const DejarComentario = ({ productoId }) => {
  const { usuario } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleGuardarComentario = async () => {
    if (!usuario) {
      alert('Debes iniciar sesión para dejar un comentario.');
      return;
    }
    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }
    if (comentario.trim() === '') {
      alert('Por favor, escribe un comentario.');
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, 'comentarios'), {
        productoId,
        autorId: usuario.uid,
        autorNombre: usuario.displayName || 'Anónimo',
        autorFotoURL: usuario.photoURL,
        rating,
        texto: comentario,
        fecha: serverTimestamp(),
      });
      setEnviado(true);
      setComentario('');
      setRating(0);
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
      alert('Hubo un error al enviar tu comentario. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
        <p className="text-green-800 font-semibold">¡Gracias por tu opinión!</p>
        <p className="text-green-600">Tu comentario ha sido enviado correctamente.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {usuario && (
          <div className="flex-shrink-0">
            {usuario.photoURL ? (
              <img src={usuario.photoURL} alt={usuario.displayName} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#a34d5f] flex items-center justify-center text-white font-bold text-xl">
                {usuario.displayName ? usuario.displayName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Escribe tu opinión</h3>
          <div className="flex items-center mb-3">
            <span className="mr-3 text-gray-700">Tu calificación:</span>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <svg
                    key={index}
                    className={`w-7 h-7 cursor-pointer ${ratingValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#f5bfb2] focus:border-transparent"
            rows="3"
            placeholder={`¿Qué te pareció el producto, ${usuario ? usuario.displayName : ''}?`}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={enviando || !usuario}
          ></textarea>
          <button
            onClick={handleGuardarComentario}
            className={`mt-3 bg-[#a34d5f] text-white px-6 py-2 rounded-full hover:bg-[#912646] transition shadow-md ${enviando || !usuario ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={enviando || !usuario}
          >
            {enviando ? 'Enviando...' : 'Enviar Opinión'}
          </button>
          {!usuario && <p className="text-xs text-gray-500 mt-2">Debes iniciar sesión para poder comentar.</p>}
        </div>
      </div>
    </div>
  );
};

export default DejarComentario;
