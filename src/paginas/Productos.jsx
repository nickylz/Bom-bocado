import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Filtros from "../componentes/Filtros";
import FormProductos from "../componentes/FormProductos";
import { useCarrito } from "../context/CarritoContext";

export default function Productos() {
  const { agregarProducto } = useCarrito();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    min: "",
    max: "",
  });

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fechaCreacion", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const cumpleNombre =
      filtro.nombre === "" ||
      p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase());
    const cumpleCategoria =
      filtro.categoria === "" || p.categoria === filtro.categoria;
    const cumpleMin = filtro.min === "" || p.precio >= parseFloat(filtro.min);
    const cumpleMax = filtro.max === "" || p.precio <= parseFloat(filtro.max);

    return cumpleNombre && cumpleCategoria && cumpleMin && cumpleMax;
  });

return (
  <div className="bg-[#fff3f0] min-h-screen p-6">
    {/* FORMULARIO */}
    <div className="max-w-5xl mx-auto mb-12">
      <FormProductos />
    </div>

    {/* CONTENEDOR PRINCIPAL */}
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* TÍTULO + FILTROS */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
        <h2 className="text-3xl font-bold text-[#9c2007] border-b-2 border-[#f5bfb2] pb-2 text-center md:text-left">
          Explora Nuestros Postres
        </h2>

        <div className="shrink-0 w-full md:w-auto">
          <Filtros filtro={filtro} setFiltro={setFiltro} />
        </div>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="mt-10">
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((p) => (
              <article
                key={p.id}
                className="bg-white border border-[#f5bfb2] rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#9c2007]">
                    {p.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{p.descripcion}</p>
                  <p className="text-[#d8718c] font-bold mt-2">
                    S/{p.precio?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => agregarProducto(p)}
                    className="bg-[#a34d5f] text-white px-5 py-2 rounded-full mt-3 hover:bg-[#912646] transition"
                  >
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16 text-lg">
            No se encontraron productos con esos filtros 
          </p>
        )}
      </div>
    </div>
  </div>
);
}