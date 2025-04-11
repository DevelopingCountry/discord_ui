/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        discorda: "#22a559",
        discordDark: "#313338",
        discordGray: "#2f3136",
        discordSidebar: "#202225",
        discordAccent: "#5865f2",
        discordGreen: "#22a559",
        discord2and3: "#2b2d31",
        discord1and4: "#313338",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        elevationLow:
          "0 1px 0 hsl(0 calc(1 * 0%) 0.784% / 0.2), 0 1.5px 0 hsl(240 calc(1 * 7.692%) 2.549% / 0.05), 0 2px 0 hsl(0 calc(1 * 0%) 0.784% / 0.05)",
        elevationLeft:
          "-1px 0 0 hsl(0 calc(1 * 0%) 0.784% / 0.2), -1.5px 0 0 hsl(240 calc(1 * 7.692%) 2.549% / 0.05), -2px 0 0 hsl(0 calc(1 * 0%) 0.784% / 0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    plugins: [],
  },
  plugins: [require("tailwindcss-animate")],
};
