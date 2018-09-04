export function post<T extends {}>(url: string, data: T) {
    return fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
}
