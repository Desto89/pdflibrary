module.exports = {
  mode: 'jit',
  content: [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      fontFamily: {
        Regular: ['Patrick Hand', 'cursive']
      },
      scale: {
        '500': '5',
      }
    },
  },
  plugins: [],
}
