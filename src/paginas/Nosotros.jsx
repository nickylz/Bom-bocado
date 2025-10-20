import NavBar from "../componentes/NavBar";

export default function Nosotros() {
  return (
    <>
    

      {/* CONTENIDO */}
      <main>
        <h2>Nuestro equipo</h2>

        <div className="equipo">
          <img
            src="https://i.ibb.co/0jzcKN9s/20250805-1131-Cafeter-a-Aesthetic-Amistosa-simple-compose-01k1xh00vke1b99r54a3esvst4.png"
            alt="Equipo"
          />
        </div>

        <div className="intro">
          Somos un grupo de reposteros apasionados que unen tradición y creatividad para ofrecer experiencias únicas en
          cada postre.
        </div>

        <div className="texto-principal">
          Preparamos nuestros postres con mucho amor, dedicación y cuidado, para que los disfrutes con toda tu familia.
        </div>

        <div className="texto-secundario">
          Somos una empresa peruana que convierte momentos familiares en únicos y especiales, elaborando postres con
          ingredientes naturales y frescos, basados en recetas regionales al estilo casero y preparados con mucho amor y
          dedicación.
        </div>

        <section className="fondo-rosa">
          <div className="contenedor-cajas">
            <div className="caja">
              <img
                src="https://i.ibb.co/nqLVqQfR/94691f308486d9f0dff0c5a485f24301.jpg"
                alt="Misión"
              />
              <h3>Nuestra Misión</h3>
              <p>
                Alegra a nuestros clientes en las celebraciones y momentos más especiales con postres que los llenen de
                alegría.
              </p>
            </div>

            <div className="caja">
              <img
                src="https://i.ibb.co/93mLPFDW/20250807-1006-Equipo-Dise-ando-Pastel-remix-01k22h3272ebfbdckenrybya2c.png"
                alt="Visión"
              />
              <h3>Nuestra Visión</h3>
              <p>
                Ser reconocidos a nivel nacional e internacional como la empresa peruana más confiable en repostería
                fina.
              </p>
            </div>

            <div className="caja">
              <img
                src="https://i.ibb.co/6JDHv55w/20250807-1016-Equipo-de-Cafeter-a-Activo-remix-01k22hh36ven6r5y1sc28w3xws.png"
                alt="Qué buscamos"
              />
              <h3>¿Qué buscamos?</h3>
              <p>
                Impulsar el talento de nuestro equipo, innovar en cada receta y seguir creciendo junto a nuestros
                clientes.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="simple-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <p className="footer-copy">
              © 2025 BOM BOCADO - Repostería Fina. Todos los derechos reservados.
            </p>
          </div>
          <p>
            Síguenos en{" "}
            <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">Tik Tok</a>
          </p>
        </div>
      </footer>

      {/* MODALES */}
      <div id="modalLogin" className="modal" aria-hidden="true">
        <div
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <span id="cerrarModal" className="cerrar" aria-label="Cerrar">
            &times;
          </span>

          <img
            src="https://i.postimg.cc/WzQ2jJjC/lol.png"
            alt="BOM BOCADO"
            className="logo-modal"
          />

          <h2 id="modalTitle">¡Qué bueno tenerte de vuelta!</h2>
          <p>Inicia sesión para continuar con tu compra</p>

          <form id="formLogin">
            <input
              type="text"
              id="usuario"
              placeholder="Usuario o correo electrónico"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              required
            />
            <button type="submit" className="btn-login">
              Iniciar sesión
            </button>
          </form>

          <p className="registro-texto">
            ¿No tienes cuenta? <a href="/registro">Crea una aquí</a>
          </p>
        </div>
      </div>

      <div id="modalRegistro" className="modal" aria-hidden="true">
        <div
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitleRegistro"
        >
          <span id="cerrarRegistro" className="cerrar" aria-label="Cerrar">
            &times;
          </span>

          <img
            src="https://i.postimg.cc/WzQ2jJjC/lol.png"
            alt="BOM BOCADO"
            className="logo-modal"
          />

          <h2 id="modalTitleRegistro">Crea tu cuenta</h2>
          <p>Regístrate para poder comprar tus productos favoritos</p>

          <form id="formRegistro">
            <input
              type="text"
              id="nuevoUsuario"
              placeholder="Nombre completo"
              required
            />
            <input
              type="email"
              id="nuevoEmail"
              placeholder="Correo electrónico"
              required
            />
            <input
              type="password"
              id="nuevoPassword"
              placeholder="Contraseña"
              required
            />
            <button type="submit" className="btn-login">
              Registrarme
            </button>
          </form>

          <p className="registro-texto">
            ¿Ya tienes cuenta?{" "}
            <a href="#" id="linkVolverLogin">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
