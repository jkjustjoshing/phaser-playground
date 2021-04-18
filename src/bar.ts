// Tutorial at
// https://www.emanueleferonato.com/2018/10/13/build-a-html5-game-like-color-jump-using-phaser-3-and-matter-physics-introducing-some-es6-features/

import Phaser from 'phaser'
import wall from './wall.png'
import ball from './ball.png'
import { gameOptions } from './gameOptions'
import { Barkeep } from './Barkeep'
import { Patron } from './Patron'
import { Beer } from './Beer'

document.querySelectorAll('canvas').forEach(canvas => canvas.remove())

const SIDES = {
  LEFT: 0,
  RIGHT: 1
}

const KEYS = {
  space: 32,
  up: 38,
  down: 40
}

console.log('https://phaser.io/examples/v3/view/physics/arcade/basic-platform')
const random = (length: number) => Math.floor(Math.random() * length)

class Bar extends Phaser.Scene {
  bars: Phaser.Physics.Arcade.Image[]
  barkeep: Barkeep
  patronGroup: Phaser.Physics.Arcade.Group

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

    const self = this
    this.input.keyboard.addKey(KEYS.space).onUp = function (e) {
      const duration = this.getDuration()

      if (duration > 100) {
        self.barkeep.addBeer()
      }
      this.reset()
    }
    this.input.keyboard.addKey(KEYS.down).onDown = function (e) {
      self.barkeep.move('down')
    }
    this.input.keyboard.addKey(KEYS.up).onDown = function (e) {
      self.barkeep.move('up')
    }

    this.patronGroup = this.physics.add.group()
    this.physics.add.overlap(this.barkeep.beerGroup, this.patronGroup, ((beer: Beer, patron: Patron) => {
      beer.destroy()
      patron.setDrinking()
    }) as ArcadePhysicsCallback);

    setTimeout(() => {
      this.addPatron(random(this.bars.length))
    }, 1000)
    setTimeout(() => {
      this.addPatron(random(this.bars.length))
    }, 1500)
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

  addPatron(row: number) {
    const patron = new Patron(this, this.bars[row].getRightCenter().y)
    this.patronGroup.add(patron)
    patron.send()
  }
}

class Boundary extends Phaser.Physics.Arcade.Body {
  constructor (world: Phaser.Physics.Arcade.World, gameObject: Phaser.GameObjects.GameObject) {
    super(world, gameObject)
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
      debug: true
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
