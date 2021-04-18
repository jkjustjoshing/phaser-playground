import Phaser from 'phaser'
import { gameOptions } from './gameOptions'
import { Beer } from './Beer'

export class Barkeep extends Phaser.Physics.Arcade.Image {
  positions: number[]
  position: number
  beerGroup: Phaser.Physics.Arcade.Group
  worldEnd: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

  constructor (scene: Phaser.Scene, positions: number[]) {
    super(scene, gameOptions.width / 4, gameOptions.height / 2, 'ball')
    this.positions = positions
    this.beerGroup = this.scene.physics.add.group()
    this.worldEnd = this.scene.physics.add.image(200, gameOptions.height / 2, 'wall')
    this.worldEnd.displayHeight = gameOptions.height
    this.worldEnd.displayWidth = 10
    this.worldEnd.setActive(true)

    this.scene.physics.add.overlap(this.worldEnd, this.beerGroup, (worldEnd, beer) => {
      this.lose(beer)
    });

    this.move()
  }

  move(direction?: 'up' | 'down') {
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
    this.beerGroup.add(beer, true)

    setTimeout(() => beer.send())
  }

  lose (beer: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    // beer.destroy()
    this.beerGroup.children.each(((beer: Beer) => {
      beer.setVelocity(0, 0)
    }) as ((beer: Phaser.GameObjects.GameObject) => void))
    // Remove one life, show "Game Over", or something
  }
}
