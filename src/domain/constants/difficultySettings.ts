import type { GameDifficulty, MinesweeperGame} from '../entities/Game';

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, MinesweeperGame> = {
  beginner: {
    gameDifficulty: 'Beginner',
    numberOfRows: 9,
    numberOfColumns: 9,
    numberOfMines: 10,
  },
  intermediate: {
    gameDifficulty: 'Intermediate',
    numberOfRows: 16,
    numberOfColumns: 16,
    numberOfMines: 40,
  },
  expert: {
    gameDifficulty: 'Expert',
    numberOfRows: 16,
    numberOfColumns: 30,
    numberOfMines: 99,
  },
};