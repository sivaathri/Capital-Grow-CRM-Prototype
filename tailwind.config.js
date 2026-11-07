/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cg: {
          navy: '#073B78',
          blue: '#0866C6',
          orange: '#FF7900',
          'orange-hover': '#ff8f1f',
          'light-blue': '#EAF3FF',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E1E8F0',
          text: '#10264D',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(7, 59, 120, 0.07)',
        dropdown: '0 12px 30px rgba(7, 59, 120, 0.15)',
        orange: '0 4px 12px rgba(255, 121, 0, 0.3)',
      },
      spacing: {
        '68': '272px',
        'sidebar': '272px',
        'sidebar-collapsed': '76px'
      }
    },
  },
  plugins: [],
}

