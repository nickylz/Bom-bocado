import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import { CarritoProvider } from "./context/CarritoContext";
import { CarritoFlotante } from "./componentes/CarritoFlotante";

// Componentes comunes
import Footer from "./componentes/Footer";

// Páginas
import Inicio from "./paginas/Index";
import Nosotros from "./paginas/Nosotros";
import Productos from "./paginas/Productos";
import Novedades from "./paginas/Novedades";
import Contacto from "./paginas/Contacto";

import "./App.css";

function App() {
  return (
    <Router>
      <CarritoProvider>
        {/* === Navbar visible en todas las páginas === */}
        <NavBar />

        {/* === Carrito flotante === */}
        

        {/* === Rutas === */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
<CarritoFlotante />
        {/* === Footer visible en todas las páginas === */}
        <Footer />
      </CarritoProvider>
    </Router>
  );
}

export default App;
