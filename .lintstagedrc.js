const path = require('path');

const buildEslintCommand = filenames =>
    `next lint --file ${filenames
        .map(f => path.relative(process.cwd(), f))
        .join(' --file ')}`;

module.exports = {
    '*.{js,jsx,ts,tsx}': [buildEslintCommand],
    '*.{ts,tsx}':
        'tsc-files --noEmit next-env.d.ts src/types/next.d.ts src/types/next-auth.d.ts'
};
