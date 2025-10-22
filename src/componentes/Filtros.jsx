import React from "react";

export default function Filtros({ filtro, setFiltro }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-rose-100 p-4 rounded-xl my-6 shadow-sm">
      <h2 className="text-lg font-semibold text-rose-800 mb-3 text-center">
        🔍 Filtros
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {/* Buscar por nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Buscar por nombre..."
          value={filtro.nombre}
          onChange={handleChange}
          className="border border-rose-300 rounded-lg p-2 w-56 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        {/* Filtro por categoría */}
        <select
          name="categoria"
          value={filtro.categoria}
          onChange={handleChange}
          className="border border-rose-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="">Todas las categorías</option>
          <option value="Pasteles">Pasteles</option>
          <option value="Tartas">Tartas</option>
          <option value="Donas">Donas</option>
          <option value="Bombones">Bombones</option>
          <option value="Galletas">Galletas</option>
          <option value="Postres fríos">Postres fríos</option>
        </select>

        {/* Filtros de precio */}
        <input
          type="number"
          name="min"
          placeholder="Precio mín."
          value={filtro.min}
          onChange={handleChange}
          className="border border-rose-300 rounded-lg p-2 w-32 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <input
          type="number"
          name="max"
          placeholder="Precio máx."
          value={filtro.max}
          onChange={handleChange}
          className="border border-rose-300 rounded-lg p-2 w-32 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
    </div>
  );
}