require('dotenv').config()
const puppeteer = require('puppeteer')
const url = `http://4pda.ru/forum/index.php?act=qms`
const cookie = [{
    domain: '4pda.ru',
    name: 'deskver',
    path: '/',
    value: '0'
},
{
    domain: '.4pda.ru',
    name: 'member_id',
    path: '/',
    value: process.env.MEMBER_ID
},
{
    domain: '.4pda.ru',
    name: 'pass_hash',
    path: '/',
    value: process.env.PASS_HASH
}]

puppeteer.launch({headless: false})
.then(async (browser) => {
    const page = await browser.newPage()
    await page.setCookie(...cookie)
    await page.goto(url)
    page.on('dialog', async dialog => await dialog.accept())
    await page.$$eval('i[data-del-member]', els => els.forEach(el => el.click()))
    await browser.close()
})
