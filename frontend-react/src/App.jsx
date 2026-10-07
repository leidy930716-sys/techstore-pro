impoort Navbar from './Navbar.jsx'
function App() {
  return (
  
  <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
    <Navbar />
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
      <div className="text-xl font-extrabold text-verde">
        TechStore Pro
      </div>
      <ul className="flex gap-6 text-sm font-semibold text-texto-dim">
        <li>Inicio</li>
        <li>Productos</li>
        <li>Nosotros</li>
        <li>Contacto</li>
      </ul>
      <button className="bg-verde text-white py-2 px-5 rounded-lg font-bold text-sm">
        Ingresar
      </button>
    </nav>
    
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-col-3 gap-6">
      
      {/* tarjeta 1 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://placehold.co/300x200" className="rounded-lg" />
        <h3 className="font-bold text-lg">Mouse Inalambrico</h3>
        <p className="text-texto-dim text-sm">Mouse ergonomico, conexion Bluetooth</p>
        <p className="text-verde font-extrabold">$89.900</p>
      </div>

      {/* tarjeta 2 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://placehold.co/300x200" className="rounded-lg" />
        <h3 className="font-bold text-lg">Teclado Mecanico</h3>
        <p className="text-texto-dim text-sm">Switches azules, retroiluminado RGB</p>
        <p className="text-verde font-extrabold">$149.900</p>
      </div>

      {/* tarjeta 3 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://placehold.co/300x200" className="rounded-lg" />
        <h3 className="font-bold text-lg">Monitor 24</h3>
        <p className="text-texto-dim text-sm">Full HD, 75Hz, panel IPS</p>
        <p className="text-verde font-extrabold">$89.900</p>
      </div>

      {/* tarjeta 4 */}
      <div className="flex flex-col gap-2 p-4 rounded-xl shadow-md bg-white">
        <img src="https://placehold.co/300x200" className="rounded-lg" />
        <h3 className="font-bold text-lg">Audifonos Bluetooth</h3>
        <p className="text-texto-dim text-sm">Cancelacion de ruido, 20H de bateria</p>
        <p className="text-verde font-extrabold">$199.900</p>
      </div>

    </section>
    <footer className="flex flex-col md:flex-rowjustify-between items-center gap-2 md:gap-0 p-6 bg-texto text-white">
      <p>© 2026 TechStore Pro</p>
      <p className="text-xs">Hecho con tailwind CSS</p>
    </footer>
  </main>
  )
}

export default App