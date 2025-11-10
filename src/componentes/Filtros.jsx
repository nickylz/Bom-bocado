import React from "react";

export default function Filtros({ filtro, setFiltro }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-end mt-6">
      <input
        type="text"
        name="nombre"
        placeholder="Buscar por nombre..."
        value={filtro.nombre}
        onChange={handleChange}
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-56 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />

      <select
        name="categoria"
        value={filtro.categoria}
        onChange={handleChange}
        className="cursor-pointer rounded-lg border border-[#f5bfb2] bg-white p-2 font-medium text-[#9c2007] focus:border-[#d16170] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      >
        <option value="">Todas las categorías</option>
        {[
          "Pasteles",
          "Tartas",
          "Donas",
          "Cupcakes",
          "Bombones",
          "Macarons",
          "Galletas",
          "Postres fríos",
        ].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="min"
        placeholder="Precio mín."
        value={filtro.min}
        onChange={handleChange}
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />

      <input
        type="number"
        name="max"
        placeholder="Precio máx."
        value={filtro.max}
        onChange={handleChange}
        className="rounded-lg border border-[#f5bfb2] bg-white p-2 w-32 font-medium text-[#9c2007] placeholder:text-[#d8718c] focus:outline-none focus:ring-2 focus:ring-[#d16170]"
      />
    </div>
  );
}
