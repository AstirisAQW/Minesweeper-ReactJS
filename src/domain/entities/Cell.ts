export interface Cell {
  isThereMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  howManyAdjacentMines: number;
  isDeathMine?: boolean;
  isWrongFlag?: boolean;
}

export type Grid = Cell[][];