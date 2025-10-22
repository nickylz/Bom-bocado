import { useState, useEffect } from "react";

export default function Login() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regCorreo, setRegCorreo] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("usuarioActual");
    if (savedUser) setUsuarioActual(JSON.parse(savedUser));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const encontrado = usuarios.find(
      (u) =>
        (u.user === loginUser || u.correo === loginUser) &&
        u.contrasena === loginPass
    );

    if (encontrado) {
      localStorage.setItem("usuarioActual", JSON.stringify(encontrado));
      setUsuarioActual(encontrado);
      setModalLogin(false);
      alert(`Bienvenido, ${encontrado.user}!`);
    } else {
      alert("Usuario o contraseña incorrectos, o la cuenta no existe.");
    }
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some((u) => u.user === regUser || u.correo === regCorreo)) {
      alert("Ese usuario o correo ya está registrado.");
      return;
    }

    const nuevo = {
      correo: regCorreo,
      user: regUser,
      contrasena: regPass,
    };

    usuarios.push(nuevo);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(nuevo));
    setUsuarioActual(nuevo);
    setModalRegistro(false);
    alert(`Cuenta creada para ${nuevo.user}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    setUsuarioActual(null);
  };

  return (
    <>
      {/* ===== BOTÓN DE USUARIO / LOGIN ===== */}
      {usuarioActual ? (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-[#7a1a0a] font-semibold">
            {usuarioActual.user}
          </span>
          <button
            onClick={handleLogout}
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
            <h2 className="text-3xl font-bold text-[#8f2133] mb-6">
              Bienvenido 
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Usuario o correo"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
              />
              <button
                type="submit"
                className="w-full bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
              >
                Iniciar sesión
              </button>
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
          onClick={(e) =>
            e.target === e.currentTarget && setModalRegistro(false)
          }
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
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
              />
              <input
                type="text"
                placeholder="Usuario"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8718c] transition"
              />
              <button
                type="submit"
                className="w-full bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
              >
                Crear cuenta
              </button>
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
