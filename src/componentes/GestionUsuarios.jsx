import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('');

  const fetchUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const listaUsuarios = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate()
      }));
      setUsuarios(listaUsuarios);
    } catch (err) {
      setError('Error al cargar los usuarios. ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleGuardarRol = async (id, rolActual) => {
    if (rolActual === 'admin' && usuarios.filter(u => u.rol === 'admin').length <= 1 && nuevoRol !== 'admin') {
      alert('¡Error! No puedes quitar el rol al único administrador que queda.');
      return;
    }
    if (nuevoRol === '') {
      alert('Por favor, selecciona un nuevo rol.');
      return;
    }
    try {
      const userRef = doc(db, 'usuarios', id);
      await updateDoc(userRef, { rol: nuevoRol });
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
      setEditandoId(null);
      setNuevoRol('');
      alert('Rol actualizado con éxito.');
    } catch (err) {
      alert('Error al actualizar el rol. ' + err.message);
    }
  };

  const handleEmpezarEdicion = (id, rolActual) => {
    setEditandoId(id);
    setNuevoRol(rolActual);
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setNuevoRol('');
  };

  const handleDeleteUser = async (id, correo) => {
    if (!window.confirm(`¡ATENCIÓN! Estás a punto de eliminar al usuario ${correo}. Esta acción es irreversible. ¿Continuar?`)) return;
    try {
      const result = await deleteUser({ uid: id });
      if (result.data.success) {
        alert(`Usuario ${correo} eliminado con éxito.`);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } else {
        throw new Error(result.data.message || 'Error desconocido al eliminar usuario.');
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert(`Error al eliminar el usuario: ${error.message}`);
    }
  };

  if (cargando) return <p className="text-center text-[#8f2133]">Cargando usuarios...</p>;
  if (error) return <p className="text-center text-red-600 bg-red-100 p-4 rounded-xl">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#8f2133] mb-6 text-center">Gestión de Usuarios</h2>
      <div className="overflow-x-auto rounded-xl border border-[#f5bfb2]">
        <table className="min-w-full divide-y divide-[#f5bfb2]">
          <thead className="bg-[#fff3f0]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#8f2133] uppercase tracking-wider">Fecha de Creación</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#8f2133] uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f5bfb2]">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">@{usuario.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{usuario.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
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
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${usuario.rol === 'admin' ? 'bg-red-200 text-red-800' : usuario.rol === 'editor' ? 'bg-pink-200 text-pink-800' : 'bg-gray-200 text-gray-800'}`}>
                      {usuario.rol}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.fechaCreacion ? format(usuario.fechaCreacion, 'dd/MM/yyyy HH:mm') : 'No disponible'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {editandoId === usuario.id ? (
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleGuardarRol(usuario.id, usuario.rol)} className="text-green-600 hover:text-green-800 text-xl" title="Guardar"><FaSave /></button>
                      <button onClick={handleCancelar} className="text-gray-600 hover:text-gray-800 text-xl" title="Cancelar"><FaTimes /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEmpezarEdicion(usuario.id, usuario.rol)} className="text-[#d16170] hover:text-[#b84c68] text-lg" title="Editar Rol"><FaEdit /></button>
                        <button onClick={() => handleDeleteUser(usuario.id, usuario.correo)} className="text-[#d16170] hover:text-[#b84c68] text-lg" title="Eliminar Usuario"><FaTrash /></button>
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
