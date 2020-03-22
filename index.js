const puppeteer = require('puppeteer');

const WhatsApp = require('./whatsapp/WhatsApp');

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36'
const userDataDir = '/home/eduardo/.config/chromium/Default';


const run = async () => {

    const getWhatsAppMeta = async () => {
        const browser = await puppeteer.launch({headless: false, userDataDir: userDataDir});
        const page = await browser.newPage();
        await page.setUserAgent(userAgent); 
        
        return {browser: browser, page: page};
    };

    const whatsAppMeta = await getWhatsAppMeta();
    const whatsApp = new WhatsApp(
        whatsAppMeta.browser,
        whatsAppMeta.page);

    let last = '';
    whatsApp.setOnMessage(async (message, time) => {
        const regex = /@(\S*)([\+|\-]{2,}).*/;
        const match = regex.exec(message);
        if (match && match[0] != last) {
            last = match[0];
            await whatsApp.sendMessage(
                '5516999924673',
                `karma point em ${match[1]}`);
        }
    });

    await whatsApp.listen('5516999924673');
}

run();

