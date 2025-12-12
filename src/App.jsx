import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Páginas
import Inicio from "./paginas/Index";
import Nosotros from "./paginas/Nosotros";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle"; 
import Novedades from "./paginas/Novedades";
import Perfil from "./paginas/Perfil";
import Intranet from "./paginas/Intranet";
import Checkout from "./paginas/Checkout";
import Gracias from "./paginas/Gracias";
import LibroDeReclamaciones from "./paginas/LibroDeReclamaciones"; // Importar la nueva página

// Contexto y Mascota
import { MascotProvider } from './context/MascotContext';
import CakeMascot from './componentes/CakeMascot';
import "./App.css";

function App() {
  return (
    <MascotProvider>
      {/* La mascota va fuera de Routes para estar siempre visible */}
      <CakeMascot />
      
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/intranet" element={<Intranet />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/libro-de-reclamaciones" element={<LibroDeReclamaciones />} /> // Añadir nueva ruta
        </Route>
      </Routes>
    </MascotProvider>
  );
}

export default App;
