import Phaser from 'phaser';

// Simple screen that loads a row from Supabase to confirm setup works.
export class MapScene extends Phaser.Scene {

  constructor() {
    super('MapScene');
  }

  create(): void {
    this.add
      .tileSprite(0,0,this.scale.width*4,this.scale.height*4,'water')
      .setOrigin(0)
      .setScale(1/4)
    this.add
      .text(this.scale.width / 2, 64, 'map', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '36px',
        color: '#f4f7fb',
      })
     this.add.sprite(160,110,'island')
          .setScale(2)
  }

  
}
