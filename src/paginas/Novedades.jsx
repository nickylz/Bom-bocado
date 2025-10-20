import React from "react";
import NavBar from "../componentes/NavBar";

export default function Novedades() {
  return (
    <>
      <NavBar />

      <main>
        <h2 className="colecciones-titulo">Nuevos Productos</h2>

        <section className="colecciones-grid" style={{ padding: "0 40px 40px 40px" }}>
          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/3d/cb/b1/3dcbb16bff6ce4358434039e23993c28.jpg"
              alt="Artículo 1"
            />
            <div className="article-date">50% descuento!!</div>
            <p>Pastel de vainilla con fresas frescas y crema batida. Perfecto para cualquier celebración.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/e7/12/3c/e7123c7cc0469a57855c9cfa818ffde1.jpg"
              alt="Artículo 2"
            />
            <div className="article-date">20% descuento!!</div>
            <p>Deliciosos bombones de chocolate con forma de corazón, ideales para regalar.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/4c/e9/a6/4ce9a654164e9e5c8b829abba145038b.jpg"
              alt="Artículo 3"
            />
            <div className="article-date">Delivery gratis</div>
            <p>Mini tartas y galletas con mermelada en forma de corazón. Dulzura en cada bocado.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/6a/8b/0f/6a8b0f584381944802a3fc3f9656259a.jpg"
              alt="Artículo 4"
            />
            <div className="article-date">+ chocolate gratis</div>
            <p>Manzanas acarameladas con cobertura brillante y un toque de chocolate extra.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>
        </section>

        <h2 className="colecciones-titulo">Postres de Temporada</h2>

        <section className="colecciones-grid" style={{ padding: "0 40px 40px 40px" }}>
          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/0a/50/47/0a50472b937f67e9cf7d1bd2f350f42c.jpg"
              alt="Postre 1"
            />
            <div className="article-date">Especial de verano</div>
            <p>Dulces, suaves y perfectas para un antojo fresco.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/fd/71/7a/fd717a6b2290d97424dbfc2d4c9a17ce.jpg"
              alt="Postre 2"
            />
            <div className="article-date">Solo en invierno</div>
            <p>Ideal para disfrutar en casa durante los días fríos.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/be/92/a5/be92a5f739299ecfc5b9c86ca04fa76b.jpg"
              alt="Postre 3"
            />
            <div className="article-date">Otoño 2025</div>
            <p>Esponjoso y perfecto para acompañar con café.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>

          <article className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/11/13/f1/1113f1f60919fac7f5bdf63a6c4bca9c.jpg"
              alt="Postre 4"
            />
            <div className="article-date">Primavera fresca</div>
            <p>Ligero, afrutado y lleno de color para la temporada.</p>
            <a href="#" className="btn-detalles">Ver más →</a>
          </article>
        </section>
      </main>

      <footer className="simple-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <p className="footer-copy">© 2025 BOM BOCADO - Repostería Fina. Todos los derechos reservados.</p>
          </div>
          <p>
            Síguenos en
            <a href="#"> Instagram</a> | 
            <a href="#"> Facebook</a> | 
            <a href="#"> Tik Tok</a>
          </p>
        </div>
      </footer>
    </>
  );
}
