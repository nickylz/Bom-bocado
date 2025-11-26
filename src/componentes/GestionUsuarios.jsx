import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { format } from "date-fns";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useModal } from "../context/ModalContext";

const functions = getFunctions();
const deleteUser = httpsCallable(functions, "deleteUser");

// Define el orden de los roles
const roleOrder = {
  admin: 1,
  editor: 2,
  cliente: 3,
};

// Función para ordenar usuarios
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

  if (cargando)
    return <p className="text-center text-[#8f2133]">Cargando usuarios...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 bg-red-100 p-4 rounded-xl">
        {error}
      </p>
    );

  return (
    <div>
      <div className="lg:hidden w-full space-y-4">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white shadow-sm rounded-lg border border-[#f5bfb2] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg  text-[#d16170] font-bold">
                  @{usuario.username}
                </p>
                <p className="text-sm text-gray-500">{usuario.correo}</p>
                <p className="text-xs text-gray-400">
                  {usuario.fechaCreacion
                    ? format(usuario.fechaCreacion, "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline px-3 py-1 text-xs rounded-full ${
                    usuario.rol === "admin"
                      ? "bg-red-200 text-red-800"
                      : usuario.rol === "editor"
                      ? "bg-pink-200 text-pink-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {usuario.rol}
                </span>

                <div className="flex items-center justify-end gap-3">
                  {editandoId === usuario.id ? (
                    <>
                      <button
                        onClick={() =>
                          handleGuardarRol(usuario.id, usuario.rol)
                        }
                        className="text-green-600 hover:text-green-800 text-lg"
                        title="Guardar"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancelar}
                        className="text-gray-600 hover:text-gray-800 text-lg"
                        title="Cancelar"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleEmpezarEdicion(usuario.id, usuario.rol)
                        }
                        className="text-[#d16170] hover:text-[#b84c68] text-lg"
                        title="Editar Rol"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usuario)}
                        className="text-[#d16170] hover:text-[#b84c68] text-lg"
                        title="Eliminar Usuario"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {editandoId === usuario.id && (
              <div className="mt-3">
                <select
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#d8718c] text-sm"
                >
                  <option value="cliente">Cliente</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-[#f5bfb2]">
        <table className="min-w-max divide-y divide-[#f5bfb2]">
          <thead className="bg-[#fff3f0] w-full">
            <tr>
              <th className="px-20 sm:px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">
                Username
              </th>

              <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">
                Correo
              </th>

              <th className="px-12 sm:px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">
                Rol
              </th>

              <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">
                Fecha de Creación
              </th>

              <th className="px-12 sm:px-6 py-3 text-center text-xs font-bold text-[#8f2133] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-[#f5bfb2] w-full">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                {/* Username: siempre */}
                <td className="px-6 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 font-medium">
                  @{usuario.username}
                </td>

                {/* Correo: solo desktop */}
                <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {usuario.correo}
                </td>

                {/* Rol: siempre */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold">
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
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        usuario.rol === "admin"
                          ? "bg-red-200 text-red-800"
                          : usuario.rol === "editor"
                          ? "bg-pink-200 text-pink-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  )}
                </td>

                {/* Fecha: solo desktop */}
                <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.fechaCreacion
                    ? format(usuario.fechaCreacion, "dd/MM/yyyy HH:mm")
                    : "No disponible"}
                </td>

                {/* Acciones: siempre */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                        className="text-[#d16170] hover:text-[#b84c68] text-lg"
                        title="Editar Rol"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usuario)}
                        className="text-[#d16170] hover:text-[#b84c68] text-lg"
                        title="Eliminar Usuario"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
