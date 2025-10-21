import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full overflow-x-hidden bg-[#fdd2d7] text-[#9c2007] border-t border-[#f5bfb2] shadow-[0_24px_48px_-8px_#d8718c26]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* ======= CONTACTO ======= */}
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-semibold text-[#d8718c] mb-4">
            Información de contacto
          </h3>

          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-xl text-[#a04f66] mt-1" />
            <p className="text-sm leading-relaxed">
              <strong>Ubicación:</strong>{" "}
              <a
                href="https://www.google.com/maps/place/Av.+Primavera+123,+Miraflores,+Lima,+Perú"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e46945] transition-colors"
              >
                Av. Primavera 123, Miraflores, Lima, Perú
              </a>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <FaPhoneAlt className="text-xl text-[#a04f66] mt-1" />
            <p className="text-sm leading-relaxed">
              <strong>Teléfono:</strong>{" "}
              <a
                href="tel:+51987654321"
                className="hover:text-[#e46945] transition-colors"
              >
                +51 987 654 321
              </a>{" "}
              |{" "}
              <a
                href="https://wa.me/51987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-colors inline-flex items-center gap-1"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <FaEnvelope className="text-xl text-[#a04f66] mt-1" />
            <p className="text-sm leading-relaxed">
              <strong>Correo:</strong>{" "}
              <a
                href="mailto:pedidos@bombocado.com"
                className="hover:text-[#e46945] transition-colors"
              >
                pedidos@bombocado.com
              </a>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <FaClock className="text-xl text-[#a04f66] mt-1" />
            <p className="text-sm leading-relaxed">
              <strong>Horario:</strong> Lun a Vie: 8AM - 8PM | Sáb: 9AM - 7PM | Dom: 9AM - 6PM
            </p>
          </div>

          {/* ======= PROMOCIÓN ======= */}
          <div className="mt-6 space-y-2">
            <div className="bg-[#f5bfb2] text-[#9c2007] px-4 py-2 rounded-full text-sm inline-block shadow-sm">
              Delivery gratis por compras mayores a S/. 45.00
            </div>

            <p className="text-sm text-[#333] max-w-md leading-relaxed">
              No te pierdas nuestras{" "}
              <span className="text-[#d8718c] font-semibold">novedades</span>,{" "}
              <span className="text-[#d8718c] font-semibold">promociones</span>{" "}
              y los momentos más dulces de nuestro día a día.
            </p>
          </div>
        </div>

        {/* ======= MAPA + REDES ======= */}
        <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.9560470969716!2d-77.03926262503623!3d-12.13166258816737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b7e1b4b5a533%3A0xa549043226dcfb18!2sBuenavista%20Caf%C3%A9!5e0!3m2!1ses-419!2spe!4v1753934291804!5m2!1ses-419!2spe"
            width="100%"
            height="250"
            className="rounded-2xl shadow-md border-none"
            allowFullScreen
            loading="lazy"
            title="Mapa de ubicación"
          ></iframe>

          <div className="flex flex-col items-center text-center">
            <p className="font-semibold mb-2 text-[#9c2007]">Síguenos en</p>
            <div className="flex gap-6 text-2xl">
              <a
                href="#"
                className="text-[#d8718c] hover:scale-110 hover:text-[#e46945] transition-transform duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-[#d8718c] hover:scale-110 hover:text-[#e46945] transition-transform duration-300"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-[#d8718c] hover:scale-110 hover:text-[#e46945] transition-transform duration-300"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
