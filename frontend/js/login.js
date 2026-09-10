// S17: LOGIN - conecta el formulario con la API

const formLogin = document.querySelector('#form-login');

formLogin.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    // Limpiar errores anteriores
    document.querySelector('#error-login-email').textContent = '';
    document.querySelector('#error-login-password').textContent = '';

    // 1. Leer los valores del formulario
    const email = document.querySelector('#login-email').value.trim();
    const password = document.querySelector('#login-password').value;

    // 2. Validación básica
    if (!email) {
        document.querySelector('#error-login-email').textContent = 'Ingresa tu correo';
        return;
    }

    if (!password) {
        document.querySelector('#error-login-password').textContent = 'Ingresa tu contraseña';
        return;
    }

    try {
        // 3. Llamar al backend
        const respuesta = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const datos = await respuesta.json();

        // 4a. Si el backend devolvió error
        if (!respuesta.ok) {
            document.querySelector('#error-login-email').textContent = 
                datos.error || 'Correo o contraseña incorrectos';
            return;
        }

        // 4b. Login exitoso - guardar token
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario-nombre', datos.nombre);

        // 5. Mostrar mensaje de bienvenida
        const exito = document.querySelector('#login-exito');
        exito.innerHTML = '<div style="background:#dcfce7;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">'
            + '<p style="color:#15803d;font-weight:700;">✅ Bienvenido, ' + datos.nombre + '</p></div>';
        exito.style.display = 'block';
        formLogin.reset();

    } catch (error) {
        // 6. Error de red
        document.querySelector('#error-login-email').textContent = 
            'No se pudo conectar. Verifica que npm run dev esté corriendo.';
    }
});