import * as ejs from 'ejs';
import * as fs from 'fs';

class TemplateUtils {
    renderTemplateWithData(templatePath: string, data: any): string {
        const template = fs.readFileSync(templatePath, 'utf-8');
        return ejs.render(template, data);
    }
}

export default new TemplateUtils();