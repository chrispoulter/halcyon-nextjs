import path from 'path';
import { promises as fs } from 'fs';

export const renderTemplate = async (
    template: string,
    data: { [key: string]: any }
) => {
    const resource = await readResource(template);
    const html = render(resource, data);
    const subject = getHtmlTitle(resource);
    return [html, subject];
};

const readResource = (resource: string) =>
    fs.readFile(
        `${path.join(process.cwd(), 'src', 'templates')}/${resource}`,
        'utf8'
    );

const getHtmlTitle = (template: string) =>
    new RegExp(/<title>(.*?)<\/title>/i).exec(template)![1];

const render = (html: string, model: { [key: string]: any }) =>
    html.replace(/{{(.*?)}}/g, (_, key) => model[key] || '');
