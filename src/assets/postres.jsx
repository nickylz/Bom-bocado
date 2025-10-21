import React from "react";

// Datos de postres
export const Postres = [
  {
    nombre: "Charlotte de Fresas",
    descripcion: "Suave y frutal",
    precio: 55.0,
    imagen: "https://i.pinimg.com/1200x/70/c9/14/70c914af01fd5f7490192f559a508c42.jpg",
  },
  {
    nombre: "Clásico Fresas & Crema",
    descripcion: "Dulce y esponjoso",
    precio: 65.0,
    imagen: "https://i.pinimg.com/736x/f6/b7/70/f6b7700c9ecd547d98470c67f8ed2870.jpg",
  },
  {
    nombre: "Red Velvet con Fresas",
    descripcion: "Suave y elegante",
    precio: 70.0,
    imagen: "https://i.pinimg.com/736x/d7/d9/e5/d7d9e5701c0f734db4f914e967501f2d.jpg",
  },
  {
    nombre: "Cheesecake de Fresas",
    descripcion: "Cremoso y fresco",
    precio: 60.0,
    imagen: "https://i.pinimg.com/1200x/95/8c/fc/958cfc0ca8d10651f1c29e76e3c00007.jpg",
  },
  {
    nombre: "Fresas Glaseadas",
    descripcion: "Suaves y crocantes",
    precio: 12.0,
    imagen: "https://i.pinimg.com/1200x/3d/1e/ca/3d1eca4db29ad0f033fbb03c2165132e.jpg",
  },
  {
    nombre: "Bocados de Fresa",
    descripcion: "Suaves y frutales",
    precio: 14.0,
    imagen: "https://i.pinimg.com/1200x/59/dd/24/59dd2470430abe11a0482fa3e3c5a8b0.jpg",
  },
  {
    nombre: "Dona Primavera",
    descripcion: "Glaseado rosado con fresas",
    precio: 11.5,
    imagen: "https://i.pinimg.com/736x/fb/7e/ec/fb7eecc7780f7695518d74cfb9b8489d.jpg",
  },
  {
    nombre: "Velvet Pasión",
    descripcion: "Bizcocho rojo y cremoso",
    precio: 6.5,
    imagen: "https://i.pinimg.com/736x/e4/73/04/e47304511a9bad8a1b667b3022ad3f86.jpg",
  },
];

// Componente de muestra para visualizar los postres
export function PostresComponent() {
  return (
    <div className="p-8 space-y-12 bg-rose-50">
      <h2 className="text-3xl font-semibold text-rose-800 mb-6 border-b-2 border-rose-300 pb-2">
        Postres
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Postres.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-rose-700">
                {item.nombre}
              </h3>
              <p className="text-sm text-gray-600">{item.descripcion}</p>
              <div className="text-rose-800 font-bold mt-2">
                S/{item.precio.toFixed(2)}
              </div>
              <button className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
