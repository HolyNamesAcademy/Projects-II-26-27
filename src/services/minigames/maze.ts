


export type Maze = {
  width: number;
  height: number;
  cells: number[][];
  walls: number[][];
}

// Reads all rows from the demo_messages table.
export async function generateMaze(): Promise<Maze> {
  const width = 10;
  const height = 10;

  const data: Maze = {
    width: width,
    height: height,
    cells: Array.from({ length: width * height }, () => [0]),
    walls: []
  }

  for (let i = 0; i < data.cells.length; i++) { //filling cells with numbers
    data.cells[i] = [i];
  }


  //filling initial walls
  let initialWalls = fillInitialWalls(height, width);

  while (initialWalls.length > 0) {
    const randomWall = initialWalls[Math.floor(Math.random() * initialWalls.length)];
    //console.log("Wall: " randomwall);

    const inSet = searchForSet(randomWall, data); //true if the walls are in the same set
  
    if (inSet == true) { //the cells by the wall are in the same set, move wall to walls
      data.walls.push(randomWall);
      initialWalls.splice(initialWalls.indexOf(randomWall), 1);
    }
    else { //if the cells are not in the same set, remove the wall and merge the cells
      mergeCells(randomWall, data);
      initialWalls.splice(initialWalls.indexOf(randomWall), 1);
    }
  }

  //console.log(data.cells);
  //console.log(data.walls);

  return data;
}

//fills the array of initial walls with all possible walls
function fillInitialWalls(height : number, width : number) {
  let walls = [];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const current = (width * j) + i;
      if (i < width - 1) {
        walls.push([current, current + 1]);
      }

      if (j < height - 1) {
        walls.push([current, (width * (j + 1)) + i]);
      }
    }
  }
  
  return walls;
}

//checks if the cells in a wall are in the same set
function searchForSet(set : number[], data : Maze) { //determine if cells on either side of a wall are in the same set
  const first = set[0];
  const second = set[1];
  for (let i = 0; i < data.cells.length; i++) {
    const set = data.cells[i]; //the set

    if (set.indexOf(first) != -1){ //if the set contains the first number, search for the second
      for (let j = 0; j < set.length; j++) {
        if (set[j] == second) {
          return true; //first and second numbers are in the set
        }
      }
    }
  }
  return false;
}

//merges two cells into one
function mergeCells(wall : number[], data : Maze) { //merge the cells when a wall is removed
  const first = wall[0];
  const second = wall[1];
  let firstIndex = 0;
  let secondIndex = 0;

  //finding index of the first cell
  for (let i = 0; i < data.cells.length; i++) {
    if (data.cells[i].indexOf(first) != -1) {
      firstIndex = i;
    }
  }
  //finding index of the second cell
  for (let j = 0; j < data.cells.length; j++) {
    if (data.cells[j].indexOf(second) != -1) {
      secondIndex = j;
    }
  }

  //putting second cell into the first one
  const secondCell = data.cells[secondIndex];

  for (let k = 0; k < secondCell.length; k++) { //moving each number from the second cell to the first
    data.cells[firstIndex].push(secondCell[k]);
  }

  data.cells.splice(secondIndex, 1); //removing second cell

}




declare global {
  interface Window {
    generateMaze: typeof generateMaze;
  }
}

window.generateMaze = generateMaze;
