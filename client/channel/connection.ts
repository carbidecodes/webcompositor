import { type Action } from 'common/utils/types.ts'
import { host, port } from 'common/utils/env.ts'

export const init = () => {
    const endpoint = `ws://${host}:${port}/ws`
    const ws = new WebSocket(endpoint)

    return {
        onOpen: (fn: Action<void>) => ws.addEventListener('open', () => fn()),
        onMessage: (fn: Action<any>) => ws.addEventListener('message', fn),
        send: (data: any) => ws.send(data)
    }
}
