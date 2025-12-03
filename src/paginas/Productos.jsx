import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Filtros from "../componentes/Filtros";
import ProductoCard from "../componentes/ProductoCard"; // ¡Importamos la tarjeta reutilizable!
import incono from "../componentes/img/Bom.png";
import { Trash2 } from "lucide-react";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    min: "",
    max: "",
  });

  // --- Carga de Productos ---
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fechaCreacion", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  // --- Filtrado de Productos ---
  const productosFiltrados = productos.filter((p) => {
    return (
      (filtro.nombre === "" || p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase())) &&
      (filtro.categoria === "" || p.categoria === filtro.categoria) &&
      (filtro.min === "" || p.precio >= parseFloat(filtro.min)) &&
      (filtro.max === "" || p.precio <= parseFloat(filtro.max))
    );
  });

  const postresNombres = productos.map(p => p.nombre);

  return (
    <div className="bg-[#fff3f0] min-h-screen pb-20">
      {/* --- Header -- */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center bg-[#d16170] text-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Haz tu pedido favorito</h1>
          <p className="text-[#fff3f0] text-lg leading-relaxed max-w-lg px-4">
            En <span className="font-semibold text-[#f5bfb2]">BomBocado</span> cada postre está hecho con dedicación, frescura y amor.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center py-10">
          <img src={incono} alt="Torta decorada" className="w-[45%] md:w-[53%] h-auto object-contain" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        {/* --- Filtros y Título -- */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
          <h2 className="text-3xl font-bold text-[#9c2007] border-b-2 border-[#f5bfb2] pb-2 text-center md:text-left">
            Explora Nuestros Postres
          </h2>
          <div className="shrink-0 w-full md:w-auto">
            <Filtros filtro={filtro} setFiltro={setFiltro} postresNombres={postresNombres} />
          </div>
        </div>

        {/* --- Grid de Productos -- */}
        <div className="mt-10">
          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {productosFiltrados.map((p) => (
                <div key={p.id} className="relative group">
                  {/* Usamos el componente ProductoCard */}
                  <ProductoCard producto={p} />
                </div>
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
