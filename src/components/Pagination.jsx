import { SECTIONS } from '@/content/sections'
import { Button } from '@/components/ui/button'

// Wiki-style prev/next. Sticky bottom bar, same translucent+blurred treatment as the top.
export function Pagination({ ui, current, onGo, bg }) {
  return (
    <nav
      className="sticky bottom-0 z-20 flex justify-between gap-3 px-4 pt-3 backdrop-blur-md"
      style={{ background: bg + 'cc', paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <Button variant="ghost" disabled={current === 0} onClick={() => onGo(current - 1)}>
        ← {ui.prev}
      </Button>
      <Button variant="ghost" disabled={current === SECTIONS.length - 1} onClick={() => onGo(current + 1)}>
        {ui.next} →
      </Button>
    </nav>
  )
}
