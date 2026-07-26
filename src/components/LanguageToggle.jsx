import { LANGS } from '@/i18n'
import { cn } from '@/lib/utils'

// Active language switch, lives in the footer. Persists via saveLang in App.
export function LanguageToggle({ lang, setLang }) {
  return (
    <div className="flex justify-center gap-4 py-5 text-fluid-sm">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn('uppercase tracking-widest', l === lang ? 'text-rose-300 font-semibold' : 'text-neutral-400')}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
