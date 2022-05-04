import * as tmi from 'https://esm.sh/tmi.js'
import { SMap, isSome, Maybe } from 'common/utils/types.ts'
import { TwitchMessage } from 'common/messages.ts'
import { pipe } from 'https://esm.sh/@psxcode/compose'

type CommandMap = SMap<(_: tmi.Userstate) => string>

const canonCommand = (body: string) : Maybe<string> => {
    if (body.startsWith('!')) {
        return body.slice(1).trim()
    }

    return null
}

const isCommand = pipe(canonCommand, isSome)
const isBotMsg = (body: string) => body.startsWith('#bot')

export const isNormalMessage = ({body}: TwitchMessage) =>
    !isCommand(body) && !isBotMsg(body)

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
        const maybeCmd = canonCommand(msg)
        if (isSome(maybeCmd)) {
            const cmd = maybeCmd

            if (cmd in commandMap) {
                client.say(channel, '#bot ' + commandMap[cmd](user))
            }
        }
    })

    return {
        onMessage: (fn: (_: TwitchMessage) => void) => {
            client.on('message', (channel, user, body, _self) => {
                fn({
                    body,
                    channel,
                    username: user.username
                })
            })
        }
    }
}
