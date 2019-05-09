import './server'
import {timing} from './client'
import {AssertionError} from 'assert'
import * as fs from 'fs'

const errors: AssertionError[] = []

const testModules: Promise<any>[][] = fs
    .readdirSync(`${__dirname}/api`)
    .filter(f => f.endsWith('.test.ts'))
    .map(f => require(`${__dirname}/api/${f}`).default)

const wrappedTestPromises = testModules.flatMap(testPromises => {
    if (!Array.isArray(testPromises)
        || testPromises.length === 0
        || !testPromises.reduce((acc, p) => acc && p instanceof Promise, true as boolean)) {
        console.error('Test files are expected to default-export a non-empty array of promises.')
        process.exit(-1)
    }

    return testPromises.map(p => {
        return p.catch((err: any) => {
            if (err instanceof AssertionError) {
                errors.push(err)
            } else {
                console.error('Unexpected error while running tests.', err)
                process.exit(-1)
            }
        })
    })
})

Promise
.all(wrappedTestPromises)
.finally(() => {
    if (errors.length === 0) {
        console.error('\n No errors!')
    } else {
        console.error('\n Errors')
        console.table(
            errors.map(err => ({
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
