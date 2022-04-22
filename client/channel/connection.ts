import { type Action } from 'common/utils/types.ts'

export const init = () => {
    const endpoint = 'ws://localhost:8001/ws'
    const ws = new WebSocket(endpoint)

    return {
        onOpen: (fn: Action<void>) => ws.addEventListener('open', () => fn()),
        onMessage: (fn: Action<any>) => ws.addEventListener('message', fn),
        send: (data: any) => ws.send(data)
    }
}
