module.exports = {
  purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    typography: (theme) => ({
      default: {
        css: {
          a: {
            color: theme("colors.blue.600"),
          },
          img: {
            display: "inline-block",
          },
          hr: {
            borderColor: theme("colors.gray.400"),
            marginTop: "2em",
            marginBottom: "2em",
          },
        },
      },
    }),
    minWidth: {
      "0": "0",
      "1/4": "25%",
      "1/2": "50%",
      "75": "75%",
      "80": "80%",
      "85": "85%",
      "90": "90%",
      full: "100%",
    },
    extend: {
      colors: {
        "meetup-blue": "#00455D",
        "meetup-purple": "#1F24CC",
        "gray-750": "#3f495a",
        "gray-850": "#222733",
        "gray-900-spotify": "#121212",
        "gray-800-spotify": "#181818",
        "gray-700-spotify": "#282828",
      },
      spacing: {
        "14": "3.5rem",
        "22": "5.5rem",
        "72": "18rem",
        "200": "50rem",
      },
      width: {
        "7/10": "70%",
        "3/10": "30%",
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
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
