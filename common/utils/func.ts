export const konst = (x: any) => () => x
export const tap = (x: any, label?: string) => {
    console.log(label ?? 'tap', x)
    return x
}

export const compose = <R,T,U>(f: (_:R)=> T, g: (_:T) => U) => (x: R) => g(f(x))

