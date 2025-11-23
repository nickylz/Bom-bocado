import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Fondo (sin cambios)
    <div 
      className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Contenedor del modal: Reducimos el ancho máximo a `sm` */}
      <div 
        className="bg-[#fff3f0] rounded-2xl shadow-2xl w-11/12 max-w-sm mx-auto transform transition-transform duration-300 scale-95 animate-scale-in border-2 border-[#f5bfb2]" 
        onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        {/* Encabezado del Modal */}
        <header className="flex justify-between items-center p-4 border-b border-[#f5bfb2]">
          <h2 className="text-xl font-bold text-[#9c2007]">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-600 transition-colors rounded-full p-1"
          >
            <X size={24} />
          </button>
        </header>

        {/* Contenido del Modal */}
        <main className="p-6 text-gray-700">
          {children}
        </main>
      </div>

      {/* Animación para la entrada (sin cambios) */}
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>
  );
}
