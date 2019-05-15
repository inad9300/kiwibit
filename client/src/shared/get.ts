export function get<T = any>(url: string): Promise<T> {
    return fetch(url).then(res => res.json())
}
