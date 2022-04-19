export type Handler = (reqEv: Deno.RequestEvent) => Promise<void>

export type RouteMap = {
    [key: string]: Handler
}

export const path = (req: Request) => new URL(req.url).pathname

// Not gonna serve many concurrent connections so we 
// don't care about blocking
export const route = (map: RouteMap, defaultHandler: Handler) => (requestEvent: Deno.RequestEvent) => {
    const thisPath = path(requestEvent.request)
    console.log({thisPath})

    const handler = map[thisPath]

    if (handler !== undefined) {
        return handler(requestEvent)
    } else {
        return defaultHandler(requestEvent)
    }
}
