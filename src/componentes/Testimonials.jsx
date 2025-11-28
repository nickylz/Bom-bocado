import React, { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { FaStar, FaEdit, FaTrash, FaTimes, FaCamera, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';
import { useModal } from "../context/ModalContext";

// Importamos tus componentes
import FiltroComentarios from "./FiltroComentarios";
import RatingSummary from "./RatingSummary"; // El componente nuevo
import FormularioResena from "./FormularioResena";

const PINK_COLOR = "#d16170";
const GRAY_COLOR = "#e4e5e9";
const ITEMS_PER_PAGE = 5;

export default function Testimonials() {
  const { usuarioActual } = useAuth();
  const { mostrarModal } = useModal();
  const [testimonios, setTestimonios] = useState([]);
  
  // Estados para Edición
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ mensaje: "", estrellas: 0 });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Estado para Filtro y Paginación
  const [filtro, setFiltro] = useState('recientes');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Cargar datos de Firebase ---
  useEffect(() => {
    const q = query(collection(db, "testimonios"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonios(arr);
    });
    return () => unsub();
  }, []);

  // --- Cálculos para el RatingSummary ---
  const totalTestimonios = testimonios.length;
  const averageRating = totalTestimonios > 0 
    ? testimonios.reduce((acc, t) => acc + t.estrellas, 0) / totalTestimonios 
    : 0;

  // Contar cuántos hay de cada estrella (5, 4, 3, 2, 1)
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (totalTestimonios > 0) {
    testimonios.forEach(t => {
      if (t.estrellas >= 1 && t.estrellas <= 5) {
        ratingCounts[t.estrellas]++;
      }
    });
  }

  // --- Lógica de Paginación y Filtros ---
  const testimoniosFiltrados = testimonios.filter(testimonio => {
    if (filtro === "mis-comentarios") {
      return testimonio.userUid === usuarioActual?.uid;
    }
    return true; 
  });

  const totalPages = Math.ceil(testimoniosFiltrados.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentTestimonials = testimoniosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  // --- Lógica de Moderación (Admin/Autor) ---
  const esModerador = usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'editor');
  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;
  const puedeEditarEliminar = (t) => esModerador || esAutor(t);

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    try { await deleteDoc(doc(db, "testimonios", id)); toast.success("Testimonio eliminado"); } 
    catch { toast.error("No se pudo eliminar el testimonio") }
  };

  const comenzarEdicion = (t) => {
    setEditId(t.id);
    setEditForm({ mensaje: t.mensaje, estrellas: t.estrellas });
    setExistingImageUrls(t.imageUrls || []);
  };

  const handleNewImageFiles = (e) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (existingImageUrls.length + editImageFiles.length + fileList.length > 5) {
          toast.error("Puedes tener un máximo de 5 imágenes.");
          return;
      }
      setEditImageFiles(prev => [...prev, ...fileList]);
    }
  };

  const removeNewImage = (index) => setEditImageFiles(prev => prev.filter((_, i) => i !== index));

  const removeExistingImage = async (urlToRemove) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;
    try {
        const imageRef = ref(storage, urlToRemove);
        await deleteObject(imageRef);
        const updatedUrls = existingImageUrls.filter(url => url !== urlToRemove);
        setExistingImageUrls(updatedUrls);
        await updateDoc(doc(db, "testimonios", editId), { imageUrls: updatedUrls });
        toast.success("Imagen eliminada");
    } catch  { toast.error("Error al eliminar imagen"); }
  }

  const guardarEdicion = async () => {
    if (!editForm.mensaje || editForm.estrellas === 0) return toast.error("Campos vacíos.");
    setUploading(true);
    const loadingToast = toast.loading('Actualizando...');
    try {
        let finalImageUrls = [...existingImageUrls];
        if (editImageFiles.length > 0) {
            for (const imageFile of editImageFiles) {
                const imageRef = ref(storage, `testimonios/${editId}/${Date.now()}-${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                finalImageUrls.push(await getDownloadURL(imageRef));
            }
        }
        await updateDoc(doc(db, "testimonios", editId), { ...editForm, imageUrls: finalImageUrls, updatedAt: serverTimestamp() });
        toast.success('Actualizado', { id: loadingToast });
        cancelarEdicion();
    } catch  { toast.error('Error', { id: loadingToast }); } 
    finally { setUploading(false); }
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditForm({ mensaje: "", estrellas: 0 });
    setEditImageFiles([]);
    setExistingImageUrls([]);
  };

  // Renderizado de estrellas (helper local para la lista y edición)
  const renderStars = (rating, isEditable = false, onClick = () => {}) => (
    <div className={`flex ${isEditable ? 'my-2 justify-center text-3xl' : 'text-xl'}`}>
      {[...Array(5)].map((_, i) => (
        <FaStar 
            key={i} 
            className={`${isEditable ? 'cursor-pointer hover:scale-110' : ''} mr-1`} 
            color={i < rating ? PINK_COLOR : GRAY_COLOR} 
            onClick={() => isEditable && onClick(i + 1)} 
        />
      ))}
    </div>
  );

  return (
    <section className="px-6 md:px-12 py-12 bg-[#fff3f0] min-h-screen">
      <div className="max-w-6xl mx-auto"> 
        <h2 className="text-4xl md:text-5xl font-bold text-[#8f2133] mb-8 text-center">
          Opiniones de nuestros clientes
        </h2>

        {/* 1. Formulario de Publicar */}
        <FormularioResena />

        {/* 2. Resumen de Calificaciones (Nuevo Diseño) */}
        {totalTestimonios > 0 && (
          <RatingSummary 
            averageRating={averageRating}
            totalReviews={totalTestimonios}
            starCounts={ratingCounts}
          />
        )}

        {/* 3. Filtros */}
        <FiltroComentarios setFiltro={setFiltro} />

        {/* 4. Lista de Comentarios */}
        <div id="lista-comentarios" className="space-y-6 mt-6">
          {currentTestimonials.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-xl">
                {filtro === 'mis-comentarios' ? 'No has escrito comentarios aún.' : 'Aún no hay testimonios en esta página.'}
            </p>
          ) : (
            currentTestimonials.map((t) => {
              const enEdicion = editId === t.id;
              return (
                <div key={t.id} className="bg-white rounded-2xl p-6 shadow-md border border-rose-100 w-full transition hover:shadow-lg">
                  <div className="flex gap-4 sm:gap-6 items-start">
                      <div className="shrink-0">
                        {t.userPhotoURL ? (
                            <img src={t.userPhotoURL} alt={t.nombre} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className="w-14 h-14 bg-[#f5bfb2] rounded-full flex items-center justify-center text-2xl font-bold text-[#9c2007]">
                                {t.nombre ? t.nombre.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}
                      </div>

                      <div className="w-full">
                        {enEdicion ? (
                          /* --- MODO EDICIÓN --- */
                          <div className="bg-rose-50 p-4 rounded-xl">
                            <h4 className="font-bold text-[#d16170] mb-2">Editando comentario...</h4>
                            <textarea 
                                value={editForm.mensaje} 
                                onChange={(e) => setEditForm({ ...editForm, mensaje: e.target.value })} 
                                className="w-full border border-rose-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] bg-white resize-none" rows="3"
                            />
                            <div className="mt-2">{renderStars(editForm.estrellas, true, (r) => setEditForm({ ...editForm, estrellas: r }))}</div>
                            
                            {/* Imágenes en Edición */}
                            <div className="my-4 flex flex-wrap gap-2">
                                {existingImageUrls.map((url, i) => (
                                    <div key={i} className="relative group w-16 h-16">
                                        <img src={url} alt="p" className="w-full h-full object-cover rounded-md"/>
                                        <button onClick={() => removeExistingImage(url)} className="absolute -top-1 -right-1 bg-[#8f2133] text-white rounded-full p-1"><FaTimes size={10}/></button>
                                    </div>
                                ))}
                                {editImageFiles.map((file, i) => (
                                     <div key={i} className="relative group w-16 h-16">
                                        <img src={URL.createObjectURL(file)} alt="p" className="w-full h-full object-cover rounded-md"/>
                                        <button onClick={() => removeNewImage(i)} className="absolute -top-1 -right-1 bg-[#8f2133]-500 text-white rounded-full p-1"><FaTimes size={10}/></button>
                                    </div>
                                ))}
                                <label className="w-16 h-16 flex items-center justify-center bg-white border border-dashed border-rose-300 text-rose-400 rounded-md cursor-pointer hover:bg-rose-100">
                                    <FaCamera/>
                                    <input type="file" multiple accept="image/*" onChange={handleNewImageFiles} className="hidden"/>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button onClick={cancelarEdicion} className="text-gray-600 px-3 py-1 hover:bg-gray-200 rounded">Cancelar</button>
                                <button onClick={guardarEdicion} disabled={uploading} className="bg-[#a34d5f] text-white px-4 py-1 rounded hover:bg-[#d16170]">
                                    {uploading ? '...' : 'Guardar'}
                                </button>
                            </div>
                          </div>
                        ) : (
                          /* --- MODO VISTA NORMAL --- */
                          <>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg text-[#8f2133]">{t.nombre}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(t.estrellas)}
                                    <span className="text-xs text-gray-400 ml-2">
                                      {t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString("es-PE") : ''}
                                    </span>
                                </div>
                              </div>
                              {puedeEditarEliminar(t) && (
                                <div className="flex gap-2 text-gray-400">
                                    <button onClick={() => comenzarEdicion(t)} className="hover:text-[#8f2133] transition p-1"><FaEdit /></button>
                                    <button onClick={() => eliminar(t.id)} className="hover:text-[#8f2133] transition p-1"><FaTrash /></button>
                                </div> 
                              )}
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed">“{t.mensaje}”</p>
                            
                            {t.imageUrls && t.imageUrls.length > 0 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                    {t.imageUrls.map((url, i) => (
                                        <img 
                                            key={i} 
                                            onClick={() => mostrarModal('', <img src={url} className="max-w-full max-h-[80vh] rounded" />)} 
                                            src={url} alt="img" 
                                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition" 
                                        />
                                    ))}
                                </div>
                            )}
                          </>
                        )}
                      </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Paginación */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
                <button 
                    onClick={() => changePage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FaChevronLeft />
                </button>

                <div className="flex bg-white rounded-full shadow px-4 py-2 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => changePage(i + 1)}
                            className={`w-10 h-10 rounded-full font-bold transition duration-300 ${
                                currentPage === i + 1 
                                ? "bg-[#d16170] text-white shadow-lg scale-110" 
                                : "text-gray-500 hover:bg-rose-50 hover:text-[#d16170]"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => changePage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FaChevronRight />
                </button>
            </div>
        )}

      </div>
    </section>
  );
}