/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Inspired by the provided image (Otafe-style palette)
                'brand-bg': '#121318',
                'brand-card': '#1C1E26',
                'brand-lime': '#D4FF3A',
                'brand-lime-hover': '#BFEC2E',
                'brand-text': '#F2F2F2',
                'brand-muted': '#9CA3AF',
                'brand-border': '#2A2C35',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            screens: {
                'xs': '400px',
                ...require('tailwindcss/defaultTheme').screens,
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
