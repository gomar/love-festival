import { useState } from 'react'
import { unlock } from '@/lib/crypto'
import { Button } from '@/components/ui/button'

export function Gate({ ui, onUnlock }) {
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(false)
    setBusy(true)
    try {
      onUnlock(await unlock(e.target.passphrase.value.trim()))
    } catch {
      setError(true)
      e.target.passphrase.value = ''
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-neutral-900 text-neutral-100 px-6">
      <section className="w-full max-w-sm text-center">
        <h1 className="text-fluid-xl font-light tracking-[0.2em] mb-10">A &amp; G</h1>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            name="passphrase"
            type="password"
            placeholder={ui.passphrase}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            className="h-12 rounded-lg bg-neutral-800 border border-neutral-700 px-4 text-center text-fluid-base text-neutral-100 focus:outline-none focus:border-rose-300"
          />
          <Button type="submit" disabled={busy}>{ui.enter}</Button>
          {error && <p className="text-rose-300 text-fluid-sm min-h-5">{ui.wrong}</p>}
        </form>
      </section>
    </main>
  )
}
