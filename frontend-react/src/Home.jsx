import { useNavigate } from 'react-router-dom'
function Home() {
    const navegar = useNavigate()
    return (
        <div className="flex flex-col items-center gap-4 py-20">
            <h1 className="text-4xl font-extrabold text-verde">
            Bienvenido a TechStore
            </h1>
            <p className="text-texto-dim max-w-md">
            Tecnología de calidad, al mejor precio. Explora nuestro catálogo de productos.
            </p>
            <button
                onClick={() => navegar("/productos")}
                className='bg-verde text-white py-2 px-6 rounded-lg font-bold'
            >
                ver catálogo
            </button>
        </div>
    )
}

export default Home
