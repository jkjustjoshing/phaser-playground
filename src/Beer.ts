import Phaser from 'phaser'
import { gameOptions } from './gameOptions'

export class Beer extends Phaser.Physics.Arcade.Image {

  constructor (scene: Phaser.Scene, y: number) {
    super(scene, gameOptions.width * 0.8, y - 70, 'ball')
    this.setActive(true)
  }

  send () {
    this.setVelocity(-200, 0)
  }

}
