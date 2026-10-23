import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from './CartContext.jsx'

function Navbar() {
    const ubicacion = useLocation()
    const { items } = useContext(CartContext)
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
            <div className="text-xl font-extrabold text-verde">
                TechStore Pro
            </div>
            <ul className="hidden md:flex gap-6 text-sm font-semibold text-texto-dim">
                <li>
                    <Link
                        to="/"
                        className={ubicacion.pathname === "/" ? "text-verde font-extrabold" : ""}
                    >
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link
                        to="/productos"
                        className={ubicacion.pathname === "/productos" ? "text-verde font-extrabold" : ""}
                    >
                        Productos
                    </Link>
                </li>
                <li>Nosotros</li>
                <li>Contacto</li>
            </ul>
            <div className="flex items-center gap-4">
                <span className='text-sm font-semibold text-texto-dim'>
                    Carrito: {items.length}
                </span>
                <button className="bg-verde text-white py-2 px-5 rounded-lg font-bold text-sm">
                    Ingresar
                </button>
            </div>
        </nav >
    )
}

export default Navbar