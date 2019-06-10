import {app} from './app'

document.documentElement.style.height = '100%'

document.body.style.height = '100%'
document.body.style.margin = '0'

export const appInstance = app()
{
    const urlParams = new URLSearchParams(location.search)
    appInstance.goTo(urlParams.get('page'))
}

document.body.append(appInstance)
