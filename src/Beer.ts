import Phaser from 'phaser'
import { gameOptions } from './gameOptions'
import genesee from './genesee.png'

export class Beer extends Phaser.Physics.Arcade.Image {

  static preload () {
    return ['genesee', genesee] as const
  }

  constructor (scene: Phaser.Scene, y: number) {
    super(scene, gameOptions.width * 0.8, y - 70, 'genesee')

    const ratio = this.displayHeight / this.displayWidth
    this.displayHeight = 50
    this.displayWidth = this.displayHeight / ratio

    this.setActive(true)
  }

  send () {
    this.setVelocity(-200, 0)
  }

}
