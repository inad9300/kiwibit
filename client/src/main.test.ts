import {ok} from 'assert'
import * as puppet from 'puppeteer'

export default {
    b: async () => {
        const browser = await puppet.launch()
        const page = await browser.newPage()

        await page.goto('https://example.com/')
        // await page.screenshot({path: 'example.png'})

        const abc = await page.title()
        ok(abc === 'Example Domain')

        await browser.close()
    }
}
