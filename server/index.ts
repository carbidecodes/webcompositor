import { WebSocketClient, WebSocketServer } from 'https://deno.land/x/websocket@v0.1.4/mod.ts'
import { EventEmitter } from 'https://deno.land/std@0.135.0/node/events.ts'

const e = new EventEmitter()
const wss = new WebSocketServer(8000)

wss.on('connection', ws => {
    ws.on('message', msg => {
        console.log({msg})
        ws.send(msg)
    })

    e.on('greet', () => ws.send('greeted'))
})

const server = Deno.listen({port: 8001})

for await (const conn of server) {
    const httpCon = Deno.serveHttp(conn)

    for await (const reqEv of httpCon) {
        const body = 'Hello world again'
        e.emit('greet', '')

        reqEv.respondWith(
            new Response(body, {status: 200})
        )
    }
}
