import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn-style variants — the pattern to extend as you adapt more components.
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-fluid-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-40 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-rose-300 text-neutral-900 hover:bg-rose-200',
        ghost: 'bg-transparent hover:bg-white/10 text-inherit',
      },
      size: { default: 'h-12 px-6', icon: 'h-11 w-11' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
