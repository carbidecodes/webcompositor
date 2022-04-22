import { init } from '/channel/connection.ts'
import { getMediaSource } from './layer.ts'
import { select, el, at, text } from './utils/dom.ts'
import { tap } from 'common/utils/func.ts'


const root = select('div#container')

const connection = init()

const toast = ({
    titleText,
    bodyText,
    imgUrl
}: {
    titleText: string
    bodyText: string
    imgUrl?: string
}) => {
    const img_ = 
        (() => {
            if (imgUrl !== undefined) {
                const img = el('img')
                img.src = imgUrl
                return [img]
            } else {
                return []
            }
        })()

    return at(el('div', 'toast'), [
        text(titleText),
        at(el('div'), [
            text(bodyText)
        ].concat(img_))
    ])
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
            const { artist, title } = data
            const toastEl = toast({
                titleText: 'Current song',
                bodyText: `${artist} - ${title}`
            })

            at(root, [toastEl])

            setTimeout(() => {
                root.removeChild(toastEl)
            }, 3000)
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

at(root, [video, button])
