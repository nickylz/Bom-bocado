import React from "react";

export function Postres() {
  const postres = {
    Pasteles: [
      {
        nombre: "Charlotte de Fresas",
        descripcion: "Suave y frutal",
        precio: "S/55.00",
        imagen:
          "https://i.pinimg.com/1200x/70/c9/14/70c914af01fd5f7490192f559a508c42.jpg",
      },
      {
        nombre: "Clásico Fresas & Crema",
        descripcion: "Dulce y esponjoso",
        precio: "S/65.00",
        imagen:
          "https://i.pinimg.com/736x/f6/b7/70/f6b7700c9ecd547d98470c67f8ed2870.jpg",
      },
      {
        nombre: "Red Velvet con Fresas",
        descripcion: "Suave y elegante",
        precio: "S/70.00",
        imagen:
          "https://i.pinimg.com/736x/d7/d9/e5/d7d9e5701c0f734db4f914e967501f2d.jpg",
      },
      {
        nombre: "Cheesecake de Fresas",
        descripcion: "Cremoso y fresco",
        precio: "S/60.00",
        imagen:
          "https://i.pinimg.com/1200x/95/8c/fc/958cfc0ca8d10651f1c29e76e3c00007.jpg",
      },
    ],
    Galletas: [
      {
        nombre: "Fresas Glaseadas",
        descripcion: "Suaves y crocantes",
        precio: "S/12.00",
        imagen:
          "https://i.pinimg.com/1200x/3d/1e/ca/3d1eca4db29ad0f033fbb03c2165132e.jpg",
      },
      {
        nombre: "Bocados de Fresa",
        descripcion: "Suaves y frutales",
        precio: "S/14.00",
        imagen:
          "https://i.pinimg.com/1200x/59/dd/24/59dd2470430abe11a0482fa3e3c5a8b0.jpg",
      },
      {
        nombre: "Corazones Velvet",
        descripcion: "Rojas y cremosas",
        precio: "S/16.00",
        imagen:
          "https://i.pinimg.com/1200x/20/d8/91/20d891848730b1987fa18b975ea5ec6e.jpg",
      },
      {
        nombre: "Estrellitas de Mermelada",
        descripcion: "Dulces y rellenas",
        precio: "S/13.00",
        imagen:
          "https://i.pinimg.com/736x/84/6c/a0/846ca0a6ec8219f74f924f8b79c3e9bf.jpg",
      },
    ],
    Donas: [
      {
        nombre: "Dona Glaseada",
        descripcion: "Dulce y esponjosa",
        precio: "S/10.00",
        imagen:
          "https://i.pinimg.com/1200x/af/19/32/af1932708236ef09f80708a822da78d7.jpg",
      },
      {
        nombre: "Dona Primavera",
        descripcion: "Glaseado rosado con fresas",
        precio: "S/11.50",
        imagen:
          "https://i.pinimg.com/736x/fb/7e/ec/fb7eecc7780f7695518d74cfb9b8489d.jpg",
      },
      {
        nombre: "Corazón de Vainilla",
        descripcion: "Suave y con delicioso relleno",
        precio: "S/12.00",
        imagen:
          "https://i.pinimg.com/736x/5c/c4/60/5cc460bbac19a9db23183c8df11362dd.jpg",
      },
      {
        nombre: "Nube de Fresas",
        descripcion: "Con crema y fresas frescas",
        precio: "S/11.00",
        imagen:
          "https://i.pinimg.com/736x/f2/8b/75/f28b7536a7b468d792d739548d120621.jpg",
      },
    ],
    Cupcakes: [
      {
        nombre: "Velvet Pasión",
        descripcion: "Bizcocho rojo y cremoso",
        precio: "S/6.50",
        imagen:
          "https://i.pinimg.com/736x/e4/73/04/e47304511a9bad8a1b667b3022ad3f86.jpg",
      },
      {
        nombre: "Magia del Bosque",
        descripcion: "Inspirada en la estación",
        precio: "S/7.00",
        imagen:
          "https://i.pinimg.com/736x/3a/33/b4/3a33b48d4d9400b8a8735a8a46b8a5d6.jpg",
      },
      {
        nombre: "Latido Dulce",
        descripcion: "Chocolate con crema suave",
        precio: "S/7.50",
        imagen:
          "https://i.pinimg.com/736x/0c/4e/30/0c4e301ebb111d34551e62bc6d8707c4.jpg",
      },
      {
        nombre: "Fresa Delicia",
        descripcion: "Vainilla con crema y fresa",
        precio: "S/6.00",
        imagen:
          "https://i.pinimg.com/1200x/3d/e9/7f/3de97fb9492b9896a37f9251f725997b.jpg",
      },
    ],
  };

  return (
    <div className="p-8 space-y-12 bg-rose-50">
      {Object.entries(postres).map(([categoria, items]) => (
        <section key={categoria}>
          <h2 className="text-3xl font-semibold text-rose-800 mb-6 border-b-2 border-rose-300 pb-2">
            {categoria}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
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
                    {item.precio}
                  </div>
                  <button className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}