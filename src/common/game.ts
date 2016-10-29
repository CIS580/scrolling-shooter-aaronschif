export class Game {
    canvas: HTMLCanvasElement
    backCanvas: HTMLCanvasElement
    buffer: CanvasRenderingContext2D
    backBuffer: CanvasRenderingContext2D
    height: number
    width: number
    framerate: number
    _lastTick: number

    constructor() {
        this.width = 780
        this.height = 480
        this.framerate = 60
    }

    update(dt: number) {

    }

    render(dt: number, ctx: CanvasRenderingContext2D) {

    }

    install(place: string) {
        let canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        document.querySelector(place).appendChild(canvas)

        let backCanvas = document.createElement('canvas')
        backCanvas.width = this.width
        backCanvas.height = this.height

        this.buffer = canvas.getContext('2d')
        this.backBuffer = backCanvas.getContext('2d')
        this.canvas = canvas
        this.backCanvas = backCanvas
    }

    start() {
        this._lastTick = performance.now()
        setInterval(this.tick.bind(this), 1000/this.framerate)
    }

    tick(): boolean {
        let now = performance.now()
        let dt = now - this._lastTick
        this._lastTick = now
        this.update(dt)
        this.render(dt, this.backBuffer)
        this.buffer.drawImage(this.backCanvas, 0, 0)
        return true
    }
}
