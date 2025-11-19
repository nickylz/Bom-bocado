import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/authContext";

export default function Perfil() {
  const { usuarioActual } = useAuth();        // ← lo que tú guardas en el contexto
  const user = usuarioActual;

  const [compras, setCompras] = useState([]);
  const [cargandoCompras, setCargandoCompras] = useState(true);

  // Estos 3 deben coincidir con tu colección "usuarios"
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoURL, setFotoURL] = useState("");

  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // ==========================
  //   CARGAR COMPRAS
  // ==========================
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "pedidos"),
      where("userId", "==", user.uid),     // aquí usas userId en pedidos
      orderBy("fechaCreacion", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompras(lista);
        setCargandoCompras(false);
      },
      (error) => {
        console.error("Error obteniendo compras:", error);
        setCargandoCompras(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ==========================
  //   CARGAR PERFIL
  // ==========================
  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;
      setCargandoPerfil(true);
      try {
        const refUser = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refUser);

        if (snap.exists()) {
          const data = snap.data();
          // CAMPOS QUE TIENES EN FIRESTORE
          setNombre(data.user || user.user || "");
          setCorreo(data.correo || user.correo || user.email || "");
          setFotoURL(data.fotoURL || user.fotoURL || user.photoURL || "");
        } else {
          // Por si no existiera doc en "usuarios"
          setNombre(user.user || user.displayName || "");
          setCorreo(user.correo || user.email || "");
          setFotoURL(user.fotoURL || user.photoURL || "");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("Error al cargar los datos del perfil");
      } finally {
        setCargandoPerfil(false);
      }
    };

    cargarDatos();
  }, [user]);

  // ==========================
  //   GUARDAR PERFIL
  // ==========================
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!user) return;

    setGuardando(true);
    try {
      const refUser = doc(db, "usuarios", user.uid);
      await updateDoc(refUser, {
        user: nombre || "Usuario",
        correo: correo || user.correo || user.email,
        fotoURL: fotoURL || "",
      });

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
      return date.toLocaleString();
    } catch {
      return "";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">
          Debes iniciar sesión para ver tu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff3f0] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-[#8f2133] mb-6 text-center">
          Mi perfil
        </h1>

        {/* CABECERA PERFIL */}
        <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mb-8 shadow-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c]">
            <img
              src={
                fotoURL ||
                user.fotoURL ||
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#7a1a0a]">
              {nombre || user.user || user.displayName || "Usuario"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {correo || user.correo || user.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              UID: <span className="font-mono">{user.uid}</span>
            </p>
          </div>
        </div>

        {/* GRID DOS COLUMNAS: EDITAR PERFIL / MIS COMPRAS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* EDITAR PERFIL */}
          <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">
              Editar perfil
            </h2>
            <p className="text-sm text-[#7a1a0a] mb-4">
              Actualiza tu información de usuario.
            </p>

            {cargandoPerfil ? (
              <p className="text-[#7a1a0a] font-semibold">Cargando datos...</p>
            ) : (
              <form onSubmit={handleGuardar} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                    placeholder="Tu nombre de usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                    Correo
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                    placeholder="tu@correo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#7a1a0a] mb-1">
                    Foto de perfil (URL)
                  </label>
                  <input
                    type="text"
                    value={fotoURL}
                    onChange={(e) => setFotoURL(e.target.value)}
                    className="w-full bg-white border border-[#f5bfb2] px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#d8718c] outline-none"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes pegar aquí el link de la imagen subida a Storage.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full mt-2 bg-[#d16170] text-white py-2.5 rounded-xl hover:bg-[#b84c68] transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            )}
          </div>

          {/* MIS COMPRAS (dejé igual porque ya estaba bien) */}
          <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#7a1a0a] mb-2">
              Mis compras
            </h2>
            <p className="text-sm text-[#7a1a0a] mb-4">
              Aquí puedes ver tus pedidos realizados.
            </p>

            {cargandoCompras ? (
              <p className="text-[#7a1a0a] font-semibold">Cargando compras...</p>
            ) : compras.length === 0 ? (
              <p className="text-gray-600 mt-2">
                Aún no has realizado ninguna compra.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 text-left mt-2 pr-1">
                {compras.map((compra) => (
                  <div
                    key={compra.id}
                    className="bg-[#fff7f6] border border-[#f5bfb2] rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[#7a1a0a] font-semibold">
                          Pedido #{(compra.id || "").slice(0, 6)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatearFecha(compra.fechaCreacion)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Método de pago:{" "}
                          <span className="font-semibold text-[#d16170]">
                            {compra.metodoPago || "No especificado"}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Productos: {compra.items?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          Delivery: S/
                          {Number(compra.delivery || 0).toFixed(2)}
                        </p>
                        <p className="text-[#d16170] font-bold text-lg">
                          Total: S/
                          {Number(compra.totalFinal || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {compra.items && compra.items.length > 0 && (
                      <ul className="mt-2 text-sm text-gray-700 space-y-1">
                        {compra.items.map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold">{item.nombre}</p>
                              <p className="text-xs text-gray-500">
                                Cantidad: {item.cantidad}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Precio: S/
                                {Number(item.precio || 0).toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
