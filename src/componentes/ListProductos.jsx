import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useCarrito } from "../context/CarritoContext";
import Filtros from "../componentes/Filtros";

export default function ListProductos() {
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
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);
    });
    return () => unsub();
  }, []);

  // Aplicar los filtros
  const productosFiltrados = productos.filter((p) => {
    const cumpleNombre = p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase());
    const cumpleCategoria = !filtro.categoria || p.categoria === filtro.categoria;
    const cumpleMin = !filtro.min || p.precio >= parseFloat(filtro.min);
    const cumpleMax = !filtro.max || p.precio <= parseFloat(filtro.max);
    return cumpleNombre && cumpleCategoria && cumpleMin && cumpleMax;
  });

  const handleComprar = (producto) => agregarProducto(producto);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
      <Filtros filtro={filtro} setFiltro={setFiltro} />

      {productosFiltrados.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productosFiltrados.map((p) => (
            <article
              key={p.id}
              className="bg-white border border-rose-100 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-60 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-rose-700">
                  {p.nombre}
                </h3>
                <p className="text-rose-500 font-bold mt-2">
                  S/{p.precio?.toFixed(2)}
                </p>
                <button
                  onClick={() => handleComprar(p)}
                  className="bg-rose-500 text-white px-5 py-2 rounded-full mt-3 hover:bg-rose-600 transition"
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
  );
}
