import serve from './serve.ts'
import { respond, handle } from './utils/handler.ts'
import { websocket } from './utils/upgrade.ts'
import { tap } from 'common/utils/func.ts'
import { pipe } from 'https://esm.sh/@psxcode/compose'

import twitchInit from './twitch.ts'

const event = () => {
    const evt = new EventTarget()

    return {
        emit: (evName: string, data: any) =>
            evt.dispatchEvent(new CustomEvent(evName, {detail: data})),

        on: (evName: string, handle: any) => {
            const handler = ({detail}: any) => handle(detail)

            evt.addEventListener(evName, handler)
        }
    }
}

const e = event()

const send = (ws: WebSocket, data: any) => {
    if (ws.readyState !== WebSocket.OPEN) {
        console.error('Socket not open')
    } else {
        ws.send(JSON.stringify(data))
    }
}

const queryParams = (urlString: string) =>
    new URL(urlString).searchParams

const tClient = twitchInit({
    current:
        user => `Adding twitch chat today ${user.username}`,
    blur:
        () => {
            // e.emit('command', 'blur')

            return 'nah'
        },
    code:
        () => 'https://github.com/carbidecodes/webcompositor'

})

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
                e.on('soundcloud', (data: any) => {
                    send(ws, tap(data, 'e.sc'))
                })

                e.on('command',  (data: any) => {
                    send(ws, tap({ evtName: 'command', data }, 'e.cmd'))
                })

                ws.addEventListener(
                    'message',
                    pipe(
                        ({data}) => data,
                        JSON.parse,
                        tap,
                        data =>
                            e.emit('soundcloud', {
                                evtName: 'currentSong',
                                data
                            })
                    )
                )

                tClient.onMessage(data => {
                    send(ws, {
                        evtName: 'twitch_message',
                        data
                    })
                })

                console.log("WS Connected")
            })
        )
})
