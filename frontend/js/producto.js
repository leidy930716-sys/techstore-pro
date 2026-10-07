async function cargarProductoDetalle() {
    // 1. Leer el id= de la URL con URLSearchParams
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id'); // '64a1b2...' o null

    const elCargando = document.getElementById('estado-cargando');
    const elError    = document.getElementById('estado-error');
    const elDetalle  = document.getElementById('producto-detalle');

    // 2. Sin id en la URL - mostrar error
    if (!id) { elCargando.style.display = 'none'; elError.style.display = 'block'; return;}

    try {
        // 3. Pedir el producto al backend (ruta del Paso 1)
        const respuesta = await fetch('http://localhost:3000/api/productos/' + id);
        if (!respuesta.ok) throw new Error('No encontrado');
        const producto = await respuesta.json();

        // 4. Llenar el DOM con los datos del producto
        document.getElementById('producto-nombre').textContent      = producto.nombre;
        document.getElementById('producto-precio').textContent      = producto.precio;
        document.getElementById('producto-descripcion').textContent = producto.descripcion;

        // 4b. Imagen: si tiene - <img>, si no - emoji como placeholder
        const imgWrap = document.getElementById('producto-imagen-wrap');
        imgWrap.innerHTML = producto.imagen
            ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
            : `<div class="producto-imagen-placeholder">${producto.icono || '📦'}</div>`;

        // 5. Mostrar el contenido
        elCargando.style.display = 'none';
        elDetalle.style.display  = 'flex';

        // 6. Botón agregar al carrito - agregarAlCarrito() viene de main.js
        document.getElementById('btn-agregar-carrito').addEventListener('click', function() {
            agregarAlCarrito({ 
                id: producto._id, 
                nombre: producto.nombre,
                precio: producto.precio, icono: producto.icono || '📦',
                imagen: producto.imagen || '', fecha: new Date().toLocaleDateString('es-CO') });
            const msg = document.getElementById('producto-mensaje');
            msg.innerHTML = '<div style="background:#dcfce7;border:1px solid #bbf7d0;border-radius:10px;padding:12px 16px;">'
                + '<p style="color:#15803d;font-weight:600;">✅ Agregado - <a href="carrito.html" style="color:#166534;">Ver carrito →</a></p></div>';
            msg.style.display = 'block';
        });

    } catch (err) {
        elCargando.style.display = 'none';
        elError.style.display    = 'block';
    }
}

document.addEventListener('DOMContentLoaded', cargarProductoDetalle);
