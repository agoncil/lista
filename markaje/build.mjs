// Renders the drawings into template.html so the page is complete without script.
// Usage: node markaje/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { render, DEFAULT } from './objects.js';

const dir = new URL('.', import.meta.url);
const html = readFileSync(new URL('template.html', dir), 'utf8')
  .replace(/\{\{(\w+)\}\}/g, (_, kind) => render(kind, DEFAULT));
writeFileSync(new URL('index.html', dir), html);
console.log('markaje/index.html written');

// The Artifact host wraps the page in its own document, so this copy carries only the head's
// title, fonts and styles followed by the body.
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta (charset|name="viewport")[^>]*>\n?/g, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
writeFileSync(new URL('artifact.html', dir), head.trim().replace(/<title>.*<\/title>/, '<title>Portada Markaje</title>') + '\n' + body);
console.log('markaje/artifact.html written');
