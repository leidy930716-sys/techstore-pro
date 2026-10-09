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
  return (

  <main className="min-h-screen max-w-6xl mx-auto px-6 py-10 flex flex-col justify-between gap-10">
    <Navbar />

    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-col-3 gap-6">

      {productos.map((producto, index) => (
        <ProductCard
          key={index}
          nombre={producto.nombre}
          descripcion={producto.descripcion}
          precio={producto.precio}
          imagen={producto.Imagen}
          stock={producto.stock}
        />
      ))}
    </section>

    <Footer />
  </main>
  )
}

export default App