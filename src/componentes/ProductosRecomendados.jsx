import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductoCard from './ProductoCard';

const ProductosRecomendados = () => {
  const { id } = useParams();
  const [productosRecomendados, setProductosRecomendados] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState('');

  useEffect(() => {
    const fetchProductoActual = async () => {
      if (id) {
        const productoRef = doc(db, "productos", id);
        const productoSnap = await getDoc(productoRef);
        if (productoSnap.exists()) {
            setCategoriaActual(productoSnap.data().categoria);
        }
      }
    };
    fetchProductoActual();
  }, [id]);

  useEffect(() => {
    const fetchProductosRecomendados = async () => {
      if (categoriaActual) {
        const q = query(
          collection(db, "productos"),
          where("categoria", "==", categoriaActual)
        );
        const querySnapshot = await getDocs(q);
        const productos = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(producto => producto.id !== id)
          .slice(0, 5); // Limitar a 5 productos
        setProductosRecomendados(productos);
      }
    };

    fetchProductosRecomendados();
  }, [categoriaActual, id]);

  if (productosRecomendados.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">También te podría gustar...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {productosRecomendados.map(producto => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default ProductosRecomendados;
