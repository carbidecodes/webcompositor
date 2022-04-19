import serve from './serve.ts'
import { respond, handle } from './utils/handler.ts'
import { websocket } from './utils/upgrade.ts'

const event = () => {
    const evt = new EventTarget()

    return {
        emit: (msg: any) => evt.dispatchEvent(new Event(msg)),
        on: (evName: string, handler: EventListener) => evt.addEventListener(evName, handler)
    }
}

const e = event()

// const wss = new WebSocketServer(8000)

// wss.on('connection', ws => {
//     ws.on('message', msg => {
//         console.log({msg})
//         ws.send(msg)
//     })

//     e.on('greet', () => ws.send('greeted'))
// })

serve({
    '/foo' : respond(_ => {
        e.emit('bar')
        return 'hi'
    }),
    '/ws' :
        handle(
            websocket(ws => {
                e.on('bar', () => ws.send('got a message'))
                console.log("got ws connection")
            })
        )
})
