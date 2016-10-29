class ImageHandle {
    img
    x
    y
    width
    height

    constructor ({img, x, y, w, h}) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
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
    constructor () {

    }

    async fetchSprite (url) {
        let sprite = new Image()
        let p = new Promise(
            (resolve)=>{sprite.onload = resolve})
        sprite.src = url
        await p

        return new ImageHandle({
            img: sprite,
            x: 0,
            y: 0,
            w: sprite.width,
            h: sprite.height
        })
    }

    fetchSpriteSheet (url, sprites) {
        let spriteSheet = new Image();
        spriteSheet.src = url;

        let spriteHandles = {};
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            spriteHandles[i] = new ImageHandle(
                {
                    img: spriteSheet,
                    x: sprite.x,
                    y: sprite.y,
                    w: sprite.w,
                    h: sprite.h,
                })
            if (sprite.name) {
                spriteHandles[sprite.name] = spriteHandles[i];
            }
        }
        return spriteHandles;
    }
}
