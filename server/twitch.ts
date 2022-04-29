import * as tmi from 'https://esm.sh/tmi.js'
import { SMap } from 'common/utils/types.ts'
import { tap } from 'common/utils/func.ts'

type CommandMap = SMap<(_: tmi.Userstate) => string>

type OnMessageData = {
    msg: string
    channel: string
    username?: string
}

export default (commandMap: CommandMap) => {
    const client = tmi.client({
        identity: {
            username: 'CarbideCodes',
            password: Deno.env.get('TWITCH_OAUTH')
        },
        channels: ['CarbideCodes']
    })

    client.connect()

    client.on('message', (channel, user, msg, _self) => {
        tap(msg, 'twitch chat')

        if (msg.startsWith('!')) {
            const cmd = msg.slice(1).trim()

            if (cmd in commandMap) {
                client.say(channel, '<bot>' + commandMap[cmd](user) + '</bot>')
            }
        }
    })

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
