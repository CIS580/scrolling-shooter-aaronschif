class ImageHandle {
    img = null
    x = 0
    y = 0
    width = 0
    height = 0

    constructor (img: HTMLImageElement, setup) {
        this.img = img
        this.img.addEventListener('load', (img)=>setup(this, img))
    }

    draw (ctx: CanvasRenderingContext2D, x, y, sx=1, sy=1) {
        ctx.drawImage(
            this.img,
            this.x, this.y, this.width, this.height,
            x, y, this.width*sx, this.height*sy
        )
    }
}

class AudioHandle {
    constructor () {

    }
}

export class MediaManager {
    pending: Array<Promise<any>>

    constructor () {
        this.pending = []

    }

    loaded() {
        return Promise.all(this.pending)
    }

    fetchSprite (url) {
        let sprite = new Image()
        let p = new Promise((resolve)=>{
            sprite.addEventListener('load', resolve)
        })
        this.pending.push(p)
        sprite.src = url
        return new ImageHandle(
            sprite, (handle: ImageHandle, event)=>{
                let img: HTMLImageElement = event.target
                handle.x = 0
                handle.y = 0
                handle.height = img.naturalHeight
                handle.width = img.naturalWidth
            }
        )
    }
}
