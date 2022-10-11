const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const accountNumber = req.query.accountNumber;
    if (username == null || password == null || accountNumber == null) {
        console.log('Bad Request!');
        res.status(400).send('Bad Request').end();
    }
    console.log('Getting interruption schedule for ' + accountNumber + '...');
    try {
        (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.goto('https://cebcare.ceb.lk/Identity/Account/Login', {waitUntil: 'networkidle2'});
            await page.waitForSelector('input[id="Input_UserName"]');
            await page.type('input[id="Input_UserName"]', username);
            await page.waitForSelector('input[id="Input_Password"]');
            await page.type('input[id="Input_Password"]', password);
            await page.click('button[type="submit"]');
            await page.waitForSelector('div[class="panel-content"]');
            await page.goto('https://cebcare.ceb.lk/Outage/OutageCalendar', {waitUntil: 'networkidle2'});
            await page.waitForSelector('select[id="AcctNo"]');
            await page.select('select[id="AcctNo"]', accountNumber);
            await page.waitForSelector('div[class="fc-content"]');
            await page.click('button[class="fc-timeGridDay-button btn btn-default"]');
            await page.waitForSelector('div[class="fc-content"]');
            var calendar = await page.$eval('div[id="calendar"]', (element) => {return element.innerHTML});
            await browser.close();
            var times = [];
            var hasTime = true;
            while (hasTime) {
                var i = calendar.toString().indexOf('<div class="fc-content">');
                if (i > 0) {
                    var text = calendar.substring(i);
                    var a = text.indexOf('<span>');
                    var b = text.indexOf('</span>');
                    if (a > 0 && b > 0) {
                        times.push(text.substring(a + 6, b).replace(/ /g, ''));
                    }
                } else {
                    hasTime = false;
                }
                calendar = calendar.substring(i + 23);
            }
            await browser.close();
            const msg = times.join(',');
            console.log('Interruption schedule: ' + msg);
            res.status(200).send(msg).end();
        })();
    } catch (e) {
        console.log('Error occurred!');
        res.status(500).send('Internal Server Error').end();
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
