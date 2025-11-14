import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";

export default function FormProducto() {
  const { usuarioActual } = useAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la",//ANEL
    "zanadrianzenbohorquez@crackthecode.la",//NICOLL
    "marandersonsantillan@crackthecode.la",//SABRINA
    "shavalerianoblas@crackthecode.la",//SHARON
  ];

  if (!usuarioActual) {
    return (
      <div className="flex justify-center items-center py-10 bg-[#fff3f0]">
        <div className="bg-white border border-[#f5bfb2] rounded-2xl shadow-lg w-[95%] max-w-2xl p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-2">
              Inicia sesión para agregar productos 
            </h2>
            <p className="text-[#7a1a0a] text-base leading-relaxed max-w-2xl mx-auto">
              Solo los{" "}
              <span className="text-[#d8718c] font-semibold">
                usuarios registrados
              </span>{" "}
              pueden subir nuevos postres al catálogo.
            </p>
          </div>
        </div>
      </div>
    );


  }
  const correoUsuario = usuarioActual?.correo?.toLowerCase().trim();

  console.log(" Correos permitidos:", correosPermitidos);
  console.log(" Correo del usuario:", correoUsuario);

  const accesoPermitido = correosPermitidos.some(
    (correo) => correo.toLowerCase().trim() === correoUsuario
  );

  if (!accesoPermitido) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-rose-100 text-center">
        <h2 className="text-2xl font-bold text-rose-700 mb-3">Acceso restringido</h2>
        <p className="text-rose-500">
          Tu cuenta no tiene permisos para agregar productos.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !categoria || !imagen) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      setSubiendo(true);

      const imgRef = ref(storage, `productos/${Date.now()}-${imagen.name}`);
      await uploadBytes(imgRef, imagen);
      const url = await getDownloadURL(imgRef);

      await addDoc(collection(db, "productos"), {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        imagen: url,
        fechaCreacion: Timestamp.now(),
        creadoPor: usuarioActual.uid,
        correoCreador: usuarioActual.correo, 
      });

      alert("Producto agregado exitosamente ");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setImagen(null);
      e.target.reset();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Ocurrió un error al guardar el producto");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-8 bg-[#fff3f0] min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#f5bfb2] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center"
      >
        <h2 className="text-3xl font-bold text-[#8f2133] mb-6">
          Agregar Producto 
        </h2>

        <div className="space-y-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-[#fffaf9] border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] font-medium"
          />

          {/* Descripción */}
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-[#fffaf9] border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] font-medium"
          />

          {/* Precio */}
          <input
            type="number"
            placeholder="Precio (S/.)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full bg-[#fffaf9] border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] font-medium"
          />

          {/* Categoría */}
          <select
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-[#fffaf9] border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c] cursor-pointer font-medium"
          >
            <option value="" className="text-gray-500 bg-[#fff3f0]">
              Selecciona una categoría
            </option>
            {[
              "Pasteles",
              "Tartas",
              "Donas",
              "Cupcakes",
              "Bombones",
              "Macarons",
              "Galletas",
              "Postres fríos",
              "Otros",
              "Temporada",
            ].map((cat) => (
              <option
                key={cat}
                value={cat}
                className="text-[#7a1a0a] bg-[#fffaf9]"
              >
                {cat}
              </option>
            ))}
          </select>

          {/* 🔸 Imagen */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full text-sm text-[#7a1a0a] file:mr-4 file:py-2 file:px-4 
                       file:rounded-xl file:border-0 file:font-semibold
                       file:bg-[#f5bfb2] file:text-[#8f2133] hover:file:bg-[#f2a6b3]
                       transition"
          />

          {/* 🔸 Botón */}
          <button
            type="submit"
            disabled={subiendo}
            className="w-full bg-[#d16170] text-white py-3 rounded-xl font-semibold 
                       hover:bg-[#b84c68] transition disabled:opacity-60"
          >
            {subiendo ? "Subiendo..." : "Agregar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
  
}
