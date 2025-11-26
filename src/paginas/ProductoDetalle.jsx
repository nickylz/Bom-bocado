import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Asumiendo que tienes un archivo de configuración de firebase
import RatingSummary from '../componentes/RatingSummary'; // Componente para mostrar estrellas
import FiltroComentarios from '../componentes/FiltroComentarios'; // Componente para filtrar comentarios
import DejarComentario from '../componentes/DejarComentario'; // Componente para dejar un comentario

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('recientes'); // 'recientes' o 'mis-comentarios'

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No se encontró el producto');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (!producto) {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Columna de la imagen */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-center items-center border border-[#f5bfb2]">
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className="w-full max-w-md h-auto object-contain rounded-2xl"
          />
        </div>

        {/* Columna de detalles */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-[#9c2007]">{producto.nombre}</h1>
          
          <p className="text-gray-600 text-lg">{producto.descripcion}</p>
          
          <p className="text-[#d8718c] font-bold text-4xl">
            S/{producto.precio?.toFixed(2)}
          </p>
          
          {/* Aquí puedes agregar la lógica para añadir al carrito si lo deseas */}
          <button className="bg-[#a34d5f] text-white px-8 py-3 rounded-full w-full md:w-auto text-lg hover:bg-[#912646] transition shadow-md">
            Añadir al Carrito
          </button>
        </div>
      </div>

      {/* Sección de Comentarios */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Opiniones del Producto</h2>
        
        <FiltroComentarios setFiltro={setFiltro} filtroActual={filtro} />

        <DejarComentario />
        
        <div className="space-y-6 mt-8">
        </div>
      </div>
    </div>
  );
}
