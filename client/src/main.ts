import {api} from './api'
import {app} from './app'

api('getCurrentUser', {token: ''}).then(u => {
    console.log('u rock', u)
})

document.documentElement.style.height = '100%'

document.body.style.margin = '0'
document.body.style.height = '100%'

const a = app()
{
    const urlParams = new URLSearchParams(location.search)
    a.goTo(urlParams.get('page'))
}

document.body.append(a)
