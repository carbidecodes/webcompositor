import type { RouteMap, Handler } from './route.ts'
import { route } from './route.ts'

const defaultHandler: Handler = async reqEv => {
    reqEv.respondWith(new Response(`oops there's nothing here`))
}

async function handleConnection(handler: Handler, conn: Deno.Conn) {
    const httpCon = Deno.serveHttp(conn)

    for await (const reqEv of httpCon) {
        handler(reqEv)
    }
}

export default async (map: RouteMap) => {
    const server = Deno.listen({port: 8001})
    const rootHandler = route(map, defaultHandler)

    for await (const conn of server) {
        handleConnection(rootHandler, conn)
    }
}
