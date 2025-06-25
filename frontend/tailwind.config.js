module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
        primary: 'gradient-to-r from-gray-600 via-gray-400 to-gray-500', 
      },
      },
    },
    plugins: [],
  };

  