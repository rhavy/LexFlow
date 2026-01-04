/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // suas extensões aqui
        },
    },
    plugins: [require("tailwindcss-animate")], // Certifique-se que isso está aqui
}