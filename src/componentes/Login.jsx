import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useModal } from "../context/ModalContext"; // 1. Importamos el hook para modales
import { FcGoogle } from "react-icons/fc";
import Ajustes from "./Ajustes";

export default function Login() {
  const {
    usuarioActual,
    iniciarSesion,
    registrarUsuario,
    iniciarConGoogle,
  } = useAuth();
  
  // 2. Traemos la función para mostrar nuestro modal personalizado
  const { mostrarModal } = useModal();

  const [modalLogin, setModalLogin] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalAjustes, setModalAjustes] = useState(false);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regCorreo, setRegCorreo] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regFoto, setRegFoto] = useState(null);

  // 3. Reemplazamos la alerta fea por nuestro modal "insano"
  useEffect(() => {
    if (usuarioActual && modalLogin) {
      setModalLogin(false);
      // ¡Aquí está la magia!
      mostrarModal(
        `¡Bienvenido, ${usuarioActual.nombre.split(' ')[0]}!`,
        "Tu inicio de sesión fue exitoso. ¡Disfruta de nuestros postres!"
      );
    }
  }, [usuarioActual, modalLogin, mostrarModal]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await iniciarSesion(loginIdentifier, loginPass);
    } catch (err) {
      // También para los errores
      mostrarModal("Error al iniciar sesión", err.message);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(regCorreo, regNombre, regUsername, regPass, regFoto);
      setModalRegistro(false);
      // Y para el registro exitoso
      mostrarModal("¡Cuenta Creada!", "Tu registro fue exitoso. Ahora puedes iniciar sesión.");
    } catch (err) {
      // Y para los errores de registro
      mostrarModal("Error en el registro", err.message);
    }
  };

  const nombreMostrado = usuarioActual?.nombre || 'Usuario';

  return (
    <>
      {usuarioActual ? (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <img
            src={usuarioActual.fotoURL || "/default-user.png"}
            alt="perfil"
            className="w-10 h-10 rounded-full border border-[#d8718c] cursor-pointer"
            onClick={() => setModalAjustes(true)}
          />
          <span className="text-[#7a1a0a] font-semibold">
            {nombreMostrado.length > 15 ? nombreMostrado.split(" ")[0] : nombreMostrado}
          </span>
        </div>
      ) : (
        <button
          onClick={() => setModalLogin(true)}
          className="bg-[#fff3f0] border border-[#da6786] text-[#da6786] font-semibold px-4 py-1 rounded-xl hover:bg-[#f5bfb2] transition"
        >
          Iniciar sesión
        </button>
      )}

      {modalLogin && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModalLogin(false)}
        >
          <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2]">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-6">Bienvenido</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Correo o Nombre de usuario"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]"
              />
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={async () => {
                      try {
                          await iniciarConGoogle();
                          // El useEffect se encargará de mostrar el modal de bienvenida
                      } catch (err) {
                          mostrarModal("Error con Google", err.message);
                      }
                  }}
                  className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold"
                >
                  <FcGoogle className="text-xl" /> Google
                </button>
              </div>
            </form>
            <p className="text-[#7a1a0a] mt-5 text-sm">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => { setModalLogin(false); setModalRegistro(true); }}
                className="text-[#d8718c] font-semibold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      )}

      {modalRegistro && (
         <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModalRegistro(false)}
        >
          <div className="bg-[#fff3f0] rounded-2xl shadow-lg w-[90%] max-w-md p-8 text-center border border-[#f5bfb2]">
            <h2 className="text-3xl font-bold text-[#8f2133] mb-6">Crear cuenta</h2>
            <form onSubmit={handleRegistro} className="space-y-4">
              <input type="email" placeholder="Correo" value={regCorreo} onChange={(e) => setRegCorreo(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
              <input type="text" placeholder="Nombre completo" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
              <input type="text" placeholder="Nombre de usuario" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
              <input type="password" placeholder="Contraseña" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="w-full bg-white border border-[#f5bfb2] text-[#7a1a0a] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#d8718c]" />
              <label htmlFor="foto-perfil" className="block text-sm font-medium text-[#8f2133] text-left">Foto de Perfil (Opcional)</label>
              <input type="file" id="foto-perfil" accept="image/*" onChange={(e) => setRegFoto(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fff3f0] file:text-[#d16170] hover:file:bg-[#f5bfb2] border border-[#f5bfb2] rounded-xl" />
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button type="submit" className="bg-[#d16170] text-white py-3 rounded-xl hover:bg-[#b84c68] transition font-semibold">
                  Crear cuenta
                </button>
                <button type="button" onClick={iniciarConGoogle} className="flex items-center justify-center gap-2 border border-[#d8718c] text-[#d8718c] py-3 rounded-xl hover:bg-[#f5bfb2] transition font-semibold">
                  <FcGoogle className="text-xl" /> Google
                </button>
              </div>
            </form>
            <p className="text-[#7a1a0a] mt-5 text-sm">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => { setModalRegistro(false); setModalLogin(true); }}
                className="text-[#d8718c] font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      )}
        
      {usuarioActual && (
        <Ajustes
          isOpen={modalAjustes}
          onClose={() => setModalAjustes(false)}
          user={{
            uid: usuarioActual.uid,
            email: usuarioActual.correo,
            displayName: usuarioActual.nombre,
            photoURL: usuarioActual.fotoURL,
            username: usuarioActual.username
          }}
        />
      )}
    </>
  );
}
