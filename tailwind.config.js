/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        montserrat: ['Montserrat', 'sans-serif'],
        josefin:[ 'Josefin Sans', 'sans-serif'],
        lato:['Lato','sans-serif']
      },
      colors: {
        gray: {
          50: 'rgb(249, 250, 251)', // Thay vì oklch
          // Thêm các màu khác nếu cần
        },
        red: {
          500: 'rgb(239, 68, 68)',
        },
        blue: {
          500: 'rgb(59, 130, 246)',
        },
      },
    },
  },
  plugins: [],
}