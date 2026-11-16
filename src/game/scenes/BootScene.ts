import Phaser from 'phaser';

// Starts the demo scene right away.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  

  preload(): void {
    this.load.image('Red_Gem', 'assets/Red_Gem.png');
    this.load.spritesheet('GemsSprite', 'assets/Gems.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('YellowGem', 'assets/Coin_Gems/YellowGem.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('BlueGem', 'assets/Coin_Gems/BlueGem.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('GreenGem', 'assets/Coin_Gems/GreenGem.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('RedGem', 'assets/Coin_Gems/RedGem.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('GreyGem', 'assets/Coin_Gems/GreyGem.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('SilverCoin', 'assets/Coin_Gems/SilverCoin.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('RedCoin', 'assets/Coin_Gems/RedCoin.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('YellowCoin', 'assets/Coin_Gems/YellowCoin.png', { frameWidth: 16, frameHeight: 16 });
    
  }
  create(): void {
    this.CreateGemAnimation('RedGem');
    this.CreateGemAnimation('BlueGem');
    this.CreateGemAnimation('GreenGem');
    this.CreateGemAnimation('YellowGem');
    this.CreateGemAnimation('GreyGem');
    this.CreateGemAnimation('SilverCoin');
    this.CreateGemAnimation('RedCoin');
    this.CreateGemAnimation('YellowCoin');
    
    this.scene.start('CompletionScene');
  }
  CreateGemAnimation(Key: string): void {
    this.anims.create({
      key: Key,
      frames: this.anims.generateFrameNumbers(Key, { frames:[0,1,2,3] }),
      frameRate: 2,
      repeat: -1,
    });
  }
 

  
}
