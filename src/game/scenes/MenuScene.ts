import Phaser from 'phaser';
import { getDemoMessages } from '../../services/demo';
import { isSupabaseConfigured } from '../../services/supabase';
import { getMenu, type Menu, type MenuTab } from '../../services/menu';

// Simple screen that loads a row from Supabase to confirm setup works.
export class MenuScene extends Phaser.Scene {
  menu: Menu | null = null;
  private statusText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private username!: Phaser.GameObjects.Text;
  private menuMap = new Map<string, Phaser.GameObjects.Text[]>();

  constructor() {
    super('MenuScene');
  }

  create(): void {


    this.add
      .text(15, 60, 'Menu', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '40px',
        color: '#f4f7fb',
      })
      .setOrigin(0,0.5);

    this.bodyText = this.add
      .text(this.scale.width / 2, 280, '', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '22px',
        color: '#f4f7fb',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: this.scale.width - 120 },
      })
      .setOrigin(0.5, 0);

    this.loadMenu();

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
    this.renderTabs(this.menu?.tabs ?? []);
  }

  renderTabs(tabs: MenuTab[]): void {
    this.menuMap.clear();

    tabs.forEach((tab, index) => {
      console.log(`Rendering tab: ${tab.label}`);
      this.createButton(50, 150 + index * 90, 0, 0.5, tab.label, () => {
        this.showTab(tab.label);
      });

      const itemTexts = tab.items.map((item, itemIndex) =>
        this.add
            .text(700, 150+itemIndex*30, `${item.key}: ${item.value}`, {
              fontFamily: 'Segoe UI, sans-serif',
              fontSize: '20px',
              color: '#f4f7fb',
            })
            .setOrigin(0, 0.5)
            .setVisible(false),
      );

      this.menuMap.set(tab.label, itemTexts);
    });
  }

  private showTab(label: string): void {
    this.menuMap.forEach((items) => {
      items.forEach((item) => item.setVisible(false));
    });

    this.menuMap.get(label)?.forEach((item) => item.setVisible(true));
  }

  private createButton(x: number, y: number, x_origin: number, y_origin: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(x, y, label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(x_origin, y_origin)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#91bdfc' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#2c7ef8' }));
    button.on('pointerdown', onClick);
  }
}
