import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Páginas
import Inicio from "./paginas/Index";
import Nosotros from "./paginas/Nosotros";
import Productos from "./paginas/Productos";
import Novedades from "./paginas/Novedades";
import Contacto from "./paginas/Contacto";
import Perfil from "./paginas/Perfil";
import Intranet from "./paginas/Intranet";
import Checkout from "./paginas/Checkout"; // <-- NUEVA RUTA
import Gracias from "./paginas/Gracias";   // <-- NUEVA RUTA

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/intranet" element={<Intranet />} />
        <Route path="/checkout" element={<Checkout />} /> {/* <-- RUTA AÑADIDA */}
        <Route path="/gracias" element={<Gracias />} />   {/* <-- RUTA AÑADIDA */}
      </Route>
    </Routes>
  );
}

export default App;
