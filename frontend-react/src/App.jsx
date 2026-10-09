import{ useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ProductCard from './ProductCard.jsx'

const productos = [
  {
    nombre: "Mouse Inalambrico",
    descripcion: "Mouse ergonomico, conexion Bluetooth",
    precio: "$89.900",
    Imagen: "https://placehold.co/300x200",
    stock: 12
  },
  {
    nombre: "Teclado Mecanico",
    descripcion: "Switches azules, retroiluminado RGB",
    precio: "$149.900",
    Imagen: "https://placehold.co/300x200",
    stock: 8
  },
  {
    nombre: "Monitor 24",
    descripcion: "Full HD, 75Hz, panel IPS",
    Imagen: "https://placehold.co/300x200",
    precio: "$89.900",
    stock: 12
  },
  {
    nombre: "Audifonos Bluetooth",
    descripcion: "Cancelacion de ruido, 20H de bateria",
    precio: "$199.900",
    Imagen: "https://placehold.co/300x200",
    stock: 5
  }
]

function App() {
  const [busqueda, setBusqueda] = useState("")
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
    <p className="text-sm text-texto-dim whitespace-nowrap">
      {productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).length} producto(s) encontrado(s)
    </p>
    </div>
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
          stock={p.stock}
        />
      ))}
    </section>
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