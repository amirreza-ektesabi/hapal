/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                blackZ: "#121212",
                greyZ: "#bdbdbd",
                redZ: "#e53935",
                whiteZ: "#d8d8d8",
                blueZ: "#1976d2",
            },
        },
    },
    plugins: [],
};