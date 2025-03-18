/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        discordDark: "#313338",
        discordGray: "#2f3136",
        discordSidebar: "#202225",
        discordAccent: "#5865f2",
        discordGreen: "#22a559",
        discord2and3: "#2b2d31",
        discord1and4: "#313338",
      },
      boxShadow: {
        elevationLow:
          "0 1px 0 hsl(0 calc(1 * 0%) 0.784% / 0.2), 0 1.5px 0 hsl(240 calc(1 * 7.692%) 2.549% / 0.05), 0 2px 0 hsl(0 calc(1 * 0%) 0.784% / 0.05)",
      },
    },
    plugins: [],
  },
};
