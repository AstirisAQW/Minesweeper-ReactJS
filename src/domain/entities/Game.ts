export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type GameDifficulty = 'beginner' | 'intermediate' | 'expert';

export interface MinesweeperGame{
  gameDifficulty: string;
  numberOfRows: number;
  numberOfColumns: number;
  numberOfMines: number;
}