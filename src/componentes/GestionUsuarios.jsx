import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { format } from "date-fns";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useModal } from "../context/ModalContext";
import { ChevronLeft, ChevronRight, Loader, AlertTriangle, User, Edit, Trash2, Clock } from "lucide-react";

const functions = getFunctions();
const deleteUser = httpsCallable(functions, "deleteUser");

const roleOrder = {
  admin: 1,
  editor: 2,
  cliente: 3,
};

const sortUsers = (users) => {
  return [...users].sort((a, b) => {
    const roleA = roleOrder[a.rol] || 99;
    const roleB = roleOrder[b.rol] || 99;
    return roleA - roleB;
  });
};

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const { mostrarModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setUsersPerPage(6);
      } else {
        setUsersPerPage(15);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const listaUsuarios = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
        fechaCreacion: docu.data().fechaCreacion?.toDate(),
      }));
      setUsuarios(sortUsers(listaUsuarios));
    } catch (err) {
      setError("Error al cargar los usuarios. " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleGuardarRol = async (id, rolActual) => {
    if (
      rolActual === "admin" &&
      usuarios.filter((u) => u.rol === "admin").length <= 1 &&
      nuevoRol !== "admin"
    ) {
      mostrarModal(
        "¡Error! No puedes quitar el rol al único administrador que queda."
      );
      return;
    }
    if (nuevoRol === "") {
      mostrarModal("Por favor, selecciona un nuevo rol.");
      return;
    }
    try {
      const userRef = doc(db, "usuarios", id);
      await updateDoc(userRef, { rol: nuevoRol });

      const updatedUsers = usuarios.map((u) =>
        u.id === id ? { ...u, rol: nuevoRol } : u
      );
      setUsuarios(sortUsers(updatedUsers));
      setEditandoId(null);
      setNuevoRol("");
      mostrarModal("Rol actualizado con éxito.");
    } catch (err) {
      mostrarModal("Error al actualizar el rol. " + err.message);
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

    try {
      const result = await deleteUser({ docId: usuario.id });
      if (result.data?.success) {
        mostrarModal(`Usuario ${usuario.correo} eliminado con éxito.`);
        setUsuarios(usuarios.filter((u) => u.id !== usuario.id));
      } else {
        throw new Error(
          result.data?.message || "Error desconocido al eliminar usuario."
        );
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      mostrarModal(`Error al eliminar el usuario: ${error.message}`);
    }
  };

  if (cargando) {
    return <div className="flex justify-center items-center py-10"><Loader className="animate-spin text-[#d16170]" size={40} /><p className="ml-4 text-lg font-semibold text-gray-700">Cargando Usuarios...</p></div>;
  }

  if (error) {
    return <div className="flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>;
  }

  const totalPages = Math.ceil(usuarios.length / usersPerPage);
  const paginatedUsers = usuarios.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#8f2133]">Historial de Usuarios</h3>
          <p className="text-sm text-gray-600">Total: {usuarios.length} usuarios</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedUsers.map((usuario) => (
          <div key={usuario.id} className="bg-white rounded-2xl border-2 border-[#f5bfb2] p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={22} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">@{usuario.username}</p>
                  <p className="text-xs text-gray-500">{usuario.correo}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                usuario.rol === "admin"
                  ? "bg-red-200 text-red-800"
                  : usuario.rol === "editor"
                  ? "bg-pink-200 text-pink-800"
                  : "bg-gray-200 text-gray-800"
              }`}>
                {usuario.rol}
              </span>
            </div>
            {editandoId === usuario.id ? (
              <div className="space-y-2 pt-2">
                 <select
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#d8718c] text-sm"
                >
                  <option value="cliente">Cliente</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2">
                    <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="w-full mt-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                        <FaSave size={16} /> Guardar
                    </button>
                    <button onClick={handleCancelar} className="w-full mt-2 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                        <FaTimes size={16} /> Cancelar
                    </button>
                </div>
              </div>
            ) : (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => handleEmpezarEdicion(usuario.id, usuario.rol)} className="w-full mt-2 bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                        <Edit size={16} /> Editar
                    </button>
                    <button onClick={() => handleDeleteUser(usuario)} className="w-full mt-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                        <Trash2 size={16} /> Eliminar
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border-2 border-[#f5bfb2]">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#d16170] text-xs text-white uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Username</th>
              <th scope="col" className="px-6 py-3 font-semibold">Correo</th>
              <th scope="col" className="px-6 py-3 font-semibold">Rol</th>
              <th scope="col" className="px-6 py-3 font-semibold">Fecha de Creación</th>
              <th scope="col" className="px-6 py-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((usuario) => (
              <tr key={usuario.id} className="border-b border-[#f5bfb2] last:border-b-0 hover:bg-[#fff3f0]/60">
                <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">@{usuario.username}</td>
                <td className="px-6 py-4">{usuario.correo}</td>
                <td className="px-6 py-4">
                {editandoId === usuario.id ? (
                    <select
                      value={nuevoRol}
                      onChange={(e) => setNuevoRol(e.target.value)}
                      className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#d8718c] text-sm"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        usuario.rol === "admin"
                          ? "bg-red-200 text-red-800"
                          : usuario.rol === "editor"
                          ? "bg-pink-200 text-pink-800"
                          : "bg-gray-200 text-gray-800"
                      }`}>
                      {usuario.rol}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                  {usuario.fechaCreacion
                    ? format(usuario.fechaCreacion, "dd/MM/yyyy HH:mm")
                    : "No disponible"}
                </td>
                <td className="px-6 py-4 text-center">
                {editandoId === usuario.id ? (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          handleGuardarRol(usuario.id, usuario.rol)
                        }
                        className="text-green-600 hover:text-green-800 text-xl"
                        title="Guardar"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancelar}
                        className="text-gray-600 hover:text-gray-800 text-xl"
                        title="Cancelar"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          handleEmpezarEdicion(usuario.id, usuario.rol)
                        }
                        className="bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm"
                        title="Editar Rol"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usuario)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        title="Eliminar Usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center pt-6 gap-2">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Anterior"><ChevronLeft size={20} /></button>
          <div className="flex bg-white rounded-full shadow-md px-4 py-2 gap-2">
            {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentPage === i + 1 ? "bg-[#d16170] text-white scale-110 shadow-lg" : "text-gray-500 hover:bg-rose-50 hover:text-[#d16170]"}`}>{i + 1}</button>))}
          </div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Siguiente"><ChevronRight size={20} /></button>
        </div>
      )}
    </div>
  );
}
