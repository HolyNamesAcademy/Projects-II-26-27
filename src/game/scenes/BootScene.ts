import Phaser from 'phaser';

// Starts the demo scene right away.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image('water', 'assets/backgrounds/water-tile.png')
    this.load.image('hedge', 'assets/hedge.png');
    this.load.spritesheet('ruby', 'assets/coins_and_gems/spr_coin_roj.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create(): void {
    this.anims.create({
      key: 'ruby',
      frames: this.anims.generateFrameNumbers('ruby', { frames: [0, 1, 2, 3] }),
      frameRate: 0.5,
      repeat: -1,
    });

    this.scene.start('MapScene', { gem: 'ruby' });
  }
}
