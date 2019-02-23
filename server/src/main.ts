import * as http from 'http'

const clientAddr = 'http://localhost:1234'
const serverPort = 4000

http
    .createServer(server)
    .listen(serverPort, () => console.debug(`Server up and running on port ${serverPort}.`))
    .on('error', err => console.error('Server failed to start.', err))

function server(req: http.IncomingMessage, res: http.ServerResponse) {
    req.on('error', err => {
        console.error('Request error.', err)
        res.writeHead(500)
        res.end()
    })

    res.setHeader('Access-Control-Allow-Origin', clientAddr)
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
    }
    else if (req.method !== 'POST') {
        res.writeHead(405)
        return res.end()
    }

    console.debug('HTTP request', req.url)

    res.writeHead(200)
    res.end()
}
