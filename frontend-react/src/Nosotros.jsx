import { link } from "react-router-dom";

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

const Nosotros = () {
    return(
        <div className="flex lex-col gap-24">
        {/* HISTORIA */}
        <section className="max-w-2xl pt-6">
    )