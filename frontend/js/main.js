// ================================================
// MENÚ HAMBURGUESA
// ================================================

const botonMenu = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

if (botonMenu && navMenu) {
  botonMenu.addEventListener('click', function () {
    navMenu.classList.toggle('open');
    const estaAbierto = navMenu.classList.contains('open');
    botonMenu.setAttribute('aria-expanded', estaAbierto);
  });

  const enlaces = navMenu.querySelectorAll('a');
  enlaces.forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      navMenu.classList.remove('open');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// ================================================
// VALIDAR FORMULARIO DE CONTACTO
// ================================================

const formulario = document.querySelector('#form-contacto');

if (formulario) {
  function mostrarError(idCampo, mensaje) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.add('tiene-error');
      spanError.textContent = mensaje;
    }
  }

  function limpiarError(idCampo) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.remove('tiene-error');
      spanError.textContent = '';
    }
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let hayErrores = false;

    const valorNombre = document.querySelector('#nombre').value.trim();
    if (valorNombre.length < 3) {
      mostrarError('nombre', 'Escribe tu nombre completo (mínimo 3 caracteres)');
      hayErrores = true;
    } else {
      limpiarError('nombre');
    }

    const valorEmail = document.querySelector('#email').value.trim();
    if (!valorEmail.includes('@') || valorEmail.length < 5) {
      mostrarError('email', 'Ingresa un correo válido (debe tener @)');
      hayErrores = true;
    } else {
      limpiarError('email');
    }

    const valorAsunto = document.querySelector('#asunto').value;
    if (valorAsunto === '') {
      mostrarError('asunto', 'Selecciona un asunto');
      hayErrores = true;
    } else {
      limpiarError('asunto');
    }

    const valorMensaje = document.querySelector('#mensaje').value.trim();
    if (valorMensaje.length < 10) {
      mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      hayErrores = true;
    } else {
      limpiarError('mensaje');
    }

    if (!hayErrores) {
      const exito = document.querySelector('#form-exito');
      if (exito) exito.style.display = 'block';
      formulario.reset();
    }
  });
}

// ================================================
// TARJETAS DINÁMICAS DESDE ARRAY
// ================================================



function crearTarjeta(producto) {
  return `
    <article class="tarjeta"
      data-id="${producto.id}"
      data-icono="${producto.icono || '📦'}"
      data-nombre="${producto.nombre}"
      data-desc="${producto.descripcion}"
      data-precio="${producto.precio}"
      data-imagen="${producto.imagen || ''}">
      
      <span class="badge-disponible">✓ Disponible</span>

      <img src="${producto.imagen}" 
          alt="${producto.nombre}" 
         class="tarjeta-img">

      <div class="tarjeta-info">
        <h3 class="tarjeta-nombre">${producto.nombre}</h3>
        <p class="tarjeta-desc">${producto.descripcion}</p>

        <div class="tarjeta-pie">
          <span class="tarjeta-precio">${producto.precio}</span>
          <a href="producto.html?id=${producto._id || producto.id || ''}" class="btn-accion">Ver más</a>
        </div>
      </div>
    </article>
  `;
}

// ================================================
// S08: CARGAR PRODUCTOS DESDE JSON
// Reemplaza el array hardcodeado de S03.
// Funciona en: productos.html (donde existe #grid-tarjetas)
// Requiere: data/productos.json con el array de productos
// ================================================

async function cargarProductos() {
  const grid = document.querySelector('#grid-tarjetas');
  if (!grid) return; // solo correr en páginas que tienen el grid

  try {
    // PASO 1 — Pedir el archivo JSON al servidor
    // await pausa aquí hasta que llegue la respuesta (el sobre)
    const respuesta = await fetch('http://localhost:3000/api/productos');

    // PASO 2 — Leer el contenido del JSON como array JavaScript
    // .json() también es asíncrono → necesita su propio await
    const productos = await respuesta.json();

    // PASO 3 — Renderizar las tarjetas en el grid
    // productos.map(crearTarjeta) convierte cada objeto en HTML
    grid.innerHTML = productos.map(crearTarjeta).join('');

    registrarBotonesModal();
    registrarBadgeHover();   // ← agregar
    registrarBuscador();     // ← agregar

  } catch (error) {
    // Si fetch falla: muestra mensaje visible en la página
    grid.innerHTML = `
      <div class="error-fetch">
        <p>⚠️ No se pudieron cargar los productos.</p>
        <button onclick="cargarProductos()" class="btn btn-primario">Reintentar</button>
      </div>
    `;
    console.error('Error al cargar productos:', error);
  }
}

