import{ useState, useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProductCard from './ProductCard.jsx'

function App() {
  const [busqueda, setBusqueda] = useState("")
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

function cargarProductos() {
  setCargando(true)
  setError(null)
  fetch("http://localhost:3000/api/productos")
    .then((res) => res.json())
    .then((datos) => setProductos(datos))
    .catch(() => setError("No se pudo conectar al servidor"))
    .finally(() => setCargando(false))
}

useEffect(() => {
  cargarProductos();
}, []);

  return (

  <main className="min-h-screen max-w-6xl mx-auto px-6 py-10 flex flex-col justify-between gap-10">
    <Navbar />
    <div className="flex items-center gap-3">
    <input
      type="text"
      placeholder="Buscar producto..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="w-full max-w-md px-4 py-2 border-slate-300 rounded-lg"
    />
    <button onClick={cargarProductos} className="px-4 py-2 bg-verde text-white rounded-lg font-bold text-sm whitespace-nowrap">
      Recargar
    </button>
    <p className="text-sm text-texto-dim whitespace-nowrap">
      {productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).length} producto(s) encontrado(s)
      ({productos.length} en total en la base de datos) 
    </p>
    </div>
    {cargando && <p className='text-center py-10'>Cargando productos...</p>}
    {error && <p className='text-center text-red-600 py-10'>{error}</p>}
    {!cargando && !error && (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-col-3 gap-6">
      {productos
      .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .map((p, index) => (
        <ProductCard
          key={index}
          nombre={p.nombre}
          descripcion={p.descripcion}
          precio={p.precio}
          imagen={p.Imagen}
          icono={p.icono}
        />
      ))}
    </section>
    )}
    {productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).length === 0 && (
      <p className="text-center text-texto-dim py-10">
        No se encontraron productos con ese nombre.
        </p>
    )}
    <Footer />
  </main>
  )
}

export default App  