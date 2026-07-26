// GitHub Pages is static — no server/edge, so no geo detection.
// navigator.language is the native client-side equivalent; footer toggle overrides; localStorage persists.
const KEY = 'lf-lang'
export const LANGS = ['en', 'fr']

export function initialLang() {
  const saved = localStorage.getItem(KEY)
  if (saved && LANGS.includes(saved)) return saved
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
  return LANGS.includes(nav) ? nav : 'en'
}

export function saveLang(lang) {
  localStorage.setItem(KEY, lang)
}

// UI chrome strings — plaintext, leak nothing.
export const UI = {
  en: { enter: 'Enter', passphrase: 'Passphrase', wrong: "That passphrase didn't work — try again.", prev: 'Previous', next: 'Next' },
  fr: { enter: 'Entrer', passphrase: 'Mot de passe', wrong: "Ce mot de passe n'a pas fonctionné — réessayez.", prev: 'Précédent', next: 'Suivant' },
}
