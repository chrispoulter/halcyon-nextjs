import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: [ ...defaultTheme.fontFamily.sans]
            },
            minHeight: {
                96: '24rem'
            }
        }
    },
    plugins: [forms]
};

export default config;
