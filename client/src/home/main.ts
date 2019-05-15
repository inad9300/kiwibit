import {title} from '../shared/dom/title'
import {api} from '../api'

title('Home')

api
    .registerUser({name: 'x'})
    .then(console.debug)
