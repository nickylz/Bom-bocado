import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import RatingSummary from '../componentes/RatingSummary';
import FiltroComentarios from '../componentes/FiltroComentarios';
import DejarComentario from '../componentes/DejarComentario';

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('recientes');

  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [ratingPromedio, setRatingPromedio] = useState(0);

  // Efecto para obtener el producto
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

  // Efecto para obtener los comentarios en tiempo real
  useEffect(() => {
    if (!id) return;

    const comentariosRef = collection(db, 'comentarios');
    const q = query(comentariosRef, where('productoId', '==', id), orderBy('fecha', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComentarios(commentsData);

      if (commentsData.length > 0) {
        const totalRating = commentsData.reduce((acc, curr) => acc + curr.rating, 0);
        setRatingPromedio(totalRating / commentsData.length);
      } else {
        setRatingPromedio(0);
      }
      setLoadingComentarios(false);
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (!producto) {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }

  // Lógica de filtrado (puedes adaptarla según tus necesidades)
  const comentariosFiltrados = comentarios; // Por ahora muestra todos

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-center items-center border border-[#f5bfb2]">
          <img src={producto.imagen} alt={producto.nombre} className="w-full max-w-md h-auto object-contain rounded-2xl" />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-[#9c2007]">{producto.nombre}</h1>
          
          <RatingSummary rating={ratingPromedio} reviewCount={comentarios.length} />

          <p className="text-gray-600 text-lg">{producto.descripcion}</p>
          <p className="text-[#d8718c] font-bold text-4xl">S/{producto.precio?.toFixed(2)}</p>
          
          <button className="bg-[#a34d5f] text-white px-8 py-3 rounded-full w-full md:w-auto text-lg hover:bg-[#912646] transition shadow-md">
            Añadir al Carrito
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Opiniones del Producto</h2>
        <FiltroComentarios setFiltro={setFiltro} filtroActual={filtro} />
        <DejarComentario productoId={id} />
        
        <div className="space-y-6 mt-8">
          {loadingComentarios ? (
            <p>Cargando comentarios...</p>
          ) : comentariosFiltrados.length > 0 ? (
            comentariosFiltrados.map(comentario => (
              <div key={comentario.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="flex-shrink-0">
                  {comentario.autorFotoURL ? (
                    <img src={comentario.autorFotoURL} alt={comentario.autorNombre} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#a34d5f] flex items-center justify-center text-white font-bold text-xl">
                      {comentario.autorNombre ? comentario.autorNombre.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-gray-800">{comentario.autorNombre}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < comentario.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{comentario.texto}</p>
                  <p className="text-xs text-gray-400 mt-3 text-right">{comentario.fecha?.toDate().toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Aún no hay opiniones para este producto. ¡Sé el primero en comentar!</p>
          )}
        </div>
      </div>
    </div>
  );
}
