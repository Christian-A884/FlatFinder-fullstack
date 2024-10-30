/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        DMsans: ['DM Sans", sans-serif'],
      },
    },
    screens: {
      xs: '510px',
      sm: '600px',
      md: '793px',
      mdl: '940px' ,
      lg: '1024px',
      xl: '1140px',
      '2xl': '1496px',
    },
    plugins: [],
  },
};
