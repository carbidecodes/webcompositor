import * as tmi from 'https://esm.sh/tmi.js'

type OnMessageData = {
    msg: string
    channel: string
    username?: string
}

export default () => {
    const client = tmi.client({
        identity: {
            username: 'CarbideCodes',
            password: Deno.env.get('TWITCH_OAUTH')
        },
        channels: ['CarbideCodes']
    })

    client.connect()

    return {
        onMessage: (fn: (_: OnMessageData) => void) => {
            client.on('message', (channel, user, msg, _self) => {
                fn({
                    msg,
                    channel,
                    username: user.username
                })
            })
        }
    }
}
