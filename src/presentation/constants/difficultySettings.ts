import type { GameDifficulty, DifficultyConfig } from '../../domain/entities/Game';

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, DifficultyConfig> = {
  beginner: {
    difficultyName: 'Beginner',
    numberOfRows: 9,
    numberOfColumns: 9,
    mineCount: 10,
  },
  intermediate: {
    difficultyName: 'Intermediate',
    numberOfRows: 16,
    numberOfColumns: 16,
    mineCount: 40,
  },
  expert: {
    difficultyName: 'Expert',
    numberOfRows: 16,
    numberOfColumns: 30,
    mineCount: 99,
  },
};