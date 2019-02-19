const SseStream = require('ssestream')

export default class EventStream {
    constructor(req, res, type) {
        this.type = type
        this.uniqueID = Math.random().toString(16)

        this.sseStream = new SseStream(req)
        this.sseStream.pipe(res)

        res.on('close', () => {
            console.log('lost connection')
            this.sseStream.unpipe(res)

            EventStream.remove(this.sseStream)

            this.sseStream = null
        })
    }

    static sendEvent(type, event, data) {
        const streams = this.streams()

        for (const x of streams) {
            x.send(type, event, data)
        }
    }

    static add(eventStream) {
        this.streams().push(eventStream)
    }

    static remove(eventStream) {
        const streams = this.streams()
        const index = streams.indexOf(eventStream)

        if (index !== -1) {
            streams.splice(index, 1)
        }
    }

    static streams() {
        if (!this._streams) {
            this._streams = []
        }

        return this._streams
    }

    isValid() {
        return this.sseStream !== null
    }

    send(type, event, data) {
        if (this.isValid() && type === this.type) {
            this.sseStream.write({
                event: event,
                data: data
            })
        }
    }
}