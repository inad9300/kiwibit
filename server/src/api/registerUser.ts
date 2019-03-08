import {ApiFn} from '../Api'

type NewUser = {
    name: string
}

export const registerUser: ApiFn<NewUser, NewUser> = (_payload) => {
    return Promise.resolve({name: 'Blues'})
}
