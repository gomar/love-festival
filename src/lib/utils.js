import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn's class helper — merge + dedupe Tailwind classes.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
