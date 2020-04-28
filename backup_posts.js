require('dotenv').config()
const puppeteer = require('puppeteer')
const url = `http://4pda.ru/forum/index.php?act=search&query=&username=${process.env.USERNAME}&forums%5B%5D=all&subforums=1&source=all&sort=da&result=posts`
const cookie = [{
    domain: '4pda.ru',
    name: 'deskver',
    path: '/',
    value: '0'
}]

const delay = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout))
}

puppeteer.launch({args: [`--proxy-server=${process.env.PROXY}`]})
.then(async browser => {
    const page = await browser.newPage()
    await page.goto(url)
    await page.setCookie(...cookie)
    const count = await page.$eval('#page-jump-1', e => Number(e.innerText.split(' ')[0]))
    for(let i = 0; i < count; i++){
        await page.goto(`${url}&st=${i * 20}`)
        await page.$$eval('.spoil', els => els.forEach(el => el.classList.remove('close')))
        await page.$$eval('img', els => els.forEach(el => !el.getAttribute('src') ? el.setAttribute('src', el.getAttribute('data-src')) : null))
        await delay(5000)
        await page.pdf({path: `${process.argv[2]}/${i}.pdf`, format: 'A4'})
    }

    await browser.close()
})