cargarProductos(); // ejecutar al cargar la página

// ================================================
// MODAL PRODUCTO
// ================================================

const modal = document.querySelector('#modal-producto');

if (modal) {
  const btnCerrar = document.querySelector('#modal-cerrar');

  // Llena el modal con los datos del producto y lo hace visible
  // tarjeta.dataset lee los atributos data-* del <article class="tarjeta">
  function abrirModal(tarjeta) {
    document.querySelector('#modal-icono').textContent = tarjeta.dataset.icono || '📦';
    document.querySelector('#modal-titulo').textContent = tarjeta.dataset.nombre || 'Producto';
    document.querySelector('#modal-desc').textContent = tarjeta.dataset.desc || '';
    document.querySelector('#modal-precio').textContent = tarjeta.dataset.precio || '';
    // NUEVO - guardar imagen e id para usarlos al agregar al carrito
    modal.dataset.imagen = tarjeta.dataset.imagen || '';
    modal.dataset.id = tarjeta.dataset.id || '';
    modal.classList.add('visible');
  }

  // Se llama desde cargarProductos() DESPUÉS de grid.innerHTML
  // porque los botones .btn-accion los crea crearTarjeta() dinámicamente
  function registrarBotonesModal() {
    document.querySelectorAll('.btn-accion').forEach(function (boton) {
      // Si es un enlace <a> - el navegador ya lo maneja, no registra el modal
      if (boton.tagName === 'A') return;
      boton.addEventListener('click', function () {
        abrirModal(boton.closest('.tarjeta'));
      });
    });
  }

  // Cerrar con el botón ×
  btnCerrar.addEventListener('click', function () {
    modal.classList.remove('visible');
  });

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.classList.remove('visible');
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') modal.classList.remove('visible');
  });
}

// ================================================
// BARRA DE PROGRESO SCROLL
// ================================================

const barraScroll = document.querySelector('#barra-scroll');
if (barraScroll) {
  window.addEventListener('scroll', function () {
    const totalDesplazamiento = document.body.scrollHeight - window.innerHeight;
    const porcentaje = (window.scrollY / totalDesplazamiento) * 100;
    barraScroll.style.width = porcentaje + '%';
  });
}

// ================================================
// BADGE HOVER EN TARJETAS
// ================================================

// Muestra el badge "✓ Disponible" al pasar el mouse por una tarjeta
// Se llama desde cargarProductos() — las tarjetas deben existir primero
function registrarBadgeHover() {
  document.querySelectorAll('.tarjeta').forEach(function (tarjeta) {
    const badge = tarjeta.querySelector('.badge-disponible');
    if (badge) {
      tarjeta.addEventListener('mouseover', function () { badge.classList.add('visible'); });
      tarjeta.addEventListener('mouseout', function () { badge.classList.remove('visible'); });
    }
  });
}

// Filtra las tarjetas en tiempo real según lo que escribe el usuario
// Se llama desde cargarProductos() — las tarjetas deben existir primero
function registrarBuscador() {
  const buscador = document.querySelector('#buscador');
  if (!buscador) return; // solo correr en páginas con buscador
  buscador.addEventListener('input', function () {
    // .toLowerCase() para que "macbook" encuentre "MacBook"
    const termino = buscador.value.toLowerCase();
    document.querySelectorAll('.tarjeta').forEach(function (tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      // muestra u oculta según si el nombre incluye el término buscado
      tarjeta.style.display = nombre.includes(termino) ? 'block' : 'none';
    });
  });
}

