import { useState, useRef } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';
import { Camera, Send, AlertTriangle } from 'lucide-react';

const inputStyles = "w-full bg-white/70 border-2 border-[#fdd2d7] rounded-lg px-4 py-2.5 text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#d8718c] focus:ring-2 focus:ring-[#d8718c]/50";
const labelStyles = "block text-sm font-semibold text-[#8a152e] mb-1.5";

const CATEGORIAS_PRODUCTOS = ["Pasteles", "Tartas", "Donas", "Cupcakes", "Bombones", "Macarons", "Galletas", "Postres fríos", "Temporada", "Otros"];

export default function FormProducto() {
  const { usuarioActual } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    frase: '',
    precio: '',
    categoria: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const tienePermiso = usuarioActual?.rol === "admin" || usuarioActual?.rol === "editor";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tienePermiso) {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    if (!imageFile) {
      setError("Por favor, selecciona una imagen.");
      return;
    }
    if (!formData.categoria) {
      setError("Por favor, selecciona una categoría.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const toastId = toast.loading('Agregando producto...');

    try {
      const storageRef = ref(storage, `productos/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "productos"), {
        ...formData,
        precio: Number(formData.precio),
        imagen: imageUrl,
        fechaCreacion: serverTimestamp(),
        creadoPor: usuarioActual.uid,
        disponible: true,
      });

      setFormData({ nombre: '', descripcion: '', frase: '', precio: '', categoria: '' });
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("¡Producto agregado con éxito!", { id: toastId });
    } catch (err) {
      console.error("Error al agregar el producto:", err);
      setError("Hubo un error al subir el producto.");
      toast.error("Hubo un error al subir el producto.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tienePermiso) {
    return (
      <div className="bg-[#fff3f0] rounded-3xl shadow-lg p-8 border border-[#f5bfb2] text-center">
        <h3 className="text-xl font-bold text-[#8f2133]">Acceso Denegado</h3>
        <p className="text-gray-600 mt-2">No tienes los permisos necesarios para agregar productos.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fff3f0] rounded-3xl shadow-lg p-6 sm:p-8 border border-[#f5bfb2]">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#9c2007]">Agregar Nuevo Producto</h2>
        <p className="text-sm text-gray-600 mt-1">Rellena el formulario para añadir un producto al catálogo.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <label className={labelStyles}>Imagen del Producto*</label>
            <div className="aspect-square w-full bg-white/80 rounded-lg border-2 border-dashed border-[#fdd2d7] flex flex-col items-center justify-center cursor-pointer hover:border-[#d8718c] transition-all" onClick={() => fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover rounded-md" />
              ) : (
                <div className="text-center text-[#d8718c]">
                  <Camera size={40} className="mx-auto" />
                  <p className="text-sm font-semibold mt-2">Haz clic para elegir</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-2">
              <label htmlFor="nombre" className={labelStyles}>Nombre del Producto*</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputStyles} placeholder="Ej: Pastel de Chocolate" required />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="frase" className={labelStyles}>Frase Corta*</label>
              <input type="text" id="frase" name="frase" value={formData.frase} onChange={handleChange} className={inputStyles} placeholder="Ej: El clásico que nunca falla" required />
            </div>

            <div>
              <label htmlFor="precio" className={labelStyles}>Precio (S/)*</label>
              <input type="number" id="precio" name="precio" step="0.01" value={formData.precio} onChange={handleChange} className={inputStyles} placeholder="Ej: 45.50" required />
            </div>

            <div>
              <label htmlFor="categoria" className={labelStyles}>Categoría*</label>
              <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={inputStyles} required>
                <option value="" disabled>Selecciona una categoría</option>
                {CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="descripcion" className={labelStyles}>Descripción Detallada*</label>
              <textarea id="descripcion" name="descripcion" rows="5" value={formData.descripcion} onChange={handleChange} className={`${inputStyles} min-h-[120px]`} placeholder="Describe el producto, sus ingredientes, etc." required></textarea>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300">
            <AlertTriangle size={24} />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="mt-10 text-right">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#d8718c] text-white font-bold py-3 px-10 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none">
            <Send size={18} />
            {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
