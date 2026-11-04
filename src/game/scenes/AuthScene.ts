import Phaser from 'phaser';
import { getDemoMessages } from '../../services/demo';
import { installRegister, register } from '../../services/auth';
import { isSupabaseConfigured } from '../../services/supabase';


// Simple screen that loads a row from Supabase to confirm setup works.
export class AuthScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private form!: Phaser.GameObjects.DOMElement;
  private authButtons: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('AuthScene');
    installRegister();
  }

      create(): void {
    

  
  const cx = this.scale.width / 2;

    this.add
      .text(cx, 64, 'Welcome', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '36px',
        color: '#3a79cd',
      })
      .setOrigin(0.5);

     this.add
      .text(cx, 112, 'Log in or create an account', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

  

    const showForm = () => {
      this.authButtons.forEach((button) => button.setVisible(false));
      this.form.setVisible(true);
    };
    this.createButton(175, 'Login', showForm);
    this.createButton(255, 'Register', showForm);

    this.form = this.add.dom(cx, 80).createFromHTML(`
      <div style="display:flex;flex-direction:column;gap:18px;width:420px;">
        <input id="email" type="email" placeholder="Email" autocomplete="email"
          style="box-sizing:border-box;width:100%;padding:16px;font-size:22px;border-radius:6px;border:1px solid #3a4558;background:#141c2b;color:#f4f7fb;" />
        <input id="password" type="password" placeholder="Password (min 6 chars)" autocomplete="current-password"
          style="box-sizing:border-box;width:100%;padding:16px;font-size:22px;border-radius:6px;border:1px solid #3a4558;background:#141c2b;color:#f4f7fb;" />
      </div>
    `);
    this.form.setVisible(false);
  }

  private createButton(y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(this.scale.width / 2, y, label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#5a9fff' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#3d8bfd' }));
    button.on('pointerdown', onClick);
    this.authButtons.push(button);
  }
}
