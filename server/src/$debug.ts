export let __: never // Force the file to be a module, thus allowing global declarations.

declare global {
    namespace NodeJS  {
        interface Global {
            $debug: boolean
        }
    }
}

global.$debug = process.argv.includes('--debug')
