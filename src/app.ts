import {Drawable} from './common/drawable'
import {MediaManager} from './common/mediaManager'
import {Actor} from './common/actor'
import {Scene} from './common/world'
import {Game} from './common/game'
import {Controller} from './common/input'
import {BulletPool} from './bullet_pool'
import {Vector} from './vector'


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


class Explosion extends Drawable {
    color
    particles

    constructor(color, position) {
        super()
        this.color = color
        this.particles = []
    }

    *baseRenderState() {
        for (let i=0; i<20; i++) {
            this.particles.push({
                x: 200,
                y: 200,
                vx: Math.cos(i) * 2 + Math.random(),
                vy: Math.sin(i) * 2 + Math.random()})
        }
        while (true) {
            let {dt, ctx} = yield null
            ctx.fillStyle = this.color
            for (let p of this.particles) {
                if (p.vy < 6) {
                    p.vy += .05
                }
                if (p.vx < 0) {
                    p.vx += .01
                } else if (p.vx > 0) {
                    p.vx -= .01
                }
                ctx.fillRect(p.x += p.vx, p.y += p.vy, 2, 2)
            }
        }
    }
}


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

            clouds = clouds.filter((cloud)=>cloud.y < this.height + 200)
            cities = cities.filter((cloud)=>cloud.y < this.height + 200)

            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, this.width, this.height)
            for (let city of cities) {
                city.y += dt/6
                city.sprite.draw(ctx, city.x, city.y, city.scale, city.scale)
            }
            ctx.fillStyle = 'rgba(0, 0, 0, .5)'
            ctx.fillRect(0, 0, this.width, this.height)
            for (let cloud of clouds) {
                cloud.y += dt/3
                cloud.sprite.draw(ctx, cloud.x, cloud.y, cloud.scale, cloud.scale)
            }
            ctx.fillStyle = 'rgba(0, 0, 0, .7)'
            ctx.fillRect(0, 0, this.width, this.height)
            if (Math.random() > .9) {
                clouds.push({
                    sprite: cloudSprites[(cloudSprites.length*Math.random())|0],
                    x: -200 + (this.width + 400) * Math.random(),
                    y: -400,
                    scale: .2
                })
            }
            if (Math.random() > .9) {
                cities.push({
                    sprite: cloudSprites[(cloudSprites.length*Math.random())|0],
                    x: -200 + (this.width + 400) * Math.random(),
                    y: -400,
                    scale: -.2
                })
            }
        }
    }

    *baseControlState() {}
}

class PlayerShip extends Actor {
    health: Number
    bullet_pool
    last_bullet: Number
    constructor(world) {
        super(world)
        this.last_bullet = 0
        this.bullet_pool = new BulletPool(1000)
        this.health = 1
        this.width = shipSprite.width/10
        this.height = shipSprite.height/10
    }

    *baseRenderState() {
        while (true) {
            let {dt, ctx} = yield null
            shipSprite.draw(ctx, this.x, this.y, .1, .1)
            this.bullet_pool.render(dt, ctx)
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
            this.y = Math.max(0, Math.min(this.world.height-this.height, this.y))
            this.x = Math.max(0, Math.min(this.world.width-this.width, this.x))
            if (controller.input.space) {
                this.fire()
            }
            this.bullet_pool.update(dt, ({x, y})=>y<0)
        }
    }

    fire() {
        if (this.last_bullet < performance.now()-40) {
            this.bullet_pool.add({x: this.x + this.width/2, y: this.y}, {x: 0, y: -3})
            this.last_bullet = performance.now()
        }
    }
}

class Hud extends Drawable {
    player
    height
    padding
    constructor (player: PlayerShip, width, height) {
        super()
        this.player = player
        this.height = height
        this.padding = 8
    }

    *baseRenderState() {
        while (true) {
            let {dt, ctx} = yield null
            let height = this.height - (this.padding * 2)
            ctx.fillStyle = 'grey'
            ctx.fillRect(this.padding, this.padding, 8, height)
            ctx.fillStyle = 'red'
            let missingLife = height - height * this.player.health
            ctx.fillRect(this.padding, this.padding + missingLife, 8, height - missingLife)
        }
    }
}

class AlienShip extends Actor {
    radius
    arcpos
    clockwise
    constructor(world) {
        super(world)
        this.clockwise = -1
        this.arcpos = 0
        this.radius = 60
        this.x = 200
        this.y = 200
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

    *baseControlState() {
        let rate = 32
        while (true) {
            let {dt} = yield null

            this.arcpos += this.clockwise * 1/rate;
            let p = this.arcpos;

            let vec = {
                x: Math.sin(p),
                y: Math.cos(p)
            }

            vec = Vector.normalize(vec)
            vec = Vector.scale(vec, 1/rate)

            if (Math.abs(this.arcpos) > Math.PI*2*Math.random()&& Math.random()>.8) {
                this.clockwise *= -1;
            }
            this.x = vec.x*this.radius + this.x;
            this.y = vec.y*this.radius + this.y;

            if (this.world.out_of_bounds(this)) {
                this.collect = ()=>true
            }
        }
    }
}

class SSGame extends Game {
    player
    enemies
    constructor() {
        super()
        this.width = 1200
        this.height = 800

        this.player = new PlayerShip(this)
        this.player.x = this.width / 2
        this.player.y = this.height - 200
        this.enemies = [new AlienShip(this)]
    }

    *baseRenderState() {
        let backdrop = new BackdropScene(this.width, this.height)
        let hud = new Hud(this.player, this.width, this.height)
        let explosion = new Explosion('red', {x: 20, y: 20})
        while (true) {
            let {dt, ctx} = yield null
            backdrop.render(dt, ctx)
            explosion.render(dt, ctx)
            this.player.render(dt, ctx)
            hud.render(dt, ctx)
            for (let enemy of this.enemies) {
                enemy.render(dt, ctx)
            }
        }
    }

    *baseControlState() {
        while (true) {
            let {dt} = yield null
            this.player.update(dt)
            this.enemies = this.enemies.filter((e)=>!e.collect())
            for (let enemy of this.enemies) {
                enemy.update(dt)
            }
        }
    }

    out_of_bounds({x, y}) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }
}

mediaManager.loaded().then(()=>{
    let game = new SSGame()
    game.install('#game-window')
    game.start()
})
