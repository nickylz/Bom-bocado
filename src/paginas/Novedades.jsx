import React from "react";

export default function Novedades() {
  return (
    <section className="bg-[#fff3f0] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center text-[#9c2007] mb-12">
          Novedades
        </h1>

        {/* ======= SECCIÓN: PRODUCTOS NUEVOS ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Productos Nuevos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Producto nuevo 1 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/1200x/8f/d4/60/8fd4603b035327a5c02dc6e34ec3939f.jpg"
                alt="Cheesecake de Arándanos"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Cheesecake de Arándanos
                </h3>
                <p className="text-gray-600 text-sm mt-1">Cremoso y fresco</p>
                <p className="text-[#d8718c] font-bold mt-2">S/48.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>

            {/* Producto nuevo 2 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/e1/f6/20/e1f62045feef931f2f57858699d64696.jpg"
                alt="Mini Tartas de Frutas"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Mini Tartas de Frutas
                </h3>
                <p className="text-gray-600 text-sm mt-1">Coloridas y naturales</p>
                <p className="text-[#d8718c] font-bold mt-2">S/40.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>

            {/* Producto nuevo 3 */}
            <article className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/3f/31/f9/3f31f9ed25d09d6b0a35e6c0a1cf8da0.jpg"
                alt="Cupcakes de Vainilla Rosa"
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#9c2007]">
                  Cupcakes de Vainilla Rosa
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Delicados y decorados a mano
                </p>
                <p className="text-[#d8718c] font-bold mt-2">S/35.00</p>
                <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                  Comprar
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* ======= SECCIÓN: PASTELES ======= */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Pasteles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: "https://i.pinimg.com/1200x/b2/3a/03/b23a03dbae3f92df0e023a0372796165.jpg",
                name: "Delicia de Frambuesas",
                desc: "Suave bizcocho con crema de frambuesa",
                price: "S/55.00",
              },
              {
                img: "https://i.pinimg.com/736x/c5/d3/54/c5d354b9d6382a66574314bc67476828.jpg",
                name: "Sueño de Chocolate Blanco",
                desc: "Esponjoso y delicado",
                price: "S/65.00",
              },
              {
                img: "https://i.pinimg.com/736x/87/57/fe/8757fe48496277e663e2acb3656a4cac.jpg",
                name: "Pastel Caramelo & Nuez",
                desc: "Dulce con un toque crocante",
                price: "S/70.00",
              },
            ].map((item, index) => (
              <article
                key={index}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  <p className="text-[#d8718c] font-bold mt-2">{item.price}</p>
                  <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ======= SECCIÓN: GALLETAS ======= */}
        <section>
          <h2 className="text-3xl font-bold text-[#9c2007] mb-6 border-b-2 border-[#f5bfb2] pb-2">
            Galletas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
  img: "https://i.pinimg.com/736x/be/07/61/be076160d1f41af3bfcd47f41caa6efb.jpg",
  name: "Besitos de Coco",
  desc: "Suaves, doradas y con un toque tropical",
  price: "S/28.00",
},
{
  img: "https://i.pinimg.com/736x/b5/02/ca/b502ca43e9eca3dcb5bf1cfc7914f13b.jpg",
  name: "Dulce Tentación de Cacao",
  desc: "Crujientes con trocitos de chocolate",
  price: "S/32.00",
},
{
  img: "https://i.pinimg.com/736x/1c/58/4f/1c584f91ef88fb4425aa3d355827534c.jpg",
  name: "Estrellitas de Vainilla",
  desc: "Decoradas con glasé rosa pastel",
  price: "S/36.00",
},

            ].map((item, index) => (
              <article
                key={index}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                  <p className="text-[#d8718c] font-bold mt-2">{item.price}</p>
                  <button className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition">
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}