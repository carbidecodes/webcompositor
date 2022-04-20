import { init } from '/channel/connection.ts'
import { getMediaSource } from './layer.ts'
import { select, el, at } from './utils/dom.ts'

const connection = init()

connection.onOpen(() => console.log('connected'))
connection.onMessage(msg => console.log({msg}))

const video: HTMLVideoElement = el('video')
const button = el('button')

button.onclick = async () => {
    video.srcObject = await getMediaSource()
    video.onloadedmetadata = () => video.play()

    return void(0)
}

button.innerText = 'get media'

at(select('div#container'), [video, button])
