import React from "react";
import { useCarrito } from "../context/CarritoContext"; // 👈 importa el contexto

export default function Novedades() {
  const { agregarProducto } = useCarrito(); // 👈 usamos la función para agregar productos

  const productosNuevos = [
    {
      nombre: "Cheesecake de Arándanos",
      descripcion: "Cremoso y fresco",
      precio: 48,
      imagen:
        "https://i.pinimg.com/1200x/8f/d4/60/8fd4603b035327a5c02dc6e34ec3939f.jpg",
    },
    {
      nombre: "Mini Tartas de Frutas",
      descripcion: "Coloridas y naturales",
      precio: 40,
      imagen:
        "https://i.pinimg.com/736x/e1/f6/20/e1f62045feef931f2f57858699d64696.jpg",
    },
    {
      nombre: "Cupcakes de Vainilla Rosa",
      descripcion: "Delicados y decorados a mano",
      precio: 35,
      imagen:
        "https://i.pinimg.com/736x/3f/31/f9/3f31f9ed25d09d6b0a35e6c0a1cf8da0.jpg",
    },
  ];

  const pasteles = [
    {
      nombre: "Delicia de Frambuesas",
      descripcion: "Suave bizcocho con crema de frambuesa",
      precio: 55,
      imagen:
        "https://i.pinimg.com/1200x/b2/3a/03/b23a03dbae3f92df0e023a0372796165.jpg",
    },
    {
      nombre: "Sueño de Chocolate Blanco",
      descripcion: "Esponjoso y delicado",
      precio: 65,
      imagen:
        "https://i.pinimg.com/736x/c5/d3/54/c5d354b9d6382a66574314bc67476828.jpg",
    },
    {
      nombre: "Pastel Caramelo & Nuez",
      descripcion: "Dulce con un toque crocante",
      precio: 70,
      imagen:
        "https://i.pinimg.com/736x/87/57/fe/8757fe48496277e663e2acb3656a4cac.jpg",
    },
  ];

  const galletas = [
    {
      nombre: "Besitos de Coco",
      descripcion: "Suaves, doradas y con un toque tropical",
      precio: 28,
      imagen:
        "https://i.pinimg.com/736x/be/07/61/be076160d1f41af3bfcd47f41caa6efb.jpg",
    },
    {
      nombre: "Dulce Tentación de Cacao",
      descripcion: "Crujientes con trocitos de chocolate",
      precio: 32,
      imagen:
        "https://i.pinimg.com/736x/b5/02/ca/b502ca43e9eca3dcb5bf1cfc7914f13b.jpg",
    },
    {
      nombre: "Estrellitas de Vainilla",
      descripcion: "Decoradas con glasé rosa pastel",
      precio: 36,
      imagen:
        "https://i.pinimg.com/736x/1c/58/4f/1c584f91ef88fb4425aa3d355827534c.jpg",
    },
  ];

  const renderProductos = (productos) =>
    productos.map((item, index) => (
      <article
        key={index}
        className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
      >
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-60 object-cover"
        />
        <div className="p-5 text-center">
          <h3 className="text-lg font-semibold text-[#9c2007]">{item.nombre}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.descripcion}</p>
          <p className="text-[#d8718c] font-bold mt-2">S/{item.precio}.00</p>
          <button
            onClick={() =>
              agregarProducto({
                nombre: item.nombre,
                precio: item.precio,
                imagen: item.imagen,
              })
            }
            className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
          >
            Comprar
          </button>
        </div>
      </article>
    ));

  return (
    <section className="bg-[#fff3f0] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-[#9c2007] mb-12">
          Novedades
        </h1>

        {/* ======= PRODUCTOS NUEVOS ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Productos Nuevos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderProductos(productosNuevos)}
          </div>
        </section>

        {/* ======= PASTELES ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Pasteles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderProductos(pasteles)}
          </div>
        </section>

        {/* ======= GALLETAS ======= */}
        <section>
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Galletas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderProductos(galletas)}
          </div>
        </section>
      </div>
    </section>
  );
}
