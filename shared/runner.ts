import {AssertionError} from 'assert'
import {flatten} from './flatten'
import {filesEndingWith} from './filesEndingWith'

const errors: AssertionError[] = []
const timing: [string, number][] = []

function registerError(err: any, title: string) {
    if (err instanceof AssertionError) {
        (err as any)._title = title
        errors.push(err)
    } else {
        console.error('Unexpected error while running tests.', err)
        process.exit(-1)
    }
}

function registerTime(testName: string, t: [number, number]) {
    timing.push([testName, t[0] * 1000 + t[1] / 1_000_000])
}

type TestFunction = () => (void | Promise<any>)

const testFiles = filesEndingWith(process.cwd() + '/src/', '.test.ts')
const testModules = testFiles.map(f => require(f).default) as TestFunction[][]
const wrappedTestPromises = testModules.map(testObject => {
    if (!testObject
        || typeof testObject !== 'object'
        || Object.keys(testObject).length === 0
        || !Object.values(testObject).reduce((acc, p) => acc && typeof p === 'function', true)) {
        console.error('Test files are expected to default-export a non-empty array of possibly-asynchronous functions. Given:', testObject)
        process.exit(-1)
    }

    return Object.entries(testObject).map(([title, fn]) => {
        let t = process.hrtime()
        try {
            const out = fn()
            if (!(out instanceof Promise)) {
                registerTime(title, process.hrtime(t))
                return Promise.resolve()
            }
            return out
                .then(() => registerTime(title, process.hrtime(t)))
                .catch(err => {
                    registerTime(title, process.hrtime(t))
                    registerError(err, title)
                })
        } catch (err) {
            registerTime(title, process.hrtime(t))
            registerError(err, title)
            return Promise.resolve()
        }
    })
})

Promise.all(flatten(wrappedTestPromises)).finally(() => {
    if (errors.length === 0)
        console.error('\n No errors!')
    else {
        console.error('\n Errors')
        console.table(
            errors.map(err => ({
                title: (err as any)._title,
                message: err.message.replace(/\n+/g, ' '),
                expected: err.expected,
                operator: err.operator,
                actual: err.actual
            }))
        )
    }

    const decimalPlaces = 2
    const fnPadSize = Math.max(...timing.map(([fn]) => fn.length))
    const timePadSize = Math.max(...timing.map(([_fn, t]) => t.toFixed(0).length)) + 1 + decimalPlaces

    console.info('\n Timing')
    console.table(
        timing
            .sort((a, b) => a[1] > b[1] ? -1 : 1)
            .map(([fn, t]) => [
                fn.padStart(fnPadSize),
                t.toFixed(decimalPlaces).padStart(timePadSize) + ' ms'
            ])
    )

    console.info('\n Coverage')

    process.exit(errors.length === 0 ? 0 : -1)
})
