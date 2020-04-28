require('dotenv').config()
const puppeteer = require('puppeteer')
const url = `http://4pda.ru/forum/index.php?act=search&query=&username=${process.env.USERNAME}&forums%5B%5D=all&subforums=1&source=all&sort=da&result=posts`
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

const delay = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

puppeteer.launch({args: [`--proxy-server=${process.env.PROXY}`]})
.then(async (browser) => {
    const page = await browser.newPage()
    await page.goto(url)
    await page.setCookie(...cookie)
    page.on('dialog', async dialog => await dialog.accept())
    const count = await page.$eval('#page-jump-1', e => Number(e.innerText.split(' ')[0]))
    for(let i = 0; i < count; i++){
        await page.goto(`${url}&st=${i * 20}`)
        await page.$$eval(`a[title='Удалить пост']`, els => els.forEach(el => el.click()))
        await delay(5000)
    }

    await browser.close()
})
