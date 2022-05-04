import serve from './serve.ts'
import { handle } from './utils/handler.ts'
import { websocket } from './utils/upgrade.ts'
import { tap } from 'common/utils/func.ts'
import { Message } from 'common/messages.ts'

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

const send = (ws: WebSocket, data: Message) => {
    if (ws.readyState !== WebSocket.OPEN) {
        console.error('Socket not open')
    } else {
        ws.send(JSON.stringify(data))
    }
}

const twitchClient = twitchInit({
    current:
        user => `Adding twitch chat today ${user.username}`,
    blur:
        () => {
            // e.emit('command', 'blur')

            return 'nah'
        },
    song:
        () => {
            e.emit('command', 'toastSong')

            return 'k'
        }
})

serve({
    '/sc': handle(
            websocket(ws => {
                ws.addEventListener(
                    'message',
                    ({data}) => e.emit('soundcloud', tap(JSON.parse(data)))
                )

                console.log('sc extension connected')
            })
        ),
    '/client': handle(
            websocket(ws => {
                e.on('soundcloud', (data: Message) => {
                    send(ws, tap(data, 'e.sc'))
                })

                e.on('command',  (data: Message) => {
                    send(ws, tap({ tag: 'opCommand', data }, 'e.cmd'))
                })

                twitchClient.onMessage(data => {
                    send(ws, {
                        tag: 'twMessage',
                        data
                    })
                })

                console.log("Client connected")
            })
        )
})
