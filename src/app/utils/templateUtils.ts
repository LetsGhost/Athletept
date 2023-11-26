import * as ejs from 'ejs';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import logger from '../../config/winstonLogger';

class TemplateUtils {
    renderTemplateWithData(templatePath: string, data: any): string {
        const template = fs.readFileSync(`dist/public/templates/${templatePath}`, 'utf-8');
        return ejs.render(template, data);
    }

    async generatePdfFromTemplate(html: string): Promise<Buffer> {
        console.time("generatePdfFromTemplate");
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();
        console.timeEnd("generatePdfFromTemplate");
        return pdfBuffer;
    }
}

export default new TemplateUtils();