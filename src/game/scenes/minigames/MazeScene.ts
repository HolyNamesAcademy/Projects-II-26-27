import Phaser from 'phaser';
import {generateMaze, Maze} from '../../../services/minigames/maze';

// Simple screen that loads a row from Supabase to confirm setup works.
export class MazeScene extends Phaser.Scene {
  mazeData: Maze;
  unitWidth: number;
  height: number; //the height of the area the maze generates in
  keys;
  mazeGuy: Phaser.Physics.Arcade.Sprite;
  wallGroup: Phaser.Physics.Arcade.StaticGroup;
  mazeLayer: Phaser.GameObjects.Layer;
  startTime: number;
  currentTime = 0;
  displayTime: Phaser.GameObjects.Text;

  preload() {
    console.log("Preloading!");
    this.load.image('background', 'public/assets/background.png');
    this.load.image('hedge', 'public/assets/hedge.png');

    this.load.spritesheet('mazeGuy', 'public/assets/mazeGuy.png', {
      frameWidth: 120,
      frameHeight: 120,
    });
  }

  constructor() {
    console.log("Constructing!");
    super('MazeScene');
    generateMaze().then((maze: Maze) => {
      console.log("Maze generated: ", maze);
      this.mazeData = maze;
      this.height = 600;
      if (this.height > this.scale.height) {this.height = this.scale.height}
      this.unitWidth = this.calculateUnitWidth(this.mazeData);
    }).catch((error) => {
      console.error("Error generating maze: ", error);
    });

  }

