import {clone} from './clone'

interface GetOptions {
    cache?: boolean
}

const cache: {[url: string]: any} = {}

export function get(url: string, options: GetOptions = {}) {
    if (options.cache && cache.hasOwnProperty(url)) {
        return Promise.resolve(clone(cache[url]))
    }

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (options.cache) {
                cache[url] = clone(json)
            }
            return json
        })
}
