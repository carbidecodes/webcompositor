import { type Action } from 'common/utils/types.ts'

export const init =
    ({host, port, endpoint}:
    {host: string, port: number, endpoint: string}) => {
    const url = `ws://${host}:${port}/${endpoint}`
    const ws = new WebSocket(url)

    return {
        onOpen: (fn: Action<void>) => ws.addEventListener('open', () => fn()),
        onMessage: (fn: Action<any>) => ws.addEventListener('message', fn),
        send: (data: any) => ws.send(data)
    }
}
