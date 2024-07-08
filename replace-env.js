/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const replacements = {
    'process.env.NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL
};

const replaceInFile = (filePath, replacements) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    Object.keys(replacements).forEach(key => {
        const value = replacements[key];
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
    });
    fs.writeFileSync(filePath, content);
};

const directoryPath = path.join(__dirname, '.next');

const traverseDirectory = dir => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else {
            replaceInFile(fullPath, replacements);
        }
    });
};

traverseDirectory(directoryPath);
