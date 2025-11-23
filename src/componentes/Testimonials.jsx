import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
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
import { FaStar, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const PINK_COLOR = "#d16170";
const GRAY_COLOR = "#e4e5e9";

export default function Testimonials() {
  const { usuarioActual } = useAuth();
  const [testimonios, setTestimonios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ mensaje: "", estrellas: 0 });

  useEffect(() => {
    const q = query(collection(db, "testimonios"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonios(arr);
    });
    return () => unsub();
  }, []);

  // --- Lógica de cálculo para el resumen ---
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

  // --- Lógica de permisos y acciones ---
  const esModerador = usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'editor');
  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;
  const puedeEditarEliminar = (t) => esModerador || esAutor(t);

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    await deleteDoc(doc(db, "testimonios", id));
  };

  const comenzarEdicion = (t) => {
    setEditId(t.id);
    setEditForm({ mensaje: t.mensaje, estrellas: t.estrellas });
  };

  const guardarEdicion = async () => {
    if (!editForm.mensaje || editForm.estrellas === 0) return alert("El comentario y las estrellas no pueden estar vacíos.");
    const ref = doc(db, "testimonios", editId);
    await updateDoc(ref, { ...editForm, updatedAt: serverTimestamp() });
    setEditId(null);
  };

  const cancelarEdicion = () => setEditId(null);

  // --- Componente para renderizar estrellas ---
  const renderStars = (rating, isEditable = false, onClick = () => {}) => (
    <div className={`flex ${isEditable ? 'my-2' : ''}`}>
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={isEditable ? 22 : 18}
          className={`${isEditable ? 'cursor-pointer' : ''} mr-1`}
          color={i < rating ? PINK_COLOR : GRAY_COLOR}
          onClick={() => isEditable && onClick(i + 1)}
        />
      ))}
    </div>
  );

  return (
    <section className="px-6 md:px-12 py-12 bg-[#fff3f0]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-10 text-center">
          Opiniones de nuestros clientes
        </h2>

        {/* --- Bloque de Resumen de Calificaciones --- */}
        {totalTestimonios > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex flex-col items-center justify-center text-center md:border-r-2 border-[#f5bfb2] md:pr-8">
                <p className="text-6xl font-bold text-[#8f2133]">{averageRating.toFixed(1)}</p>
                {renderStars(averageRating)}
                <p className="text-gray-600 mt-2">{totalTestimonios} calificaciones</p>
              </div>
              <div className="w-full flex flex-col-reverse">
                {[1, 2, 3, 4, 5].map(star => (
                  <div key={star} className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-gray-700 w-16">{star} {star > 1 ? 'estrellas' : 'estrella'}</span>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div className="bg-[#d16170] h-4 rounded-full progress-bar-fill" style={{ width: `${ratingPercentages[star]}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-10 text-right">{Math.round(ratingPercentages[star])}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- Lista de Comentarios --- */}
        <div className="space-y-8">
          {testimonios.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aún no hay testimonios. ¡Sé el primero en dejar tu opinión!</p>
          ) : (
            testimonios.map((t) => {
              const enEdicion = editId === t.id;
              const permisos = puedeEditarEliminar(t);
              return (
                <div key={t.id} className="testimonial-card bg-white rounded-2xl p-6 shadow-lg text-left flex flex-col sm:flex-row gap-6 items-start transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  {/* --- AVATAR: Foto de perfil o inicial --- */}
                  <div className="flex-shrink-0">
                    {t.userPhotoURL ? (
                        <img src={t.userPhotoURL} alt={t.nombre} className="w-16 h-16 rounded-full object-cover shadow-md" />
                    ) : (
                        <div className="w-16 h-16 bg-[#f5bfb2] rounded-full flex items-center justify-center text-3xl font-bold text-[#9c2007] shadow-md">
                            {t.nombre ? t.nombre.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {/* --- NOMBRE Y FECHA (Reubicada) --- */}
                        <div className="flex items-baseline gap-3">
                            <h4 className="font-semibold text-xl text-[#7a1a0a]">{t.nombre}</h4>
                            {t.createdAt && !enEdicion && (
                                <p className="text-xs text-gray-400">
                                  {new Date(t.createdAt.seconds * 1000).toLocaleDateString("es-PE")}
                                  {t.updatedAt && <span className="text-gray-400 italic ml-2">(editado)</span>}
                                </p>
                            )}
                        </div>
                        {!enEdicion && renderStars(t.estrellas)}
                      </div>
                      {permisos && (
                        <div className="flex gap-3 text-gray-500 pt-1">
                          {enEdicion ? (
                            <>
                              <button onClick={guardarEdicion} className="hover:text-green-600"><FaSave size={18} /></button>
                              <button onClick={cancelarEdicion} className="hover:text-red-500"><FaTimes size={18} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => comenzarEdicion(t)} className="hover:text-blue-600"><FaEdit size={16} /></button>
                              <button onClick={() => eliminar(t.id)} className="hover:text-red-500"><FaTrash size={16} /></button>
                            </> 
                          )}
                        </div>
                      )}
                    </div>
                    {enEdicion ? (
                      <>
                        <textarea value={editForm.mensaje} onChange={(e) => setEditForm({ ...editForm, mensaje: e.target.value })} className="border rounded w-full p-2 my-2 h-20 bg-gray-50 focus:ring-2 focus:ring-[#d8718c] outline-none" />
                        {renderStars(editForm.estrellas, true, (r) => setEditForm({ ...editForm, estrellas: r }))}
                      </>
                    ) : (
                      <p className="text-gray-700 italic">“{t.mensaje}”</p>
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
