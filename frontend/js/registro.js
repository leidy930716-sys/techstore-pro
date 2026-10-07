// ================================================
// S09: REGISTRO CON API COLOMBIA
// Carga departamentos y municipios desde api-colombia.com
// Guarda el registro en LocalStorage
// ================================================

const URL_API = 'https://api-colombia.com/api/v1';

const selectDepto = document.querySelector('#reg-departamento');
const selectMuni = document.querySelector('#reg-municipio');
const formRegistro = document.querySelector('#form-registro');

// ── PASO 1: Cargar departamentos al abrir la página ──────────────────────────
async function cargarDepartamentos() {
    try {
        selectDepto.innerHTML = '<option value="">Cargando departamentos...</option>';

        const respuesta = await fetch(`${URL_API}/Department`);
        const departamentos = await respuesta.json();

        // Ordenar alfabéticamente por nombre
        departamentos.sort(function (a, b) { return a.name.localeCompare(b.name); });

        selectDepto.innerHTML = '<option value="">-- Selecciona un departamento --</option>';
        departamentos.forEach(function (depto) {
            const opcion = document.createElement('option');
            opcion.value = depto.id;
            opcion.textContent = depto.name;
            selectDepto.appendChild(opcion);
        });

    } catch (error) {
        selectDepto.innerHTML = '<option value="">Error al cargar. Recarga la página.</option>';
        console.error('Error cargando departamentos:', error);
    }
}

// ── PASO 2: Cargar municipios cuando el usuario elige un departamento ─────────
async function cargarMunicipios(idDepartamento) {
    try {
        selectMuni.disabled = true;
        selectMuni.innerHTML = '<option value="">Cargando municipios...</option>';

        const respuesta = await fetch(`${URL_API}/Department/${idDepartamento}/cities`);
        const municipios = await respuesta.json();

        // Ordenar alfabéticamente
        municipios.sort(function (a, b) { return a.name.localeCompare(b.name); });

        selectMuni.innerHTML = '<option value="">-- Selecciona un municipio --</option>';
        municipios.forEach(function (muni) {
            const opcion = document.createElement('option');
            opcion.value = muni.name;
            opcion.textContent = muni.name;
            selectMuni.appendChild(opcion);
        });
        selectMuni.disabled = false;

    } catch (error) {
        selectMuni.innerHTML = '<option value="">Error al cargar municipios.</option>';
    }
}

// ── PASO 3: Escuchar cambio en el select de departamento ─────────────────────
selectDepto.addEventListener('change', function () {
    const idSeleccionado = selectDepto.value;

    if (!idSeleccionado) {
        selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
        selectMuni.disabled = true;
        return;
    }

    cargarMunicipios(idSeleccionado);
});

// ── PASO 4: Validar y guardar el registro ────────────────────
if (formRegistro) {
    formRegistro.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        const nombre = document.querySelector('#reg-nombre').value.trim();
        const email = document.querySelector('#reg-email').value.trim();

        // CORREGIDO: Se obtiene el valor del input de contraseña que faltaba en tu código original
        const inputPassword = document.querySelector('#reg-password');
        const password = inputPassword ? inputPassword.value : '';

        const municipio = selectMuni.value;
        let hayErrores = false;

        // CORREGIDO: Se agregaron los '#' para seleccionar por ID al limpiar errores
        document.querySelector('#error-reg-nombre').textContent = '';
        document.querySelector('#error-reg-email').textContent = '';
        document.querySelector('#error-reg-password').textContent = '';
        document.querySelector('#error-reg-departamento').textContent = '';
        document.querySelector('#error-reg-municipio').textContent = '';

        // CORREGIDO: Bloques independientes. Se cerró correctamente el 'if' de nombre.
        // Validar nombre
        if (nombre.length < 3) {
            document.querySelector('#error-reg-nombre').textContent = 'Escribe tu nombre completo';
            hayErrores = true;
        }

        // Validar email
        if (!email.includes('@') || email.length < 5) {
            document.querySelector('#error-reg-email').textContent = 'Ingresa un correo válido';
            hayErrores = true;
        }

        // Validar password (CORREGIDO: Ahora cuenta con la propiedad hayErrores = true)
        if (password.length < 6) {
            document.querySelector('#error-reg-password').textContent = 'La contraseña debe tener al menos 6 caracteres';
            hayErrores = true;
        }

        // Validar departamento
        if (!selectDepto.value) {
            document.querySelector('#error-reg-departamento').textContent = 'Selecciona un departamento';
            hayErrores = true;
        }

        // Validar municipio
        if (!municipio) {
            document.querySelector('#error-reg-municipio').textContent = 'Selecciona un municipio';
            hayErrores = true;
        }

        // Enviar datos si el formulario es válido
        if (!hayErrores) {
            try {
                const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nombre,
                        email: email,
                        password: password,
                        departamento: selectDepto.options[selectDepto.selectedIndex].textContent,
                        municipio: municipio
                    })
                });

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    document.querySelector('#error-reg-email').textContent = datos.error || 'Error al crear la cuenta';
                    return;
                }

                // Mostrar éxito y limpiar formulario
                document.querySelector('#registro-exito').style.display = 'block';
                formRegistro.reset();
                selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
                selectMuni.disabled = true;

            } catch (error) {
                document.querySelector('#error-reg-nombre').textContent = 'No se pudo conectar. Verifica que el servidor del backend esté corriendo.';
            }
        }
    });
}

// CORREGIDO: Ejecutar la función automáticamente al cargar el script para llenar el primer select
cargarDepartamentos();

// ── BONUS: Mostrar registro guardado si existe ────────────────────────────────
function mostrarRegistroGuardado() {
    const guardado = localStorage.getItem('usuario-registro');
    if (!guardado) return;

    const usuario = JSON.parse(guardado);
    const resumen = document.querySelector('#resumen-registro');
    if (!resumen) return;

    resumen.innerHTML = `
        <div style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:20px; margin-top:24px; color:#e2e8f0;">
        <h3 style="margin-bottom:16px; color:#38bdf8; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
            🗿​ Cuenta registrada</h3>

        <p style="margin-bottom:8px; color:#94a3b8;">
            <strong style="color:#ffffff;">Nombre:</strong> ${usuario.nombre}</p>
        <p style="margin-bottom:8px; color:#94a3b8;">
            <strong style="color:#ffffff;">Email:</strong> ${usuario.email}</p>
        <p style="margin-bottom:8px; color:#94a3b8;">
            <strong style="color:#ffffff;">Ubicación:</strong> ${usuario.municipio}, ${usuario.departamento}</p>
        <p style="margin-bottom:16px; color:#94a3b8;">
            <strong style="color:#ffffff;">Fecha:</strong> ${usuario.fecha}</p>

        <button onclick="localStorage.removeItem('usuario-registro'); location.reload();" 
                style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:500;">
            Cerrar sesión
        </button>
        </div>
    `;
    resumen.style.display = 'block';
}

mostrarRegistroGuardado();