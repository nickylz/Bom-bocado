import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Páginas
import Inicio from "./paginas/Index";
import Nosotros from "./paginas/Nosotros";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle"; // <-- NUEVA RUTA
import Novedades from "./paginas/Novedades";
import Contacto from "./paginas/Contacto";
import Perfil from "./paginas/Perfil";
import Intranet from "./paginas/Intranet";
import Checkout from "./paginas/Checkout";
import Gracias from "./paginas/Gracias";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} /> {/* <-- RUTA AÑADIDA */}
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/intranet" element={<Intranet />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gracias" element={<Gracias />} />
      </Route>
    </Routes>
  );
}

export default App;
