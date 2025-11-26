import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, query, where, onSnapshot, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/authContext';
import { useCarrito } from '../context/CarritoContext';
import { ArrowLeft } from 'lucide-react';

import RatingSummary from '../componentes/RatingSummary';
import DejarComentario from '../componentes/DejarComentario';

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual: usuario } = useAuth();
  const { agregarAlCarrito, carrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [ratingPromedio, setRatingPromedio] = useState(0);

  const [editingComment, setEditingComment] = useState({ id: null, texto: '' });

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
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

  useEffect(() => {
    if (!id) return;
    setLoadingComentarios(true);
    const q = query(collection(db, 'comentarios'), where('productoId', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const sortedComments = commentsData.sort((a, b) => {
        const dateA = a.fecha ? a.fecha.toDate() : new Date(0);
        const dateB = b.fecha ? b.fecha.toDate() : new Date(0);
        return dateB - dateA;
      });

      setComentarios(sortedComments);

      if (sortedComments.length > 0) {
        const totalRating = sortedComments.reduce((acc, curr) => acc + curr.rating, 0);
        setRatingPromedio(totalRating / sortedComments.length);
      } else {
        setRatingPromedio(0);
      }
      setLoadingComentarios(false);
    }, (error) => {
      console.error("Error al obtener comentarios: ", error);
      setLoadingComentarios(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad);
    setCantidad(1);
  };

  const handleEliminarComentario = async (comentarioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteDoc(doc(db, 'comentarios', comentarioId));
      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        alert('No se pudo eliminar el comentario.');
      }
    }
  };

  const handleActualizarComentario = async () => {
    if (editingComment.texto.trim() === '') {
      alert('El comentario no puede estar vacío.');
      return;
    }
    try {
      const comentarioRef = doc(db, 'comentarios', editingComment.id);
      await updateDoc(comentarioRef, { 
        texto: editingComment.texto,
        editado: serverTimestamp()
      });
      setEditingComment({ id: null, texto: '' });
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      alert('No se pudo actualizar el comentario.');
    }
  };
  
  const cambiarCantidad = (delta) => {
    setCantidad(prev => Math.max(1, prev + delta));
  };

  if (loading) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }
  
  const cantidadEnCarrito = carrito.find(item => item.id === producto.id)?.cantidad || 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
       <button 
        onClick={() => navigate('/productos')}
        className="absolute top-24 left-4 sm:left-6 bg-[#d8718c] text-white p-2 rounded-full hover:bg-[#a34d5f] transition shadow-md z-10"
        aria-label="Volver a productos"
      >
        <ArrowLeft size={22} />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mt-12 md:mt-0">
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex justify-center items-center border border-[#f5bfb2] aspect-square overflow-hidden max-w-lg justify-self-center w-full">
          <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover rounded-2xl" />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#9c2007]">{producto.nombre}</h1>
          <RatingSummary rating={ratingPromedio} reviewCount={comentarios.length} />
          <p className="text-gray-600 text-base sm:text-lg">{producto.descripcion}</p>
          
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <p className="text-[#d8718c] font-bold text-3xl sm:text-4xl text-center sm:text-left">S/{producto.precio?.toFixed(2)}</p>
              <div className="flex items-center justify-center gap-5 bg-rose-100 rounded-full px-4 py-1 self-center sm:self-auto">
                <button 
                  onClick={() => cambiarCantidad(-1)}
                  className="text-3xl font-bold text-[#d8718c] hover:text-[#a34d5f] transition"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-800 w-8 text-center">{cantidad}</span>
                <button 
                  onClick={() => cambiarCantidad(1)}
                  className="text-3xl font-bold text-[#d8718c] hover:text-[#a34d5f] transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handleAgregarAlCarrito}
                className="bg-[#a34d5f] hover:bg-[#912646] text-white px-8 py-3 rounded-full w-full sm:w-auto text-lg transition shadow-md"
              >
                Añadir al Carrito
              </button>
              {cantidadEnCarrito > 0 && (
                <p className="text-gray-600 font-medium bg-rose-100 px-3 py-1 rounded-full whitespace-nowrap">
                  En carrito: {cantidadEnCarrito}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Opiniones del Producto</h2>
        <DejarComentario productoId={id} />
        
        <div className="space-y-6 mt-8">
          {loadingComentarios ? (
            <p className="text-center text-gray-500 py-8">Cargando comentarios...</p>
          ) : comentarios.length > 0 ? (
            comentarios.map(comentario => {
              const puedeGestionar = usuario && (usuario.rol === 'admin' || usuario.rol === 'editor' || (comentario.autorId && usuario.uid === comentario.autorId));
              const isEditing = editingComment.id === comentario.id;

              return (
                <div key={comentario.id} className="bg-rose-50 p-4 sm:p-5 rounded-2xl shadow-sm border border-rose-100 flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    {comentario.autorFotoURL ? (
                      <img src={comentario.autorFotoURL} alt={comentario.autorNombre} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f4a1a7] flex items-center justify-center text-white font-bold text-xl">
                        {comentario.autorNombre ? comentario.autorNombre.charAt(0).toUpperCase() : '#'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <div>
                        <p className="font-bold text-gray-800">{comentario.autorNombre}</p>
                        <div className="flex items-center gap-2">
                           <p className="text-xs text-gray-400">{comentario.fecha?.toDate().toLocaleDateString('es-ES')}</p>
                           {comentario.editado && <p className="text-xs text-gray-400 italic">(editado)</p>}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < comentario.rating ? 'text-[#d8718c]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea 
                          value={editingComment.texto}
                          onChange={(e) => setEditingComment({ ...editingComment, texto: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleActualizarComentario} className="bg-[#a34d5f] text-white px-3 py-1 rounded-md text-sm">Guardar</button>
                          <button onClick={() => setEditingComment({ id: null, texto: '' })} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mt-2 text-justify">"{comentario.texto}"</p>
                    )}
                  </div>
                  {puedeGestionar && !isEditing && (
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingComment({ id: comentario.id, texto: comentario.texto })} className="text-gray-400 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                      </button>
                      <button onClick={() => handleEliminarComentario(comentario.id)} className="text-gray-400 hover:text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-8">Aún no hay opiniones para este producto. ¡Sé el primero en comentar!</p>
          )}
        </div>
      </div>
    </div>
  );
}
