import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../lib/firebase";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const ROLES = ["admin", "editor", "lector"];

const GestionUsuarios = () => {
  const { usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState({ campo: "correo", asc: true });

  useEffect(() => {
    const q = query(collection(db, "usuarios"), orderBy(orden.campo, orden.asc ? "asc" : "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(users);
        setCargando(false);
      },
      (error) => {
        console.error("Error al obtener usuarios:", error);
        toast.error("Error al cargar los usuarios.");
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, [orden]);

  const handleGuardarCambios = async (id) => {
    if (!nuevoRol) {
      toast.error("Por favor, selecciona un rol.");
      return;
    }

    const toastId = toast.loading("Actualizando rol...");
    try {
      const userRef = doc(db, "usuarios", id);
      await updateDoc(userRef, { rol: nuevoRol });
      toast.success("Rol actualizado correctamente.", { id: toastId });
      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      toast.error(`Error al actualizar: ${error.message}`, { id: toastId });
    }
  };

  const handleEmpezarEdicion = (id, rolActual) => {
    setEditandoId(id);
    setNuevoRol(rolActual);
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setNuevoRol("");
  };

  const handleDeleteUser = async (usuario) => {
    if (
      !window.confirm(
        `¡ATENCIÓN! Estás a punto de eliminar al usuario ${usuario.correo}. Esta acción es irreversible. ¿Continuar?`
      )
    )
      return;

    const toastId = toast.loading("Eliminando usuario...");
    try {
      const functions = getFunctions();
      const deleteUser = httpsCallable(functions, "deleteUser");
      const result = await deleteUser({ docId: usuario.id });

      if (result.data.success) {
        toast.success("Usuario eliminado correctamente.", { id: toastId });
      } else {
        throw new Error(
          result.data?.message || "Error desconocido al eliminar usuario."
        );
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error(`Error al eliminar el usuario: ${error.message}`, { id: toastId });
    }
  };

  if (cargando) {
    return <div className="text-center p-8">Cargando usuarios...</div>;
  }
  
  const cambiarOrden = (campo) => {
    setOrden(prev => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
    }));
  }

  const usuariosFiltrados = usuarios.filter(u => 
    u.correo.toLowerCase().includes(filtro.toLowerCase()) ||
    (u.nombre && u.nombre.toLowerCase().includes(filtro.toLowerCase())) ||
    (u.rol && u.rol.toLowerCase().includes(filtro.toLowerCase()))
  );

  const puedeEditar = (usuario) => {
    if (!usuarioActual) return false;
    if (usuario.id === usuarioActual.id) return false; // Un usuario no se puede editar a sí mismo
    if (usuarioActual.rol === 'admin') return true;
    if (usuarioActual.rol === 'editor' && usuario.rol === 'lector') return true;
    
    return false;
  }
  
  const puedeEliminar = (usuario) => {
      if (!usuarioActual) return false;
      if (usuario.id === usuarioActual.id) return false; // Un usuario no se puede eliminar a sí mismo
      return usuarioActual.rol === 'admin';
  }


  return (
    <div className="container mx-auto px-4 py-8 bg-[#fff3f0]">
        <h1 className="text-4xl font-bold text-center text-[#8f2133] mb-8">
            Gestión de Usuarios
        </h1>

        <div className="mb-6">
            <input 
                type="text"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                placeholder="Buscar por nombre, correo o rol..."
                className="w-full p-3 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#d8718c]"
            />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full whitespace-nowrap">
                <thead className="bg-[#a34d5f] text-white">
                    <tr>
                        <th onClick={() => cambiarOrden('nombre')} className="px-6 py-3 text-left font-bold cursor-pointer">Nombre</th>
                        <th onClick={() => cambiarOrden('correo')} className="px-6 py-3 text-left font-bold cursor-pointer">Correo</th>
                        <th onClick={() => cambiarOrden('rol')} className="px-6 py-3 text-left font-bold cursor-pointer">Rol</th>
                        <th className="px-6 py-3 text-left font-bold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-rose-50">
                            <td className="px-6 py-4">{usuario.nombre || "-"}</td>
                            <td className="px-6 py-4">{usuario.correo}</td>
                            <td className="px-6 py-4">
                                {editandoId === usuario.id ? (
                                    <select
                                        value={nuevoRol}
                                        onChange={(e) => setNuevoRol(e.target.value)}
                                        className="p-2 border rounded-md"
                                    >
                                        {ROLES.map((rol) => (
                                            <option key={rol} value={rol}>
                                                {rol}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        usuario.rol === 'admin' ? 'bg-blue-200 text-blue-800' : 
                                        usuario.rol === 'editor' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`
                                    }>
                                      {usuario.rol}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {editandoId === usuario.id ? (
                                    <>
                                        <button onClick={() => handleGuardarCambios(usuario.id)} className="text-green-600 hover:text-green-800 mr-3"><FaSave size={20}/></button>
                                        <button onClick={handleCancelar} className="text-red-600 hover:text-red-800"><FaTimes size={20}/></button>
                                    </>
                                ) : (
                                    <>
                                        {puedeEditar(usuario) && (
                                            <button onClick={() => handleEmpezarEdicion(usuario.id, usuario.rol)} className="text-blue-600 hover:text-blue-800 mr-4 transition-transform hover:scale-110"><FaEdit size={20}/></button>
                                        )}
                                        {puedeEliminar(usuario) && (
                                            <button onClick={() => handleDeleteUser(usuario)} className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"><FaTrash size={20}/></button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default GestionUsuarios;
