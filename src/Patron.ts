import Phaser from 'phaser'
import { gameOptions } from './gameOptions'

export class Patron extends Phaser.Physics.Arcade.Image {

  constructor (scene: Phaser.Scene, y: number) {
    super(scene, gameOptions.width * 0, y - 70, 'ball')
    this.setActive(true)
    this.displayHeight = 10
    this.displayWidth = 10
  }

  send () {
    setTimeout(() => {
      this.setVelocity(200, 0)
    }, 100)
  }

  setDrinking () {
    this.setVelocity(0, 0)
    setTimeout(() => {
      this.setVelocity(-200, 0)
    }, 1000)
  }

}
