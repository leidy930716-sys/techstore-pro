import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "./CartContext.jsx";
import { AuthContext } from "./AuthContext.jsx";

const enlaces = [
    { ruta: "/", texto: "Inicio" },
    { ruta: "/productos", texto: "Productos" },
    { ruta: "/nosotros", texto: "Nosotros" },
    { ruta: "/contacto", texto: "Contacto" },
];

function Navbar() {
    const { items, vaciarCarrito } = useContext(CartContext);
    const { usuario } = useContext(AuthContext);
    const [abierto, setAbierto] = useState(false);

    function cerrar() {
        setAbierto(false);
    }

    return (
        <nav className="w-full max-w-6xl mx-auto px-6 pt-6">
            <div className="flex items-center justify-between gap-4">
                <Link to="/" onClick={cerrar} className="font-wordmark text-lg md:text-xl tracking-wide">
                    TECH<span className="text-accent-dark">STORE</span>
                </Link>

                <ul className="hidden md:flex gap-9 text-sm font-medium text-gray-700">
                    {enlaces.map((enlace) => (
                        <li key={enlace.ruta}>
                            <NavLink
                                to={enlace.ruta}
                                end
                                className={({ isActive }) =>
                                    isActive? "text-ink font-semibold" : "hover:text-ink transition-colors"
                                }
                            >
                                {enlace.texto}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <span className="font-mono text-xs md:text-[13px] text-gray-700 whitespace-nowrap">
                        Carrito ({items.length})
                    </span>

                    {items.length > 0 && (
                        <button
                            onClick={vaciarCarrito}
                            className="hidden md:block text-xs text-accent-dark underline"
                        >
                            Vaciar
                        </button>
                    )}

                    <button className="hidden md:block bg-ink text-paper px-5 py-2.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors">
                        {usuario ? usuario : "Ingresar"}
                    </button>

                    <button
                        onClick={() => setAbierto(!abierto)}
                        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={abierto}
                        className="md:hidden relative size-10 -mr-2"
                    >
                        <span
                            className={
                                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                                (abierto ? "rotate-45" : "-translate-y-2")
                            }
                        ></span>
                        <span
                            className={
                                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                                (abierto ? "opacity-0 scale-x-0" : "")
                            }
                        ></span>
                        <span
                            className={
                                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                                (abierto ? "-rotate-45" : "translate-y-2")
                            }
                        ></span>
                    </button>
                </div>
            </div>

            <div
                inert={!abierto}
                className={"md:hidden grid transition-[grid-template-rows] duration-300 ease-out" +
                    (abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                }
            >
                <div className="overflow-hidden">
                    <ul className="flex flex-col pt-6 pb-4">
                        {enlaces.map((enlace, i) => (
                            <li
                                key={enlace.ruta}
                                style={{
                                    transitionDelay: abierto ? i * 60 + 100 + "ms" : "0ms",
                                }}
                                className={
                                    "transition-all duration-300 " +
                                    (abierto
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-2")
                                }
                            >
                                <NavLink
                                    to={enlace.ruta}
                                    end
                                    onClick={cerrar}
                                    className={({ isActive }) =>
                                        "block py-3 font-display font-semibold text-3xl tracking-tight " +
                                        (isActive ? "text-ink" : "text-gray-500")
                                    }
                                >
                                    {enlace.texto}
                                </NavLink>
                            </li>
                        ))}
                        <li
                            style={{
                                transitionDelay: abierto
                                    ? enlaces.length * 60 + 100 + "ms"
                                    : "0ms",
                            }}
                            className={
                                "transition-all duration-300 " +
                                (abierto
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-2")
                            }
                        >
                            <button className="w-full bg-ink text-paper py-3.5 rounded-card text-sm font-semibold">
                                {usuario ? usuario : "Ingresar"}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;