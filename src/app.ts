import {MediaManager} from './common/mediaManager'
import {Actor} from './common/actor'
import {Scene} from './common/world'
import {Game} from './common/game'


const mediaManager = new MediaManager()
const cloudSprite = mediaManager.fetchSprite('./assets/cloud.png')


class PlayerShip extends Actor {

}


class SSGame extends Game {
    render(dt, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black'
        ctx.fillRect(20, 20, 20, 20)
        ctx.fillRect(40, 40, 2000, 20)
        // console.log(cloudSprite)

        ctx.fillStyle = 'green'
        ctx.fillRect(0, 0, cloudSprite.width, cloudSprite.height)
        cloudSprite.draw(ctx, 0, 0, .2, .2)
        // cloudSprite.then((e)=>e.draw(ctx, 0, 0))
        // ctx.drawImage(cloudSprite, 0, 0)
    }

    update(dt) {

    }
}

mediaManager.loaded().then(()=>{
    let game = new SSGame()
    game.install('#game-window')
    game.start()
})
