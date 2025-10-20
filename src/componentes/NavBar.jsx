import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header>
      <div className="header-inner">
        <button className="nav-toggle" id="navToggle" aria-label="Abrir menú">
          ☰
        </button>

        <nav id="mainNav">
          <Link to="/">INICIO</Link>
          <Link to="/nosotros">NOSOTROS</Link>
          <Link to="/productos">PRODUCTOS</Link>
          <Link to="/novedades">NOVEDADES</Link>
          <Link to="/contacto">CONTACTO</Link>
        </nav>

        <div id="userArea"></div>
      </div>
    </header>
  );
}

export default NavBar;
