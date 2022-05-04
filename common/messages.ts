export type Message =
    | { tag: 'scCurrentSong',
        data: {
            artist: string,
            title: string,
            imgUrl: string
        }}
    | { tag: 'twMessage'
        data: {
            username?: string,
            msg: string
        }}
    | { tag: 'opCommand'
        data: string
        }
