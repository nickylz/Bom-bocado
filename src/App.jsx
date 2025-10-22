import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import { CarritoProvider } from "./context/CarritoContext";
import { CarritoFlotante } from "./componentes/CarritoFlotante"; // 👈 Importamos el carrito

// Páginas
import Footer from "./componentes/Footer";
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
        {/* === NAVBAR visible en todas las páginas === */}
        <NavBar />

        {/* === Carrito flotante === */}
        <CarritoFlotante />

        {/* === Rutas === */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>

        {/* === Footer === */}
        <Footer />
      </CarritoProvider>
    </Router>
  );
}

export default App;
