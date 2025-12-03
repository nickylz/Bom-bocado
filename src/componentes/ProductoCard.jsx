import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/authContext';
import { useFavoritos } from '../context/FavoritosContext';
import { Heart } from 'lucide-react';

export default function ProductoCard({ producto, mostrarBoton = true }) {
  const { agregarAlCarrito } = useCarrito();
  const { usuarioActual } = useAuth();
  const { esFavorito, agregarAFavoritos, removerDeFavoritos } = useFavoritos();

  const isFavorito = esFavorito(producto.id);

  const handleAgregar = () => {
    agregarAlCarrito(producto);
  };

  const handleFavoritoClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFavorito) {
      removerDeFavoritos(producto.id);
    } else {
      agregarAFavoritos(producto);
    }
  };

  return (
    <div className="relative group bg-white border border-[#f5bfb2] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/productos/${producto.id}`} className="block">
        <div className="w-full aspect-square overflow-hidden rounded-t-2xl">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 text-center">
          <h3 className="font-bold text-lg text-[#7a1a0a] truncate">{producto.nombre}</h3>
          <p className="text-[#d16170] font-semibold">S/{producto.precio.toFixed(2)}</p>
        </div>
      </Link>

      {/* Botón de favoritos (corazón) */}
      {usuarioActual && (
        <button
          onClick={handleFavoritoClick}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-400 hover:text-red-500 transition-all duration-300 z-10"
          title={isFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart size={22} fill={isFavorito ? '#ef4444' : 'none'} stroke={isFavorito ? '#ef4444' : 'currentColor'}/>
        </button>
      )}

      {mostrarBoton && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAgregar}
            className="w-full bg-[#d16170] text-white py-2 rounded-xl hover:bg-[#b84c68] transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      )}
    </div>
  );
}
