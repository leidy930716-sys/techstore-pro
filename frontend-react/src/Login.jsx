import { useState, useContext } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import Campo, { claseInput } from "./Campo.jsx";

const URL_API = "http://localhost:3000/api/auth";

const FORM_VACIO = { email: "", password: "" };

function login() {
    const { login } = useContext(AuthContext);
    const navegar = useNavigate();
    const [form, setForm] = useState(FORM_VACIO);
    const [errores, setErrores] = useState("inactivo");
    const [mensajeError, setMensajeError] = useState("");

    function manejarCambio(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrores({ ...errores, [e.target.name]: "" });
        if (estado !== "inactivo") setEstado("inactivo");
    }

    function validar() {
        const nuevos = {};
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            nuevos.email = "Escribe un correo válido, como nombre@correo.com";
        }
        if (!form.password) {
            nuevos.password = "Escribe tu contraseña";
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
            const res = await fetch(URL_API + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const datos = await res.json();
            if (!res.ok) throw new Error(datos.error || "No se pudo iniciar sesión");

            login(datos.nombre, datos.token, datos.rol);
            navegar("/");
        } catch (err) {
            setMensajeError(
                err instanceof TypeError ? "No se pudo conectar al servidor" : err.message,
            );
            setEstado("error");
        }
    }

    return(
        <div className="max-w-md mx-auto flex flex-col gap-8 pt-6">
            <section>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                    Cuenta
                </p>
                <h1 className="font-display font-bold text-5xl tracking-tighter mt-4 mb-3">
                    Ingresar<span className="text-accent">.</span>
                </h1>
                <p className="text-gray-700">Entra con tu correo y tu contraseña.</p>
            </section>
        </div>
    )
}