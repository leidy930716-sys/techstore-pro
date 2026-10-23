import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : [];
    })

    function agregarAlCarrito(producto) {
        const nuevo = [...items, producto];
        setItems(nuevo);
        localStorage.setItem("carrito", JSON.stringify(nuevo));
    }

    function quitarDelCarrito(producto) {
        const nuevo = items.filter((_, i) => i !== indice);
        setItems(nuevo);
        localStorage.setItem("carrito", JSON.stringify(nuevo));
    }

    function vaciarCarrito() {
        setItems([]);
        localStorage.removeItem("carrito");
    }

    return (
        <CartContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, vaciarCarrito }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext


