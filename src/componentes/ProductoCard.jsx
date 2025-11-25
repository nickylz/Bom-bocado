import React, { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';

export default function ProductoCard({ producto, mostrarBoton = true }) {
  const [cantidad, setCantidad] = useState(1);
  const { agregarProducto } = useCarrito();

  const handleIncrement = () => {
    setCantidad(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCantidad(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAgregar = () => {
    agregarProducto(producto, cantidad);
    // Opcional: podrías mostrar una notificación de "Añadido al carrito"
  };

  return (
    <article className=" bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden flex flex-col h-full w-full max-w-xs sm:max-w-sm">
      <div className="relative w-full h-56 sm:h-60">
        <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 text-center grow flex flex-col">
        <h3 className="text-lg font-semibold text-[#9c2007]">{producto.nombre}</h3>
        <p className="text-gray-600 text-sm mt-1 grow">{producto.descripcion}</p>
        <p className="text-[#d8718c] font-bold text-xl my-3">
          S/{producto.precio?.toFixed(2)}
        </p>

        {mostrarBoton && (
          <div className="mt-auto">
            <div className="flex items-center justify-center gap-4 mb-3">
              <button 
                onClick={handleDecrement} 
                className="bg-gray-200 text-gray-700 font-bold w-8 h-8 rounded-full hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="text-lg font-semibold w-10 text-center">{cantidad}</span>
              <button 
                onClick={handleIncrement} 
                className="bg-gray-200 text-gray-700 font-bold w-8 h-8 rounded-full hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAgregar}
              className="bg-[#a34d5f] text-white px-6 py-2 rounded-full w-full hover:bg-[#912646] transition"
            >
              Comprar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
