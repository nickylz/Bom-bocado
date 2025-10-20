import React from "react";
import NavBar from "../componentes/NavBar";

export default function Inicio() {
  return (
    <>
      {/* ======= NAVBAR ======= */}
      <NavBar/>

      {/* ======= CUERPO PRINCIPAL ======= */}
      <main>
        <section className="ola">
          <div className="contenido">
            <div className="imagen">
              <img
                src="https://i.postimg.cc/WzQ2jJjC/lol.png"
                alt="Torta decorada"
              />
            </div>
            <div className="textito">
              <h1>Postres únicos</h1>
              <p>
                En BOM BOCADO creamos repostería fina con amor, ingredientes
                seleccionados y detalles únicos. Perfectos para regalar o
                disfrutar en familia.
              </p>
              <a href="/contacto" className="btn-pedido">
                Hacer pedido
              </a>
            </div>
          </div>
        </section>

        <section className="colecciones">
          <h2 className="colecciones-titulo" style={{ color: "#7a1a0a" }}>
            ¡Lo más Vendido!
          </h2>

          <div className="colecciones-grid">
            <div className="coleccion-item">
              <img
                src="https://i.pinimg.com/1200x/a5/75/8c/a5758c95cfd57b1c1d1292f0a0be02ec.jpg"
                alt="Chocolate Bar"
              />
              <h3>Macaloves - Macarons de Amor</h3>
              <a href="/novedades" className="btn-detalles">
                Ver más →
              </a>
            </div>

            <div className="coleccion-item">
              <img
                src="https://i.pinimg.com/736x/d1/8f/da/d18fdaa9cd95c431e6fb77c53cda987d.jpg"
                alt="Truffles"
              />
              <h3>Strawberry Cloud Croissant</h3>
              <a href="/novedades" className="btn-detalles">
                Ver más →
              </a>
            </div>

            <div className="coleccion-item">
              <img
                src="https://i.pinimg.com/1200x/02/a1/00/02a10030eaed821b1525560b18e4b7b8.jpg"
                alt="Galletas de amor"
              />
              <h3>Heartful Bites - Galletas de Amor</h3>
              <a href="/novedades" className="btn-detalles">
                Ver más →
              </a>
            </div>

            <div className="coleccion-item">
              <img
                src="https://i.pinimg.com/736x/e0/99/63/e099634012685ea760aa16416f208467.jpg"
                alt="Cherry Kiss Pie"
              />
              <h3>Cherry Kiss Pie</h3>
              <a href="/novedades" className="btn-detalles">
                Ver más →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ======= FOOTER ======= */}
      <footer className="simple-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <p className="footer-copy">
              © 2025 BOM BOCADO - Repostería Fina. Todos los derechos reservados.
            </p>
          </div>
          <p className="meow">
            Síguenos en{" "}
            <a href="#">Instagram</a> | <a href="#">Facebook</a> |{" "}
            <a href="#">TikTok</a>
          </p>
        </div>
      </footer>

      {/* ======= MODALES ======= */}
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
