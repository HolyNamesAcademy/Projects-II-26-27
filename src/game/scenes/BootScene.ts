import Phaser from 'phaser';

// Starts the demo scene right away.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  preload():void{

   this.load.image('water', 'assets/Sprites/water.jpg');
   this.load.image('island', 'assets/Sprites/fall-island.png')

  }
  create(): void {
    this.scene.start('DemoScene');
  }
}
