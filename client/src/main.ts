import './polyfills'
import {app} from './app'
import {html} from './html'

document.documentElement.style.height = '100%'

document.body.style.height = '100%'
document.body.style.margin = '0'

const style = html('style')
style.textContent = `
    .kiwibit * { box-sizing: border-box; }
`

const a = app()
{
    const urlParams = new URLSearchParams(location.search)
    a.goTo(urlParams.get('page'))
}

document.body.append(style, a)
