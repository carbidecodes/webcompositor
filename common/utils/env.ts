export const host = Deno.env.get('WC_HOST') ?? 'localhost'

export const port = Number.parseInt(Deno.env.get('WC_PORT') ?? '8001')
