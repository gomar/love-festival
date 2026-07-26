import { cn } from '@/lib/utils'

// Top bar: translucent + blurred, tinted by the current section's color so the
// browser/status bar area inherits it. Sections come from the decrypted content.
export function MenuBar({ sections, lang, current, onGo, open, setOpen, bg }) {
  return (
    <>
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 h-14 backdrop-blur-md"
        style={{ background: bg + 'cc', paddingTop: 'env(safe-area-inset-top)' }}
      >
        <span className="font-light tracking-[0.2em] text-fluid-base">A &amp; G</span>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="h-11 w-11 grid place-items-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {open && (
        <nav
          className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 backdrop-blur-md"
          style={{ background: bg + 'f2' }}
          onClick={() => setOpen(false)}
        >
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { onGo(i); setOpen(false) }}
              className={cn('text-fluid-lg tracking-wide', i === current ? 'text-rose-300' : 'text-neutral-100')}
            >
              {s.label[lang]}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}
