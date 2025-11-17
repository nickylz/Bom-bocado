import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Login from "./Login";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#ffc8ce] shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-[#da6786]"
        >
          BOM<span className="text-[#8a152e]">BOCADO</span>
        </Link>

        {/* BOTÓN HAMBURGUESA (solo móvil) */}
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
            menuOpen ? "max-h-112 py-4" : "max-h-0"
          } md:max-h-none md:py-0 
          overflow-hidden flex flex-col md:flex-row md:items-center md:gap-6 
          absolute md:static top-full left-0 w-full md:w-auto bg-[#fff3f0] md:bg-transparent 
          shadow-md md:shadow-none transition-all duration-500 ease-in-out text-center`}
        >
          <Link
            to="/"
            className="text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            className="text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Productos
          </Link>
          <Link
            to="/nosotros"
            className="text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            className="text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Contacto
          </Link>
          <Link
            to="/novedades"
            className="text-[#7a1a0a] font-semibold py-2 hover:text-[#e46945]"
          >
            Novedades
          </Link>

          {/* LOGIN SOLO EN ESCRITORIO */}
          <div className="hidden md:block">
            <Login />
          </div>

          {/* LOGIN SOLO EN MÓVIL (abajo del menú) */}
          <div className="block md:hidden mt-4 border-t border-[#f5bfb2] pt-4">
            <Login />
          </div>
        </nav>
      </div>
    </header>
  );
}
