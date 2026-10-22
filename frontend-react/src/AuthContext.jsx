import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(
        localStorage.getItem("usuario-nombre")
    );

    function login(nombre, token, rol) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario-nombre", nombre);
        localStorage.setItem("usuario-rol", rol);
        setUsuario(nombre);
    }

    function logout() {
        localStorage.clear();
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
