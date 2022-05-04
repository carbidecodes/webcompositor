export type Song = {
    artist: string,
    title: string,
    imgUrl: string
}

export type Message =
    | { tag: 'scCurrentSong',
        data: Song
        }
    | { tag: 'twMessage'
        data: {
            username?: string,
            msg: string
        }}
    | { tag: 'opCommand'
        data: string
        }
