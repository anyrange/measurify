module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "meetup-blue": "#00455D",
        "meetup-purple": "#1F24CC",
        "gray-750": "#3f495a",
        "gray-850": "#222733",
        "green-300-spotify": "#21f04c",
        "green-400-spotify": "#09ad4b",
        "green-500-spotify": "#1ed760",
        "green-600-spotify": "#1db954",
        "green-700-spotify": "#1b8b42",
        "gray-1000-spotify": "#080707",
        "gray-950-spotify": "#191414",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#181818",
        "gray-700-spotify": "#282828",
        "gray-600-spotify": "#333333",
        "gray-500-spotify": "#ABABAB",
        "gray-450-spotify": "#535353",
        "gray-400-spotify": "#bfbfbf",
        "black-100-spotify": "#414141",
      },
      spacing: {
        "14": "3.5rem",
        "22": "5.5rem",
        "72": "18rem",
        "200": "50rem",
      },
      width: {
        "1/10": "10%",
        "1.5/10": "15%",
        "2/10": "20%",
        "2.5/10": "25%",
        "3/10": "30%",
        "3.5/10": "35%",
        "7/10": "70%",
      },
      fontSize: {
        xxs: "0.5rem",
      },
      lineHeight: {
        "extra-loose": "2.5",
      },
    },
    container: {
      padding: "1rem",
    },
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      "source-sans-pro": [
        "Source Sans Pro",
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
      mono: [
        "Menlo",
        "Monaco",
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      translate: ["motion-safe"],
    },
  },
};
