import Phaser from 'phaser';
import { getMenu, type Menu } from '../../services/settings';
import {register} from '../../services/auth';

// type MenuItems = Record<string, Phaser.GameObjects.Text[]>;

// Simple screen that loads a row from Supabase to confirm setup works.
export class MapScene extends Phaser.Scene {
  menu: Menu | null = null;
  gem: string | null = null;

  constructor() {
    super('MapScene');
  }

  create(): void {
    // Phaser does not await init/create, so load data here and render when it arrives.
    this.gem = (this.scene.settings.data as { gem?: string } | undefined)?.gem ?? null;

    void this.loadMenu();

    this.add
      .tileSprite(0, 0, this.scale.width * 4, this.scale.height * 4, 'water')
      .setOrigin(0)
      .setScale(1 / 4);

    const island = this.add.sprite(this.scale.width / 2, this.scale.height / 2, this.gem ?? '')
    .setScale(8)
    .setInteractive()
    .play(this.gem ?? '');

    island.on('pointerover', () => {
      console.log(`Pointer over gem: ${this.gem}`);
      island.play('hover');
    });

    island.on('pointerout', () => {
      console.log(`Pointer out of gem: ${this.gem}`);
      island.play('island');
    });

    // this.cameras.main.setBackgroundColor('#028af8');


    this.add
      .text(this.scale.width / 2, 64, 'Map', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '36px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);
  }

  async loadMenu(): Promise<void> {
    try {
      this.menu = await getMenu();
    } catch (error) {
      console.error('Failed to load menu', error);
      return;
    }

    // The scene may have been stopped while we were waiting.
    if (!this.sys.isActive()) return;
    this.renderMenuTabs(this.menu?.tabs ?? []);
  }

  renderMenuTabs(tabs: Menu['tabs']): void {
    tabs.forEach((tab, index) => {
      console.log(`Rendering menu tab: ${tab.name}`);
      this.add.text(16 + index * 100, 16, tab.name, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#f4f7fb',
      });
    });
  }

  // renderMaze(): void {
  //   // Render the maze here
  //   const isleWidth = 2;
  //   this.scale.height;
  //   this.scale.width;

  //   this.add.image(0, 0, 'hedge').setOrigin(0);
  // }
}
