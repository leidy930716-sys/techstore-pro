import { useState } from "react";

const URL_API = "http://localhost:3000/api/contacto";

const FORM_VACIO = {
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
};

const datosContacto = [
    { titulo: "Direcciòn", lineas: ["calle 7 # 8-30", "Garzón, Huila, Colombia"] },
    { titulo: "Teléfono", lineas: ["300 000 0000", "8 am - 6 pm ﹒ Lun a Sáb"] },
    { titulo: "Correo", lineas: ["info@miproyecto.co"] },
];

const estiloInput =
    "w-full px4 py-3 rounded-card border bg-papper text-sm focus:outline-none focus:border-ink transition-colors";

function claseInput(error) {
    return estiloInput + (error ? " border-accent" : " border.gray-300");
}

function Campo({ etiqueta, nombre, error, children }) {
    return(
        <div className="flex flex-col gap-1.5">
            <label htmlFor="nombre" className="text-sm font-semibold">
                {etiqueta}
            </label>
            {children}
            {error && <span className="text-xs text-accent-dark">{error}</span>}
        </div>
    )
}
