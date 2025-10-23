import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) setCarrito(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.nombre === producto.nombre);
      if (existente) {
        return prev.map((p) =>
          p.nombre === producto.nombre
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarProducto = (nombre) => {
    setCarrito((prev) => prev.filter((p) => p.nombre !== nombre));
  };

  const cambiarCantidad = (nombre, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.nombre === nombre ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const totalProductos = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        cambiarCantidad,
        vaciarCarrito,
        total,
        totalProductos,
        mostrarCarrito,
        setMostrarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);