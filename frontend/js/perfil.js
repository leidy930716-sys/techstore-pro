async function cargarPerfil() {
    const token = localStorage.getItem('token');

    if (!token) {
        document.getElementById('estado-cargando').style.display = 'none';
        document.getElementById('estado-sin-sesion').style.display = 'block';
        return;
    }

    try {
        // 1. Llamar al backend pasando el token de autenticación
        const respuesta = await fetch('http://localhost:3000/api/auth/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const usuario = await respuesta.json();

        if (!respuesta.ok) throw new Error(usuario.error || 'Error en la respuesta');

        // 2. Ocultar el cargando y mostrar la tarjeta de datos
        document.getElementById('estado-cargando').style.display = 'none';
        document.getElementById('perfil-datos').style.display = 'block';

        // 3. Renderizar los datos del encabezado
        if (usuario.nombre) {
            document.getElementById('perfil-avatar').textContent = usuario.nombre.charAt(0).toUpperCase();
            document.getElementById('perfil-nombre').textContent = usuario.nombre;
        }

        document.getElementById('perfil-rol').textContent = usuario.rol === 'admin' ? '⭐ Administrador' : '🛍️ Cliente';

        // 4. Llenar los campos de información detallada
        document.getElementById('perfil-email').textContent = usuario.email || 'No registrado';
        document.getElementById('perfil-departamento').textContent = usuario.departamento || 'No registrado';
        document.getElementById('perfil-municipio').textContent = usuario.municipio || 'No registrado';

    } catch (err) {
        console.error("Error al cargar perfil:", err);
        document.getElementById('estado-cargando').style.display = 'none';
        document.getElementById('estado-error').style.display = 'block';
    }
}

cargarPerfil();
