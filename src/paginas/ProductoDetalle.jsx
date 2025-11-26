import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, collection, query, where, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/authContext'; // Importar el hook de autenticación

import RatingSummary from '../componentes/RatingSummary';
import DejarComentario from '../componentes/DejarComentario';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { usuarioActual: usuario } = useAuth(); // Obtener el usuario actual y su rol

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [ratingPromedio, setRatingPromedio] = useState(0);

  const [editingComment, setEditingComment] = useState({ id: null, texto: '' });

  // Efecto para obtener el producto
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

  // Efecto para obtener los comentarios en tiempo real
  useEffect(() => {
    if (!id) return;
    setLoadingComentarios(true);
    const q = query(collection(db, 'comentarios'), where('productoId', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar los comentarios por fecha en el lado del cliente
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
      await updateDoc(comentarioRef, { texto: editingComment.texto });
      setEditingComment({ id: null, texto: '' }); // Salir del modo edición
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      alert('No se pudo actualizar el comentario.');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="text-center py-20">Producto no encontrado</div>;
  }

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
        <DejarComentario productoId={id} />
        
        <div className="space-y-6 mt-8">
          {loadingComentarios ? (
            <p className="text-center text-gray-500 py-8">Cargando comentarios...</p>
          ) : comentarios.length > 0 ? (
            comentarios.map(comentario => {
              const puedeGestionar = usuario && (usuario.rol === 'admin' || usuario.rol === 'editor' || (comentario.autorId && usuario.uid === comentario.autorId));
              const isEditing = editingComment.id === comentario.id;

              return (
                <div key={comentario.id} className="bg-rose-50 p-5 rounded-2xl shadow-sm border border-rose-100 flex gap-4 items-start">
                  <div className="shrink-0 pt-1">
                    {comentario.autorFotoURL ? (
                      <img src={comentario.autorFotoURL} alt={comentario.autorNombre} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#f4a1a7] flex items-center justify-center text-white font-bold text-xl">
                        {comentario.autorNombre ? comentario.autorNombre.charAt(0).toUpperCase() : '#'}
                      </div>
                    )}
                  </div>
                  <div className="grow">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-bold text-gray-800">{comentario.autorNombre}</p>
                        <p className="text-xs text-gray-400">{comentario.fecha?.toDate().toLocaleDateString('es-ES')}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < comentario.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
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
