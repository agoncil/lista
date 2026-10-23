// Builds the Markaje store home: every product drawing is rendered here, so the page is complete
// without script; tienda.js only adds the filters, search and basket.
// Usage: node markaje/tienda/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { render } from '../objects.js';

const dir = new URL('.', import.meta.url);

const CATS = [
  { id: 'textil', name: 'Textil', from: '8,90 €', obj: 'camiseta', s: { colour: 'negro' }, text: 'Camisetas, sudaderas, polos y gorras bordadas o serigrafiadas.' },
  { id: 'tazas', name: 'Tazas', from: '6,50 €', obj: 'taza', s: { colour: 'od' }, text: 'Cerámica, esmaltadas de campaña y térmicas con tu escudo.' },
  { id: 'parches', name: 'Parches', from: '2,90 €', obj: 'parche', s: { colour: 'coyote' }, text: 'Bordados, PVC 3D y nombres de pecho, con velcro o para coser.' },
  { id: 'merch', name: 'Merchandising', from: '2,20 €', obj: 'llavero', s: { colour: 'azul', unit: 'Promoción 2026' }, text: 'Monedas, llaveros, pines, banderines y pulseras.' },
  { id: 'metopas', name: 'Metopas', from: '45 €', obj: 'metopa', s: {}, text: 'Madera con escudo en relieve y placa con dedicatoria.' },
  { id: 'regalos', name: 'Regalos protocolarios', from: '14,90 €', obj: 'estuche', s: { unit: 'Acto de relevo' }, text: 'Monedas en estuche, placas y metopas para actos oficiales.' },
];

const PRODUCTS = [
  { cat: 'parches', name: 'Parche bordado con velcro', price: '3,90 €', min: 'Mín. 50 uds', obj: 'parche', s: { colour: 'od' } },
  { cat: 'textil', name: 'Camiseta técnica personalizada', price: '9,50 €', min: 'Mín. 20 uds', obj: 'camiseta', s: { colour: 'coyote' } },
  { cat: 'tazas', name: 'Taza de cerámica 330 ml', price: '6,50 €', min: 'Mín. 12 uds', obj: 'taza', s: { colour: 'azul', unit: 'Comisaría Centro' } },
  { cat: 'merch', name: 'Moneda de unidad 40 mm', price: '5,90 €', min: 'Mín. 50 uds', obj: 'moneda', s: { colour: 'od' } },
  { cat: 'metopas', name: 'Metopa de madera con dedicatoria', price: '45 €', min: 'Desde 1 ud', obj: 'metopa', s: { unit: 'Sargento 1º R. Gil', motto: 'Gracias por 30 años' } },
  { cat: 'textil', name: 'Gorra bordada', price: '8,90 €', min: 'Mín. 20 uds', obj: 'gorra', s: { colour: 'od' } },
  { cat: 'tazas', name: 'Taza esmaltada de campaña', price: '9,90 €', min: 'Mín. 12 uds', obj: 'campana', s: { colour: 'od', unit: 'Cía. de Zapadores' } },
  { cat: 'regalos', name: 'Moneda en estuche de regalo', price: '14,90 €', min: 'Desde 10 uds', obj: 'estuche', s: { unit: 'Jura de bandera' } },
  { cat: 'parches', name: 'Parche de PVC 3D', price: '4,50 €', min: 'Mín. 50 uds', obj: 'parche', s: { colour: 'negro', shape: 'redondo', unit: 'Grupo Rural', motto: 'Siempre alerta' } },
  { cat: 'merch', name: 'Pin esmaltado', price: '2,80 €', min: 'Mín. 100 uds', obj: 'pin', s: { colour: 'azul' } },
  { cat: 'merch', name: 'Llavero de PVC', price: '2,20 €', min: 'Mín. 100 uds', obj: 'llavero', s: { colour: 'coyote', unit: 'UME' } },
  { cat: 'regalos', name: 'Placa grabada con cadena', price: '9 €', min: 'Desde 1 ud', obj: 'placa', s: { unit: 'Cabo M. Ortega', motto: 'Misión Líbano 2026' } },
];

const BODIES = ['Ejército de Tierra', 'Armada', 'Ejército del Aire y del Espacio', 'Guardia Civil', 'Policía Nacional', 'Policía Local', 'UME', 'Academias'];

const tileBg = { od: 'var(--t-od)', coyote: 'var(--t-coyote)', negro: 'var(--t-stone)', azul: 'var(--t-blue)' };

const icon = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16Z"/></svg>',
  one: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3ZM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
};

const card = (p, i) => `
        <li class="product" data-cat="${p.cat}" data-name="${p.name.toLowerCase()}"${i >= 8 ? ' hidden' : ''}>
          <a class="product-img" href="#producto" style="--tile:${tileBg[p.s.colour] || 'var(--t-stone)'}">${render(p.obj, p.s)}</a>
          <div class="product-info">
            <h3><a href="#producto">${p.name}</a></h3>
            <p class="product-meta">${p.min} · personalizable</p>
            <p class="product-price"><span>Desde</span> ${p.price}</p>
          </div>
          <button class="add" type="button" data-name="${p.name}">Añadir a la cesta</button>
        </li>`;

