// Ported from the tested vanilla gate. Decryption success IS the auth check.
const ITER = 600000 // must match build.js

async function fetchBytes(name) {
  const r = await fetch(import.meta.env.BASE_URL + name, { cache: 'no-store' })
  if (!r.ok) throw new Error(`fetch ${name}: ${r.status}`)
  return new Uint8Array(await r.arrayBuffer())
}

async function deriveKey(passphrase, salt) {
  const base = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    true, // extractable, so we can cache the raw key for return visits
    ['decrypt'],
  )
}

async function decryptWith(key) {
  const blob = await fetchBytes('content.enc')
  const iv = blob.subarray(0, 12)
  const data = blob.subarray(12) // ciphertext || tag
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return JSON.parse(new TextDecoder().decode(plain)) // throws on wrong passphrase
}

async function cacheKey(key) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
  localStorage.setItem('lf-key', btoa(String.fromCharCode(...raw)))
}

// Try a passphrase → decrypted content, or throws on failure.
export async function unlock(passphrase) {
  const salt = await fetchBytes('salt.bin')
  const key = await deriveKey(passphrase, salt)
  const content = await decryptWith(key)
  await cacheKey(key)
  return content
}

// Return visit: try the cached key. Resolves to content, or null if none/stale.
export async function unlockFromCache() {
  const b64 = localStorage.getItem('lf-key')
  if (!b64) return null
  try {
    const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['decrypt'])
    return await decryptWith(key)
  } catch {
    localStorage.removeItem('lf-key') // stale (e.g. passphrase rotated)
    return null
  }
}
