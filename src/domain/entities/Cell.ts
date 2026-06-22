export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  numberOfSurroundingMines: number;
  didPlayerClickThisMine?: boolean;
  isFlaggedWrong?: boolean; // flagged by player, but revealed when game ends
}

export type Grid = Cell[][];