import {avg} from './avg'

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
