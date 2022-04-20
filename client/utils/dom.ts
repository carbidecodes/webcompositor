export const select = (selector: string) : Element => {
    const el = document.querySelector(selector)

    if (el == null) {
        throw `Failed to select ${selector}`
    }

    return el
}

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K) => document.createElement<K>(tag)
export const at = (node: Element, children: Array<Element>) => {
    children.forEach(x => node.appendChild(x))
    return node
}
