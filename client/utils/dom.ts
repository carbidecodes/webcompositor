export const select = (selector: string) : Element => {
    const el = document.querySelector(selector)

    if (el == null) {
        throw `Failed to select ${selector}`
    }

    return el
}

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) => {
    const el = document.createElement<K>(tag)
    if (className !== undefined) {
        el.className = className
    }

    return el
}
export const at = (node: Element, children: Array<Element>) => {
    children.forEach(x => node.appendChild(x))
    return node
}
export const text = (txt: string) => {
    const t = el('span')
    t.innerText = txt
    return t
}
