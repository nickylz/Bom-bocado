import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#ffe2e6] shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-[#d8718c]"
        >
          BOM<span className="text-[#7a1a0a]">BOCADO</span>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[#7a1a0a] text-2xl md:hidden transition-transform duration-300"
          aria-label="Abrir menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* LINKS */}
        <nav
          className={`${
            menuOpen ? "max-h-80 py-4" : "max-h-0"
          } md:max-h-none md:py-0 
          overflow-hidden flex flex-col md:flex-row md:items-center md:gap-6 
          absolute md:static top-full left-0 w-full md:w-auto bg-[#fff3f0] md:bg-transparent 
          shadow-md md:shadow-none transition-all duration-500 ease-in-out text-center`}
        >
          <Link
            to="/"
            className="block md:inline text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945] transition-colors duration-300"
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            className="block md:inline text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Productos
          </Link>
          <Link
            to="/nosotros"
            className="block md:inline text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            className="block md:inline text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Contacto
          </Link>
          <Link
            to="/novedades"
            className="block md:inline text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Novedades
          </Link>
          <Link
            to="/carrito"
            className="block md:inline text-[#d8718c] text-xl py-2 hover:text-[#e46945]"
          >
            <FaShoppingCart />
          </Link>
        </nav>
      </div>
    </header>
  );
}
