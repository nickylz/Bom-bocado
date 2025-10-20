import React, { useEffect } from "react";
import NavBar from "../componentes/NavBar";

export default function Contacto() {
  useEffect(() => {
    // ======= Animación del blockquote =======
    const quote = document.getElementById("intro-quote");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
            const fp = document.getElementById("followPhrase");
            if (fp) fp.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );
    if (quote) observer.observe(quote);
  }, []);

  return (
    <>
          <NavBar />

      {/* ======= SECCIÓN CONTACTO ======= */}
      <section aria-label="Contacto">
        <div className="section-header">
          <h1>¡Hablemos!</h1>
          <blockquote id="intro-quote">
            ¿Tienes alguna pregunta, quieres hacer un pedido especial o simplemente quieres saludarnos?  
            En Bom Bocado, nos encanta escucharte. Contáctanos por el medio que prefieras y con gusto te atenderemos
            con el amor en cada pedazo que nos caracteriza.
          </blockquote>
        </div>

        <div className="layout">
          {/* IZQUIERDA */}
          <div className="left-column">
            <form aria-label="Formulario de contacto" action="#" noValidate>
              <h2>Escríbenos</h2>

              <div className="form-field">
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />
              </div>

              <div className="form-field">
                <input type="tel" id="telefono" name="telefono" placeholder="Tu teléfono" />
              </div>

              <div className="form-field">
                <input type="email" id="correo" name="correo" placeholder="Tu correo electrónico" required />
              </div>

              <div className="form-field">
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="6"
                  placeholder="Escríbenos un mensaje..."
                  required
                ></textarea>
              </div>

              <div>
                <button type="submit">Enviar mensaje</button>
              </div>
            </form>
          </div>

          {/* DERECHA */}
          <div className="right-column">
            <div aria-label="Información de contacto y redes sociales">
              <h3>Información de contacto</h3>

              <div className="contact-item">
                <div className="icon-wrapper">📍</div>
                <div>
                  <strong>Ubicación:</strong>
                  <p>
                    <a
                      href="https://www.google.com/maps/place/Av.+Primavera+123,+Miraflores,+Lima,+Perú"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Av. Primavera 123, Miraflores, Lima, Perú
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-wrapper">📞</div>
                <div>
                  <strong>Teléfono y WhatsApp:</strong>
                  <p>
                    <a href="tel:+51987654321">+51 987 654 321</a> |{" "}
                    <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-wrapper">📧</div>
                <div>
                  <strong>Correo electrónico:</strong>
                  <p>
                    <a href="mailto:pedidos@bombocado.com">pedidos@bombocado.com</a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-wrapper">🕒</div>
                <div>
                  <strong>Horario:</strong>
                  <p>Lun a Vie: 8AM - 8PM | Sáb: 9AM - 7PM | Dom: 9AM - 6PM</p>
                </div>
              </div>

              <div className="contact-item" style={{ flexDirection: "column", gap: "8px" }}>
                <div className="social-label">
                  Delivery gratis por compras mayores a S/. 45.00{" "}
                </div>
                <p className="follow-phrase" id="followPhrase">
                  No te pierdas nuestras{" "}
                  <span className="highlight">novedades</span>,{" "}
                  <span className="highlight">promociones</span> y los momentos más dulces
                  de nuestro día a día.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="map-container" aria-label="Mapa de ubicación">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9560470969716!2d-77.03926262503623!3d-12.13166258816737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b7e1b4b5a533%3A0xa549043226dcfb18!2sBuenavista%20Caf%C3%A9!5e0!3m2!1ses-419!2spe!4v1753934291804!5m2!1ses-419!2spe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Mapa de ubicación"
          ></iframe>
        </div>
      </section>

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
    </>
  );
}
