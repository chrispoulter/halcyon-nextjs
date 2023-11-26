import path from 'path';
import { promises as fs } from 'fs';

const folderPath = path.join(process.cwd(), 'src', 'templates');

export const renderTemplate = async (
    template: string,
    data: { [key: string]: any }
) => {
    const file = await fs.readFile(`${folderPath}/${template}`, 'utf8');
    const html = file.replace(/{{(.*?)}}/g, (_, key) => data[key] || '');
    const subject = new RegExp(/<title>(.*?)<\/title>/i).exec(html)![1];
    return [html, subject];
};
