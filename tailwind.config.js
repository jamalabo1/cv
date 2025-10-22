/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
    theme: {
        extend: {
            fontFamily: {
                display: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto"],
            },
            boxShadow: {
                glow: "0 0 0 4px rgba(59,130,246,.15)",
            },
            colors: {
                brand: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    500: "#6366f1",
                    600: "#4f46e5",
                    700: "#4338ca"
                }
            }
        }
    },
  plugins: [],
}
