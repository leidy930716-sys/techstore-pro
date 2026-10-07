const ESTADOS_ORDEN = ['PAGO_CONFIRMADO', 'procesando', 'enviado', 'entregado'];

async function cargarOrdenesAdmin() {
    const lista = document.getElementById('admin-ordenes-lista');
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('usuario-rol');

    // 1. Si no hay sesión o el usuario no es admin, bloquear el acceso
    if (!token) {
        lista.innerHTML = '<p>🔒 Debes iniciar sesión para ver esta página.</p>';
        return;
    }
    if (rol !== 'admin') {
        lista.innerHTML = '<p>⛔ No tienes permisos para ver esta página.</p>';
        return;
    }

    try {
        // 2. Pedir TODAS las órdenes al backend (ruta protegida con verificarAdmin)
        const respuesta = await fetch('http://localhost:3000/api/ordenes/admin/todas', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!respuesta.ok) throw new Error('Error al cargar órdenes');

        const ordenes = await respuesta.json();

        // 3. Renderizar cada orden con un <select> para cambiar el estado
        lista.innerHTML = ordenes.map(function (orden) {
            const cliente = orden.usuario ? (orden.usuario.nombre + ' — ' + orden.usuario.email) : 'Cliente eliminado';

            const opcionesHTML = ESTADOS_ORDEN.map(function (estado) {
                const seleccionado = estado === orden.estado ? 'selected' : '';
                return `<option value="${estado}" ${seleccionado}>${estado}</option>`;
            }).join('');

            const timelineHTML = renderTimelineEstado(orden.estado);

            const productosHTML = (orden.productos || []).map(function (item) {
                return `<li>${item.nombre || 'Producto'} x${item.cantidad || 1}</li>`;
            }).join('');

            const totalFormateado = '$' + (orden.total || 0).toLocaleString();

            return `
            <div class="pedido-card" data-orden-card="${orden._id}">
                <div class="pedido-encabezado">
                    <p><strong>Cliente:</strong> ${cliente}</p>
                    <select class="selector-estado" data-orden-id="${orden._id}">${opcionesHTML}</select>
                </div>
                <ul class="pedido-productos">${productosHTML}</ul>
                <div class="timeline-wrap">${timelineHTML}</div>
                <div class="pedido-total">Total: ${totalFormateado}</div>
            </div>
        `;
        }).join('');

        // 4. Escuchar cambios en cada <select> para actualizar el estado en el backend
        document.querySelectorAll('.selector-estado').forEach(function (select) {
            select.addEventListener('change', async function () {
                const ordenId = select.dataset.ordenId;
                const nuevoEstado = select.value;

                const r = await fetch('http://localhost:3000/api/ordenes/' + ordenId + '/estado', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ estado: nuevoEstado })
                });

                if (!r.ok) { alert('No se pudo actualizar el estado de la orden.'); return; }
            });
        });

    } catch (error) {
        lista.innerHTML = '<p>❌ No se pudieron cargar las órdenes.</p>';
    }
}

cargarOrdenesAdmin(); // ejecutar al cargar la página