// ================================================
// BÚSQUEDA EN TIEMPO REAL
// ================================================

const buscador = document.querySelector('#buscador');
if (buscador) {
  buscador.addEventListener('input', function () {
    const termino = buscador.value.toLowerCase().trim();
    todasLasTarjetas.forEach(function (tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      if (nombre.includes(termino) || termino === '') {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  });
}

// ================================================
// TEMA OSCURO
// ================================================

function aplicarTemaGuardado() {
  const tema = localStorage.getItem('tema');
  if (tema === 'oscuro') {
    document.body.classList.add('tema-oscuro');
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = '☀️';
  }
}

function toggleTema() {
  const esOscuro = document.body.classList.toggle('tema-oscuro');
  const btn = document.getElementById('btn-tema');
  if (esOscuro) {
    localStorage.setItem('tema', 'oscuro');
    if (btn) btn.textContent = '☀️';
  } else {
    localStorage.setItem('tema', 'claro');
    if (btn) btn.textContent = '🌙';
  }
}

const btnTema = document.getElementById('btn-tema');
if (btnTema) {
  btnTema.addEventListener('click', toggleTema);
}

aplicarTemaGuardado();

// ================================================
// CARRITO DE COMPRAS
// ================================================

function leerCarrito() {
  const guardado = localStorage.getItem('carrito');
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadge();
}

function actualizarBadge() {
  const badge = document.getElementById('carrito-badge');
  if (!badge) return;
  const carrito = leerCarrito();
  badge.textContent = carrito.length;
}

function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito);
  alert(`✅ ${producto.nombre} agregado al carrito`);
}

const btnModalCarrito = document.querySelector('.modal-btn-carrito');
if (btnModalCarrito) {
  btnModalCarrito.addEventListener('click', function () {
    const modalEl = document.getElementById('modal-producto');
    const producto = {
      id: modalEl.dataset.id || '', // Nuevo
      nombre: document.getElementById('modal-titulo').textContent,
      precio: document.getElementById('modal-precio').textContent,
      icono: document.getElementById('modal-icono').textContent,
      imagen: modalEl.dataset.imagen || '', // Nuevo
      fecha: new Date().toLocaleDateString('es-CO')
    };
    agregarAlCarrito(producto);
    modalEl.classList.remove('visible');
  });
}

actualizarBadge();

// ================================================
// PÁGINA CARRITO - Solo se ejecuta en carrito.html
// ================================================

function mostrarPaginaCarrito() {
  const lista = document.getElementById('lista-carrito');
  const resumen = document.getElementById('carrito-resumen');
  if (!lista) return;

  const carrito = leerCarrito();

  if (carrito.length === 0) {
    if (resumen) resumen.textContent = 'Tu carrito está vacío';
    lista.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito. <a href="index.html">Ver productos →</a></p>';
    return;
  }

  if (resumen) resumen.textContent = `${carrito.length} producto(s) en el carrito`;
  lista.innerHTML = '';

  carrito.forEach(function (producto, indice) {
    const item = document.createElement('div');
    item.classList.add('carrito-item');

    // Si tiene imagen - mostrarlas. Si no - mostrar el emoji.
    const imagenHTML = producto.imagen
      ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-img">`
      : `<span class="carrito-item-icono">${producto.icono}</span>`;

    item.innerHTML = `
      ${imagenHTML}
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${producto.nombre}</div>
        <div class="carrito-item-precio">${producto.precio}</div>
        <div class="carrito-item-fecha">Agregado: ${producto.fecha || 'Hoy'}</div>
      </div>
      <button class="btn-eliminar" data-indice="${indice}">Eliminar</button>
    `;
    lista.appendChild(item);
  });

  document.querySelectorAll('.btn-eliminar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const indice = parseInt(this.dataset.indice);
      const carritoActual = leerCarrito();
      carritoActual.splice(indice, 1);
      guardarCarrito(carritoActual);
      mostrarPaginaCarrito();
    });
  });
}

