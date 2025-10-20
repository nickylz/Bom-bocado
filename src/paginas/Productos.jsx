import NavBar from "../componentes/NavBar";

export default function Productos() {
  return (
    <>
            <NavBar />

      <section className="ola">
        <div className="contenido">
          <div className="imagen">
            <img
              src="https://i.postimg.cc/WzQ2jJjC/lol.png"
              alt="Torta decorada"
            />
          </div>
          <div className="textito">
            <h1>Haz tu pedido favorito</h1>
            <p>
              Cada postre es una combinación de sabor, ternura y frescura. Hechos
              con pasión para disfrutar en familia o regalar con cariño. BOM
              BOCADO convierte lo dulce en una experiencia única.
            </p>
          </div>
        </div>
      </section>

      {/* === COLECCIONES === */}
      <section className="colecciones">
        <h2 style={{ color: "#7a1a0a" }}>Pasteles</h2>
        <div className="colecciones-grid">
          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/70/c9/14/70c914af01fd5f7490192f559a508c42.jpg"
              alt="Macaloves"
            />
            <h3>Charlotte de Fresas</h3>
            <p>Suave y frutal</p>
            <div className="price">S/55.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/f6/b7/70/f6b7700c9ecd547d98470c67f8ed2870.jpg"
              alt="Pastel de Temporada"
            />
            <h3>Clásico Fresas & Crema</h3>
            <p>Dulce y esponjoso</p>
            <div className="price">S/65.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/d7/d9/e5/d7d9e5701c0f734db4f914e967501f2d.jpg"
              alt="Pastel de Temporada"
            />
            <h3>Red Velvet con Fresas</h3>
            <p>Suave y elegante</p>
            <div className="price">S/70.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/95/8c/fc/958cfc0ca8d10651f1c29e76e3c00007.jpg"
              alt="Pastel de Frambuesa"
            />
            <h3>Cheesecake de Fresas</h3>
            <p>Cremoso y fresco</p>
            <div className="price">S/60.00</div>
            <button className="comp-boton">Comprar</button>
          </div>
        </div>
      </section>

      {/* Galletas */}
      <section className="colecciones">
        <h2 style={{ color: "#7a1a0a" }}>Galletas</h2>
        <div className="colecciones-grid">
          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/3d/1e/ca/3d1eca4db29ad0f033fbb03c2165132e.jpg"
              alt="Galletas de Frambuesa"
            />
            <h3>Fresas Glaseadas</h3>
            <p>Suaves y crocantes</p>
            <div className="price">S/12.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/59/dd/24/59dd2470430abe11a0482fa3e3c5a8b0.jpg"
              alt="Galletas de Temporada"
            />
            <h3>Bocados de Fresa</h3>
            <p>Suaves y frutales</p>
            <div className="price">S/14.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/20/d8/91/20d891848730b1987fa18b975ea5ec6e.jpg"
              alt="Galletas Variadas"
            />
            <h3>Corazones Velvet</h3>
            <p>Rojas y cremosas</p>
            <div className="price">S/16.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/84/6c/a0/846ca0a6ec8219f74f924f8b79c3e9bf.jpg"
              alt="Galletas de Chocolate"
            />
            <h3>Estrellitas de Mermelada</h3>
            <p>Dulces y rellenas</p>
            <div className="price">S/13.00</div>
            <button className="comp-boton">Comprar</button>
          </div>
        </div>
      </section>

      {/* Donas */}
      <section className="colecciones">
        <h2 style={{ color: "#7a1a0a" }}>Donas</h2>
        <div className="colecciones-grid">
          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/af/19/32/af1932708236ef09f80708a822da78d7.jpg"
              alt="Dona Glaseada"
            />
            <h3>Dona Glaseada</h3>
            <p>Dulce y esponjosa</p>
            <div className="price">S/10.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/fb/7e/ec/fb7eecc7780f7695518d74cfb9b8489d.jpg"
              alt="Dona de Temporada"
            />
            <h3>Dona Primavera</h3>
            <p>Glaseado rosado con fresas</p>
            <div className="price">S/11.50</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/5c/c4/60/5cc460bbac19a9db23183c8df11362dd.jpg"
              alt="Dona Rellena"
            />
            <h3>Corazón de Vainilla</h3>
            <p>Suave y con delicioso relleno</p>
            <div className="price">S/12.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/f2/8b/75/f28b7536a7b468d792d739548d120621.jpg"
              alt="Dona de Frambuesa"
            />
            <h3>Nube de Fresas</h3>
            <p>Con crema y fresas frescas</p>
            <div className="price">S/11.00</div>
            <button className="comp-boton">Comprar</button>
          </div>
        </div>
      </section>

      {/* Cupcakes */}
      <section className="colecciones">
        <h2 style={{ color: "#7a1a0a" }}>Cupcakes</h2>
        <div className="colecciones-grid">
          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/e4/73/04/e47304511a9bad8a1b667b3022ad3f86.jpg"
              alt="Cupcake"
            />
            <h3>Velvet Pasión</h3>
            <p>Bizcocho rojo y cremoso</p>
            <div className="price">S/6.50</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/3a/33/b4/3a33b48d4d9400b8a8735a8a46b8a5d6.jpg"
              alt="Cupcake"
            />
            <h3>Magia del Bosque</h3>
            <p>Inspirada en la estación</p>
            <div className="price">S/7.00</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/736x/0c/4e/30/0c4e301ebb111d34551e62bc6d8707c4.jpg"
              alt="Cupcake"
            />
            <h3>Latido Dulce</h3>
            <p>Chocolate con crema suave</p>
            <div className="price">S/7.50</div>
            <button className="comp-boton">Comprar</button>
          </div>

          <div className="coleccion-item">
            <img
              src="https://i.pinimg.com/1200x/3d/e9/7f/3de97fb9492b9896a37f9251f725997b.jpg"
              alt="Cupcake"
            />
            <h3>Fresa Delicia</h3>
            <p>Vainilla con crema y fresa</p>
            <div className="price">S/6.00</div>
            <button className="comp-boton">Comprar</button>
          </div>
        </div>
      </section>

      <footer className="simple-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <p className="footer-copy">
              © 2025 BOM BOCADO - Repostería Fina. Todos los derechos
              reservados.
            </p>
          </div>
          <p>
            Síguenos en <a href="#">Instagram</a> |{" "}
            <a href="#">Facebook</a> | <a href="#">TikTok</a>
          </p>
        </div>
      </footer>
    </>
  );
}
