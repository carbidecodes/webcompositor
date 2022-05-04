import serve from './serve.ts'
import { handle } from './utils/handler.ts'
import { websocket } from './utils/upgrade.ts'
import { tap, effect, gate } from 'common/utils/func.ts'
import { Maybe, isSome } from 'common/utils/types.ts'
import { Message, Song } from 'common/messages.ts'
import { pipe } from 'https://esm.sh/@psxcode/compose'

import twitchInit, { isNormalMessage } from './twitch.ts'

type State = {
    currentSong: Maybe<Song>
}

const state: State = {
    currentSong: null
}

const transition = {
    newSong: (song: Song) => state.currentSong = song
}

const event = () => {
    const evt = new EventTarget()

    const emit = (evName: string, data: any) =>
        evt.dispatchEvent(new CustomEvent(evName, {detail: data}))

    return {
        emit,
        emitF: (evName: string) => (data: any) => emit(evName, data),
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
            if (isSome(state.currentSong)) {
                e.emit('soundcloud', songAsMessage(state.currentSong))

                return `${state.currentSong?.artist} - ${state.currentSong?.title}`
            } else {
                return 'Nothing yet!'
            }
        }
})

const songAsMessage = (data: Song) : Message => {
    return {
        tag: 'scCurrentSong',
        data
    }
}

serve({
    '/sc': handle(
            websocket(ws => {
                ws.addEventListener(
                    'message',
                    pipe(
                        ({data}) => data,
                        JSON.parse,
                        effect(transition.newSong),
                        songAsMessage,
                        tap,
                        e.emitF('soundcloud')
                    )
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

                twitchClient.onMessage(
                    gate(
                        isNormalMessage,
                        data => 
                            send(ws, {
                                tag: 'twMessage',
                                data
                            })
                    )
                )

                console.log("Client connected")
            })
        )
})
