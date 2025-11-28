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

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingId, setEditingId] = useState(null);
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
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "productos"),
      orderBy("nombre", "asc")
    );

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

      // descuento opcional
      if (formData.descuento === "" || formData.descuento === null) {
        dataToUpdate.descuento = 0;
      } else {
        dataToUpdate.descuento = Number(formData.descuento) || 0;
      }

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

  const productosFiltrados = productos.filter((p) => {
    const texto = (busqueda || "").toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(texto) ||
      p.categoria?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-[#f5bfb2]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#9c2007]">
          Gestión de Productos
        </h2>
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-72 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5bfb2]"
        />
      </div>

      {cargando ? (
        <p className="text-center text-gray-500 py-6">Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No hay productos para mostrar.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#fff3f0] text-left">
                <th className="px-3 py-2">Imagen</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Descuento (%)</th>
                <th className="px-3 py-2 hidden md:table-cell">Categoría</th>
                <th className="px-3 py-2 hidden lg:table-cell">Frase</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const isEditing = editingId === producto.id;
                return (
                  <tr
                    key={producto.id}
                    className="border-b border-gray-100 hover:bg-rose-50"
                  >
                    <td className="px-3 py-2">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-[#f5bfb2]"
                      />
                    </td>

                    {/* Nombre */}
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="font-semibold text-gray-800">
                          {producto.nombre}
                        </span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          name="precio"
                          step="0.01"
                          value={formData.precio}
                          onChange={handleChange}
                          className="w-24 border border-gray-300 rounded-md px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-[#d8718c] font-bold">
                          S/{Number(producto.precio || 0).toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* Descuento */}
                    <td className="px-3 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          name="descuento"
                          step="1"
                          value={formData.descuento}
                          onChange={handleChange}
                          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-gray-700">
                          {producto.descuento
                            ? `${producto.descuento}%`
                            : "—"}
                        </span>
                      )}
                    </td>

                    {/* Categoría */}
                    <td className="px-3 py-2 hidden md:table-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-gray-700">
                          {producto.categoria || "—"}
                        </span>
                      )}
                    </td>

                    {/* Frase */}
                    <td className="px-3 py-2 hidden lg:table-cell max-w-xs">
                      {isEditing ? (
                        <input
                          type="text"
                          name="frase"
                          value={formData.frase}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-gray-500 line-clamp-2">
                          {producto.frase || producto.descripcion || "—"}
                        </span>
                      )}
                    </td>


                    {/* Acciones */}
                    <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(producto.id)}
                            className="bg-[#a34d5f] text-white px-3 py-1 rounded-full text-xs hover:bg-[#912646]"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(producto)}
                            className="text-blue-600 text-xs hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="inline-flex text-xs leading-5 font-bold rounded-full"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
