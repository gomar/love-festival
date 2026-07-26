import { useEffect, useState } from 'react'
import { unlockFromCache } from '@/lib/crypto'
import { initialLang, saveLang, UI } from '@/i18n'
import { SECTIONS } from '@/content/sections'
import { Gate } from '@/components/Gate'
import { MenuBar } from '@/components/MenuBar'
import { Pagination } from '@/components/Pagination'
import { LanguageToggle } from '@/components/LanguageToggle'

// Per-section background — colorful placeholder palette, swap for the real one.
const BG = ['#1a1418', '#22303a', '#2b2140', '#1f3328', '#3a2420']

function sectionFromHash() {
  const i = SECTIONS.findIndex((s) => s.id === location.hash.slice(1))
  return i >= 0 ? i : 0
}

export default function App() {
  const [content, setContent] = useState(null) // decrypted { en:{…}, fr:{…} }
  const [lang, setLangState] = useState(initialLang)
  const [current, setCurrent] = useState(sectionFromHash)
  const [menuOpen, setMenuOpen] = useState(false)

  // Return-visit auto-unlock.
  useEffect(() => {
    unlockFromCache().then((c) => c && setContent(c))
  }, [])

  // Hash <-> section sync: back-button works, refresh stays on the section.
  useEffect(() => {
    const onHash = () => setCurrent(sectionFromHash())
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const bg = BG[current % BG.length]

  // Android address bar inherits the current section color.
  useEffect(() => {
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', bg)
  }, [bg])

  function go(i) {
    const n = Math.max(0, Math.min(SECTIONS.length - 1, i))
    location.hash = SECTIONS[n].id
    setCurrent(n)
    scrollTo({ top: 0 })
  }

  function setLang(l) {
    setLangState(l)
    saveLang(l)
  }

  const ui = UI[lang]
  if (!content) return <Gate ui={ui} onUnlock={setContent} />

  const section = SECTIONS[current]
  const data = content[lang]?.[section.id] ?? {}

  return (
    <div className="min-h-dvh flex flex-col text-neutral-100 transition-colors duration-500" style={{ background: bg }}>
      <MenuBar lang={lang} current={current} onGo={go} open={menuOpen} setOpen={setMenuOpen} bg={bg} />

      {/* max-w caps the layout; mx-auto centers it on massive desktops (the "third breakpoint") */}
      <main key={section.id} className="flex-1 w-full max-w-2xl mx-auto px-6 py-10 animate-fade">
        <h1 className="text-fluid-xl font-light tracking-wide mb-6">{data.title}</h1>
        <p className="text-fluid-base leading-relaxed whitespace-pre-line text-neutral-100/90">{data.body}</p>
      </main>

      <Pagination ui={ui} current={current} onGo={go} bg={bg} />
      <footer style={{ background: bg }}>
        <LanguageToggle lang={lang} setLang={setLang} />
      </footer>
    </div>
  )
}
