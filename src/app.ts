import {Drawable} from './common/drawable'
import {MediaManager} from './common/mediaManager'
import {Actor} from './common/actor'
import {Scene} from './common/world'
import {Game} from './common/game'
import {Controller} from './common/input'


const controller = new Controller()
controller.attach()

const mediaManager = new MediaManager()
const cloudSprites = [
    mediaManager.fetchSprite('./assets/cloud.png'),
    mediaManager.fetchSprite('./assets/cloud2.png'),
    mediaManager.fetchSprite('./assets/sun1.png'),
    // mediaManager.fetchSprite('./assets/bubble1.png')
]

const shipSprite = mediaManager.fetchSprite('./assets/ship.png')

class BackdropScene extends Drawable {
    width: number
    height: number

    constructor(width, height) {
        super()
        this.width = width
        this.height = height
    }

    *baseRenderState() {
        let clouds = []
        let cities = []
        while (true) {
            let {dt, ctx} = yield null

            clouds = clouds.filter((cloud)=>cloud.y < 800)
            cities = cities.filter((cloud)=>cloud.y < 800)

            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, this.width, this.height)
            for (let city of cities) {
                city.y += dt/6
                city.sprite.draw(ctx, city.x, city.y, city.scale, city.scale)
            }
            ctx.fillStyle = 'rgba(0, 0, 0, .7)'
            ctx.fillRect(0, 0, this.width, this.height)
            for (let cloud of clouds) {
                cloud.y += dt/3
                cloud.sprite.draw(ctx, cloud.x, cloud.y, cloud.scale, cloud.scale)
            }
            ctx.fillStyle = 'rgba(0, 0, 0, .5)'
            ctx.fillRect(0, 0, this.width, this.height)
            if (Math.random() > .9) {
                clouds.push({
                    sprite: cloudSprites[(cloudSprites.length*Math.random())|0],
                    x: -200 + (900) * Math.random(),
                    y: -400,
                    scale: .2
                })
            }
            if (Math.random() > .9) {
                cities.push({
                    sprite: cloudSprites[(cloudSprites.length*Math.random())|0],
                    x: -200 + (900) * Math.random(),
                    y: -400,
                    scale: -.2
                })
            }
        }
    }

    *baseControlState() {}
}

class PlayerShip extends Actor {
    constructor(world) {
        super(world)
    }

    *baseRenderState() {
        while (true) {
            let {dt, ctx} = yield null
            // ctx.fillStyle = 'blue'
            // ctx.fillRect(this.width, this.height, 10, 10)
            shipSprite.draw(ctx, this.x, this.y, .1, .1)
        }
    }

    *baseControlState() {
        const mod = 1/3
        while (true) {
            let {dt} = yield null
            if (controller.input.up) {
                this.y -= dt*mod
            } else if (controller.input.down) {
                this.y += dt*mod
            }
            if (controller.input.right) {
                this.x += dt*mod
            } else if (controller.input.left) {
                this.x -= dt*mod
            }
        }
    }
}

class AlienShip extends Actor {
    constructor(world) {
        super(world)
    }

    *baseRenderState() {
        const size = 14
        while (true) {
            let {dt, ctx} = yield null
            ctx.fillStyle = 'green'
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, 2*Math.PI);
            ctx.fill();
        }
    }
}

class SSGame extends Game {
    player
    enemies
    constructor() {
        super()
        this.player = new PlayerShip(this)
        this.enemies = [new AlienShip(this)]
    }

    *baseRenderState() {
        let backdrop = new BackdropScene(this.width, this.height)
        while (true) {
            let {dt, ctx} = yield null
            backdrop.render(dt, ctx)
            this.player.render(dt, ctx)
            for (let enemy of this.enemies) {
                enemy.render(dt, ctx)
            }
        }
    }

    *baseControlState() {
        while (true) {
            let {dt} = yield null
            this.player.update(dt)
            for (let enemy of this.enemies) {
                enemy.update(dt)
            }
        }
    }
}

mediaManager.loaded().then(()=>{
    let game = new SSGame()
    game.install('#game-window')
    game.start()
})
