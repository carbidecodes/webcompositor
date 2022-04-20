export type Maybe<T> = T | null
export type Action<T> = (t: T) => void

export const isSome = <T>(x: Maybe<T>) : x is T => x !== null
