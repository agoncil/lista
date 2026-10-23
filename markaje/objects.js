// Markaje: the five objects drawn in SVG from the visitor's own text.
// Shared by build.mjs (static render, the no-script fallback) and app.js (live render).

export const COLOURS = {
  od:     { name: 'Verde OD',      cloth: '#4b5228', thread: '#e6dcae', dark: '#2c3017' },
  coyote: { name: 'Coyote',        cloth: '#8a6a42', thread: '#17140d', dark: '#5c4529' },
  negro:  { name: 'Negro táctico', cloth: '#1b1c19', thread: '#d2b98f', dark: '#0b0b0a' },
  azul:   { name: 'Azul policía',  cloth: '#1e2c48', thread: '#ece5d2', dark: '#111a2d' },
};

export const DEFAULT = { unit: 'II Batallón Zaragoza', motto: 'Siempre adelante', colour: 'od', shape: 'escudo' };

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clip = (t, n) => { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
// Fit a line of text into a width by shrinking the font size: narrow uppercase letters run about 0.62em wide.
const fit = (t, width, max) => Math.max(14, Math.min(max, Math.floor(width / (Math.max(t.length, 1) * 0.62))));

function star(cx, cy, r, fill) {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="${fill}"/>`;
}

function laurel(cx, cy, r, fill, side) {
  let out = '';
  for (let i = 0; i < 7; i++) {
    const a = side < 0 ? 105 + i * 16 : 75 - i * 16;
    const rad = (a * Math.PI) / 180;
    const x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
    out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="5" transform="rotate(${(a + 90 * side).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${fill}"/>`;
  }
  return out;
}

function patch(s) {
  const c = COLOURS[s.colour] || COLOURS.od;
  const unit = clip(s.unit, 26).toUpperCase(), motto = clip(s.motto, 30);
  const shapes = {
    escudo: 'M200 20 L370 60 L370 230 C370 330 290 395 200 425 C110 395 30 330 30 230 L30 60 Z',
    redondo: 'M200 25 A195 195 0 1 1 199.9 25 Z',
    rectangulo: 'M20 95 H380 V345 H20 Z',
  };
  const inner = {
    escudo: 'M200 42 L350 77 L350 230 C350 318 280 375 200 403 C120 375 50 318 50 230 L50 77 Z',
    redondo: 'M200 45 A175 175 0 1 1 199.9 45 Z',
    rectangulo: 'M40 115 H360 V325 H40 Z',
  };
  const shape = shapes[s.shape] ? s.shape : 'escudo';
  const top = shape === 'rectangulo' ? 175 : 150;
  return `<svg viewBox="0 0 400 440" role="img" aria-label="Parche bordado: ${esc(unit)}, ${esc(motto)}">
  <path d="${shapes[shape]}" fill="${c.dark}"/>
  <path d="${shapes[shape]}" fill="${c.cloth}" transform="translate(200 220) scale(0.965) translate(-200 -220)"/>
  <path d="${inner[shape]}" fill="none" stroke="${c.thread}" stroke-width="5" stroke-dasharray="9 5"/>
  ${star(200, top + 40, 40, c.thread)}
  ${laurel(200, top + 30, 64, c.thread, -1)}${laurel(200, top + 30, 64, c.thread, 1)}
  <text x="200" y="${top + 150}" text-anchor="middle" fill="${c.thread}" font-family="Archivo, sans-serif" font-weight="800" font-stretch="75%" font-size="${fit(unit, 270, 38)}" letter-spacing="1">${esc(unit)}</text>
  <text x="200" y="${top + 188}" text-anchor="middle" fill="${c.thread}" font-family="Archivo, sans-serif" font-weight="500" font-size="${fit(motto, 250, 24)}">${esc(motto)}</text>
</svg>`;
}

function coin(s) {
  const c = COLOURS[s.colour] || COLOURS.od;
  const unit = clip(s.unit, 30).toUpperCase(), motto = clip(s.motto, 30).toUpperCase();
  return `<svg viewBox="0 0 400 440" role="img" aria-label="Moneda de unidad: ${esc(unit)}">
  <defs><path id="arcT" d="M70 220 A130 130 0 0 1 330 220"/><path id="arcB" d="M62 220 A138 138 0 0 0 338 220"/></defs>
  <circle cx="200" cy="220" r="185" fill="#6f5a2c"/>
  <circle cx="200" cy="220" r="176" fill="#c9a24e"/>
  <circle cx="200" cy="220" r="104" fill="${c.cloth}"/>
  <circle cx="200" cy="220" r="104" fill="none" stroke="#7a6230" stroke-width="6"/>
  ${star(200, 212, 54, '#e9c96e')}
  <text font-family="Archivo, sans-serif" font-weight="800" font-stretch="75%" font-size="${Math.min(30, fit(unit, 380, 30))}" fill="#3d3015" letter-spacing="2"><textPath href="#arcT" startOffset="50%" text-anchor="middle">${esc(unit)}</textPath></text>
  <text font-family="Archivo, sans-serif" font-weight="700" font-stretch="75%" font-size="${Math.min(22, fit(motto, 360, 22))}" fill="#3d3015" letter-spacing="2"><textPath href="#arcB" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">${esc(motto)}</textPath></text>
</svg>`;
}

