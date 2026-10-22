import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="flex flex-col items-center judtify-center text-center gap-4 py-20">
            <h1 className="text-5xl front-extrabold text-texto-dim">404</h1>
            <p className="text-texto-dim">Esta pagina no existe.</p>
            <Link to="/" className="text-verde font-bold underline">
            volver al inicio
            </Link>        
        </div>
    )
}

export default NotFound