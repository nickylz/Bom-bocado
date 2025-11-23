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
  const [editForm, setEditForm] = useState({
    mensaje: "",
    estrellas: 0,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la",
    "zanadrianzenbohorquez@crackthecode.la",
    "marandersonsantillan@crackthecode.la",
    "shavalerianoblas@crackthecode.la",
    "pet123@gmail.com",
  ];

  useEffect(() => {
    const q = query(
      collection(db, "testimonios"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonios(arr);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (testimonios.length <= 2) return; 
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2 >= testimonios.length ? 0 : prev + 2));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonios]);

  const esAdmin = usuarioActual && correosPermitidos.includes(usuarioActual.email.toLowerCase());

  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;

  const puedeEditarEliminar = (t) => esAdmin || esAutor(t);

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    try {
      await deleteDoc(doc(db, "testimonios", id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const comenzarEdicion = (t) => {
    if (!puedeEditarEliminar(t)) return;
    setEditId(t.id);
    setEditForm({ mensaje: t.mensaje, estrellas: t.estrellas });
  };

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

  const cancelarEdicion = () => setEditId(null);

  const visibles = testimonios.slice(currentIndex, currentIndex + 2);

  const renderStars = (rating, isEditable = false, onClick = () => {}) => (
    <div className={`flex ${isEditable ? 'my-3' : ''}`}>
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            size={isEditable ? 18 : 22}
            className={`${isEditable ? 'cursor-pointer' : ''} mr-1`}
            color={ratingValue <= rating ? PINK_COLOR : GRAY_COLOR}
            onClick={() => isEditable && onClick(ratingValue)}
          />
        );
      })}
    </div>
  );

  return (
    <section className="text-center px-6 md:px-12 py-12 bg-[#fff3f0]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-10">
        Opiniones de nuestros clientes
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto min-h-[250px]">
        {testimonios.length === 0 ? (
          <p className="text-gray-500">Aún no hay testimonios.</p>
        ) : (
          visibles.map((t) => {
            const enEdicion = editId === t.id;
            const permisos = puedeEditarEliminar(t);

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 shadow-lg w-full md:w-1/2 text-left transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-2xl text-[#7a1a0a]">
                      {t.nombre}
                    </h4>
                    {t.createdAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(t.createdAt.seconds * 1000).toLocaleDateString("es-PE")}
                      </p>
                    )}
                    {renderStars(t.estrellas)}
                  </div>

                  {permisos && (
                    <div className="flex gap-3 text-gray-500 pt-2">
                      {enEdicion ? (
                        <>
                          <button onClick={guardarEdicion} className="hover:text-green-600" title="Guardar"><FaSave size={16} /></button>
                          <button onClick={cancelarEdicion} className="hover:text-red-500" title="Cancelar"><FaTimes size={16} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => comenzarEdicion(t)} className="hover:text-blue-600" title="Editar"><FaEdit size={16} /></button>
                          <button onClick={() => eliminar(t.id)} className="hover:text-red-500" title="Eliminar"><FaTrash size={16} /></button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {enEdicion ? (
                  <>
                    <textarea
                      value={editForm.mensaje}
                      onChange={(e) => setEditForm({ ...editForm, mensaje: e.target.value })}
                      className="border rounded w-full p-2 my-2 h-20 bg-gray-50 focus:ring-2 focus:ring-[#d8718c] outline-none"
                    />
                    {renderStars(editForm.estrellas, true, (rating) => setEditForm({ ...editForm, estrellas: rating }))}
                  </>
                ) : (
                  <p className="italic text-gray-700 text-lg">“{t.mensaje}”</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
