import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-open-sans)', 'sans-serif']
            },
            minHeight: {
                96: '24rem'
            }
        }
    },
    plugins: [forms]
};

export default config;
