const render = ({a}) =>
    document.querySelector('button').innerText = `Toggle A ${a ? 'off' : 'on'}`

const get = keys => window.chrome.storage.sync.get(keys)
const set = record => window.chrome.storage.sync.set(record)

const commands = {
    toggleA: async () => {
        const { a } = await get('a')
        return window.chrome.storage.sync.set({a: !a})
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('content loaded')
    document.querySelector('button')
        .addEventListener('click', () => update(commands.toggleA))
})

const update = async fn => {
    if (fn !== undefined) {
        await fn()
    }
    render(await get(['a']))
}

update()
