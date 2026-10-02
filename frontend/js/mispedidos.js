async function cargarMisPedidos() {
    const lista = document.getElementById('pedidos-lista');
    const token = localStorage.getItem('token');

    // 1. Sin token - usuario no logueado
    if (!token) {
        lista.innerHTML = `<div style="text-align:center;padding:40px 0;">
        <p>⚠️ Debes iniciar sesión para ver tus pedidos.</p>
        <a href="login.html" class="btn btn-primario">Iniciar sesión</a></div>`;
        return;
    }

    try {
        // 2. Llamar al backend con el token en el header Authorization
        const respuesta = await fetch('http://localhost:3000/api/ordenes', {
            headers: { Authorization: 'Bearer ' + token },
        });
        if (!respuesta.ok) throw new Error('Error al cargar');
        const pedidos = await respuesta.json();

        // 3. Sin pedidos - mensaje vacío
        if (pedidos.length === 0) {
            lista.innerHTML = `<p style="text-align:center;padding:40px 0;color:#9ca3af;">Todavía no tienes pedidos.</p>`;
            return;
        }

        // 4. Renderizar cada pedido como tarjeta
        lista.innerHTML = pedidos
            .map(function (p) {
                const fecha = new Date(p.createdAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                const estado = p.estado || 'pendiente';
                const etiqueta =
                    {
                        pendiente: '⏳ Pendiente',
                        procesando: '⚙️ Procesando',
                        enviado: '📦 Enviado',
                        entregado: '✅ Entregado',
                        cancelado: '❌ Cancelado',
                        PAGO_CONFIRMADO: '💳 Pago confirmado'
                    }[estado] || estado;
                const claseEstado = estado === 'PAGO_CONFIRMADO' ? 'entregado' : estado;
                    
                const items = (p.productos || [])
                    .map(function (i) {
                        return `<li><span>${i.producto ? i.producto.nombre : 'Producto'}</span> <span>x${i.cantidad || 1}</span></li>`;
                    })
                    .join('');
                const total = p.total
                    ? '\$' + Number(p.total).toLocaleString('es-CO')
                    : '-';
                // Línea de tiempo del pedido — solo se dibuja si el estado forma parte
                // del flujo normal post-pago (ver js/timeline.js)
                const timelineHTML = renderTimelineEstado(estado);
                return `<div class="pedido-card">
        <div class="pedido-encabezado">
            <div><div class="pedido-id">ID: #${p._id}</div><div class="pedido-fecha">${fecha}</div></div>
            <span class="badge-estado ${claseEstadoestado}">${etiqueta}</span>
        </div>
        <ul class="pedido-productos">${items}</ul>
        ${timelineHTML}
        <div class="pedido-total">Total: ${total}</div>
        </div>`;
            })
            .join('');
    } catch (e) {
        lista.innerHTML = `<p style="color:#ef4444;text-align:center;padding:40px 0;">❌ No se pudieron cargar los pedidos. Verifica que el servidor esté corriendo con npm run dev.</p>`;
    }
}


cargarMisPedidos();
