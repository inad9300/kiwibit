import {app} from './app'

document.documentElement.style.height = '100%'

document.body.style.height = '100%'
document.body.style.margin = '0'

const urlParams = new URLSearchParams(location.search)
export const appRoot = app(urlParams.get('page'))

document.body.append(appRoot)
