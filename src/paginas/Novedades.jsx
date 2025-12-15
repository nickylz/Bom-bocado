import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';
import ProductoCard from "../componentes/ProductoCard";
import incono from "../componentes/img/Bom.png";

const fallbackFavoritos = [
  { id: "fav-1", nombre: "Tarta Mix", descripcion: "Refrescante y cremosa", precio: 40.00, imagen: "https://i.pinimg.com/736x/4c/07/44/4c07447203a816cbb5a470fbe7d14ee9.jpg" },
  { id: "fav-2", nombre: "Tiramisú Clásico", descripcion: "Con café y mascarpone", precio: 28.00, imagen: "https://www.tasteofhome.com/wp-content/uploads/2024/11/EXPS_TOHD24_25469_EricKleinberg_6.jpg" },
  { id: "fav-3", nombre: "Fresas Glaseadas", descripcion: "Suaves y crocantes", precio: 12.00, imagen: "https://i.pinimg.com/1200x/3d/1e/ca/3d1eca4db29ad0f033fbb03c2165132e.jpg" },
  { id: "fav-4", nombre: "Bombones de Frambuesa", descripcion: "Rellenos con centro frutal", precio: 18.00, imagen: "https://i.pinimg.com/736x/83/27/51/832751dc0d1881d6467a3ec67e9501c8.jpg" },
  { id: "fav-5", nombre: "Mousse de Fresa", descripcion: "Ligero y tropical", precio: 22.00, imagen: "https://images.getrecipekit.com/20220607111638-mousse-de-fresa.jpg?aspect_ratio=4:3&quality=90&" },
];

const fallbackNuevos = [
  { id: "new-1", nombre: "Cake Cups", descripcion: "Tortas para no compartir", precio: 15, imagen: "https://i.pinimg.com/1200x/9e/ac/95/9eac9596987b7659316f2a1318be55f1.jpg" },
  { id: "new-2", nombre: "Volcan Amargo", descripcion: "Erupción de chocolate", precio: 55, imagen: "https://i.pinimg.com/736x/59/fe/65/59fe65e34318652d0ebeb6cba6b801f0.jpg" },
  { id: "new-3", nombre: "Mini Pavlovas", descripcion: "Merengue con crema y frutos rojos", precio: 12, imagen: "https://i.pinimg.com/736x/b5/4b/82/b54b82799dabc0c3b13455e0c51e46c5.jpg" },
  { id: "new-4", nombre: "Tarta de Ensueño", descripcion: "Tortas sin horno", precio: 15, imagen: "https://i.pinimg.com/736x/de/82/3e/de823e28d3007eda4e34344e53aaf915.jpg" },
  { id: "new-5", nombre: "Explosión Helada", descripcion: "Explosiones de sabor", precio: 9, imagen: "https://i.pinimg.com/736x/73/4b/2b/734b2bddac1c16fa597681ed83d17b53.jpg" },
];

const Shape = ({ className }) => <div className={`absolute ${className}`}></div>;

