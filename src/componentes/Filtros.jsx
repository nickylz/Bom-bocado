import React from "react";

export default function Filtros({ filtro, setFiltro }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    // Contenedor principal de filtros en FILA (horizontal)
    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
      
      {/* Buscar por nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Buscar por nombre..."
        value={filtro.nombre}
        onChange={handleChange}
        // --- Clases actualizadas ---
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-56 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />

      {/* Filtro por categoría */}
      <select
        name="categoria"
        value={filtro.categoria}
        onChange={handleChange}
        // --- Estilo del Select (sin cambios) ---
        className="cursor-pointer rounded-lg border border-[#f5bfb2] bg-white p-2 font-medium text-[#9c2007] focus:border-[#d16170] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      >
        <option
          value=""
          className="font-medium text-gray-500 bg-white hover:bg-[#f5bfb2]"
        >
          Todas las categorías
        </option>
        <option
          value="Pasteles"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Pasteles
        </option>
        <option
          value="Tartas"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Tartas
        </option>
        <option
          value="Donas"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Donas
        </option>
        <option
          value="Cupcakes"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Cupcakes
        </option>
        <option
          value="Bombones"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Bombones
        </option>
        <option
          value="Galletas"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Galletas
        </option>
        <option
          value="Postres fríos"
          className="font-medium text-[#a34d5f] bg-[#fff3f0] hover:bg-[#d16170] hover:text-white"
        >
          Postres fríos
        </option>
      </select>

      {/* Filtros de precio (min) */}
      <input
        type="number"
        name="min"
        placeholder="Precio mín."
        value={filtro.min}
        onChange={handleChange}
        // --- Clases actualizadas ---
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />
      
      {/* Filtros de precio (max) */}
      <input
        type="number"
        name="max"
        placeholder="Precio máx."
        value={filtro.max}
        onChange={handleChange}
        // --- Clases actualizadas ---
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />
    </div>
  );
}