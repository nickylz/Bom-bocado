import React, { useState } from "react";

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
    Tartas: [
      {
        nombre: "Tarta Mix",
        descripcion: "Refrescante y cremosa",
        precio: "S/40.00",
        imagen:
          "https://i.pinimg.com/736x/4c/07/44/4c07447203a816cbb5a470fbe7d14ee9.jpg",
      },
      {
        nombre: "Tarta de Frutos Rojos",
        descripcion: "Colorida y natural",
        precio: "S/45.00",
        imagen:
          "https://i.pinimg.com/1200x/7d/4a/61/7d4a613407354b6162116ff49940c4a4.jpg",
      },
      {
        nombre: "Tarta Intensa",
        descripcion: "Perfecta para los amantes del cacao",
        precio: "S/48.00",
        imagen:
          "https://i.pinimg.com/1200x/f0/e9/ec/f0e9ec675bb018f291c387e0e7e5cccf.jpg",
      },
      {
        nombre: "Tarta Bom",
        descripcion: "La combinacion perfecta",
        precio: "S/48.00",
        imagen:
          "https://i.pinimg.com/736x/7d/4c/5e/7d4c5e70f7af3312fb210e35e1df8812.jpg",
      },
    ],
    Bombones: [
      {
        nombre: "Bombones de Frambuesa",
        descripcion: "Rellenos con centro frutal",
        precio: "S/18.00 (6u)",
        imagen:
          "https://i.pinimg.com/736x/83/27/51/832751dc0d1881d6467a3ec67e9501c8.jpg",
      },
      {
        nombre: "Bombones de Café",
        descripcion: "Cobertura de chocolate amargo",
        precio: "S/20.00 (6u)",
        imagen:
          "https://i.pinimg.com/1200x/60/a3/c0/60a3c08d627bf10bb9a47f303ea77708.jpg",
      },
      {
        nombre: "Macarons",
        descripcion: "Crujientes por fuera y con relleno de fresa",
        precio: "S/25.00 (6u)",
        imagen:
          "https://i.pinimg.com/1200x/8a/c7/db/8ac7dba6e7683598c0e3e972c0040888.jpg",
      },
      {
        nombre: "BomCorazon",
        descripcion: "Una explocion de sabor",
        precio: "S/25.00 (5u)",
        imagen:
          "https://i.pinimg.com/736x/a9/f2/97/a9f297b5bfa18907f0659a93e5f0c65b.jpg",
      },
    ],
    "Postres Fríos": [
      {
        nombre: "Mousse de Fresa",
        descripcion: "Ligero y tropical",
        precio: "S/22.00",
        imagen:
          "https://images.getrecipekit.com/20220607111638-mousse-de-fresa.jpg?aspect_ratio=4:3&quality=90&",
      },
      {
        nombre: "Tiramisú Clásico",
        descripcion: "Con café y mascarpone",
        precio: "S/28.00",
        imagen:
          "https://www.tasteofhome.com/wp-content/uploads/2024/11/EXPS_TOHD24_25469_EricKleinberg_6.jpg",
      },
      {
        nombre: "Gelatina de Fresas Naturales",
        descripcion: "Refrescante y ligera",
        precio: "S/10.00",
        imagen:
          "https://campograndeperu.com/wp-content/uploads/2024/03/gelatina-de-fresa-natural-1-1024x684.jpg",
      },
      {
        nombre: "Panna Cotta de Frutos Rojos",
        descripcion: "Nuevo y refrescante",
        precio: "S/15.00",
        imagen:"https://i.pinimg.com/736x/3c/61/cb/3c61cba237f52567d5942cfa3fbe947b.jpg",
      }
    ],
  };
  const [busqueda, setBusqueda] = useState("");
  const [minPrecio, setMinPrecio] = useState("");
  const [maxPrecio, setMaxPrecio] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  const categorias = ["Todos", ...Object.keys(postres)];
  
  const convertirPrecio = (precioStr) => {
    if (!precioStr) return NaN;
    const match = precioStr.match(/[\d]+[.,]?\d*/);
    if (!match) return NaN;
    return parseFloat(match[0].replace(",", "."));
  };


  const minNum = minPrecio === "" ? null : parseFloat(minPrecio);
  const maxNum = maxPrecio === "" ? null : parseFloat(maxPrecio);


  const postresFiltrados = Object.entries(postres)
    .filter(([categoria]) => (categoriaSeleccionada === "Todos" ? true : categoria === categoriaSeleccionada))
    .map(([categoria, items]) => {
      const itemsFiltrados = items.filter((item) => {
        const precio = convertirPrecio(item.precio); 
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const sinLimite = minNum === 0 && maxNum === 0;
        const pasaMin = sinLimite || minNum === null ? true : !Number.isNaN(precio) && precio >= minNum;
        const pasaMax = sinLimite || maxNum === null ? true : !Number.isNaN(precio) && precio <= maxNum;
        return coincideNombre && pasaMin && pasaMax;
      });
      return [categoria, itemsFiltrados];
    })
    .filter(([, items]) => items.length > 0);

  return (
    <div className="p-8 space-y-12 bg-rose-50 min-h-screen">
      <h1 className="text-4xl font-bold text-rose-800 text-center mb-8">Nuestros Postres</h1>

      {/* filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-rose-300 rounded-lg px-4 py-2 w-52"
        />

        <input
          type="number"
          placeholder="Min S/"
          value={minPrecio}
          onChange={(e) => setMinPrecio(e.target.value)}
          className="border border-rose-300 rounded-lg px-4 py-2 w-28 text-center"
          step="0.01"
          min="0"
        />
        <input
          type="number"
          placeholder="Max S/"
          value={maxPrecio}
          onChange={(e) => setMaxPrecio(e.target.value)}
          className="border border-rose-300 rounded-lg px-4 py-2 w-28 text-center"
          step="0.01"
          min="0"
        />

        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="border border-rose-300 rounded-lg px-4 py-2"
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {postresFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No se encontraron postres 😢</p>
      ) : (
        postresFiltrados.map(([categoria, items]) => (
          <section key={categoria}>
            <h2 className="text-2xl font-semibold text-rose-800 mb-6 border-b-2 border-rose-300 pb-2">{categoria}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-56 object-cover" />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-rose-700">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">{item.descripcion}</p>
                    <div className="text-rose-800 font-bold mt-2">{item.precio}</div>
                    <button className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition">Comprar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
