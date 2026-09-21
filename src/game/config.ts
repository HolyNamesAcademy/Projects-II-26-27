import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { DemoScene } from './scenes/DemoScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Phaser 4: put size and parent on `scale` only (top-level copies are ignored when both are set).
// AUTO uses the WebGL renderer and falls back to Canvas. Forcing WEBGL has no fallback.
// roundPixels defaults to false in v4; keep it on so this static UI stays on whole pixels.
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#0b1220',
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  render: {
    roundPixels: true,
  },
  scene: [BootScene, DemoScene],
};
