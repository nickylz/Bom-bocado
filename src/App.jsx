import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/authContext";

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

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarritoProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/novedades" element={<Novedades />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/intranet" element={<Intranet />} />
            </Route>
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
