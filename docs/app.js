// Gate: passphrase -> PBKDF2 key -> AES-GCM decrypt -> render. Decryption success IS the auth check.
const ITER = 600000; // must match build.js

const $ = (id) => document.getElementById(id);
const gate = $('gate');
const content = $('content');
const form = $('gate-form');
const input = $('passphrase');
const error = $('error');

async function fetchBytes(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`fetch ${url}: ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

async function deriveKey(passphrase, salt) {
  const base = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    true, // extractable, so we can cache the raw key for return visits
    ['decrypt']
  );
}

async function decryptContent(key) {
  const blob = await fetchBytes('content.enc');
  const iv = blob.subarray(0, 12);
  const data = blob.subarray(12); // ciphertext || tag — Web Crypto wants the tag appended
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return JSON.parse(new TextDecoder().decode(plain)); // throws on wrong passphrase (auth tag mismatch)
}

function render(data) {
  gate.hidden = true;
  content.hidden = false;
  $('c-title').textContent = data.title;
  $('c-message').textContent = data.message;
}

async function cacheKey(key) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
  localStorage.setItem('lf-key', btoa(String.fromCharCode(...raw)));
}

async function loadCachedKey() {
  const b64 = localStorage.getItem('lf-key');
  if (!b64) return null;
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['decrypt']);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  error.hidden = true;
  try {
    const salt = await fetchBytes('salt.bin');
    const key = await deriveKey(input.value.trim(), salt);
    const data = await decryptContent(key); // fails here if passphrase is wrong
    await cacheKey(key);
    render(data);
  } catch {
    error.hidden = false;
    input.value = '';
    input.focus();
  }
});

// Return visit: try the cached key, skip the gate if it still decrypts.
(async () => {
  try {
    const key = await loadCachedKey();
    if (key) render(await decryptContent(key));
  } catch {
    localStorage.removeItem('lf-key'); // stale (e.g. passphrase rotated) — fall back to gate
  }
})();