const btnVaciar = document.getElementById('btn-vaciar');
if (btnVaciar) {
  btnVaciar.addEventListener('click', function () {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      localStorage.removeItem('carrito');
      actualizarBadge();
      mostrarPaginaCarrito();
    }
  });
}

mostrarPaginaCarrito();

// ==== S17c: ESTADO DE SESION EN EL NAV ====
// lee el token del localStorage y actualiza el nav en TODAS las paginas

function actualizarNavSesion() {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('usuario-nombre');
  const rol = localStorage.getItem('usuario-rol');
  const enlaceLogin = document.querySelector('#nav-login');
  if (!enlaceLogin) return;

  if (token && nombre) {
    // 1. Construir wrapper y botón con el nombre
    const wrapper = document.createElement('div');
    wrapper.className = 'usuario-dropdown';

    const btn = document.createElement('button');
    btn.className = 'usuario-btn';
    btn.textContent = '👤 ' + nombre;

    // 2. Construir menú con las tres opciones
    const menu = document.createElement('div');
    menu.className = 'usuario-menu';

    const linkPerfil = document.createElement('a');
    linkPerfil.href = 'perfil.html';
    linkPerfil.textContent = '👤 Mi perfil';

    const linkPedidos = document.createElement('a');
    linkPedidos.href = 'mispedidos.html';
    linkPedidos.textContent = '📦 Mis pedidos';

    // Opción: Panel Admin — solo visible si el usuario tiene rol 'admin'
    const linkAdmin = document.createElement('a');
    linkAdmin.href = 'admin.html';
    linkAdmin.textContent = '🛠️ Panel Admin';

    const sep = document.createElement('div');
    sep.className = 'menu-separador';

    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'btn-cerrar-sesion';
    btnCerrar.textContent = '🚪 Cerrar sesión';

    btnCerrar.addEventListener('click', function () {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario-nombre');
      localStorage.removeItem('usuario-rol');  // ← AGREGAR
      window.location.href = 'login.html';
    });

    menu.appendChild(linkPerfil);
    menu.appendChild(linkPedidos);
    if (rol === 'admin') menu.appendChild(linkAdmin);  // ← AGREGAR
    menu.appendChild(sep);
    menu.appendChild(btnCerrar);

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);

    // 3. Ocultar "Registro" — no tiene sentido estando logueado
    const navMenu = document.querySelector('#nav-menu');

    if (navMenu) {
      navMenu.querySelectorAll('a').forEach(function (a) {
        if (a.href.includes('registro.html')) {
          a.style.display = 'none';
        }
      });
    }

    // 4. Reemplazar el <a id="nav-login"> por el dropdown
    enlaceLogin.parentNode.replaceChild(wrapper, enlaceLogin);

    // 5. Abrir/cerrar al hacer clic; cerrar al clic fuera
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('abierto');
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        menu.classList.remove('abierto');
      }
    });

  } else {
    enlaceLogin.textContent = 'Login';
    enlaceLogin.href = 'login.html';
  }
}

actualizarNavSesion(); // ejecutar al cargar cada pagina

// ===== S18A: CHECKOUT — PAGAR CON WOMPI =====
// Ya no se crea la orden directamente. Se pide una firma al backend,
// se abre el Widget de Wompi, y la orden se crea solo si el pago es aprobado
// (el backend lo confirma vía polling, ver /api/pagos/estado/:reference).

