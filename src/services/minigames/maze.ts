// Reads all rows from the demo_messages table.
export type Maze = {
  width: number;
  height: number;
  cells: boolean[][];
};

export function generateMaze(): Maze {
  const data: Maze = {
    width: 10,
    height: 10,
    cells: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => false)),
  };

  return data;
}

declare global {
  interface Window {
    generateMaze: typeof generateMaze;
  }
}

export function installMaze() {
  window.generateMaze = generateMaze;
}
