import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const postresDeAgradecimiento = [
    "https://i.postimg.cc/SsLjzJ0b/1.png",
    "https://i.postimg.cc/50zK5WpV/2.png",
    "https://i.postimg.cc/nrtR0Sw-Q/3.png",
    "https://i.postimg.cc/R0HLyQt1/4.png",
    "https://i.postimg.cc/Jz9bNDFs/5.png"
];

const imagenAleatoria = postresDeAgradecimiento[Math.floor(Math.random() * postresDeAgradecimiento.length)];

export default function Gracias() {
    const { vaciarCarrito } = useCarrito();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idPedido = queryParams.get('pedido');

    useEffect(() => {
        // Limpiamos el carrito en cuanto se monta la página
        vaciarCarrito(); 

        // Si no hay ID de pedido, redirigimos
        if (!idPedido) {
            navigate('/');
        }
    }, [idPedido, navigate, vaciarCarrito]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#fff3f0] text-center px-4">
            <div className="bg-white/80 p-8 rounded-3xl shadow-2xl border border-[#f5bfb2] max-w-md mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#9c2007] mb-3">¡Gracias por tu compra!</h1>
                <p className="text-gray-600 mb-4">Tu pedido ha sido registrado y está siendo procesado.</p>
                
                <img src={imagenAleatoria} alt="Postre de agradecimiento" className="rounded-2xl mx-auto w-56 sm:w-64 shadow-lg my-6" />

                {idPedido && (
                    <div className="text-sm text-gray-500 bg-[#f5bfb2]/30 rounded-lg py-2 px-4">
                        <p>ID de tu pedido: <span className="font-semibold text-gray-700">{idPedido}</span></p>
                    </div>
                )}

                <Link 
                    to="/productos"
                    className="mt-8 inline-block bg-[#d16170] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b84c68] transition-transform duration-300 transform hover:scale-105"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
}
