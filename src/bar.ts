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
  width: 730,
  height: 834,
  gravity: 4,
  bars: 4,
  ballSpeed: 5,
  jumpForce: 10
}

class Bar extends Phaser.Scene {
  bars: Phaser.Physics.Matter.Image[]
  ball: Phaser.Physics.Matter.Image


  constructor () {
    super('Bar')
  }

  preload () {
    this.load.image('wall', wall)
    this.load.image('ball', ball)
  }

  create () {
    this.bars = []
    for (let i = 0; i < gameOptions.bars; ++i) {
      this.bars.push(this.addBar(i))
    }
    this.ball = this.matter.add.image(gameOptions.width / 4, gameOptions.height / 2, 'ball')
    this.ball.setBody({ type: 'circle' })
    this.ball.setVelocity(0, 0)
    this.moveBall()
    this.input.keyboard.on('keydown', this.action, this)
  }

  addBar(wallNumber) {
    let wallTexture = this.textures.get('wall')
    let wallHeight = gameOptions.height / (gameOptions.bars * 2 + 1)
    let wallX = gameOptions.width * 0.4
    let wallY = wallHeight * (wallNumber * 2 + 1.5)
    let wall = this.matter.add.image(wallX, wallY, 'wall', null, {
      isStatic: true
    })
    wall.displayHeight = wallHeight
    wall.displayWidth = gameOptions.width * 0.8
    return wall
  }

  moveBall(direction?: 'up' | 'down') {
    let position: number
    if (!direction) {
      position = 0
    } else if (direction === 'up') {
      position = (this.ball.getData('position') - 1 + gameOptions.bars) % gameOptions.bars
    } else if (direction === 'down') {
      position = (this.ball.getData('position') + 1) % gameOptions.bars
    }

    this.ball.setData('position', position)
    this.ball.setPosition(gameOptions.width * 0.9, this.bars[position].getRightCenter().y)
  }

  action (event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.moveBall('up')
    } else if (event.key === 'ArrowDown') {
      this.moveBall('down')
    }
  }

  update () {
    // this.ball.setVelocity(this.ball.body.velocity.x > 0 ? gameOptions.ballSpeed : -gameOptions.ballSpeed, this.ball.body.velocity.y)
    // if (this.ball.y < 0 || this.ball.y > gameOptions.height) {
    //   this.scene.start('PlayGame')
    // }
  }
}


const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: gameOptions.width,
  height: gameOptions.height,
  backgroundColor: 0x983303,
  scene: Bar,
  physics: {
    default: "matter",
    matter: {
      gravity: {
        x: 0,
        y: 0
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
  let gameRatio = gameOptions.width / gameOptions.height;
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
