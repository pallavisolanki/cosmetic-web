/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{html,js,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'infinite-scroll': 'infinite-scroll 25s linear infinite',
          },
          keyframes: {
          'infinite-scroll': {
              from: { transform: 'translateX(0)' },
              to: { transform: 'translateX(-100%)' },
          }
          }                    
      },
    },
    plugins: [
      '@tailwindcss/postcss',
      require('@tailwindcss/forms'), // Example Tailwind plugin
      require('@tailwindcss/typography'), // Another Tailwind plugin
    ],
  }
  