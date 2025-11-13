import { useState } from "react";
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
  const [subiendo, setSubiendo] = useState(false);

  const correosPermitidos = [
    "danportaleshinostroza@crackthecode.la",//ANEL
    "zanadrianzenbohorquez@crackthecode.la",//NICOL
    "marandersonsantillan@crackthecode.la",//SABRINA
    "compa3@correo.com",
  ];

  if (!usuarioActual) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-rose-100 text-center">
        <h2 className="text-2xl font-bold text-rose-700 mb-3">
          Inicia sesión para agregar productos 
        </h2>
        <p className="text-rose-500">
          Solo los usuarios registrados pueden subir nuevos postres al catálogo.
        </p>
      </div>
    );
  }
  const correoUsuario = usuarioActual?.correo?.toLowerCase().trim();

  console.log("📋 Correos permitidos:", correosPermitidos);
  console.log("📧 Correo del usuario:", correoUsuario);

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
        correoCreador: usuarioActual.email, 
      });

      alert("Producto agregado exitosamente 🧁");
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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-rose-100"
    >
      <h2 className="text-2xl font-bold text-rose-700 mb-4 text-center">
        Agregar Producto
      </h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="font-medium text-[#804754] w-full p-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="font-medium text-[#804754] w-full p-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300"
        />

        <input
          type="number"
          placeholder="Precio (S/.)"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="font-medium text-[#804754] w-full p-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300"
        />

        <select
          name="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="font-medium text-[#804754] w-full p-3 rounded-xl border border-rose-200 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="" className="text-gray-500">
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
              className="font-medium text-[#804754] bg-[#fff3f0]"
            >
              {cat}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                     file:rounded-xl file:border-0 file:text-sm file:font-semibold
                     file:bg-rose-200 file:text-rose-800 hover:file:bg-rose-300"
        />

        <button
          type="submit"
          disabled={subiendo}
          className="w-full bg-rose-400 text-white py-2 rounded-xl font-semibold 
                     hover:bg-rose-500 transition disabled:opacity-60"
        >
          {subiendo ? "Subiendo..." : "Agregar Producto"}
        </button>
      </div>
    </form>
  );
}
