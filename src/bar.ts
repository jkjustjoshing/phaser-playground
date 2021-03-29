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
  bars: Phaser.Physics.Arcade.Image[]
  barkeep: Barkeep
  space: Phaser.Input.Keyboard.Key


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
    this.barkeep = this.add.existing(new Barkeep(this, this.bars.map(b => b.getRightCenter().y)))

    this.space = this.input.keyboard.addKey(32)
    this.space.onUp = (e) => {
      const duration = this.space.getDuration()

      if (duration > 100) {
        this.sendBeer()
      }
      this.space.reset()
    }

    this.input.keyboard.on('keydown', this.keydown, this)
    this.input.keyboard.on('keyup', this.keyup, this)
  }

  addBar(wallNumber) {
    let wallTexture = this.textures.get('wall')
    let wallHeight = gameOptions.height / (gameOptions.bars * 2 + 1)
    let wallX = gameOptions.width * 0.4
    let wallY = wallHeight * (wallNumber * 2 + 1.5)
    let wall = this.physics.add.image(wallX, wallY, 'wall')
    wall.displayHeight = wallHeight
    wall.displayWidth = gameOptions.width * 0.8
    return wall
  }

  keydown (event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.barkeep.moveBall('up')
    } else if (event.key === 'ArrowDown') {
      this.barkeep.moveBall('down')
    }
  }

  keyup (event: KeyboardEvent) {
  }

  sendBeer () {
    this.barkeep.addBeer()
  }
}

class Barkeep extends Phaser.Physics.Arcade.Image {
  positions: number[]
  position: number

  constructor (scene: Phaser.Scene, positions: number[]) {
    super(scene, gameOptions.width / 4, gameOptions.height / 2, 'ball')
    this.positions = positions

    // this.setBody({ type: 'circle' })
    // this.setVelocity(0, 0)

    this.moveBall()
  }

  moveBall(direction?: 'up' | 'down') {
    let position: number
    if (!direction) {
      position = 0
    } else if (direction === 'up') {
      position = (this.position - 1 + gameOptions.bars) % gameOptions.bars
    } else if (direction === 'down') {
      position = (this.position + 1) % gameOptions.bars
    }

    this.position = position
    this.setPosition(gameOptions.width * 0.9, this.positions[position])
  }

  addBeer () {
    const beer = new Beer(this.scene, this.positions[this.position])
    this.scene.add.existing(beer)
    setTimeout(() => beer.send())
  }
}

class Beer extends Phaser.Physics.Arcade.Image {

  constructor (scene: Phaser.Scene, y: number) {
    super(scene, gameOptions.width * 0.8, y - 70, 'ball')
    scene.physics.world.enable(this)
  }

  send () {
    this.setVelocity(-100, 0)
  }

}


const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: gameOptions.width,
  height: gameOptions.height,
  backgroundColor: 0x983303,
  scene: Bar,
  physics: {
    default: 'arcade',
    arcade: {

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
