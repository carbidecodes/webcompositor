import { init } from '/channel/connection.ts'
import { getMediaSource } from './layer.ts'
import { Create, Read } from './utils/dom.ts'
import { tap } from 'common/utils/func.ts'

const { el, at, text } = Create
const { select } = Read

const TOAST_SHOW_DURATION_MS = 300000

const root = select('div#container')

const connection = init()

const toastRoot = el('div', 'layer')
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

const showSongToast = (
    { artist, title, imgUrl }:
    { artist: string, title: string, imgUrl: string }
) => {
    const toastEl = toast({
        titleText: 'Current song',
        bodyText: `${artist} - ${title}`,
        imgUrl
        })

    at(toastRoot, [ toastEl ], true)

    return toastEl
}

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

            setTimeout(() => {
                toastEl.classList.remove('toast--in')
                requestAnimationFrame(
                    () => toastEl.classList.add('toast--out')
                )
                toastEl.addEventListener('animationend',
                    () => toastRoot.removeChild(toastEl),
                    { once: true }
                )
            }, TOAST_SHOW_DURATION_MS)
        break
    }
}

connection.onOpen(() => console.log('connected'))
connection.onMessage(({data}) =>
    handleMsg(tap(JSON.parse(data))))

const video: HTMLVideoElement = el('video')
const button = el('button')

button.onclick = async () => {
    video.srcObject = await getMediaSource()
    video.onloadedmetadata = () => video.play()

    return void(0)
}

button.innerText = 'get media'

at(root,
    [ at(el('div', 'layer'),
        [ video
        , button
        ])
    , toastRoot
    ])

// TODO remove
// showSongToast({artist: 'carbide', title: 'foo'})
// showSongToast({artist: 'carbide', title: 'bar'})
// showSongToast({artist: 'carbide', title: 'baz'})
// showSongToast({artist: 'carbide', title: 'quix'})
