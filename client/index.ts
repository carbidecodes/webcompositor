import { init } from '/channel/connection.ts'
import { getMediaSource } from './layer.ts'
import { Create, Read } from './utils/dom.ts'
import { tap } from 'common/utils/func.ts'
import { host, port } from 'utils/env.ts'

const MIN_TOAST_TIME = 5000

const { el, at, text } = Create
const { select } = Read

const root = select('div#container')

const connection = init({host, port})

const toastRoot = el('div', 'layer flex-column')

const toast = ({
    titleText,
    bodyText,
    imgUrl
}: {
    titleText: string
    bodyText: string
    imgUrl?: string
}) => {
    const img_ : Element[] = 
        (() => {
            if (imgUrl !== undefined) {
                const img = el('img')
                img.src = imgUrl
                return [img]
            } else {
                return []
            }
        })()

    return at(el('div', 'toast toast--in'), img_.concat([
        at(el('div', 'toast--body'),
            [ text(titleText)
            , text(bodyText)
            ])
    ]))
}

const showToast = (
    {
        titleText,
        bodyText,
        imgUrl
    }: {
        titleText: string
        bodyText: string
        imgUrl?: string
}) => {
    const toastEl = toast({
        titleText,
        bodyText,
        imgUrl
        })

    at(toastRoot, [ toastEl ], true)

    return toastEl
}

const showSongToast = (
    { artist, title, imgUrl }:
    { artist: string, title: string, imgUrl: string }
) => showToast({titleText: artist, bodyText: title, imgUrl})

const handleMsg = ({
    evtName,
    data
}:{
    evtName: string,
    data: any
}) => {
    switch (evtName) {
        case 'currentSong':
            const toastEl = showSongToast(data)

            const chars : number= data.artist.length + data.title.length
            const time = Math.max(chars * 150, MIN_TOAST_TIME)

            setTimeout(() => {
                toastEl.classList.remove('toast--in')
                requestAnimationFrame(
                    () => toastEl.classList.add('toast--out')
                )
                toastEl.addEventListener('animationend',
                    () => toastRoot.removeChild(toastEl),
                    { once: true }
                )
            }, time)
            break

        case 'twitch_message':
            tap(data)
            showToast({
                titleText: data.username,
                bodyText: data.msg
            })
            break
    }
}

connection.onOpen(() => console.log('connected'))
connection.onMessage(({data}) =>
    handleMsg(tap(JSON.parse(tap(data)))))

const video: HTMLVideoElement = el('video')

type Shortcuts = {
    [key: string] : () => void
}

const shortcuts: Shortcuts = {
    s: async () => {
        video.style.width = '1920px'
        video.style.height = '1080px'

        video.srcObject = await getMediaSource()
        video.onloadedmetadata = () => video.play()
    },
    b: () => {
        video.classList.toggle('blurred')
    },
    z: () => {
        select('div.camera img')?.classList.toggle('zoomed')
    },
    c: () => {
        select('div.camera img')?.classList.toggle('blurred')
    }
}

document.addEventListener('keyup', async ev => {
    if (ev.key in shortcuts) {
        shortcuts[ev.key]()
    }
})

const on = <T>(el: T, fn: (_:T) => void) : T => {
    fn(el)
    return el
}

at(root,
    [ at(el('div', 'layer'),
        [ video
        ])
    , at(el('div', 'layer expand'),
        [ at(el('div', 'camera'),
            [ on(el('img'), v => v.src = "http://localhost:8081/video")
            ]
        )])
    , toastRoot
    ])
