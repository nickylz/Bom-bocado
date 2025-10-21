import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false); // 👈 nuevo estado

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.nombre === producto.nombre);
      if (existente) {
        return prev.map((p) =>
          p.nombre === producto.nombre ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    setMostrarCarrito(true); // 👈 mostrar carrito cuando agregas algo
  };

  const cambiarCantidad = (nombre, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.nombre === nombre ? { ...p, cantidad: p.cantidad + delta } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminarProducto = (nombre) =>
    setCarrito((prev) => prev.filter((p) => p.nombre !== nombre));

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        cambiarCantidad,
        eliminarProducto,
        vaciarCarrito,
        total,
        mostrarCarrito, // 👈 lo compartimos
        setMostrarCarrito, // 👈 también lo compartimos
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
