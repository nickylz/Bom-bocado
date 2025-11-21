export default function PerfilHeader({ user }) {
  return (
    <div className="bg-white border border-[#f5bfb2] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mb-8 shadow-sm">

      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d8718c]">
        <img
          src={
            user.fotoURL ||
            user.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Foto de perfil"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-[#7a1a0a]">
          {user.user || user.displayName || "Usuario"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">{user.correo || user.email}</p>
        <p className="text-xs text-gray-500 mt-1">
          UID: <span className="font-mono">{user.uid}</span>
        </p>
      </div>

    </div>
  );
}
