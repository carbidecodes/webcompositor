export const port = Number.parseInt(Deno.args[0].toLowerCase() === 'a' ? '8002' : '8001')
