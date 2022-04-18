import { WebSocketClient, StandardWebSocketClient } from 'https://deno.land/x/websocket@v0.1.4/mod.ts'

import { type Action } from '/utils/types.ts'

export const init = () => {
    const endpoint = 'ws://localhost:8000'
    const ws = new StandardWebSocketClient(endpoint)

    return {
        onOpen: (fn: Action<void>) => ws.on('open', fn),
        onMessage: (fn: Action<any>) => ws.on('message', fn)
    }
}
