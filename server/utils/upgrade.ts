export const websocket = (withSocket: (_: WebSocket) => void) => (request: Request) => {
    const {socket, response} = Deno.upgradeWebSocket(request)

    withSocket(socket)
    
    return response
}