const btnConfirmar = document.getElementById('btn-confirmar');
let pollingInterval = null;

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', async function () {
    const token = localStorage.getItem('token');
    const carrito = leerCarrito();
    const mensaje = document.getElementById('checkout-mensaje');

    if (!token) {
      mensaje.innerHTML =
        '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
        '<p style="color:#854d0e; font-weight:600;">⚠️ Debes iniciar sesión para confirmar tu pedido.</p>' +
        '<a href="login.html" style="color:#92400e;">Ir al login →</a>' +
        '</div>';
      mensaje.style.display = 'block';
      return;
    }

    if (carrito.length === 0) {
      mensaje.innerHTML =
        '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
        '<p style="color:#854d0e; font-weight:600;">⚠️ El carrito está vacío.</p>' +
        '</div>';
      mensaje.style.display = 'block';
      return;
    }

    const productosParaEnviar = carrito.map(function (item) {
      return { producto: item.id, cantidad: 1 };
    });

    // Calcular el total — el precio viene como string "$1.299.000".
    // Los puntos son separadores de miles (formato colombiano), no decimales — hay que quitarlos.
    const total = carrito.reduce(function (acumulado, item) {
      const numero = parseFloat(item.precio.replace(/[^0-9]/g, '')) || 0;
      return acumulado + numero;
    }, 0);

    try {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Preparando pago...';

      // Pedir al backend la firma de integridad (crea la Transaccion en estado PENDING)
      const respuesta = await fetch('http://localhost:3000/api/pagos/firma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ productos: productosParaEnviar, total: total })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        mensaje.innerHTML =
          '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
          '<p style="color:#991b1b; font-weight:600;">❌ ' + (datos.error || 'Error al preparar el pago') + '</p>' +
          '</div>';
        mensaje.style.display = 'block';
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = '💳 Pagar con Wompi';
        return;
      }

      // Abrir el Widget de Wompi con los datos de la firma
      const checkout = new WidgetCheckout({
        currency: datos.currency,
        amountInCents: datos.amountInCents,
        reference: datos.reference,
        publicKey: datos.publicKey,
        signature: { integrity: datos.signature }
      });

      checkout.open(function () {
        // Este callback se ejecuta cuando el widget se cierra (pago terminado o cancelado)
        iniciarPolling(datos.reference, token, mensaje);
      });

    } catch (error) {
      mensaje.innerHTML =
        '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
        '<p style="color:#991b1b; font-weight:600;">❌ No se pudo conectar. Verifica que el servidor esté corriendo.</p>' +
        '</div>';
      mensaje.style.display = 'block';
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = '💳 Pagar con Wompi';
    }
  });
}

// Consulta cada 3 segundos si el pago ya fue aprobado por Wompi.
// Máximo 20 intentos (60 segundos) antes de mostrar timeout.
function iniciarPolling(reference, token, mensaje) {
  btnConfirmar.textContent = 'Confirmando pago...';
  let intentos = 0;

  pollingInterval = setInterval(async function () {
    intentos++;
    if (intentos > 20) {
      clearInterval(pollingInterval);
      mostrarResultadoPago('TIMEOUT', mensaje);
      return;
    }

    try {
      const r = await fetch('http://localhost:3000/api/pagos/estado/' + reference, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await r.json();

      if (data.status !== 'PENDING') {
        clearInterval(pollingInterval);
        mostrarResultadoPago(data.status, mensaje);
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  }, 3000);
}

function mostrarResultadoPago(status, mensaje) {
  if (status === 'APPROVED') {
    localStorage.removeItem('carrito');
    actualizarBadge();

    mensaje.innerHTML =
      '<div style="background:#dcfce7; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">' +
      '<p style="color:#15803d; font-weight:700; font-size:16px;">✅ ¡Pago aprobado!</p>' +
      '<p style="color:#166534; font-size:13px; margin-top:6px;">Tu orden fue registrada en el sistema.</p>' +
      '<a href="index.html" style="color:#15803d; font-weight:600;">← Volver al inicio</a>' +
      '</div>';
    mensaje.style.display = 'block';

    mostrarPaginaCarrito(); // actualizar la vista del carrito (ahora vacío)

  } else if (status === 'DECLINED') {
    mensaje.innerHTML =
      '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
      '<p style="color:#991b1b; font-weight:600;">❌ Pago rechazado. Intenta con otra tarjeta.</p>' +
      '</div>';
    mensaje.style.display = 'block';
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = '💳 Pagar con Wompi';

  } else {
    mensaje.innerHTML =
      '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
      '<p style="color:#854d0e; font-weight:600;">⏱️ No pudimos confirmar el pago todavía. Revisa "Mis pedidos" en un momento.</p>' +
      '</div>';
    mensaje.style.display = 'block';
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = '💳 Pagar con Wompi';
  }
}