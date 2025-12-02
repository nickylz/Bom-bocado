import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function ProductoCard({ producto, mostrarBoton = true }) {
  const { agregarAlCarrito } = useCarrito();

  const handleAgregar = () => {
    agregarAlCarrito(producto);
  };

  return (
    <article className="group relative bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden flex flex-col h-full w-64">
      <div className="relative w-full aspect-square overflow-hidden">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="w-full h-full object-cover transition-all duration-300 group-hover:blur-[2px]" 
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/productos/${producto.id}`}
            className="bg-[#a34d5f] text-white px-4 py-2 text-base sm:px-6 sm:py-3 rounded-full font-bold sm:text-lg hover:bg-[#912646] transition"
          >
            Ver más
          </Link>
        </div>
      </div>
      <div className="p-5 text-center grow flex flex-col">
        <h3 className="text-lg font-semibold text-[#9c2007] truncate">{producto.nombre}</h3>
        <p className="text-gray-600 text-sm mt-1 grow">{producto.frase}</p>
        <p className="text-[#d8718c] font-bold text-xl my-3">
          S/{producto.precio?.toFixed(2)}
        </p>

        {mostrarBoton && (
          <div className="mt-auto pt-2">
            <button
              onClick={handleAgregar}
              className="bg-[#a34d5f] hover:bg-[#912646] text-white px-6 py-3 text-lg rounded-full w-full transition shadow-md font-semibold"
            >
              Añadir al Carrito
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