function metopa(s) {
  const unit = clip(s.unit, 26), motto = clip(s.motto, 34);
  return `<svg viewBox="0 0 400 440" role="img" aria-label="Metopa de madera con placa grabada: ${esc(unit)}">
  <path d="M60 30 H340 V300 C340 360 280 400 200 420 C120 400 60 360 60 300 Z" fill="#5a3a1e"/>
  <path d="M76 46 H324 V296 C324 348 272 382 200 400 C128 382 76 348 76 296 Z" fill="#7b5230"/>
  <circle cx="200" cy="150" r="74" fill="#c9a24e"/>
  <circle cx="200" cy="150" r="64" fill="#b58f3e"/>
  ${star(200, 150, 46, '#ecd18a')}
  <rect x="96" y="262" width="208" height="76" fill="#d9c08a"/>
  <text x="200" y="295" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="700" font-size="${fit(unit, 190, 20)}" fill="#2b2112">${esc(unit)}</text>
  <text x="200" y="322" text-anchor="middle" font-family="Archivo, sans-serif" font-size="${fit(motto, 190, 15)}" fill="#2b2112">${esc(motto)}</text>
</svg>`;
}

function tag(s) {
  const unit = clip(s.unit, 22).toUpperCase(), motto = clip(s.motto, 24).toUpperCase();
  return `<svg viewBox="0 0 400 440" role="img" aria-label="Placa grabada: ${esc(unit)}">
  <path d="M180 30 C140 70 150 120 168 150" fill="none" stroke="#8e8e86" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round"/>
  <rect x="70" y="140" width="260" height="170" rx="40" fill="#9da09a"/>
  <rect x="80" y="150" width="240" height="150" rx="32" fill="#c3c6bf"/>
  <circle cx="200" cy="168" r="9" fill="#8e8e86"/>
  <text x="104" y="222" font-family="Archivo, sans-serif" font-weight="700" font-stretch="75%" font-size="${fit(unit, 195, 26)}" fill="#3c3e39" letter-spacing="1">${esc(unit)}</text>
  <text x="104" y="254" font-family="Archivo, sans-serif" font-weight="500" font-stretch="75%" font-size="${fit(motto, 195, 20)}" fill="#3c3e39" letter-spacing="1">${esc(motto)}</text>
  <text x="104" y="282" font-family="Archivo, sans-serif" font-weight="500" font-stretch="75%" font-size="18" fill="#3c3e39" letter-spacing="1">ESPAÑA</text>
</svg>`;
}

function shirt(s) {
  const c = COLOURS[s.colour] || COLOURS.od;
  const unit = clip(s.unit, 24).toUpperCase(), motto = clip(s.motto, 30);
  return `<svg viewBox="0 0 400 440" role="img" aria-label="Camiseta serigrafiada: ${esc(unit)}">
  <path d="M140 40 L80 64 L22 140 L80 178 L104 150 L104 410 H296 V150 L320 178 L378 140 L320 64 L260 40 C250 70 228 84 200 84 C172 84 150 70 140 40 Z" fill="${c.cloth}"/>
  <path d="M140 40 C150 70 172 84 200 84 C228 84 250 70 260 40 L248 36 C238 60 222 70 200 70 C178 70 162 60 152 36 Z" fill="${c.dark}"/>
  ${star(200, 170, 34, c.thread)}
  <text x="200" y="250" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-stretch="75%" font-size="${fit(unit, 180, 30)}" fill="${c.thread}">${esc(unit)}</text>
  <text x="200" y="280" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="500" font-size="${fit(motto, 170, 17)}" fill="${c.thread}">${esc(motto)}</text>
</svg>`;
}

export const OBJECTS = { parche: patch, moneda: coin, metopa, placa: tag, camiseta: shirt };
export const render = (kind, s) => (OBJECTS[kind] || patch)({ ...DEFAULT, ...s });
