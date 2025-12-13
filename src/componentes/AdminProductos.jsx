import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../lib/firebase";
import toast from 'react-hot-toast';
import { Eye, Trash, X, Save, ChevronLeft, ChevronRight, Camera, PlusCircle, AlertTriangle, Send, ChevronDown } from 'lucide-react';

const CATEGORIAS_PRODUCTOS = ["Pasteles", "Tartas", "Donas", "Cupcakes", "Bombones", "Macarons", "Galletas", "Postres fríos", "Temporada", "Otros"];
const inputStyles = "w-full bg-white/70 border-2 border-[#fdd2d7] rounded-lg px-4 py-2.5 text-gray-800 transition-all duration-300 focus:outline-none focus:border-[#d8718c] focus:ring-2 focus:ring-[#d8718c]/50";
const labelStyles = "block text-sm font-semibold text-[#8a152e] mb-1.5";

// --- Componente unificado para Agregar/Editar Producto ---
const ProductoModal = ({ producto, onClose, onSave, onProductAdded }) => {
  const esNuevo = !producto?.id;
  const [formData, setFormData] = useState(esNuevo ? { nombre: '', descripcion: '', precio: '', descuento: '', categoria: '' } : { ...producto });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(producto?.imagen || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!esNuevo) {
        setFormData({ ...producto });
        setImagePreview(producto.imagen);
        setImageFile(null);
    }
  }, [producto, esNuevo]);

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
    if (esNuevo && !imageFile) { setError("Debes seleccionar una imagen."); return; }
    if (!formData.categoria) { setError("Debes seleccionar una categoría."); return; }

    setIsSubmitting(true);
    setError(null);
    const toastId = toast.loading(esNuevo ? 'Agregando producto...' : 'Actualizando producto...');

    try {
        let imageUrl = formData.imagen;
        if (imageFile) {
            const storageRef = ref(storage, `productos/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
            if (!esNuevo && producto.imagen) {
                try { await deleteObject(ref(storage, producto.imagen)); } catch (e) { console.warn("No se pudo borrar imagen antigua:", e); }
            }
        }

        const data = {
            ...formData,
            precio: parseFloat(formData.precio) || 0,
            descuento: parseInt(formData.descuento, 10) || 0,
            imagen: imageUrl,
        };

        if (esNuevo) {
            await addDoc(collection(db, 'productos'), { ...data, fechaCreacion: serverTimestamp(), disponible: true });
            toast.success('¡Producto agregado!', { id: toastId });
            onProductAdded();
        } else {
            const { id, ...dataToUpdate } = data;
            await updateDoc(doc(db, "productos", id), dataToUpdate);
            toast.success('Producto actualizado', { id: toastId });
            onSave();
        }
        onClose();
    } catch (err) {
        console.error("Error:", err);
        setError("Ocurrió un error. Inténtalo de nuevo.");
        toast.error('Error al guardar', { id: toastId });
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-3xl w-full max-h-[95vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 relative border-b-2 border-rose-100/80">
            <h2 className="text-2xl font-bold text-[#8f2133]">{esNuevo ? 'Agregar Nuevo Producto' : 'Editar Producto'}</h2>
            <p className="text-sm text-gray-500">{esNuevo ? 'Rellena los campos para registrar un nuevo ítem.' : 'Modifica los detalles del producto.'}</p>
            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all" aria-label="Cerrar"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <label className={labelStyles}>Imagen del Producto*</label>
                    <div className="aspect-square w-full bg-white/80 rounded-lg border-2 border-dashed border-[#fdd2d7] flex flex-col items-center justify-center cursor-pointer hover:border-[#d8718c] transition-all relative" onClick={() => fileInputRef.current.click()}>
                        {imagePreview ? <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover rounded-md" /> : <div className="text-center text-[#d8718c]"><Camera size={40} className="mx-auto" /><p className="text-sm font-semibold mt-2">Elegir Imagen</p></div>}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md"><p className='text-white font-bold flex items-center gap-2'><Camera/> Cambiar</p></div>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="sm:col-span-2"><label htmlFor="nombre" className={labelStyles}>Nombre*</label><input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputStyles} placeholder="Ej: Torta de Chocolate" required /></div>
                    <div><label htmlFor="precio" className={labelStyles}>Precio (S/)*</label><input type="number" id="precio" name="precio" step="0.01" value={formData.precio} onChange={handleChange} className={inputStyles} placeholder="Ej: 45.50" required /></div>
                    <div><label htmlFor="descuento" className={labelStyles}>Descuento (%)</label><input type="number" id="descuento" name="descuento" value={formData.descuento || ''} onChange={handleChange} className={inputStyles} placeholder="Ej: 10" /></div>
                    <div className="sm:col-span-2"><label htmlFor="categoria" className={labelStyles}>Categoría*</label><select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={inputStyles} required><option value="" disabled>Selecciona...</option>{CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                    <div className="sm:col-span-2"><label htmlFor="descripcion" className={labelStyles}>Descripción</label><textarea id="descripcion" name="descripcion" rows="5" value={formData.descripcion} onChange={handleChange} className={`${inputStyles} min-h-[125px]`} placeholder="Describe el producto..."></textarea></div>
                </div>
            </div>
            {error && <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>}
        </form>

        <div className="p-4 bg-white/30 border-t-2 border-rose-100/80 flex justify-between items-center">
            {!esNuevo && <button onClick={() => { if(window.confirm('¿Seguro que quieres eliminar este producto?')) { deleteDoc(doc(db, 'productos', producto.id)).then(() => { toast.success('Producto Eliminado'); onClose(); }); } }} className="flex items-center gap-2 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"><Trash size={16}/> Eliminar</button>}
            <div className={esNuevo ? 'w-full flex justify-end' : ''}>
                <button onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#d8718c] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md disabled:bg-gray-400"><Send size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar'}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal AdminProductos ---
const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const productosPorPagina = 8;

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fechaCreacion", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProductos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCargando(false);
    }, () => setCargando(false));
    return () => unsubscribe();
  }, []);

  const openModalForNew = () => { setSelectedProduct(null); setModalOpen(true); };
  const openModalForEdit = (producto) => { setSelectedProduct(producto); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedProduct(null); };

  const productosFiltrados = productos.filter(p => categoriaFiltro ? p.categoria === categoriaFiltro : true);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPaginados = productosFiltrados.slice((currentPage - 1) * productosPorPagina, currentPage * productosPorPagina);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#8f2133]">Gestión de Productos</h3>
          <p className="text-sm text-gray-600">Total: {productosFiltrados.length} productos</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative"><select value={categoriaFiltro} onChange={e => { setCategoriaFiltro(e.target.value); setCurrentPage(1); }} className="appearance-none w-full sm:w-auto bg-white border-2 border-[#f5bfb2] text-gray-700 font-semibold py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#d16170]"><option value="">Todas las categorías</option>{CATEGORIAS_PRODUCTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>
            <button onClick={openModalForNew} className="flex items-center gap-2 bg-[#d8718c] text-white font-bold py-2.5 px-5 rounded-lg hover:bg-[#c25a75] transition-colors shadow-md"><PlusCircle size={20} /> Agregar</button>
        </div>
      </div>

      {cargando ? <div className="py-10 text-center text-gray-500">Cargando...</div> : (
        productosPaginados.length === 0 ? <p className="text-center text-gray-500 py-8">No hay productos para mostrar.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosPaginados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-2xl border-2 border-[#f5bfb2] shadow-sm overflow-hidden flex flex-col group">
                <div className="relative"><img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover"/>{producto.descuento > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{producto.descuento}% OFF</span>}</div>
                <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{producto.categoria}</span>
                    <h4 className="font-bold text-gray-800 text-lg my-1 flex-grow">{producto.nombre}</h4>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-xl font-black text-[#d16170]">S/{Number(producto.precio || 0).toFixed(2)}</p>
                        <button onClick={() => openModalForEdit(producto)} className="bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors shadow-sm"><Eye size={16} /></button>
                    </div>
                </div>
            </div>
            ))}
        </div>
      ))}

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center pt-6 gap-2"><button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow-md disabled:opacity-50"><ChevronLeft size={20} /></button><div className="flex bg-white rounded-full shadow-md px-4 py-2 gap-2">{[...Array(totalPaginas)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold transition ${currentPage === i + 1 ? 'bg-[#d16170] text-white' : 'text-gray-500 hover:bg-rose-50'}`}>{i+1}</button>))}</div><button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPaginas} className="p-3 rounded-full bg-white text-[#d16170] shadow-md disabled:opacity-50"><ChevronRight size={20} /></button></div>
      )}

      {modalOpen && <ProductoModal producto={selectedProduct} onClose={closeModal} onSave={closeModal} onProductAdded={() => {}} />}

    </div>
  );
};

export default AdminProductos;

// Estilos para la animación del modal
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
    .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
    `;
    document.head.appendChild(styleSheet);
  }
