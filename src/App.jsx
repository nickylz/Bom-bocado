import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import Footer from "./componentes/Footer";

// Tus páginas
import Inicio from "./paginas/Index";
import Nosotros from "./paginas/Nosotros";
import Productos from "./paginas/productos";
import Novedades from "./paginas/Novedades";
import Contacto from "./paginas/contacto";
import "./App.css";

function App() {
  return (
    <Router>
      {/* === NAVBAR visible en todas las páginas === */} <NavBar />

      
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>

    
      <Footer />
    </Router>
  );
}

export default App;
