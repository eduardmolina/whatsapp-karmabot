class Utils {
    static sleep(time) {
        return new Promise((resolve) => { 
            setTimeout(resolve, time);
        });
    }
}


class WhatsApp {

    static messageUrl = 'https://web.whatsapp.com/send?phone=<phone>&text=<message>';
    static messageBoxSelector = '#main > div > div > div';
    static sendBtnSelector = '#main > footer > div.copyable-area > div:nth-child(3) > button';

    constructor(browser, page) {
        this.browser = browser;
        this.page = page;
        this.listenHandle = null;
        this.onMessage = null;
    }

    async sendMessage(phone='', message) {

        if (phone) {
            const url = WhatsApp.messageUrl
                        .replace('<phone>', phone)
                        .replace('<message>', message);

            await this.page.goto(url);
        } else {
            // get message input
        }

        await this.page.waitForSelector(WhatsApp.sendBtnSelector);
        await this.page.click(WhatsApp.sendBtnSelector);
        await Utils.sleep(2000);
    }

    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }

    async selectChannelByName(channel) {
    }

    async listen(channel='', interval=100) {
        if (!this.onMessage) {
            throw 'onMessage handler not found';
        }

        if (channel) {
            const url = WhatsApp.messageUrl
                .replace('<message>', '')
                .replace('<phone>', channel);
            await this.page.goto(url);
        }

        this.listenHandle = setInterval(async () => {
            await this.page.waitForSelector(WhatsApp.messageBoxSelector);
            const messageProps = await this.page.$eval(WhatsApp.messageBoxSelector, (element) => {
                const children = element.children;
                const messageBox = children[children.length - 1];
                const messages = messageBox.children;
                const lastMessageProps = messages[messages.length - 1].innerText.split('\n');
                
                return lastMessageProps;
            });

            await this.onMessage(messageProps[0], messageProps[1]);
        }, interval);
    }

    async exit() {
        await this.browser.close();

        if (this.listenHandle) {
            clearInterval(listenHandle);
        }
    }
}

module.exports = WhatsApp;
