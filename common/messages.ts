export type Song = {
    artist: string,
    title: string,
    imgUrl: string
}

export type TwitchMessage = {
    body: string
    channel: string
    username?: string
}

export type Message =
    | { tag: 'scCurrentSong',
        data: Song
        }
    | { tag: 'twMessage'
        data: TwitchMessage
        }
    | { tag: 'opCommand'
        data: string
        }
