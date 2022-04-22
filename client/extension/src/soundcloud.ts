import { init } from '/channel/connection.ts'
import { Read } from 'utils/dom.ts'
import { tap } from 'common/utils/func.ts'

import { pipe } from 'https://esm.sh/@psxcode/compose'

const { select, observe, query, text } = Read

const connection = init()
connection.onOpen(() => console.log('connected.'))
connection.onMessage(tap)

document.body.style.backgroundColor = 'red'

const playback = select('div.playbackSoundBadge')

const extract = (node: Element) => {
    let q = query(node)

    return {
        artist: text(q<HTMLAnchorElement>('a.sc-link-secondary')!),
        title: text(q<HTMLSpanElement>('a.sc-link-primary span[aria-hidden=true]')!),
        imgUrl: q<HTMLSpanElement>('div.image span')!.style.backgroundImage
    }
}

const tapA = (x: any, label = '') => tap(x, 'asdf - ' + label)

const handleUpdate = (record: MutationRecord) => {
    if (record.type === 'childList') {
        pipe(
            extract,
            tapA,
            JSON.stringify,
            connection.send
        )(playback)
    }
}

observe(
    tapA(playback),
    pipe(tapA, handleUpdate),
    {
        childList: true
    }
)
