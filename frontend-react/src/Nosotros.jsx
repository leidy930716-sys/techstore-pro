import { Link } from "react-router-dom";

const valores = [
    {
        titulo: "Misión",
        texto: "Ofrecer productos tecnolólogicos de alta calidad con asesoria exterta, precios competitivos y un excelente servicio al cliente.",
    },
    {
        titulo: "Visión",
        texto: "Ser la tienda de tecnología mas reconocida  del  huila en 2030, con presencia en las principales ciudades del departamento.",
    },
    {
        titulo: "Valores",
        texto: "Honestidad en cada venta, calidad garantizada, innovación constante, compromiso con el cliente y apoyo a la comunidad local.",
    },
];

const equipo = [
    {
        nombre: "Juan Perez",
        cargo: "Gerente General",
        descripcion: "Con más de 10 años de experiencia en el sector tecnológico, lidera nuestro equipo con visión y compromiso.",
    },
    {
        nombre: "Maria Gomez",
        cargo: "Directora de Marketing",
        descripcion: "Especialista en estrategias digitales, impulsa nuestra presencia en línea y fortalece nuestra marca.",
    },
    {
        nombre: "Carlos Rodriguez",
        cargo: "Jefe de Ventas",
        descripcion: "Con un enfoque en la satisfacción del cliente, lidera nuestro equipo de ventas para ofrecer soluciones personalizadas.",
    },
];

const Nosotros = () => {
    return (
        <div className="flex flex-col gap-24">
            {/* HISTORIA */}
            <section className="max-w-2xl pt-6">
                <p className="font-mono text-xs  uppercase tracking-widest text-gray-500">
                    Nosotros
                </p>
                <h1 className="font-display font-bold text-5xl tracking-tighter mt-4 mb-6">
                    Quiénes somos<span className="text-accent">.</span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    TechStore Pro nació en Garzón, Huila, con una misión clara: acercar la
                    mejor tecnología a las familias y empresaas del sur colombiano. Iniciamos
                    en 2023 como una pequeña tienda y hoy somos el referente tecnológico de
                    la región.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    Creemos en que la tecnología no es un lujo, es una herramienta que
                    transforma vidas. por eso ofrecemos asesoría especializada, precios
                    justos y garantia real en cada producto.
                </p>
                <Link
                    to="/contacto"
                    className="inline-block bg-ink text-papper px-7 py-3.5 rounded-card text-smfont-semibold hover:bg-accent transition-colors"
                >
                    Contáctanos
                </Link>
            </section>

            {/* MISION, VISION Y VALORES */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {valores.map((v) => (
                <div
                    key={v.titulo}
                    className="p-6 rounded-card border-gray-100 hover:border-gray-300 transition-colors"
                >
                    <h2 className="font-display font-semibold text-xl mb-3">
                        {v.titulo}<span className="text-accent">.</span>
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{v.texto}</p>
                </div>
                ))}
            </section>

            {/* EQUIPO */}
            <section>
                <h2 className="font-display font-bold text-3xl tracking-tight mb-8">
                    Nuestro equipo<span className="text-accent"></span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {equipo.map((persona, i) => (
                        <div key = {persona.nombre} className="flex flex-col gap-3">
                            <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center font-mono text-sm text-gray-500">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3 className="font-display font-semibold text-lg">{persona.nombre}</h3>
                            <p className="font-mono text-xs uppercase tracking-wider text-accent-dark">
                                {persona.cargo}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">{persona.descripcion}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Nosotros;