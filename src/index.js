// Tutorial at
// https://www.emanueleferonato.com/2018/10/13/build-a-html5-game-like-color-jump-using-phaser-3-and-matter-physics-introducing-some-es6-features/

import Phaser from 'phaser'
import wall from './wall.png'
import ball from './ball.png'

document.querySelectorAll('canvas').forEach(canvas => canvas.remove())

const SIDES = {
  LEFT: 0,
  RIGHT: 1
}

const gameOptions = {
  gravity: 4,
  bars: 4,
  ballSpeed: 2,
  jumpForce: 10
}

class playGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  preload () {
    this.load.image('wall', wall)
    this.load.image('ball', ball)
  }

  create () {
    this.leftWalls = []
    this.rightWalls = []
    for (let i = 0; i < gameOptions.bars; ++i) {
      this.leftWalls.push(this.addWall(i, SIDES.LEFT))
      this.rightWalls.push(this.addWall(i, SIDES.RIGHT))
    }
    this.ball = this.matter.add.image(game.config.width / 4, game.config.height / 2, 'ball')
    this.ball.setBody({ type: 'circle' })
    let randomWall = Phaser.Math.RND.pick(this.rightWalls)
    this.ball.setTint(randomWall.body.color)
    this.ball.setVelocity(gameOptions.ballSpeed, 0)
    this.input.on('pointerdown', this.jump, this)
  }

  addWall(wallNumber, side) {
    let wallTexture = this.textures.get('wall')
    let wallHeight = game.config.height / gameOptions.bars
    let wallX = side * game.config.width + wallTexture.source[0].width * (side - 0.5)
    let wallY = wallHeight * wallNumber + wallHeight / 2
    let wall = this.matter.add.image(wallX, wallY, 'wall', null, {
      isStatic: true,
      label: (side === SIDES.RIGHT) ? 'rightwall' : 'leftwall'
    })
    wall.displayHeight = wallHeight
    return wall
  }

  jump () {
    this.ball.setVelocity((this.ball.body.velocity.x > 0) ? gameOptions.ballSpeed : -gameOptions.ballSpeed, -gameOptions.jumpForce)
  }

  update () {
    this.ball.setVelocity(this.ball.body.velocity.x > 0 ? gameOptions.ballSpeed : -gameOptions.ballSpeed, this.ball.body.velocity.y)
    if (this.ball.y < 0 || this.ball.y > game.config.height) {
      this.scene.start('PlayGame')
    }
  }
}


const gameConfig = {
  type: Phaser.AUTO,
  width: 730,
  height: 1334,
  backgroundColor: 0x983303,
  scene: playGame,
  physics: {
    default: "matter",
    matter: {
      gravity: {
        x: 0,
        y: gameOptions.gravity
      }
    }
  }
}

const game = new Phaser.Game(gameConfig)

const resize = () => {
  let canvas = document.querySelector("canvas");
  if (!canvas) {
    return
  }
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else{
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
resize()
window.addEventListener('resize', resize)
