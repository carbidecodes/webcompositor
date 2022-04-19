type SimpleHandler<T> = (_: Request) => T

type Responsable = BodyInit | null | undefined 
export const respond =
    <T extends Responsable>(fn: SimpleHandler<T> ) =>
        async (reqEvent: Deno.RequestEvent) =>
            reqEvent.respondWith(new Response(fn(reqEvent.request)))
