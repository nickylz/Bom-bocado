// src/paginas/Perfil.jsx
import { useAuth } from "../context/authContext";

function Perfil() {
  const { usuarioActual, cerrarSesion } = useAuth();

  if (!usuarioActual) {
    return <p>No has iniciado sesión</p>;
  }

  return (
    <div className="perfil-container">
      {/* ✅ Foto de perfil */}
      <img
        src={usuarioActual.fotoURL || "/default-avatar.png"} // imagen por defecto si no tiene
        alt="Foto de perfil"
        className="perfil-foto"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "10px",
        }}
      />

      {/* ✅ Nombre del usuario */}
      <h2>{usuarioActual.user}</h2>

      {/* ✅ Correo del usuario */}
      <p>{usuarioActual.correo}</p>

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default Perfil;
