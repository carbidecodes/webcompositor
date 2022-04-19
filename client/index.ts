import { init } from '/channel/connection.ts'

const connection = init()

connection.onOpen(() => console.log('connected'))
connection.onMessage(msg => console.log({msg}))
