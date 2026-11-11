import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="flex flex-col items-center judtify-center text-center gap-4 py-20">
            <h1 className="font-display font-bold text-7xl tracking-tighter text-gray-300">404</h1>
            <p className="text-gray-700">Esta pagina no existe.</p>
            <Link to="/" className="font-semibold underline hover:text-accent transition-colors">
            volver al inicio
            </Link>        
        </div>
    )
}

export default NotFound