export default function Novedades() {
  const [productos, setProductos] = useState([]);
  const [postreDelMes, setPostreDelMes] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "productos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(lista);
      
      const postre = lista.find(p => p.postreDelMes === true);
      setPostreDelMes(postre);
    });
    return () => unsubscribe();
  }, []);

  const productosTemporada = productos.filter(p => p.categoria === "Temporada");
  const favoritosFirebase = productos.filter(p => p.favorito === true);
  const nuevosFirebase = productos.filter(p => p.nuevo === true);

  const favoritos = favoritosFirebase.length > 0 ? favoritosFirebase : fallbackFavoritos;
  const productosNuevos = nuevosFirebase.length > 0 ? nuevosFirebase : fallbackNuevos;

  const renderProductos = (items, { mostrarBoton = true, mostrarFavoritos = true, esEnlace = true } = {}) =>
    items.map((item) => (
      <ProductoCard 
        key={item.id} 
        producto={item} 
        mostrarBoton={mostrarBoton} 
        mostrarFavoritos={mostrarFavoritos}
        esEnlace={esEnlace}
      />
    ));

  const renderCarrusel = (items, { mostrarBoton = true, mostrarFavoritos = true, esEnlace = true } = {}) => (
    <div className="overflow-hidden relative">
      <div className="flex gap-8 animate-scroll">
        {items.concat(items).map((item, index) => (
          <div key={`${item.id}-${index}`} className="w-80 shrink-0">
            <ProductoCard 
              producto={item} 
              mostrarBoton={mostrarBoton} 
              mostrarFavoritos={mostrarFavoritos}
              esEnlace={esEnlace}
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute top-0 left-0 w-20 h-full bg-linear-to-r from-[#fff3f0] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-20 h-full bg-linear-to-l from-[#fff3f0] to-transparent z-10" />
    </div>
  );

  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      <section className="relative w-full min-h-[60vh] md:min-h-[75vh] flex items-center justify-center text-center px-4 py-20 bg-[#d16170] text-white overflow-hidden">
        <Shape className="bg-[#f5bfb2]/30 w-24 h-24 top-20 left-10 animate-pulse-slow" />
        <Shape className="bg-white/20 w-48 h-48 bottom-10 right-10 animate-spin-slow" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          <div className="hidden lg:block bg-transparent p-3">
            <img
              src={incono}
              alt="Logo Bom Bocado"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
            />
          </div>
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight" style={{ fontFamily: 'serif' }}>
              Descubre lo <br />
              <span className="text-[#f5bfb2]">Nuevo</span> y delicioso.
            </h1>
            <p className="mt-6 text-lg text-[#fff3f0] leading-relaxed">
             En <span className="font-semibold text-white">Bom Bocado</span>, nos encanta sorprenderte. Explora nuestras últimas creaciones y los postres de temporada que hemos preparado con mucho cariño para ti.
            </p>
          </div>
        </div>
      </section>

      {/* --- Postre del Mes -- */}
      {postreDelMes && (
        <section className="py-20 bg-[#fdecdf]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-xl font-semibold text-[#d16170]">Postre del Mes</h2>
                <h3 className="text-4xl font-bold text-[#9c2007] mt-2">{postreDelMes.nombre}</h3>
                <p className="mt-4 text-gray-600 text-lg">{postreDelMes.descripcion}</p>
                <div className="mt-6">
                  <Link to={`/productos/${postreDelMes.id}`} className="mt-4 inline-block bg-[#9c2007] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#7a1a0a] transition-colors">
                    Ver más
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2 h-80 lg:h-auto rounded-2xl overflow-hidden shadow-lg">
                <img src={postreDelMes.imagen} alt={postreDelMes.nombre} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-2">Productos de Temporada</h2>
            {productosTemporada.length > 0 ? (productosTemporada.length > 4 ? renderCarrusel(productosTemporada) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{renderProductos(productosTemporada)}</div>) : (<p className="text-center text-gray-500 mt-10">De momento no hay productos de temporada. ¡Vuelve pronto!</p>)}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-2">Los favoritos de la casa ♡</h2>
            {favoritos.length > 0 ? (favoritos.length > 4 ? renderCarrusel(favoritos) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{renderProductos(favoritos)}</div>) : (<p className="text-center text-gray-500 mt-10">Aún estamos eligiendo a nuestros favoritos. ¡Vuelve pronto!</p>)}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-[#9c2007] mb-8 border-b-2 border-[#f5bfb2] pb-2">Próximamente</h2>
            {productosNuevos.length > 0 ? (productosNuevos.length > 4 ? renderCarrusel(productosNuevos, { mostrarBoton: false, mostrarFavoritos: false, esEnlace: false }) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{renderProductos(productosNuevos, { mostrarBoton: false, mostrarFavoritos: false, esEnlace: false })}</div>) : (<p className="text-center text-gray-500 mt-10">Estamos horneando nuevas sorpresas. ¡Espéralas!</p>)}
          </section>
        </div>
      </main>

            <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