const page = `<title>Markaje</title>
<meta name="description" content="Tienda de personalización para el Ejército, la Guardia Civil y la Policía: textil, tazas, parches, merchandising, metopas y regalos protocolarios.">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800&family=Archivo:wdth,wght@75..100,400..700&display=swap" rel="stylesheet">
<style>
${readFileSync(new URL('tienda.css', dir), 'utf8')}
</style>

<div class="notice"><div class="wrap notice-in"><p>Diseño gratis en todos los pedidos</p><p class="only-wide">Presupuesto en 24 h laborables</p><p class="only-wide">Envíos a toda España</p></div></div>

<header class="top">
  <div class="wrap top-in">
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="cats" aria-label="Abrir el menú">${icon.menu}</button>
    <a class="brand" href="#" aria-label="Markaje, inicio">${render('parche', { colour: 'od', unit: 'Markaje', motto: ' ' }).replace('<svg ', '<svg class="brand-mark" aria-hidden="true" ')}<span>MARKAJE</span></a>
    <label class="search"><span class="sr-only">Buscar productos</span>${icon.search}<input id="q" type="search" placeholder="Busca parches, tazas, metopas…" autocomplete="off"></label>
    <nav class="tools" aria-label="Tu cuenta">
      <a href="#cuenta">${icon.user}<span class="only-wide">Mi cuenta</span></a>
      <a href="#cesta" class="bag">${icon.bag}<span class="only-wide">Cesta</span><b id="count" aria-live="polite">0</b></a>
    </nav>
  </div>
  <nav class="cats" id="cats" aria-label="Categorías">
    <ul class="wrap cats-in">
${CATS.map((c) => `      <li><a href="#catalogo" data-filter="${c.id}">${c.name}</a></li>`).join('\n')}
      <li class="cats-b2b"><a href="#unidades">Pedidos para unidades</a></li>
    </ul>
  </nav>
</header>

<main>
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-text">
        <h1>Personalización para tu unidad</h1>
        <p>Textil, tazas, parches, merchandising, metopas y regalos protocolarios para el Ejército, la Guardia Civil y la Policía. Nos mandas el escudo o la idea y te enviamos el boceto gratis.</p>
        <div class="hero-actions">
          <a class="btn gold" href="#catalogo">Ver el catálogo</a>
          <a class="btn line" href="#unidades">Pedir presupuesto</a>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art art-patch">${render('parche', { colour: 'coyote' })}</div>
        <div class="art art-coin">${render('moneda', { colour: 'od', unit: 'Promoción 2026', motto: 'Honor y servicio' })}</div>
        <div class="art art-mug">${render('taza', { colour: 'od', unit: 'Cía. de Zapadores', motto: 'Siempre adelante' })}</div>
      </div>
    </div>
  </section>

  <ul class="wrap promises" aria-label="Ventajas">
    <li>${icon.pen}<span><b>Boceto gratis</b> y cambios sin límite</span></li>
    <li>${icon.one}<span><b>Desde 1 unidad</b> en metopas y grabados</span></li>
    <li>${icon.doc}<span><b>Factura</b> a nombre de la unidad o asociación</span></li>
    <li>${icon.truck}<span><b>Envío</b> a toda España, Ceuta y Melilla</span></li>
  </ul>

  <section class="wrap block" aria-labelledby="h-cats">
    <h2 id="h-cats">Compra por categoría</h2>
    <ul class="cat-grid">
${CATS.map((c) => `      <li><a class="cat" href="#catalogo" data-filter="${c.id}" style="--tile:${tileBg[c.s.colour] || 'var(--t-stone)'}">
        <span class="cat-img">${render(c.obj, c.s)}</span>
        <span class="cat-text"><b>${c.name}</b><span>${c.text}</span><em>Desde ${c.from}</em></span>
      </a></li>`).join('\n')}
    </ul>
  </section>

  <section class="bodies" aria-labelledby="h-bodies">
    <div class="wrap">
      <h2 id="h-bodies">Compra por cuerpo</h2>
      <ul class="body-list">
${BODIES.map((b, i) => `        <li><a href="#catalogo">${render('pin', { colour: ['od', 'azul', 'azul', 'od', 'azul', 'azul', 'coyote', 'negro'][i] }).replace('<svg ', '<svg aria-hidden="true" ')}<span>${b}</span></a></li>`).join('\n')}
      </ul>
    </div>
  </section>

  <section class="wrap block" id="catalogo" aria-labelledby="h-cat">
    <div class="block-head">
      <h2 id="h-cat">Lo más pedido</h2>
      <div class="chips" role="group" aria-label="Filtrar por categoría">
        <button type="button" data-chip="all" aria-pressed="true">Todo</button>
${CATS.map((c) => `        <button type="button" data-chip="${c.id}" aria-pressed="false">${c.name}</button>`).join('\n')}
      </div>
    </div>
    <ul class="grid" id="grid">${PRODUCTS.map(card).join('')}
    </ul>
    <p class="empty" id="empty" hidden>No hay productos con esa búsqueda. Prueba con «parche», «taza» o «moneda», o <a href="#unidades">pídenos lo que necesitas</a>.</p>
  </section>

  <section class="steps-band" aria-labelledby="h-steps">
    <div class="wrap">
      <h2 id="h-steps">Cómo se hace un pedido</h2>
      <ol class="steps">
        <li><b>Elige el producto</b><span>Del catálogo o algo que no veas aquí.</span></li>
        <li><b>Mándanos el escudo o la idea</b><span>Una foto, un boceto a mano o el lema basta.</span></li>
        <li><b>Aprueba el boceto</b><span>Gratis, en 48 h, con los cambios que pidas.</span></li>
        <li><b>Recíbelo en la unidad</b><span>En 3 o 4 semanas, con foto antes del envío.</span></li>
      </ol>
    </div>
  </section>

  <section class="wrap protocol" aria-labelledby="h-proto">
    <div class="protocol-art" aria-hidden="true">
      <div class="art">${render('metopa', { unit: 'Coronel J. Álvarez', motto: 'Con el afecto de su regimiento' })}</div>
      <div class="art">${render('estuche', { unit: 'Relevo de mando' })}</div>
    </div>
    <div class="protocol-text">
      <h2 id="h-proto">Regalos protocolarios</h2>
      <p>Para relevos de mando, visitas oficiales, juras de bandera y despedidas. Metopas con dedicatoria, monedas en estuche de terciopelo y placas grabadas, preparadas para entregar en el acto.</p>
      <ul class="ticks">
        <li>Dedicatoria y fecha grabadas en cada pieza</li>
        <li>Estuche o caja de presentación incluidos</li>
        <li>Pedidos urgentes en 10 días para fechas cerradas</li>
      </ul>
      <a class="btn ink" href="#catalogo" data-filter="regalos">Ver regalos protocolarios</a>
    </div>
  </section>

  <section class="units" id="unidades" aria-labelledby="h-units">
    <div class="wrap units-in">
      <div>
        <h2 id="h-units">Pedidos para unidades</h2>
        <p>Si compras para una compañía, una promoción o una asociación, te preparamos un presupuesto cerrado con boceto en 24 h laborables.</p>
      </div>
      <dl class="packs">
        <div><dt>Pack promoción</dt><dd>50 parches, 50 monedas y 50 llaveros con el mismo diseño</dd><dd class="pack-price">690 €</dd></div>
        <div><dt>Pack compañía</dt><dd>40 camisetas técnicas y 40 parches de unidad</dd><dd class="pack-price">520 €</dd></div>
        <div><dt>Pack despedida</dt><dd>Metopa con dedicatoria y 20 tazas con el lema</dd><dd class="pack-price">165 €</dd></div>
      </dl>
      <div class="contact">
        <p>Escríbenos a <b class="copyable">pedidos@markaje.es</b> o por WhatsApp al <b class="copyable">600 000 000</b>.</p>
        <a class="btn gold" href="mailto:pedidos@markaje.es?subject=Presupuesto%20para%20mi%20unidad">Pedir presupuesto</a>
      </div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="wrap foot-in">
    <div class="foot-brand"><b>MARKAJE</b><p>Personalización para el Ejército, la Guardia Civil y la Policía.</p></div>
    <nav aria-label="Categorías"><h2>Tienda</h2><ul>${CATS.map((c) => `<li><a href="#catalogo" data-filter="${c.id}">${c.name}</a></li>`).join('')}</ul></nav>
    <nav aria-label="Ayuda"><h2>Ayuda</h2><ul><li><a href="#unidades">Pedidos para unidades</a></li><li><a href="#envios">Envíos y plazos</a></li><li><a href="#devoluciones">Cambios y devoluciones</a></li><li><a href="#emblemas">Uso de emblemas oficiales</a></li></ul></nav>
    <div><h2>Contacto</h2><p>pedidos@markaje.es<br>600 000 000<br>Lunes a viernes, de 9 a 18 h</p></div>
  </div>
  <p class="wrap foot-legal">© 2026 Markaje · <a href="#privacidad">Privacidad</a> · <a href="#aviso-legal">Aviso legal</a></p>
</footer>

<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

<script>
${readFileSync(new URL('tienda.js', dir), 'utf8')}
</script>
`;

writeFileSync(new URL('tienda.html', dir), page);
// A standalone copy for local viewing and hosting.
writeFileSync(new URL('index.html', dir), `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${page.replace(/(<\/style>)/, '$1\n</head>\n<body>')}</body>\n</html>\n`);
console.log('markaje/tienda/tienda.html and index.html written');
