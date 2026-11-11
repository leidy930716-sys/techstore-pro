import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";

function Productos() {
    const [busqueda, setBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    function cargarProductos() {
        setCargando(true);
        setError(null);
        fetch("http://localhost:3000/api/productos")
            .then((res) => res.json())
            .then((datos) => setProductos(datos))
            .catch((err) => setError("No se pudo conectar al servidor"))
            .finally(() => setCargando(false));
    }

    useEffect(() => {
        cargarProductos();
    }, []);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gra-300 rounded-card focus:outline-none focus:border-ink"
                />
                <p className="text-sm text-gray-500 whitespace-nowrap">
                    {
                        productos.filter((p) =>
                            p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                        ).length
                    }{" "}
                    producto(s) encontrado(s)
                </p>
                
            </div>
            {cargando && <p className='text-center py-10'>Cargando productos...</p>}
            {error && <p className='text-center text-accent-dark py-10'>{error}</p>}
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
                                imagen={p.imagen}
                                icono={p.icono}
                            />
                        ))}
                </section>
            )}
            {productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).length === 0 && (
                <p className="text-center text-gray-500 py-10">
                    No se encontraron productos con ese nombre.
                </p>
            )}
        </div>
    );
}

export default Productos;
