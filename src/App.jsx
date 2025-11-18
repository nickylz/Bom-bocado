import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import { CarritoProvider } from "./context/CarritoContext";
import { CarritoFlotante } from "./componentes/CarritoFlotante";
import { AuthProvider } from "./context/authContext";
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
    <Router basename="/Bom-bocado">  
      <AuthProvider>
        <CarritoProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
          <CarritoFlotante />
          <Footer />
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
