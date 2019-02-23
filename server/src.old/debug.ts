declare global {
    namespace NodeJS  {
        interface Global {
            $debug: boolean
        }
    }
}

global.$debug = true
