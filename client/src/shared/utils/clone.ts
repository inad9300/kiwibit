export function clone<T>(obj: T): T
export function clone<T>(arr: T[]): T[]
export function clone(obj: any): any {
    if (Array.isArray(obj))
        return obj.map(item => Object.assign({}, item))
    else
        return Object.assign({}, obj)
}
