export const host = (window.deno_env?.['WC_HOST']) ?? 'localhost'

export const port = Number.parseInt(window.deno_env?.['WC_PORT'] ?? '8001')
