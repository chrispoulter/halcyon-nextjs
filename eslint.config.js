import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const config = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    eslintPluginPrettierRecommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 0
        }
    }
];

export default config;
