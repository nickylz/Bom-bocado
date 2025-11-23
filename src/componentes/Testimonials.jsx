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

export default function Testimonials() {
  const { usuarioActual } = useAuth(); // ✅ IMPORTANTE
  const [testimonios, setTestimonios] = useState([]);

  // Estados para editar
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    mensaje: "",
    estrellas: 0,
  });

  // Rotación automática
  const [currentIndex, setCurrentIndex] = useState(0);

  // Correos permitidos (admins)
  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la",
    "zanadrianzenbohorquez@crackthecode.la",
    "marandersonsantillan@crackthecode.la",
    "shavalerianoblas@crackthecode.la",
    "pet123@gmail.com",
  ];

  // Leer testimonios
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

  // Rotación cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (testimonios.length === 0) return 0;
        return prev + 2 >= testimonios.length ? 0 : prev + 2;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonios]);

  // PERMISOS
  const esAdmin = usuarioActual && correosPermitidos.includes(usuarioActual.correo.toLowerCase());

  const esAutor = (t) => usuarioActual && usuarioActual.uid === t.userUid;

  const puedeEditarEliminar = (t) => esAdmin || esAutor(t);

  // Eliminar
  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este testimonio?"))
      return;
    try {
      await deleteDoc(doc(db, "testimonios", id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Empezar edición
  const comenzarEdicion = (t) => {
    if (!puedeEditarEliminar(t)) return; // PROTECCIÓN
    setEditId(t.id);
    setEditForm({ mensaje: t.mensaje, estrellas: t.estrellas });
  };

  // Guardar edición
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

  // Cancelar
  const cancelarEdicion = () => setEditId(null);

  // Mostrar 2 testimonios
  const visibles = testimonios.slice(currentIndex, currentIndex + 2);

  return (
    <section className="text-center px-6 md:px-12 py-12 bg-[#fff3f0]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#8f2133] mb-10">
        Opiniones de nuestros clientes
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto min-h-[250px]">
        {visibles.length === 0 ? (
          <p className="text-gray-500">Aún no hay testimonios.</p>
        ) : (
          visibles.map((t) => {
            const enEdicion = editId === t.id;
            const permisos = puedeEditarEliminar(t);

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 shadow-lg w-full md:w-1/2 text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-2xl text-[#7a1a0a] ">
                      {t.nombre}
                    </h4>
                    {t.createdAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          t.createdAt.seconds * 1000
                        ).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    {/* Estrellas */}
                    <div className="flex">
                      {[...Array(t.estrellas)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={22}
                          color="#ffc107"
                          className="mr-1"
                        />
                      ))}
                    </div>
                  </div>

                  {permisos && (
                    <div className="flex gap-2 text-gray-600">
                      {enEdicion ? (
                        <>
                          <button
                            onClick={guardarEdicion}
                            className="hover:text-green-600"
                          >
                            <FaSave size={14} />
                          </button>

                          <button
                            onClick={cancelarEdicion}
                            className="hover:text-red-600"
                          >
                            <FaTimes size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => comenzarEdicion(t)}
                            className="hover:text-blue-600"
                          >
                            <FaEdit size={14} />
                          </button>

                          <button
                            onClick={() => eliminar(t.id)}
                            className="hover:text-red-600"
                          >
                            <FaTrash size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {enEdicion ? (
                  <>
                    <textarea
                      value={editForm.mensaje}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mensaje: e.target.value })
                      }
                      className="border rounded w-full p-2 my-3 h-12"
                    />

                    <div className="flex mb-3">
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
                  <p className="italic text-gray-700 text-xl">"{t.mensaje}"</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
