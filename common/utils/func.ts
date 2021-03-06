import { Maybe } from './types.ts'

export const konst = (x: any) => () => x
export const tap = (x: any, label?: string) => {
    console.log(label ?? 'tap', x)
    return x
}

export const effect = <T>(fn: (_:T) => void) => (x: T) => {
    fn(x)
    return x
}

export const compose =
    <R,T,U>(f: (_:R)=> T, g: (_:T) => U) => (x: R) => g(f(x))

export const gate = <T, R>(predicate: (_:T) => boolean, on: (_:T) => R) : (_:T) => Maybe<R> =>
    (x: T) => {
        if (predicate(x)) {
            return on(x)
        }
        return null
    }
