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

function Contacto() {
    const [form, setForm] = useState(FORM_VACIO);
    const [errores, setErrores] = useState({});
    const [estado, setEstado] = useState("inactivo");
    const [mensajeError, setMensajeError] = useState("");

    function manejarCambio(e)  {
        setForm({ ...form, [e.target.name]: "" });
        if (estado !== "inactivo") setEstado("inactivo");
    }

    function validar() {
        const nuevos = {};
        if (form.nombre.trim().length < 3) {
            nuevos.nombre = "Escribe tu nombre completo, minimo 3 caracteres";
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            nuevos.email = "Escribe un correo valido, como nombre@correo.com";
        }
        if (form.telefono && !/^\d{7,10}$/.test(form.telefono)) {
            nuevos.telefono = "Solo números, entre 7 y 10 caracteres";
        }
        if (!form.asunto) {
            nuevos.asunto = "Selecciona un asunto";
        }
        if (mensaje.trim().length < 10) {
            nuevos.mensaje = "El mensaje debe tener al menos 10 caracteres";
        }
        return nuevos;
    }

    async function manejarEnvio(e) {
        e.preventDefault();

        const nuevos = validar();
        setErrores(nuevos);
        if (Object.keys(nuevos).length > 0) return;

        setEstado("enviando");
        try {
            const res = await fetch(URL_API, {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const datos = await res.json();
            if (!res.ok) throw new Error(datos.error || "No se pudo enviar el mensaje");

            setForm(FORM_VACIO);
            setEstado("exito");
        } catch (err) {
            setMensajeError(
                err in
            )
        }
    }
}
