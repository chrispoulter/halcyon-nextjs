const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--base-font)', ...defaultTheme.fontFamily.sans]
            },
            minHeight: {
                96: '24rem'
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
};
