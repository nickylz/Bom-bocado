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

export default function Testimonials() {
  const [testimonios, setTestimonios] = useState([]);

  // Estados para *editar* un testimonio
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    mensaje: "",
    estrellas: 0,
  });

  // Índice actual para rotación automática
  const [currentIndex, setCurrentIndex] = useState(0);

  // Leer en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "testimonios"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonios(arr);
    });
    return () => unsub();
  }, []);

  // Rotar testimonios cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (testimonios.length === 0) return 0;
        return prev + 2 >= testimonios.length ? 0 : prev + 2;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonios]);

  // --- Funciones CRUD ---

  // Eliminar testimonio
  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    try {
      await deleteDoc(doc(db, "testimonios", id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Empezar edición
  const comenzarEdicion = (t) => {
    setEditId(t.id);
    setEditForm({ mensaje: t.mensaje, estrellas: t.estrellas });
  };

  // Guardar cambios de edición
  const guardarEdicion = async () => {
    if (!editForm.mensaje || editForm.estrellas === 0) {
      alert("El comentario y las estrellas no pueden estar vacíos.");
      return;
    }
    try {
      const ref = doc(db, "testimonios", editId);
      await updateDoc(ref, {
        mensaje: editForm.mensaje,
        estrellas: editForm.estrellas,
        updatedAt: serverTimestamp(),
      });
      setEditId(null);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => setEditId(null);

  // Obtener los 2 testimonios que se muestran actualmente
  const visibles = testimonios.slice(currentIndex, currentIndex + 2);

  return (
    <section className="text-center px-6 md:px-12 py-12 bg-[#fffaf9]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-10">
        Opiniones de nuestros clientes
      </h2>

      <div
        className="flex flex-col md:flex-row justify-center md:items-start gap-8 max-w-4xl mx-auto min-h-[250px] transition-all duration-500"
      >
        {visibles.length === 0 ? (
          <p className="text-gray-500">Aún no hay testimonios publicados.</p>
        ) : (
          visibles.map((t) => {
            const enEdicion = editId === t.id;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 shadow-lg w-full md:w-1/2 flex flex-col justify-start text-left animate-fadeIn"
              >
                {/* CABECERA */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-[#7a1a0a]">
                      {t.nombre}
                    </h4>
                    <div className="flex">
                      {[...Array(t.estrellas)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={18}
                          color="#ffc107"
                          className="mr-1"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 text-gray-600">
                    {enEdicion ? (
                      <>
                        <button
                          onClick={guardarEdicion}
                          title="Guardar cambios"
                          className="hover:text-green-600 transition"
                        >
                          <FaSave size={14} />
                        </button>
                        <button
                          onClick={cancelarEdicion}
                          title="Cancelar edición"
                          className="hover:text-red-600 transition"
                        >
                          <FaTimes size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => comenzarEdicion(t)}
                          title="Editar comentario"
                          className="hover:text-blue-600 transition"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => eliminar(t.id)}
                          title="Eliminar comentario"
                          className="hover:text-red-600 transition"
                        >
                          <FaTrash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* CUERPO */}
                {enEdicion ? (
                  <>
                    <textarea
                      value={editForm.mensaje}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mensaje: e.target.value })
                      }
                      className="border rounded w-full p-2 my-3 text-sm h-24"
                    />
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={18}
                          className="cursor-pointer mr-1"
                          color={
                            i + 1 <= editForm.estrellas ? "#ffc107" : "#ccc"
                          }
                          onClick={() =>
                            setEditForm({ ...editForm, estrellas: i + 1 })
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="italic text-gray-700 text-sm leading-relaxed">
                    "{t.mensaje}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