  create(): void {

    this.wallGroup = this.physics.add.staticGroup(); //for collision detection
    this.mazeLayer = this.add.layer(); //for keeping the maze behind mazeGuy
    this.mazeLayer.setDepth(2);


    const entrance = this.renderMaze(this.mazeData);

    this.mazeGuy = this.physics.add.sprite( 
      entrance[0], entrance[1] + (this.unitWidth * 3.5), 'mazeGuy') //35 = size / 2
      .setOrigin(0,2)
      .setScale( (this.unitWidth / 120 ) * 2.5);
      
    this.mazeGuy.setSize(60, 60);
    this.mazeGuy.setDepth(1);


    this.physics.add.collider(this.mazeGuy, this.wallGroup);


    this.keys = this.input.keyboard.createCursorKeys();


    let start = this.add.rectangle(
      ((this.scale.width - this.height) / 2) - this.unitWidth,
      ((this.scale.height - this.height) / 2),
      this.unitWidth, this.unitWidth * 2, 0x00ff00, 1).setOrigin(0,0).setDepth(0);
    
    let end = this.add.rectangle(
      (((this.scale.width - this.height) / 2) + this.height + this.unitWidth),
      ((this.scale.height - this.height) / 2) + this.height - (this.unitWidth * 2),
      this.unitWidth, this.unitWidth * 2, 0xff0000, 1).setOrigin(0,0).setDepth(0);


    this.startTime = this.time.now;
    this.displayTime = this.add.text( (this.scale.width - this.height) / 4, (this.scale.height / 2), '00:00',
      { font: '48px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);
    this.displayTime.setDepth(3);

    /*this.anims.create({
      key: 'frontWalk',
      frames: this.anims.generateFrameNumbers('mazeGuy', {frames: [0, 1, 2, 3, 4, 5]}),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: 'backWalk',
      frames: this.anims.generateFrameNumbers('mazeGuy', {frames: [6, 7, 8, 9, 10, 11]}),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: 'rightWalk',
      frames: this.anims.generateFrameNumbers('mazeGuy', {frames: [12, 13, 14, 15, 16, 17]}),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.create({
      key: 'leftWalk',
      frames: this.anims.generateFrameNumbers('mazeGuy', {frames: [18, 19, 20, 21, 22, 23]}),
      frameRate: 1,
      repeat: -1,
    });*/
  }


  update(time, delta) {
    const move = (this.unitWidth * 600 * delta) / 1000;
    if (this.keys.right.isDown) {
      this.mazeGuy.setVelocityX(move);
      this.mazeGuy.setVelocityY(0);
    }
    else if (this.keys.left.isDown) {
      this.mazeGuy.setVelocityX(-move);
      this.mazeGuy.setVelocityY(0);
    }
    else if (this.keys.down.isDown) {
      this.mazeGuy.setVelocityY(move);
      this.mazeGuy.setVelocityX(0);
    }
    else if (this.keys.up.isDown) {
      this.mazeGuy.setVelocityY(-move);
      this.mazeGuy.setVelocityX(0);
    }
    else {
      this.mazeGuy.setVelocityX(0);
      this.mazeGuy.setVelocityY(0);
    }

    this.updateTimer()


  }

  updateTimer() {
    let tenths = Math.floor((this.time.now - this.startTime) / 100);
    let seconds = Math.floor((tenths) / 10);
    tenths = tenths - (seconds * 10);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    this.displayTime.setText(`${minutes.toString().padStart(2, '0')}:` + 
    `${(seconds).toString().padStart(2, '0')}.` + 
    `${(tenths).toString()}`);
  }






  renderMaze(maze: Maze): number[] {
    const sideLength = this.height;
    const cellsPerSide = maze.size;
    const unitWidth = this.unitWidth;
    const unitsPerSide = (cellsPerSide * 2) + (cellsPerSide + 1);
    const walls = maze.walls;


    //printing hedges according to the walls given - two hedges to border each cell, excluding corners
    let Xloc: number;
    let Yloc: number;
    let col: number; //maxColumns = (columns * 2) + (columns - 1);
    let row: number; //maxRows = (rows * 2) + (row - 1);
    
    let hedgesPrinted = 0;
    //walls[i][0] < walls[i][1] for all i
    for (let i = 0; i < walls.length; i++) {
      if ((walls[i][0] + 1) == walls[i][1]) { //if the wall is |
        col = walls[i][0] % cellsPerSide;
        row = Math.floor(walls[i][0] / cellsPerSide); //the current row

        Xloc = ( 2 + (3 * col) ) * unitWidth;
        

        //this.addHedge(Xloc, Yloc); //an extra one in front, to make all the corners the same
        for (let j = 0; j < 2; j++) { //for adding multiple hedges
          Yloc = ( (3 * row) + j ) * unitWidth;

          this.addHedge(Xloc, Yloc);
          hedgesPrinted++;
        }
      }
      else { //if the wall is __
        row = Math.floor(walls[i][0] / cellsPerSide);
        col = walls[i][0] % cellsPerSide;
        Yloc = ( 2 + (3 * row) ) * unitWidth;
        
        for (let j = 0; j < 2; j++) { //adding two hedges in a row
          Xloc = ( (3 * col) + j) * unitWidth;

          this.addHedge(Xloc, Yloc);
        }  
      }

    }
    console.log("Hedges: " + hedgesPrinted);



    //filling in the corners - all corners should be filled in

    for (let r = 1; r < cellsPerSide; r++) {
      for (let c = 1; c < cellsPerSide; c++) {
        const corner = [ ((3 * c) - 1 ), ((3 * r) - 1 ) ];

        this.addHedge( (corner[0] * unitWidth), (corner[1] * unitWidth) );
      }
    }

    let x: number;
    let y: number;
    let enterX = 0;
    let enterY = 0;
    //maze border
    let entrance = [0,0];
    for (let i = 0; i < unitsPerSide; i++) {
      for (let j = 0; j < unitsPerSide; j++) {
        if (j == 0 || j == unitsPerSide - 1) { //top or bottom
          x = (0 - unitWidth) + (i * unitWidth);
          y = (0 - unitWidth) + (j * unitWidth);
          this.addHedge(x,y);
        }
        else if ( // opening at entrance
          (i == 0 && (j == 1 || j == 2))) {
            enterX = ((0 - unitWidth) + (i * unitWidth)) + ((this.scale.width - this.height) / 2);
            enterY = ((0 - unitWidth) + (j * unitWidth)) + ((this.scale.height - this.height) / 2);
          }
        else if ( //opening at exit
          (i == unitsPerSide - 1 && (j == unitsPerSide - 2 || j== unitsPerSide - 3))) 
          {x = (0 - unitWidth) + (i * unitWidth);
          y = (0 - unitWidth) + (j * unitWidth);
        console.log ('exit' + x + ',' + y);}
        else if (i == 0 || i == unitsPerSide - 1) { //right and left
          x = (0 - unitWidth) + (i * unitWidth);
          y = (0 - unitWidth) + (j * unitWidth);
          entrance = this.addHedge(x,y);
        }
        else {}
      }
    } 
    return [enterX, enterY];

  }

  calculateUnitWidth(maze: Maze): number {

    const unit = this.height / maze.unitsPerSide;
    return unit;
  }

  addHedge(x: number, y: number): number[] {
    let xShift: number; //pixels shifted to the right in the x direction to center the maze
    let yShift: number; //pixels shifted down in the y direction to center the maze

    xShift = ((this.scale.width - this.height) / 2);
    yShift = ((this.scale.height - this.height) / 2);

    //change 1200 to match new hedge image dimensions
    //this.add.image(x + xShift, y + yShift, 'hedge').setOrigin(0,0).setScale(this.unitWidth / 1200); //1200 is the width and height of the hedge
    const wall = this.wallGroup.create(x + xShift, y + yShift, 'hedge')
      .setOrigin(0,0)
      .setScale(this.unitWidth / 1200)
      .refreshBody();
    this.mazeLayer.add(wall);
    return [xShift, yShift];
  }

}
