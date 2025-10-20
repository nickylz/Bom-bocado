import { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#ecd2e7] text-[#4b2447] border-b-2 border-[#bc73a3] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🧁 Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#7c2c53] hover:text-[#a87199] transition-colors"
        >
          Bom-Bocado
        </Link>

        {/* 🍔 Botón hamburguesa */}
        <button
          className="nav-toggle text-3xl md:hidden text-[#7c2c53] focus:outline-none"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* 🌸 Menú (modo escritorio) */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          <Link
            to="/"
            className="hover:text-[#bc3a7] transition-colors duration-200"
          >
            INICIO
          </Link>
          <Link
            to="/nosotros"
            className="hover:text-[#bc3a7] transition-colors duration-200"
          >
            NOSOTROS
          </Link>
          <Link
            to="/productos"
            className="hover:text-[#bc3a7] transition-colors duration-200"
          >
            PRODUCTOS
          </Link>
          <Link
            to="/novedades"
            className="hover:text-[#bc3a7] transition-colors duration-200"
          >
            NOVEDADES
          </Link>
          <Link
            to="/contacto"
            className="hover:text-[#bc3a7] transition-colors duration-200"
          >
            CONTACTO
          </Link>
        </nav>

        {/* 🧩 Contenedor dinámico */}
        <div id="userArea" className="hidden md:block"></div>
      </div>

      {/* 📱 Menú móvil */}
      {menuOpen && (
        <nav className="flex flex-col md:hidden bg-[#fbe8f4] border-t border-[#bc73a3] text-center py-3 space-y-2 text-lg shadow-inner animate-fade-in">
          <Link
            to="/"
            className="block hover:text-[#bc3a7] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            INICIO
          </Link>
          <Link
            to="/nosotros"
            className="block hover:text-[#bc3a7] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            NOSOTROS
          </Link>
          <Link
            to="/productos"
            className="block hover:text-[#bc3a7] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            PRODUCTOS
          </Link>
          <Link
            to="/novedades"
            className="block hover:text-[#bc3a7] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            NOVEDADES
          </Link>
          <Link
            to="/contacto"
            className="block hover:text-[#bc3a7] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            CONTACTO
          </Link>
        </nav>
      )}
    </header>
  );
}

export default NavBar;
