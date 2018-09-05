export function getUrlParams() {
    return new URLSearchParams(location.search.substr(1))
}
