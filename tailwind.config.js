/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // El tema activo se maneja con el atributo data-theme en el <html>
  // Tailwind se usa para layout/utilidades, los colores de tema van por CSS variables
  theme: {
    extend: {
      colors: {
        // Colores que usan CSS variables — cambian según el tema
        'theme-bg': 'var(--theme-bg)',
        'theme-surface': 'var(--theme-surface)',
        'theme-accent': 'var(--theme-accent)',
        'theme-accent-soft': 'var(--theme-accent-soft)',
        'theme-text': 'var(--theme-text)',
        'theme-text-muted': 'var(--theme-text-muted)',
        'theme-border': 'var(--theme-border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
