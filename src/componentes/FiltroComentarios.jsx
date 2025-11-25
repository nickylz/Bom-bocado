import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FiltroComentarios = ({ setFiltro, filtroActual }) => {
  return (
    <div className="my-8 flex justify-center sm:justify-end items-center gap-4">
      <label htmlFor="filtro" className="font-semibold text-gray-700 flex items-center gap-2">
        <FaFilter className="text-gray-500" />
        <span>Filtrar por:</span>
      </label>
      <select
        id="filtro"
        value={filtroActual}
        onChange={(e) => setFiltro(e.target.value)}
        className="bg-white border border-rose-200 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition duration-200 ease-in-out shadow-sm hover:border-rose-300 cursor-pointer"
      >
        <option value="recientes">Más Recientes</option>
        <option value="mis-comentarios">Mis Comentarios</option>
      </select>
    </div>
  );
};

export default FiltroComentarios;
