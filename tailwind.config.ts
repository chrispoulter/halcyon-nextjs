import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    plugins: [forms]
};

export default config;
