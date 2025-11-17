// TestimoniosAdmin.jsx
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../context/authContext";

export function TestimoniosAdmin() {
  const { usuarioActual } = useAuth();

  const [testimonios, setTestimonios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
    estrellas: 0,
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    mensaje: "",
    estrellas: 0,
  });

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la",
    "zanadrianzenbohorquez@crackthecode.la",
    "marandersonsantillan@crackthecode.la",
    "shavalerianoblas@crackthecode.la",
    "",
  ];

  useEffect(() => {
    const q = query(collection(db, "testimonios"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTestimonios(arr);
    });
    return () => unsubscribe();
  }, []);

  const guardarTestimonio = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.mensaje || form.estrellas === 0) {
      alert("Completa todos los campos antes de guardar");
      return;
    }

    try {
      await addDoc(collection(db, "testimonios"), {
        ...form,
        createdAt: serverTimestamp(),
        userUid: usuarioActual?.uid || null,
        userCorreo: usuarioActual?.email || null,
      });

      setForm({ nombre: "", correo: "", mensaje: "", estrellas: 0 });
    } catch (err) {
      console.error("Error al guardar testimonio:", err);
    }
  };

  const eliminarTestimonio = async (id) => {
    if (!window.confirm("¿Eliminar este testimonio?")) return;

    try {
      await deleteDoc(doc(db, "testimonios", id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const comenzarEdicion = (t) => {
    setEditId(t.id);
    setEditForm({
      nombre: t.nombre,
      mensaje: t.mensaje,
      estrellas: t.estrellas,
    });
  };

  const guardarEdicion = async () => {
    try {
      const ref = doc(db, "testimonios", editId);
      await updateDoc(ref, {
        ...editForm,
        updatedAt: serverTimestamp(),
      });
      setEditId(null);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  const cancelarEdicion = () => setEditId(null);

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#8f2133]">
        Administrar Testimonios
      </h1>

      <form onSubmit={guardarTestimonio} className="space-y-3 mb-10">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border rounded p-2 w-full"
        />

        <input
          type="email"
          placeholder="Correo (opcional)"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="border rounded p-2 w-full"
        />

        <textarea
          placeholder="Comentario del cliente"
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          className="border rounded p-2 w-full"
        ></textarea>

        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={24}
              className="cursor-pointer"
              color={i + 1 <= form.estrellas ? "#ffc107" : "#ccc"}
              onClick={() => setForm({ ...form, estrellas: i + 1 })}
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#a34d5f] text-white px-6 py-2 rounded hover:bg-[#9c2007]"
        >
          Guardar Testimonio
        </button>
      </form>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Testimonios Recientes</h3>

        {testimonios.length === 0 ? (
          <p>No hay testimonios aún.</p>
        ) : (
          <ul className="space-y-4">
            {testimonios.map((t) => {
              const enEdicion = editId === t.id;

              const correoUsuario = usuarioActual?.email?.toLowerCase().trim();

              const esAdmin =
                usuarioActual && correosPermitidos.includes(correoUsuario);

              const esAutor =
                usuarioActual && usuarioActual.uid === t.userUid;

              const puedeEditarEliminar = esAdmin || esAutor;

              return (
                <li
                  key={t.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="w-full">
                    {enEdicion ? (
                      <>
                        <input
                          type="text"
                          value={editForm.nombre}
                          onChange={(e) =>
                            setEditForm({ ...editForm, nombre: e.target.value })
                          }
                          className="border rounded p-1 w-full mb-2"
                        />

                        <textarea
                          value={editForm.mensaje}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              mensaje: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-full mb-2"
                        />

                        <div className="flex space-x-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={22}
                              className="cursor-pointer"
                              color={
                                i + 1 <= editForm.estrellas
                                  ? "#ffc107"
                                  : "#ccc"
                              }
                              onClick={() =>
                                setEditForm({
                                  ...editForm,
                                  estrellas: i + 1,
                                })
                              }
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-lg text-[#7a1a0a]">
                          {t.nombre}
                        </h4>
                        <p className="italic text-gray-600 mb-2">
                          "{t.mensaje}"
                        </p>

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
                      </>
                    )}
                  </div>

                  {puedeEditarEliminar && (
                    <div className="flex flex-col gap-2 ml-4">
                      {enEdicion ? (
                        <>
                          <button
                            onClick={guardarEdicion}
                            className="text-green-600"
                          >
                            💾
                          </button>

                          <button
                            onClick={cancelarEdicion}
                            className="text-red-600"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => comenzarEdicion(t)}
                          className="text-blue-600"
                        >
                          ✏️
                        </button>
                      )}

                      <button
                        onClick={() => eliminarTestimonio(t.id)}
                        className="text-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}