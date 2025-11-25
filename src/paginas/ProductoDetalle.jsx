import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Asumiendo que tienes un archivo de configuración de firebase
import RatingSummary from '../componentes/RatingSummary'; // Componente para mostrar estrellas
import FiltroComentarios from '../componentes/FiltroComentarios'; // Componente para filtrar comentarios

// Mock de comentarios (luego se reemplazará con datos de Firebase)
const mockComentarios = [
  {
    id: 1,
    autor: 'Juan Pérez',
    calificacion: 5,
    texto: '¡Excelente producto! Me encantó la calidad y el sabor.',
    fecha: '2024-07-20',
    esMio: false,
  },
  {
    id: 2,
    autor: 'Ana Gómez',
    calificacion: 4,
    texto: 'Muy bueno, aunque el empaque podría mejorar.',
    fecha: '2024-07-18',
    esMio: true, // Para el filtro "Mis Comentarios"
  },
  {
    id: 3,
    autor: 'Carlos Ruiz',
    calificacion: 5,
    texto: '¡De los mejores postres que he probado! Totalmente recomendado.',
    fecha: '2024-07-15',
    esMio: false,
  },
];

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
  
  const comentariosFiltrados = mockComentarios.filter(c => 
    filtro === 'mis-comentarios' ? c.esMio : true
  );

  // Cálculo del rating promedio y conteo de comentarios
  const totalComentarios = mockComentarios.length;
  const ratingPromedio = totalComentarios > 0 
    ? mockComentarios.reduce((acc, curr) => acc + curr.calificacion, 0) / totalComentarios
    : 0;

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
          
          <RatingSummary rating={ratingPromedio} reviewCount={totalComentarios} />

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
        
        <div className="space-y-6 mt-8">
          {comentariosFiltrados.map(comentario => (
            <div key={comentario.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-800">{comentario.autor}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < comentario.calificacion ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{comentario.texto}</p>
              <p className="text-xs text-gray-400 mt-3 text-right">{comentario.fecha}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
