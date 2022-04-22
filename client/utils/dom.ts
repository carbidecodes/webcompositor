export namespace Create {
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
}

export namespace Read {
    export const select = (selector: string) : Element => {
        const el = document.querySelector(selector)

        if (el == null) {
            throw `Failed to select ${selector}`
        }

        return el
    }

    export const observe = (
        node: Element,
        handle: (_: MutationRecord) => void,
        opts = {characterData: true} as MutationObserverInit
    ) => {
        const observer = new MutationObserver(
            (records, _) => {
                records.forEach(handle)
            })

        observer.observe(node, opts)
    }

    export const query = (node: Element) =>
        <E extends Element>(selector: string) : E | null =>
                node.querySelector(selector)

    export const text = (node: HTMLElement) => node.innerText
}

