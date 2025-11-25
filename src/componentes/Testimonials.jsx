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
import { FaStar, FaEdit, FaTrash, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';
import { useModal } from "../context/ModalContext";

const PINK_COLOR = "#d16170";
const GRAY_COLOR = "#e4e5e9";

export default function Testimonials() {
  const { usuarioActual } = useAuth();
  const { mostrarModal } = useModal();
  const [testimonios, setTestimonios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ mensaje: "", estrellas: 0 });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "testimonios"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonios(arr);
    });
    return () => unsub();
  }, []);

  const totalTestimonios = testimonios.length;
  const averageRating = totalTestimonios > 0 ? testimonios.reduce((acc, t) => acc + t.estrellas, 0) / totalTestimonios : 0;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (totalTestimonios > 0) {
    testimonios.forEach(t => {
      if (t.estrellas >= 1 && t.estrellas <= 5) {
        ratingCounts[t.estrellas]++;
      }
    });
  }
  const ratingPercentages = {
    5: totalTestimonios > 0 ? (ratingCounts[5] / totalTestimonios) * 100 : 0,
    4: totalTestimonios > 0 ? (ratingCounts[4] / totalTestimonios) * 100 : 0,
    3: totalTestimonios > 0 ? (ratingCounts[3] / totalTestimonios) * 100 : 0,
    2: totalTestimonios > 0 ? (ratingCounts[2] / totalTestimonios) * 100 : 0,
    1: totalTestimonios > 0 ? (ratingCounts[1] / totalTestimonios) * 100 : 0,
  };

  const esModerador = usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'editor');
  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;
  const puedeEditarEliminar = (t) => esModerador || esAutor(t);

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    try {
        await deleteDoc(doc(db, "testimonios", id));
        toast.success("Testimonio eliminado");
    } catch { toast.error("No se pudo eliminar el testimonio") }
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

  const removeNewImage = (index) => {
    setEditImageFiles(prev => prev.filter((_, i) => i !== index));
  }

  const removeExistingImage = async (urlToRemove) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta imagen?")) return;
    try {
        const imageRef = ref(storage, urlToRemove);
        await deleteObject(imageRef);
        const updatedUrls = existingImageUrls.filter(url => url !== urlToRemove);
        setExistingImageUrls(updatedUrls);

        const docRef = doc(db, "testimonios", editId);
        await updateDoc(docRef, { imageUrls: updatedUrls });

        toast.success("Imagen eliminada con éxito");
    } catch (error) {
        toast.error("No se pudo eliminar la imagen");
        console.error(error);
    }
  }

  const guardarEdicion = async () => {
    if (!editForm.mensaje || editForm.estrellas === 0) return toast.error("El comentario y las estrellas no pueden estar vacíos.");
    setUploading(true);
    const loadingToast = toast.loading('Actualizando testimonio...');

    try {
        let finalImageUrls = [...existingImageUrls];
        if (editImageFiles.length > 0) {
            toast.loading('Subiendo nuevas imágenes...', { id: loadingToast });
            for (const imageFile of editImageFiles) {
                const imageRef = ref(storage, `testimonios/${editId}/${Date.now()}-${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                const url = await getDownloadURL(imageRef);
                finalImageUrls.push(url);
            }
        }

        const docRef = doc(db, "testimonios", editId);
        await updateDoc(docRef, {
            ...editForm,
            imageUrls: finalImageUrls,
            updatedAt: serverTimestamp(),
        });

        toast.success('Testimonio actualizado', { id: loadingToast });
        cancelarEdicion();
    } catch (error) {
        console.error(error);
        toast.error('No se pudo actualizar', { id: loadingToast });
    } finally {
        setUploading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditForm({ mensaje: "", estrellas: 0 });
    setEditImageFiles([]);
    setExistingImageUrls([]);
  };

  const renderStars = (rating, isEditable = false, onClick = () => {}) => (
    <div className={`flex ${isEditable ? 'my-2 justify-center text-3xl' : 'text-xl'}`}>
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${isEditable ? 'cursor-pointer transition-transform hover:scale-110' : ''} mr-1`}
          color={i < rating ? PINK_COLOR : GRAY_COLOR}
          onClick={() => isEditable && onClick(i + 1)}
        />
      ))}
    </div>
  );

  return (
    <section className="px-6 md:px-12 py-12 bg-[#fff3f0]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-10 text-center">
          Opiniones de nuestros clientes
        </h2>

        {totalTestimonios > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-12 border border-rose-100">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex flex-col items-center justify-center text-center md:border-r-2 border-[#f5bfb2] md:pr-8">
                <p className="text-6xl font-bold text-[#8f2133]">{averageRating.toFixed(1)}</p>
                {renderStars(averageRating)}
                <p className="text-gray-600 mt-2">{totalTestimonios} {totalTestimonios > 1 ? 'calificaciones' : 'calificación'}</p>
              </div>
              <div className="w-full flex flex-col-reverse gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-16">{star} {star > 1 ? 'estrellas' : 'estrella'}</span>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div className="bg-[#d16170] h-4 rounded-full" style={{ width: `${ratingPercentages[star]}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-10 text-right">{Math.round(ratingPercentages[star])}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {testimonios.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aún no hay testimonios. ¡Sé el primero en dejar tu opinión!</p>
          ) : (
            testimonios.map((t) => {
              const enEdicion = editId === t.id;
              return (
                <div key={t.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg text-left flex gap-4 sm:gap-6 items-start border border-rose-100">
                  <div className="shrink-0">
                    {t.userPhotoURL ? (
                        <img src={t.userPhotoURL} alt={t.nombre} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-md" />
                    ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f5bfb2] rounded-full flex items-center justify-center text-xl sm:text-3xl font-bold text-[#9c2007] shadow-md">
                            {t.nombre ? t.nombre.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                  </div>

                  <div className="w-full">
                    {enEdicion ? (
                      <div>
                        <textarea value={editForm.mensaje} onChange={(e) => setEditForm({ ...editForm, mensaje: e.target.value })} className="w-full border border-rose-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#d8718c] resize-none transition" rows="3"/>
                        {renderStars(editForm.estrellas, true, (r) => setEditForm({ ...editForm, estrellas: r }))}
                        
                        <div className="my-4">
                            <h4 className="font-semibold text-sm text-gray-600 mb-3">Imágenes</h4>
                            <div className="flex flex-wrap gap-3 items-center">
                                {existingImageUrls.map((url, i) => (
                                    <div key={i} className="relative group">
                                        <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow-md"/>
                                        <button onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><FaTimes size={12}/></button>
                                    </div>
                                ))}
                                {editImageFiles.map((file, i) => (
                                     <div key={i} className="relative group">
                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow-md"/>
                                        <button onClick={() => removeNewImage(i)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><FaTimes size={12}/></button>
                                    </div>
                                ))}
                                {(existingImageUrls.length + editImageFiles.length < 5) && (
                                    <label htmlFor="new-images" className="w-24 h-24 flex flex-col items-center justify-center gap-1 bg-rose-50 border-2 border-dashed border-rose-200 text-rose-400 rounded-lg cursor-pointer hover:bg-rose-100 hover:text-[#d16170]"><FaCamera size={20}/> <span className="text-xs font-semibold">Añadir</span></label>
                                )}
                                <input type="file" id="new-images" multiple accept="image/*" onChange={handleNewImageFiles} className="hidden"/>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={cancelarEdicion} className="font-semibold text-gray-600 hover:text-gray-800">Cancelar</button>
                            <button onClick={guardarEdicion} disabled={uploading} className="font-semibold bg-[#a34d5f] text-white px-5 py-2 rounded-lg hover:bg-[#9c2007] transition disabled:bg-gray-400">{uploading ? 'Guardando...' : 'Guardar'}</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h4 className="font-bold text-lg text-[#7a1a0a]">{t.nombre}</h4>
                                {t.createdAt && (
                                    <p className="text-xs text-gray-500">
                                      {new Date(t.createdAt.seconds * 1000).toLocaleDateString("es-PE")}
                                      {t.updatedAt && <span className="italic ml-2">(editado)</span>}
                                    </p>
                                )}
                            </div>
                            {renderStars(t.estrellas)}
                          </div>
                          {puedeEditarEliminar(t) && (
                            <div className="flex gap-4 text-gray-500 pt-1 mt-2 sm:mt-0 self-end sm:self-auto">
                                <button onClick={() => comenzarEdicion(t)} className="hover:text-blue-600"><FaEdit size={16} /></button>
                                <button onClick={() => eliminar(t.id)} className="hover:text-red-500"><FaTrash size={16} /></button>
                            </div> 
                          )}
                        </div>
                        <p className="text-gray-700 my-3 italic">“{t.mensaje}”</p>
                        {t.imageUrls && t.imageUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {t.imageUrls.map((url, i) => (
                                    <div key={i} onClick={() => mostrarModal('', <img src={url} alt="Testimonio" className="w-full rounded-lg" />)} className="cursor-pointer">
                                      <img src={url} alt={`Imagen de testimonio ${i + 1}`} className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow" />
                                    </div>
                                ))}
                            </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
