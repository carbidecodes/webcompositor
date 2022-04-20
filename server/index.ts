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
