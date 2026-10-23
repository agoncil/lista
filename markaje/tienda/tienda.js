(() => {
  const grid = document.getElementById('grid');
  const items = [...grid.children];
  const chips = [...document.querySelectorAll('[data-chip]')];
  const q = document.getElementById('q');
  const empty = document.getElementById('empty');
  let cat = 'all';

  // Shows the products of the chosen category that match the search; with neither, the first eight.
  function apply() {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((li, i) => {
      const ok = (cat === 'all' || li.dataset.cat === cat) && (!term || li.dataset.name.includes(term));
      const visible = ok && (cat !== 'all' || term || i < 8);
      li.hidden = !visible;
      if (visible) shown++;
    });
    empty.hidden = shown > 0;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.chip === cat)));
  }

  chips.forEach((c) => c.addEventListener('click', () => { cat = c.dataset.chip; apply(); }));
  q.addEventListener('input', () => {
    if (q.value.trim()) cat = 'all';
    apply();
    if (q.value.trim()) document.getElementById('catalogo').scrollIntoView({ block: 'start' });
  });

  document.querySelectorAll('[data-filter]').forEach((a) => a.addEventListener('click', () => {
    cat = a.dataset.filter;
    q.value = '';
    apply();
    menu.setAttribute('aria-expanded', 'false');
    cats.classList.remove('open');
  }));

  // Basket: a counter and a short notice; checkout is not wired in this mock-up.
  const count = document.getElementById('count');
  const toast = document.getElementById('toast');
  let n = 0, timer;
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.add');
    if (!b) return;
    count.textContent = String(++n);
    count.classList.add('bump');
    setTimeout(() => count.classList.remove('bump'), 200);
    toast.textContent = `Añadido a la cesta: ${b.dataset.name}`;
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { toast.hidden = true; }, 2600);
  });

  const menu = document.querySelector('.menu-btn');
  const cats = document.getElementById('cats');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    cats.classList.toggle('open', open);
  });
})();
