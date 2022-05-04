import { init } from '/channel/connection.ts'
import { Read } from 'utils/dom.ts'
import { tap } from 'common/utils/func.ts'
import { Song } from 'common/messages.ts' 

import { pipe } from 'https://esm.sh/@psxcode/compose'

const { select, observe, query, text } = Read

const extract = (node: Element) : Song => {
    let q = query(node)

    const cleanUrlString // url("foo") => 'foo'
    = (urlString: string) =>
        urlString // probably not ideal
        .replace('url(','')
        .replace(')','')
        .replaceAll('"','')

    return {
        artist: text(q<HTMLAnchorElement>('a.sc-link-secondary')!),
        title: text(q<HTMLSpanElement>('a.sc-link-primary span[aria-hidden=true]')!),
        imgUrl: cleanUrlString(q<HTMLSpanElement>('div.image span')!.style.backgroundImage)
    }
}

const tapA = (x: any, label = '') => tap(x, 'asdf - ' + label)

const connect = async () => {
    const { a } = await window.chrome.storage.sync.get('a')

    const connection = init({host: 'localhost', port: a ? 8002 : 8001, endpoint: 'sc'})

    connection.onOpen(() => console.log('connected.'))
    connection.onMessage(tap)

    return connection
}

(async () => {
    const connection = await connect()

    const playback = select('div.playbackSoundBadge')

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
})()

