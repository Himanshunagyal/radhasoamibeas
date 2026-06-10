/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        rssb: {
          red: '#8B1A1A',
          redDark: '#6B1212',
          redLight: '#A52020',
          gold: '#C8952A',
          goldLight: '#E8B84B',
          cream: '#FDF8F0',
          text: '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
