import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const productosPorPagina = 10;

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    frase: "",
    descripcion: "",
    imagen: "",
    descuento: "",
    favorito: false,
    nuevo: false,
  });

  const [__, setCargando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
        setCargando(false);
      },
      (error) => {
        console.error("Error al cargar productos:", error);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEditClick = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre || "",
      precio: producto.precio || "",
      categoria: producto.categoria || "",
      frase: producto.frase || "",
      descripcion: producto.descripcion || "",
      imagen: producto.imagen || "",
      descuento: producto.descuento || "",
      favorito: Boolean(producto.favorito),
      nuevo: Boolean(producto.nuevo),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      nombre: "",
      precio: "",
      categoria: "",
      frase: "",
      descripcion: "",
      imagen: "",
      descuento: "",
      favorito: false,
      nuevo: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const docRef = doc(db, "productos", id);

      const dataToUpdate = {
        nombre: formData.nombre,
        precio: Number(formData.precio) || 0,
        categoria: formData.categoria,
        frase: formData.frase,
        descripcion: formData.descripcion,
        imagen: formData.imagen,
        favorito: !!formData.favorito,
        nuevo: !!formData.nuevo,
      };

      dataToUpdate.descuento =
        formData.descuento === "" || formData.descuento === "0" ? null : Number(formData.descuento);

      await updateDoc(docRef, dataToUpdate);

      alert("Producto actualizado correctamente.");
      handleCancelEdit();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await deleteDoc(doc(db, "productos", id));
      alert("Producto eliminado.");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };
  
  const calcularPrecioFinal = (precio, descuento) => {
    if (!descuento || descuento <= 0) return precio;
    return precio - (precio * descuento / 100);
  }

  const productosFiltrados = productos.filter((p) =>
    categoriaFiltro ? p.categoria === categoriaFiltro : true
  );

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  const indexInicio = (currentPage - 1) * productosPorPagina;
  const indexFin = indexInicio + productosPorPagina;

  const productosPaginados = productosFiltrados.slice(indexInicio, indexFin);

  return (
    <div className="bg-[#fff3f0] rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-[#f5bfb2] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#9c2007]">
            Gestión de Productos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total:{" "}
            <span className="font-semibold">{productosFiltrados.length}</span>{" "}
            productos
          </p>
        </div>

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border-2 border-[#f5bfb2] rounded-xl px-4 py-2 sm:py-3 text-sm font-medium bg-white text-[#9c2007] focus:outline-none focus:ring-2 focus:ring-[#d16170] transition"
        >
          <option value="">Todas las categorías</option>

          {[...new Set(productos.map((p) => p.categoria))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Vista Móvil */}
      <div className="lg:hidden space-y-4">
        {productosPaginados.length > 0 ? (
          productosPaginados.map((producto) => (
            <div
              key={producto.id}
              className={`bg-white shadow-md rounded-2xl border-2 border-[#f5bfb2] hover:shadow-lg transition ${
                editingId === producto.id ? "p-3" : "p-4"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className={`rounded-lg object-cover border-2 border-[#f5bfb2] shrink-0 ${
                    editingId === producto.id
                      ? "w-16 h-16 sm:w-16 sm:h-16"
                      : "w-20 h-20 sm:w-24 sm:h-24"
                  }`}
                />

                <div className="flex-1 flex flex-col justify-between">
                  {editingId === producto.id ? (
                    <div className="space-y-1 text-xs">
                      <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full border border-[#f5bfb2] px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#d16170]"
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <input
                          name="precio"
                          type="number"
                          value={formData.precio}
                          onChange={handleChange}
                          placeholder="Precio"
                          className="border border-[#f5bfb2] px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#d16170]"
                        />
                        <input
                          name="descuento"
                          type="number"
                          value={formData.descuento}
                          onChange={handleChange}
                          placeholder="Desc %"
                          className="border border-[#f5bfb2] px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#d16170]"
                        />
                      </div>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                        className="border border-[#f5bfb2] px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#d16170]"
                      >
                        <option value="">Categoría</option>
                        {[...new Set(productos.map(p=>p.categoria))].map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-[#9c2007] text-lg truncate">
                        {producto.nombre}
                      </p>
                      <div className="flex items-center gap-2">
                        {producto.descuento > 0 ? (
                            <>
                                <p className="text-[#d16170] font-semibold text-xl">
                                    S/{calcularPrecioFinal(producto.precio, producto.descuento).toFixed(2)}
                                </p>
                                <p className="text-gray-400 line-through text-sm">
                                    S/{producto.precio?.toFixed(2)}
                                </p>
                            </>
                        ) : (
                            <p className="text-[#d16170] font-semibold text-xl">
                                S/{producto.precio?.toFixed(2)}
                            </p>
                        )}
                      </div>
                      <span className="inline-block bg-[#fff3f0] text-[#9c2007] px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                        {producto.categoria}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 justify-end">
                    {editingId === producto.id ? (
                      <>
                        <button onClick={() => handleSave(producto.id)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition" title="Guardar"><FaSave /></button>
                        <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg transition" title="Cancelar"><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(producto)} className="bg-[#d16170] hover:bg-[#b84c68] text-white p-2 rounded-lg transition" title="Editar"><FaEdit /></button>
                        <button onClick={() => handleDelete(producto.id)} className="bg-[#d16170] hover:bg-[#b84c68] text-white p-2 rounded-lg transition" title="Eliminar"><FaTrash /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No hay productos</p>
        )}
      </div>

      {/* Vista Desktop */}
      <div className="hidden lg:block border-2 border-[#f5bfb2] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full divide-y divide-[#f5bfb2]">
            <thead className="bg-[#d16170] text-white sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Imagen</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Descuento</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Categoría</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase">Acciones</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-[#f5bfb2]">
              {productosPaginados.length > 0 ? (
                productosPaginados.map((producto) => {
                  const isEditing = editingId === producto.id;
                  return (
                    <tr key={producto.id} className="hover:bg-[#fff3f0] transition">
                      <td className="px-6 py-4">
                        <img src={producto.imagen} alt={producto.nombre} className="w-14 h-14 rounded-lg object-cover border-2 border-[#f5bfb2]"/>
                      </td>
                      <td className="px-6 py-4 text-sm align-middle">
                        {isEditing ? (
                          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border rounded-md px-2 py-1 text-xs"/>
                        ) : (
                          <span className="font-semibold text-[#9c2007]">{producto.nombre}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm align-middle">
                        {isEditing ? (
                          <input type="number" name="precio" step="0.01" value={formData.precio} onChange={handleChange} className="w-24 border rounded-md px-2 py-1 text-xs"/>
                        ) : (
                          <div className="flex items-center gap-2">
                            {producto.descuento > 0 ? (
                                <>
                                    <span className="font-bold text-[#d16170] text-lg">
                                        S/{calcularPrecioFinal(producto.precio, producto.descuento).toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 line-through text-sm">
                                        S/{Number(producto.precio || 0).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="font-bold text-[#d16170] text-lg">
                                    S/{Number(producto.precio || 0).toFixed(2)}
                                </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm align-middle">
                        {isEditing ? (
                          <input type="number" name="descuento" step="1" value={formData.descuento} onChange={handleChange} placeholder="%" className="w-16 border rounded-md px-2 py-1 text-xs"/>
                        ) : producto.descuento > 0 ? (
                          <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-bold">{producto.descuento}%</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm align-middle">
                        {isEditing ? (
                          <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full border rounded-md px-2 py-1 text-xs">
                             <option value="">Categoría</option>
                             {[...new Set(productos.map(p=>p.categoria))].map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <span className="inline-block bg-[#fff3f0] text-[#9c2007] px-3 py-1 rounded-full text-xs font-semibold">{producto.categoria}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <div className="flex gap-3 justify-center">
                            <button onClick={() => handleSave(producto.id)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition" title="Guardar"><FaSave /></button>
                            <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-lg transition" title="Cancelar"><FaTimes /></button>
                          </div>
                        ) : (
                          <div className="flex gap-3 justify-center">
                            <button onClick={() => handleEditClick(producto)} className="bg-[#d16170] hover:bg-[#b84c68] text-white p-2 rounded-lg transition" title="Editar"><FaEdit /></button>
                            <button onClick={() => handleDelete(producto.id)} className="bg-[#d16170] hover:bg-[#b84c68] text-white p-2 rounded-lg transition" title="Eliminar"><FaTrash /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay productos para mostrar</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 transition"><FaChevronLeft /></button>
          <div className="flex bg-white rounded-full shadow px-4 py-2 gap-2">
            {[...Array(totalPaginas)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold transition duration-300 ${ currentPage === i + 1 ? "bg-[#d16170] text-white scale-110" : "text-gray-500 hover:bg-rose-50"}`}>{i + 1}</button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPaginas} className="p-3 rounded-full bg-white text-[#d16170] shadow hover:bg-rose-50 disabled:opacity-50 transition"><FaChevronRight /></button>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;