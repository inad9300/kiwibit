const serverPort = 4000
const clientPort = 1234

export const config = {
    server: {
        port: serverPort,
        addr: `http://localhost:${serverPort}/api/`
    },
    client: {
        port: clientPort,
        addr: `http://localhost:${clientPort}/`
    }
}
