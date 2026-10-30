import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Home from "./Home.jsx";
import Productos from './Productos.jsx'
import NotFound from "./NotFound.jsx";

function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App  