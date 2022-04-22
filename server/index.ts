import serve from './serve.ts'
import { respond, handle } from './utils/handler.ts'
import { websocket } from './utils/upgrade.ts'

const event = () => {
    const evt = new EventTarget()

    return {
        emit: (evName: string, data: any) =>
            evt.dispatchEvent(new CustomEvent(evName, {detail: data})),

        on: (evName: string, handler: EventListener) =>
            evt.addEventListener(evName, handler)
    }
}

const e = event()

const send = (ws: WebSocket, data: any) => {
    if (ws.readyState !== WebSocket.OPEN) {
        console.error('Socket not open')
    } else {
        ws.send(data)
    }
}

const queryParams = (urlString: string) =>
    new URL(urlString).searchParams

serve({
    '/soundcloud' : respond(req => {
        // eh
        const params = queryParams(req.url)

        const title = params.get('title')
        const artist = params.get('artist')

        e.emit('soundcloud', {evtName: 'currentSong', data: { title, artist }})

        return 'k'
    }),
    '/ws' :
        handle(
            websocket(ws => {
                e.on('soundcloud', ({detail}: any) => {
                    console.log('sc detail', {detail})
                    send(ws, JSON.stringify(detail))
                })

                console.log("got ws connection")
            })
        )
})
