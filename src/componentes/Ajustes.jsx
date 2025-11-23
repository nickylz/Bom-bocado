import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Ajustes({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-0 md:block md:bg-transparent bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="
          bg-[#fff3f0] shadow-xl border border-[#f5bfb2] relative 
          text-center md:text-left 
          w-[90%] max-w-sm p-6 rounded-3xl 
          md:absolute md:top-16 md:right-4 
          md:w-72 md:p-4 md:rounded-2xl
        "
      >
        <button
          onClick={onClose}
          className="absolute text-[#d16170] hover:text-[#b84c68] top-3 right-4 md:top-2 md:right-3 text-2xl md:text-lg"
        >
          &times;
        </button>

        <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-6 md:mb-4">
          <div className="w-20 h-20 md:w-12 md:h-12 rounded-full overflow-hidden border-4 md:border-2 border-white md:border-[#d8718c] shadow-md flex-shrink-0">
            <img
              src={user?.photoURL || "/default-user.png"}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col mt-3 md:mt-0">
            <span className="text-xl md:text-base font-bold md:font-semibold text-[#8f2133] leading-tight">
              {user?.displayName || "Usuario"}
            </span>
            <span className="text-md md:text-sm font-semibold text-[#d8718c]">
              @{user?.username || "username"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/perfil"
            onClick={onClose}
            className="block w-full text-center px-4 py-3 md:py-2 rounded-xl border-2 border-[#f5bfb2] bg-white hover:bg-[#fdecea] transition-all duration-300 font-semibold text-[#8f2133] md:text-sm shadow-sm"
          >
            Gestionar Perfil
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-[#d16170] text-white py-3 md:py-2 rounded-xl hover:bg-[#b84c68] transition-all duration-300 font-semibold md:text-sm shadow-md"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
