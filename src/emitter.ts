import EventEmitter from "events"

export type GlobalEmit = {
  session: string
  data: any
}

export class TawaEmitter extends EventEmitter {
  // @ts-ignore
  emit(type: string, ...args: any[]) {
    // emit everything to the * channel
    super.emit('*', { session: type, data: args[0] })
    // and emit normally
    super.emit(type, ...args)
  }
}