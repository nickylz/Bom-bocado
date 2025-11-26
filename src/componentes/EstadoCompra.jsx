import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaSync, FaSave } from "react-icons/fa";

export default function EstadoCompra() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [estadoEditando, setEstadoEditando] = useState({});
  const [guardando, setGuardando] = useState(false);

  const pageSize = 3;
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pageStarts, setPageStarts] = useState([]); 

  const cargarPagina = async (paginaDestino = 1) => {
    try {
      setCargando(true);
      setError(null);
      const pedidosRef = collection(db, "pedidos");

      if (paginaDestino === 1 && paginaActual === 1 && pageStarts.length === 0) {
        const snapshotTotal = await getDocs(pedidosRef);
        const totalDocs = snapshotTotal.size;
        const paginas = Math.max(1, Math.ceil(totalDocs / pageSize));
        setTotalPaginas(paginas);
      }

      let q;

      if (paginaDestino === 1) {
        q = query(
          pedidosRef,
          orderBy("fechaCreacion", "desc"),
          limit(pageSize)
        );
      } else {
        const starts = [...pageStarts];
        if (!starts[paginaDestino - 1]) {
          let lastDoc = null;
          for (let p = 1; p <= paginaDestino; p++) {
            let innerQuery;
            if (p === 1) {
              innerQuery = query(
                pedidosRef,
                orderBy("fechaCreacion", "desc"),
                limit(pageSize)
              );
            } else {
              innerQuery = query(
                pedidosRef,
                orderBy("fechaCreacion", "desc"),
                startAfter(lastDoc),
                limit(pageSize)
              );
            }

            const snap = await getDocs(innerQuery);

            if (snap.empty) break;

            const firstDoc = snap.docs[0];
            const last = snap.docs[snap.docs.length - 1];

            if (!starts[p - 1]) {
              starts[p - 1] = firstDoc;
            }
            lastDoc = last;

            if (p === paginaDestino) {
              const lista = snap.docs.map((docu) => {
                const data = docu.data();
                return {
                  id: docu.id,
                  ...data,
                  fechaCreacion: data.fechaCreacion?.toDate() || null,
                };
              });

              setPedidos(lista);
              setPaginaActual(paginaDestino);
              setPageStarts(starts);
              setCargando(false);
              return;
            }
          }

          setCargando(false);
          return;
        } else {
          const startDoc = pageStarts[paginaDestino - 1];
          q = query(
            pedidosRef,
            orderBy("fechaCreacion", "desc"),
            startAfter(startDoc),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const lista = snapshot.docs.map((docu) => {
          const data = docu.data();
          return {
            id: docu.id,
            ...data,
            fechaCreacion: data.fechaCreacion?.toDate() || null,
          };
        });

        const firstDoc = snapshot.docs[0];

        setPageStarts((prev) => {
          const copia = [...prev];
          copia[paginaDestino - 1] = copia[paginaDestino - 1] || firstDoc;
          return copia;
        });

        setPedidos(lista);
        setPaginaActual(paginaDestino);
      } else {
        setPedidos([]);
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar los pedidos: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPagina(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCambiarEstadoLocal = (pedidoId, nuevoEstado) => {
    setEstadoEditando((prev) => ({
      ...prev,
      [pedidoId]: nuevoEstado,
    }));
  };

  const handleGuardarEstado = async (pedido) => {
    const pedidoId = pedido.id;
    const nuevoEstado = estadoEditando[pedidoId] ?? pedido.estado;
    if (!nuevoEstado) return;

    try {
      setGuardando(true);
      const pedidoRef = doc(db, "pedidos", pedidoId);
      await updateDoc(pedidoRef, { estado: nuevoEstado });

      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );

      setEstadoEditando((prev) => {
        const copia = { ...prev };
        delete copia[pedidoId];
        return copia;
      });
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("Error al actualizar el estado: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "finalizada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (cargando) {
    return <p className="text-center text-[#8f2133]">Cargando pedidos...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-600 bg-red-100 p-4 rounded-xl">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg sm:text-xl font-bold text-[#8f2133]">Pedidos</p>
        <button
          onClick={() => {
            setPageStarts([]);
            setPaginaActual(1);
            cargarPagina(1);
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-[#8f2133] text-white hover:bg-[#6d1525] transition"
        >
          <FaSync className="text-xs" />
          Actualizar
        </button>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No hay pedidos en esta página.
        </p>
      ) : (
        <>
          <div className="space-y-4 mt-2">
            {pedidos.map((pedido) => {
              const estadoSeleccionado =
                estadoEditando[pedido.id] ?? pedido.estado;

              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-2xl border border-[#f5bfb2] p-4 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pedido ID:{" "}
                        <span className="font-mono text-gray-700">
                          {pedido.id}
                        </span>
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {pedido.nombreCliente}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pedido.correoUsuario}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Dirección:{" "}
                        <span className="font-medium">
                          {pedido.direccionEnvio}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {pedido.fechaCreacion
                          ? format(pedido.fechaCreacion, "dd/MM/yyyy HH:mm", {
                              locale: es,
                            })
                          : "Fecha no disponible"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${getEstadoColor(
                            pedido.estado
                          )}`}
                        >
                          Estado actual: {pedido.estado}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-semibold">
                          Pago: {pedido.metodoPago}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Productos:{" "}
                        <span className="font-bold">
                          {pedido.totalProductos || 0}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700">
                        Subtotal:{" "}
                        <span className="font-bold">
                          S/ {pedido.subtotal?.toFixed(2) || "0.00"}
                        </span>
                      </p>
                      <p className="text-base font-bold text-[#8f2133]">
                        Total: S/ {pedido.totalFinal?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#f5bfb2] pt-4">
                    <h3 className="text-sm font-semibold text-[#8f2133] mb-2">
                      Productos del pedido
                    </h3>
                    <div className="space-y-2">
                      {(pedido.items || []).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {item.imagen && (
                              <img
                                src={item.imagen}
                                alt={item.nombre}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.nombre}
                              </p>
                              <p className="text-xs text-gray-500">
                                Cantidad: {item.cantidad} · Precio: S/{" "}
                                {item.precio?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700">
                            Total: S/{" "}
                            {(item.cantidad * item.precio).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#f5bfb2] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Cambiar estado:
                      </span>
                      <select
                        value={estadoSeleccionado}
                        onChange={(e) =>
                          handleCambiarEstadoLocal(
                            pedido.id,
                            e.target.value
                          )
                        }
                        className="px-3 py-2 text-sm rounded-xl border border-[#f5bfb2] bg-white focus:outline-none focus:ring-2 focus:ring-[#d8718c]"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="finalizada">Finalizada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGuardarEstado(pedido)}
                      disabled={guardando}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#8f2133] hover:bg-[#6d1525] disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      <FaSave className="text-xs" />
                      {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => cargarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || cargando}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[#f5bfb2] text-[#8f2133] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fff3f0]"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página{" "}
              <span className="font-semibold">{paginaActual}</span> de{" "}
              <span className="font-semibold">{totalPaginas}</span>
            </span>

            <button
              onClick={() => cargarPagina(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas || cargando}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[#f5bfb2] text-[#8f2133] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fff3f0]"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
