/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    
    
    theme: {
      extend: {
        fontFamily: {
          sans: ['Montserrat', 'sans-serif'],
        },
      },
    },
    plugins: [],
    
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 1s ease-out forwards',
      },
    }
    
    
  };
  