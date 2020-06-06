import { AssertionError } from 'assert'

type TestError = AssertionError & {
  _file: string
  _testName: string
}

type TestTime = {
  file: string
  testName: string
  time: number
}

const errors: TestError[] = []
const times: TestTime[] = []

function registerError(file: string, testName: string, err: any) {
  if (err instanceof AssertionError) {
    ;(err as TestError)._file = file
    ;(err as TestError)._testName = testName
    errors.push(err as TestError)
  } else {
    console.error('Unexpected error while running tests.', err)
    process.exit(-1)
  }
}

function registerTime(file: string, testName: string, t: [number, number]) {
  times.push({ file, testName, time: t[0] * 1000 + t[1] / 1_000_000 })
}

export type TestSuite = Record<string, () => void | Promise<any>>

export function runTestSuites(testSuites: (readonly [string, TestSuite])[]): boolean {
  const testPromises: Promise<void>[] = []

  testSuites.forEach(([file, suite]) => {
    testPromises.push(
      ...Object.entries(suite).map(([testName, fn]) => {
        let t = process.hrtime()
        try {
          const out = fn()
          if (!(out instanceof Promise)) {
            registerTime(file, testName, process.hrtime(t))
            return Promise.resolve()
          }
          return out
            .then(() => registerTime(file, testName, process.hrtime(t)))
            .catch(err => {
              registerTime(file, testName, process.hrtime(t))
              registerError(file, testName, err)
            })
        } catch (err) {
          registerTime(file, testName, process.hrtime(t))
          registerError(file, testName, err)
          return Promise.resolve()
        }
      })
    )
  })

  Promise.all(testPromises).finally(() => {
    if (errors.length === 0) {
      console.error('\n No errors! 🤠')
    } else {
      console.error('\n Errors 🤯')
      console.table(
        errors.map(err => ({
          File: err._file,
          Test: err._testName,
          Message: err.message.replace(/\n+/g, ' '),
          Expected: err.expected,
          Operator: err.operator,
          Actual: err.actual
        }))
      )
    }

    const decimalPlaces = 2
    const filePadSize = Math.max(...times.map(({ file }) => file.length))
    const testNamePadSize = Math.max(...times.map(({ testName }) => testName.length))
    const timePadSize = Math.max(...times.map(({ time }) => time.toFixed(0).length)) + 1 + decimalPlaces

    if (errors.length === 0) {
      console.info('\n Timing ⏱')
      console.table(
        times
          .sort((a, b) => (a.time > b.time ? -1 : 1))
          .map(({ file, testName, time }) => ({
            File: file.padStart(filePadSize),
            Test: testName.padStart(testNamePadSize),
            Time: time.toFixed(decimalPlaces).padStart(timePadSize) + ' ms'
          }))
      )
    }
  })

  return errors.length === 0
}
