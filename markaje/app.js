import { render, COLOURS } from './objects.js';

const form = document.getElementById('config');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PRODUCTS = {
  parche:   ['Parches bordados, tejidos y de PVC', 'Con velcro o para coser, del escudo de la compañía al nombre de pecho. Bordado de hasta 12 colores o PVC 3D para el que vive a la intemperie.', 'Desde 3,90 € por unidad · mínimo 50'],
  moneda:   ['Monedas de unidad y de promoción', 'Metal envejecido o dorado, esmalte a dos caras, canto acordonado y número de serie. La moneda que se entrega al terminar el curso o la misión.', 'Desde 5,90 € por unidad · mínimo 50'],
  metopa:   ['Metopas con dedicatoria', 'Madera maciza con el escudo en relieve y una placa grabada con el nombre, el empleo y la fecha. Para despedidas, ascensos y jubilaciones.', 'Desde 45 € · desde una unidad'],
  placa:    ['Grabado láser sobre metal y piel', 'Placas de identificación, navajas, carteras, mecheros y llaveros con el nombre y el lema de la unidad.', 'Desde 9 € · desde una unidad'],
  camiseta: ['Textil de unidad', 'Camisetas técnicas, sudaderas y gorras con el escudo bordado o serigrafiado, en tallas de la XS a la 3XL.', 'Desde 9,50 € por prenda · mínimo 20'],
};

const state = () => Object.fromEntries(new FormData(form));

function redraw() {
  const s = state();
  document.querySelectorAll('[data-obj]').forEach((el) => { el.innerHTML = render(el.dataset.obj, s); });
  const c = COLOURS[s.colour];
  const shape = { escudo: 'escudo', redondo: 'redondo', rectangulo: 'rectangular' }[s.shape];
  const body = `Hola, quiero presupuesto para un parche de unidad.\n\nUnidad: ${s.unit}\nLema: ${s.motto}\nColor: ${c.name}\nForma: ${shape}\nCantidad aproximada: \n\nGracias.`;
  document.getElementById('quote').href =
    `mailto:hola@markaje.es?subject=${encodeURIComponent('Presupuesto de parches · ' + s.unit)}&body=${encodeURIComponent(body)}`;
}
form.addEventListener('submit', (e) => e.preventDefault());

// The stage shows the object of the section in view; a tab can pick another one.
const layers = [...document.querySelectorAll('.stage .layer')];
let shown = 'parche';
function show(kind) {
  if (kind === shown) return;
  shown = kind;
  layers.forEach((l) => l.classList.toggle('on', l.dataset.kind === kind));
}
let tabKind = 'parche';
form.addEventListener('input', () => { redraw(); show('parche'); });
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const sec = e.target;
    show(sec.classList.contains('showcase') ? tabKind : sec.dataset.stage);
  });
}, { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('[data-stage]').forEach((s) => io.observe(s));

const tabs = [...document.querySelectorAll('[role=tab]')];
tabs.forEach((t) => t.addEventListener('click', () => {
  tabKind = t.dataset.kind;
  tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
  const [title, text, price] = PRODUCTS[tabKind];
  document.getElementById('prod-title').textContent = title;
  document.getElementById('prod-text').textContent = text;
  document.getElementById('prod-price').textContent = price;
  const fig = document.getElementById('mfig-prod');
  fig.dataset.obj = tabKind;
  fig.innerHTML = render(tabKind, state());
  show(tabKind);
}));

// Entrances: the parts of each section rise in turn, once.
const parts = document.querySelectorAll('.rv');
if (reduce || !('IntersectionObserver' in window)) {
  parts.forEach((p) => p.classList.add('in'));
} else {
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const sib = [...e.target.parentElement.querySelectorAll(':scope > .rv')];
      e.target.style.setProperty('--d', `${Math.max(0, sib.indexOf(e.target)) * 80}ms`);
      e.target.classList.add('in');
      seen.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  parts.forEach((p) => seen.observe(p));
}
