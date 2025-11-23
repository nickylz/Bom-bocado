import { useState, useRef } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/authContext";

export default function FormProducto() {
  const { usuarioActual } = useAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [nombreImagen, setNombreImagen] = useState("Ningún archivo seleccionado");
  const [subiendo, setSubiendo] = useState(false);
  
  const inputFileRef = useRef(null);

  const tienePermiso = usuarioActual?.rol === 'admin' || usuarioActual?.rol === 'editor';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setNombreImagen(file.name);
    } else {
      setNombreImagen("Ningún archivo seleccionado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tienePermiso) {
      alert("No tienes permiso para realizar esta acción.");
      return;
    }
    if (!imagen) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    setSubiendo(true);
    try {
      const storageRef = ref(storage, `productos/${Date.now()}_${imagen.name}`);
      await uploadBytes(storageRef, imagen);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "productos"), {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        imagen: imageUrl,
        fechaCreacion: Timestamp.now(),
        creadoPor: usuarioActual.uid,
      });

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setImagen(null);
      setNombreImagen("Ningún archivo seleccionado");
      if(inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      alert("¡Producto agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un error al subir el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  if (!tienePermiso) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-[#8f2133]">Nombre del Producto</label>
          <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-[#8f2133]">Descripción</label>
          <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows="3" className="mt-1 w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"></textarea>
        </div>
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-[#8f2133]">Precio (S/)</label>
          <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required min="0" step="0.01" className="mt-1 w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-[#8f2133]">Categoría</label>
          <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="mt-1 w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]">
            <option value="">Selecciona una categoría</option>
            <option value="Tortas">Tortas</option>
            <option value="Postres">Postres</option>
            <option value="Bocaditos">Bocaditos</option>
          </select>
        </div>
        
        {/* --- NUEVO INPUT DE ARCHIVO PERSONALIZADO --- */}
        <div>
            <label className="block text-sm font-medium text-[#8f2133]">Imagen del Producto</label>
            <div className="mt-1 flex items-center">
                <input 
                    type="file" 
                    id="imagen" 
                    ref={inputFileRef}
                    onChange={handleFileChange} 
                    accept="image/*" 
                    required 
                    className="hidden" 
                />
                <label 
                    htmlFor="imagen"
                    className="cursor-pointer bg-[#fff3f0] text-[#d16170] font-semibold py-2 px-4 rounded-xl hover:bg-[#f5bfb2] transition-colors"
                >
                    Elegir archivo
                </label>
                <span className="ml-4 text-gray-500">{nombreImagen}</span>
            </div>
        </div>

        <button type="submit" disabled={subiendo} className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-[#d16170] hover:bg-[#b84c68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d8718c] disabled:opacity-50 transition-colors">
          {subiendo ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}
