export function getUrlParams() {
    return new URLSearchParams(location.search.substr(1))
}

export function clone<T>(obj: T): T
export function clone<T>(arr: T[]): T[]
export function clone(obj: any): any {
    if (Array.isArray(obj))
        return obj.map(item => Object.assign({}, item))
    else
        return Object.assign({}, obj)
}

export function pct(part: number, total: number): number {
    return (100 * part) / total
}

export function add(a: number, b: number): number {
    return a + b
}

export function avg(a: number, b: number): number {
    return (a + b) / 2
}

function pad(s: string): string {
    return s.length === 1 ? '0' + s : s
}

export function avgRgb(hexColorA: string, hexColorB: string): string {
    const redA = parseInt(hexColorA.substr(1, 2), 16)
    const greenA = parseInt(hexColorA.substr(3, 2), 16)
    const blueA = parseInt(hexColorA.substr(5, 2), 16)

    const redB = parseInt(hexColorB.substr(1, 2), 16)
    const greenB = parseInt(hexColorB.substr(3, 2), 16)
    const blueB = parseInt(hexColorB.substr(5, 2), 16)

    return '#'
        + pad(Math.round(avg(redA, redB)).toString(16))
        + pad(Math.round(avg(greenA, greenB)).toString(16))
        + pad(Math.round(avg(blueA, blueB)).toString(16))
}
