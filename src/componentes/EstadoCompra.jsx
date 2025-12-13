import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, Loader, Mail, User, Box, DollarSign, Eye, ChevronDown, ChevronLeft, ChevronRight, X, Clock, ShoppingCart, Home, Save } from 'lucide-react';

// --- Componente de Información Reutilizable (similar a GestionReclamos) ---
const InfoItem = ({ icon, label, children, className }) => (
  <div className={`bg-white p-3 rounded-lg border border-rose-100/80 flex items-start gap-3 shadow-sm ${className}`}>
    <div className="flex-shrink-0 text-[#d16170]">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{children}</p>
    </div>
  </div>
);

export default function EstadoCompra() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [sortBy, setSortBy] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPorPagina = 10;

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const pedidosCollection = collection(db, 'pedidos');
      const q = query(pedidosCollection, orderBy('fechaCreacion', sortBy));
      const pedidosSnapshot = await getDocs(q);
      const pedidosList = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion.toDate(),
      }));
      setPedidos(pedidosList);
    } catch (err) {
      console.error("Error fetching pedidos:", err);
      setError('Hubo un problema al cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [sortBy]);

  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);
  const pedidosPaginados = pedidos.slice((currentPage - 1) * pedidosPorPagina, currentPage * pedidosPorPagina);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "finalizada": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const PedidoDetailModal = ({ pedido, onClose, onUpdate }) => {
    const [nuevoEstado, setNuevoEstado] = useState(pedido?.estado || 'pendiente');
    const [guardando, setGuardando] = useState(false);

    if (!pedido) return null;

    const handleGuardarEstado = async () => {
      try {
        setGuardando(true);
        const pedidoRef = doc(db, "pedidos", pedido.id);
        await updateDoc(pedidoRef, { estado: nuevoEstado });
        onUpdate(); // Refresca la lista
        onClose(); // Cierra el modal
      } catch (err) {
        console.error("Error al actualizar estado:", err);
        alert("Error al actualizar el estado.");
      } finally {
        setGuardando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-[#fffcfc] rounded-3xl shadow-2xl border border-rose-100/50 max-w-3xl w-full relative animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-6 sm:p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-400 rounded-full p-1.5 transition-all duration-300" aria-label="Cerrar modal"><X size={20} /></button>
            <h2 className="text-xl sm:text-2xl font-bold text-[#8f2133] mb-1">Detalle del Pedido</h2>
            <p className="text-xs text-gray-500">ID: {pedido.id}</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto space-y-6 px-6 sm:px-8 pb-8 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">

            {/* --- Sección Cliente y Estado -- */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoItem icon={<User size={18} />} label="Cliente">{pedido.nombreCliente}</InfoItem>
                <InfoItem icon={<Mail size={18} />} label="Email">{pedido.correoUsuario}</InfoItem>
                <InfoItem icon={<Home size={18} />} label="Dirección" className="lg:col-span-3">{pedido.direccionEnvio}</InfoItem>
                <InfoItem icon={<DollarSign size={18} />} label="Monto Total"><span className="font-bold text-lg">S/ {pedido.totalFinal?.toFixed(2)}</span></InfoItem>
                <InfoItem icon={<Clock size={18} />} label="Fecha">{format(pedido.fechaCreacion, "dd/MM/yyyy HH:mm", { locale: es })}</InfoItem>
                 <InfoItem icon={<ShoppingCart size={18} />} label="Método de Pago">{pedido.metodoPago}</InfoItem>
              </div>
            </div>

            {/* --- Sección Productos -- */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Productos en el Pedido ({pedido.totalProductos})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-rose-50">
                {(pedido.items || []).map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-rose-100/80">
                    <div className="flex items-center gap-3">
                      <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg object-cover shrink-0"/>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.nombre}</p>
                        <p className="text-xs text-gray-500">{item.cantidad} x S/ {item.precio?.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">S/ {(item.cantidad * item.precio).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* --- Sección de Acción -- */}
            <div className="bg-rose-50 border-t-2 border-dashed border-rose-200 p-5 rounded-b-2xl mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Actualizar Estado del Pedido</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className={`px-3 py-1.5 text-sm rounded-full font-semibold ${getEstadoColor(pedido.estado)}`}>Estado actual: {pedido.estado}</div>
                    <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} className="px-4 py-2 text-sm w-full sm:w-auto rounded-xl border-2 border-[#f5bfb2] bg-white focus:outline-none focus:ring-2 focus:ring-[#d8718c] font-semibold">
                        <option value="pendiente">Pendiente</option>
                        <option value="finalizada">Finalizada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                    <button onClick={handleGuardarEstado} disabled={guardando || nuevoEstado === pedido.estado} className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#8f2133] hover:bg-[#6d1525] disabled:opacity-60 disabled:cursor-not-allowed transition w-full sm:w-auto">
                        <Save size={14} />
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center py-10"><Loader className="animate-spin text-[#d16170]" size={40} /><p className="ml-4 text-lg font-semibold text-gray-700">Cargando Pedidos...</p></div>;
  }

  if (error) {
    return <div className="flex items-center gap-3 text-red-700 bg-red-100/80 p-4 rounded-lg border border-red-300"><AlertTriangle size={24} /><p className="font-semibold">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#8f2133]">Historial de Pedidos</h3>
          <p className="text-sm text-gray-600">Total: {pedidos.length} pedidos</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchPedidos} className="p-2.5 bg-white border-2 border-[#f5bfb2] text-gray-700 rounded-lg hover:bg-rose-50"><Loader size={16} /></button>
          <div className="relative">
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} className="appearance-none w-full sm:w-auto bg-white border-2 border-[#f5bfb2] text-gray-700 font-semibold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#d16170] focus:ring-1 focus:ring-[#d16170] transition-colors">
              <option value="desc">Más Recientes</option>
              <option value="asc">Más Antiguos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No se han encontrado pedidos.</p>
      ) : (
        <>
          {/* --- Vista Móvil --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {pedidosPaginados.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-2xl border-2 border-[#f5bfb2] p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{pedido.nombreCliente}</p>
                      <p className="text-xs text-gray-500 font-mono">#{pedido.id.substring(0, 7).toUpperCase()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getEstadoColor(pedido.estado)}`}>{pedido.estado}</span>
                </div>
                <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold">Total: <span className="font-bold text-lg text-[#c54b64]">S/ {pedido.totalFinal?.toFixed(2)}</span></span>
                  <span className="text-gray-500 text-xs flex items-center gap-1.5"><Clock size={12}/> {format(pedido.fechaCreacion, "dd/MM/yy") }</span>
                </div>
                <button onClick={() => setSelectedPedido(pedido)} className="w-full mt-2 bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-semibold">
                  <Eye size={16} /> Ver Detalles
                </button>
              </div>
            ))}
          </div>

          {/* --- Vista Escritorio --- */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg border-2 border-[#f5bfb2]">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-rose-50 text-xs text-[#7a1a0a] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Pedido</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Cliente</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Fecha</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Total</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Estado</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#fff3f0]/60">
                    <td className="px-6 py-4 font-mono text-gray-800">#{pedido.id.substring(0, 7).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{pedido.nombreCliente}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{format(pedido.fechaCreacion, "dd/MM/yyyy HH:mm")}</td>
                    <td className="px-6 py-4 font-bold text-[#c54b64]">S/ {pedido.totalFinal?.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getEstadoColor(pedido.estado)}`}>{pedido.estado}</span></td>
                    <td className="px-6 py-4 text-center"><button onClick={() => setSelectedPedido(pedido)} className="bg-[#d16170] text-white p-2 rounded-lg hover:bg-[#b94a5b] transition-colors duration-200 shadow-sm" title="Ver Detalles del Pedido"><Eye size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center pt-6 gap-2">
           <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Anterior"><ChevronLeft size={20} /></button>
          <span className="font-semibold text-gray-600 bg-white shadow-md rounded-full px-4 py-2">Página {currentPage} de {totalPaginas}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPaginas} className="p-3 rounded-full bg-white text-[#d16170] shadow-md hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" aria-label="Página Siguiente"><ChevronRight size={20} /></button>
        </div>
      )}

      <PedidoDetailModal pedido={selectedPedido} onClose={() => setSelectedPedido(null)} onUpdate={fetchPedidos} />
    </div>
  );
}

// --- Estilos de Animación (igual que en GestionReclamos) ---
const animationStyles = `
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
.animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = animationStyles;
  document.head.appendChild(styleSheet);
}
