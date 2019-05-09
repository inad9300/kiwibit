import './server'
import {timing} from './client'
import {AssertionError} from 'assert'

const errors: AssertionError[] = []

Promise.all([
    // TODO Automate.
    import('./api/getCurrentUser.test'),
    import('./api/registerUser.test')
])
.then(modules => {
    return modules
        .map(mod => mod.default)
        .map(promises => {
            // TODO Validate type of `promises` at runtime.
            return promises.map(p => {
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
        .flat()
})
.then(promises => Promise.all(promises))
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

    console.info('\n Timing')
    console.table(timing)

    console.info('\n Coverage')

    process.exit(errors.length === 0 ? 0 : -1)
})
