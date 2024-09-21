import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans]
            },
            minHeight: {
                96: '24rem'
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
};

export default config;
