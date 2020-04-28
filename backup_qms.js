require('dotenv').config()
const puppeteer = require('puppeteer')
const querystring = require('querystring')
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

const delay = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

puppeteer.launch({args: [`--proxy-server=${process.env.PROXY}`]})
.then(async (browser) => {
    const page = await browser.newPage()
    await page.setCookie(...cookie)
    await page.goto(url)
    const members = await page.$$('a[data-member-id]')
    for (const member in members){
        await members[member].click()
        await delay(2000)
        const threads = await page.$$eval('a[data-thread-id]', els => els.map(el => el.href))
        threads.forEach(async thread => {
            const tab = await browser.newPage()
            await tab.setCookie(...cookie)
            await tab.goto(thread)
            await delay(2000)
            await tab.pdf({path: `${process.argv[2]}/${querystring.parse(thread).mid}_${querystring.parse(thread).t}.pdf`, format: 'A4'})
            await tab.close()
        })
    }

    await browser.close()
})
