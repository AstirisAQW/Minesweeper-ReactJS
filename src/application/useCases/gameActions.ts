import type { Grid } from '../../domain/entities/Cell';
import type { GameDifficulty, GameStatus } from '../../domain/entities/Game';
import { DIFFICULTY_SETTINGS } from '../../presentation/constants/difficultySettings';
import {
  createEmptyGrid,
  buildGridWithMines,
  revealCellsByFloodFill,
  hasPlayerWon,
  revealAllMines,
  markDeathMine,
  markWrongFlags,
  toggleFlag,
} from '../../domain/services/gridService';

export interface RevealCellResult {
  grid: Grid;
  nextStatus: GameStatus;
  shouldStartTimer: boolean;
}

export function startNewGameAction(difficulty: GameDifficulty): Grid {
  const { numberOfRows, numberOfColumns } = DIFFICULTY_SETTINGS[difficulty];
  return createEmptyGrid(numberOfRows, numberOfColumns);
}

export function revealCellAction(
  grid: Grid,
  clickedRow: number,
  clickedColumn: number,
  currentStatus: GameStatus,
  difficulty: GameDifficulty,
): RevealCellResult {
  const { numberOfRows, numberOfColumns, numberOfMines } = DIFFICULTY_SETTINGS[difficulty];
  const clickedCell = grid[clickedRow][clickedColumn];

  if (clickedCell.isRevealed || clickedCell.isFlagged) {
    return { grid, nextStatus: currentStatus, shouldStartTimer: false };
  }

  // First click: safe mine placement + flood fill
  if (currentStatus === 'idle') {
    const withMines = buildGridWithMines(grid, numberOfRows, numberOfColumns, numberOfMines, clickedRow, clickedColumn);
    const revealed = revealCellsByFloodFill(withMines, clickedRow, clickedColumn, numberOfRows, numberOfColumns);
    const won = hasPlayerWon(revealed, numberOfMines);
    return { grid: revealed, nextStatus: won ? 'won' : 'playing', shouldStartTimer: true };
  }

  // Hit a mine
  if (clickedCell.isMine) {
    const allMinesRevealed = revealAllMines(grid);
    const withDeath = markDeathMine(allMinesRevealed, clickedRow, clickedColumn);
    const withWrongFlags = markWrongFlags(withDeath);
    return { grid: withWrongFlags, nextStatus: 'lost', shouldStartTimer: false };
  }

  // Safe cell reveal
  const revealed = revealCellsByFloodFill(grid, clickedRow, clickedColumn, numberOfRows, numberOfColumns);
  const won = hasPlayerWon(revealed, numberOfMines);
  return { grid: revealed, nextStatus: won ? 'won' : currentStatus, shouldStartTimer: false };
}

export function flagCellAction(
  grid: Grid,
  row: number,
  col: number,
): ReturnType<typeof toggleFlag> {
  return toggleFlag(grid, row, col);
}