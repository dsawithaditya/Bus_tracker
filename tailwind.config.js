/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#090D16',
        surface: '#111827',
        surfaceElevated: '#1a2234',
        borderDark: '#1F2937',
        indigoElectric: '#6366F1',
        emeraldNeon: '#10B981',
        amberVibrant: '#F59E0B',
        coralCrimson: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}

