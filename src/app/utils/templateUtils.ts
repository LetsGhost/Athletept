import * as ejs from 'ejs';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer-core';
import logger from '../../config/winstonLogger.js';

class TemplateUtils {
    renderTemplateWithData(templatePath: string, data: any): string {
        try{
            const template = fs.readFileSync(`dist/public/templates/${templatePath}`, 'utf-8');
            return ejs.render(template, data);
        } catch(error){
            logger.error('Error rendering template with data:', error, {service: 'TemplateUtils.renderTemplateWithData'});
            return '';
        }
    }

    async generatePdfFromTemplate(html: string): Promise<Buffer> {
        let browser;
        try{
            if(html === ""){
                return Buffer.from('');
            }

            const startTime = new Date().getTime();
            
            browser = await puppeteer.launch({ headless: true, executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html);
            const pdfBuffer = await page.pdf({ format: 'A4' });
            await browser.close();
            
            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            logger.info(`generatePdfFromTemplate execution time: ${executionTime}ms`, {service: 'TemplateUtils.generatePdfFromTemplate'});
            
            return pdfBuffer;
        } catch(error){
            logger.error('Error generating pdf from template:', error, {service: 'TemplateUtils.generatePdfFromTemplate'});
            return Buffer.from('');
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

export default new TemplateUtils();