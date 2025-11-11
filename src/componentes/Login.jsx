// src/components/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { FcGoogle } from "react-icons/fc"; // 🔹 Ícono de Google

export default function Login() {
  const {
    usuarioActual,
    iniciarSesion,
    registrarUsuario,
    iniciarConGoogle,
    cerrarSesion,
  } = useAuth();

  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);

  const [loginCorreo, setLoginCorreo] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regCorreo, setRegCorreo] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regFoto, setRegFoto] = useState(null);

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await iniciarSesion(loginCorreo, loginPass);
      setModalLogin(false);
      alert("Inicio de sesión exitoso!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🔹 REGISTRO
  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(regCorreo, regUser, regPass, regFoto);
      setModalRegistro(false);
      alert("Cuenta creada correctamente!");
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  };

  return (
    <>
      {/* ===== BOTÓN DE USUARIO / LOGIN ===== */}
      {usuarioActual ? (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <img
            src={usuarioActual.fotoURL || "/default-user.png"}
            alt="perfil"
            className="w-10 h-10 rounded-full border border-[#d8718c]"
          />
          <span className="text-[#7a1a0a] font-semibold">
            {usuarioActual.user}
          </span>
          <button
            onClick={cerrarSesion}
            className="bg-[#d8718c] text-white px-4 py-1 rounded-xl hover:bg-[#b84c68] transition"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalLogin(true)}
          className="bg-[#fff3f0] border border-[#da6786] text-[#da6786] font-semibold px-4 py-1 rounded-xl hover:bg-[#f5bfb2] transition"
        >
          Iniciar sesión
        </button>
      )}

      {/* ===== MODAL LOGIN ===== */}
      {modalLogin && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModalLogin(false)}
        >
          <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2]">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-6">Bienvenido</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Correo"
                value={loginCorreo}
                onChange={(e) => setLoginCorreo(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"
              />

              {/* 🔸 Botones lado a lado */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={iniciarConGoogle}
                  className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold"
                >
                  <FcGoogle className="text-xl" /> Google
                </button>
              </div>
            </form>

            <p className="text-[#7a1a0a] mt-5 text-sm">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => {
                  setModalLogin(false);
                  setModalRegistro(true);
                }}
                className="text-[#d8718c] font-semibold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ===== MODAL REGISTRO ===== */}
      {modalRegistro && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModalRegistro(false)}
        >
          <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2]">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-6">
              Crear cuenta
            </h2>
            <form onSubmit={handleRegistro} className="space-y-4">
              <input
                type="email"
                placeholder="Correo"
                value={regCorreo}
                onChange={(e) => setRegCorreo(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl"
              />
              <input
                type="text"
                placeholder="Usuario"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setRegFoto(e.target.files[0])}
                className="w-full bg-white border border-[#f5bfb2] px-4 py-3 rounded-xl"
              />

              {/* 🔸 Botones lado a lado */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
                >
                  Crear cuenta
                </button>

                <button
                  type="button"
                  onClick={iniciarConGoogle}
                  className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold"
                >
                  <FcGoogle className="text-xl" /> Google
                </button>
              </div>
            </form>

            <p className="text-[#7a1a0a] mt-5 text-sm">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => {
                  setModalRegistro(false);
                  setModalLogin(true);
                }}
                className="text-[#d8718c] font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
