/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Fluid type via clamp() — scales across breakpoints without juggling.
      // Button/base min is 1rem (16px) to honor the ≥16px floor.
      fontSize: {
        'fluid-sm': 'clamp(0.9rem, 0.85rem + 0.3vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.95rem + 0.4vw, 1.15rem)',
        'fluid-lg': 'clamp(1.25rem, 1.1rem + 1vw, 1.75rem)',
        'fluid-xl': 'clamp(1.9rem, 1.4rem + 2.6vw, 3.5rem)',
      },
    },
  },
  plugins: [],
}
