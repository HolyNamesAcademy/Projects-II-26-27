import Phaser from 'phaser';
import {generateMaze, Maze} from '../../../services/minigames/maze';

// Simple screen that loads a row from Supabase to confirm setup works.
export class MazeScene extends Phaser.Scene {


  constructor() {
    super('MazeScene');
    generateMaze().then((maze: Maze) => {
      console.log("Maze generated: ", maze);
    }).catch((error) => {
      console.error("Error generating maze: ", error);
    });
  }

  create(): void {
  }
}
