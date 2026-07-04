import type { Cell, Grid } from '../entities/Cell';

function createCell(): Cell {
  return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    numberOfSurroundingMines: 0,
  };
}

export function createEmptyGrid(
  numberOfRows: number,
  numberOfColumns: number,
): Grid {
  return Array.from({ length: numberOfRows }, () =>
    Array.from({ length: numberOfColumns }, createCell)
  );
}

// Places mines at random positions, skipping the 3×3 safe zone around the first clicked cell.
function placeMinesWithFirstClickSafeZone(
  grid: Grid,
  numberOfRows: number,
  numberOfColumns: number,
  mineCount: number,
  safeRow: number,
  safeColumn: number,
): Grid {
  const result: Grid = grid.map(row => row.map(cell => ({ ...cell })));

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * numberOfRows);
    const col = Math.floor(Math.random() * numberOfColumns);

    const isInsideSafeZone =
      Math.abs(row - safeRow) <= 1 && Math.abs(col - safeColumn) <= 1;

    if (isInsideSafeZone || result[row][col].isMine) continue;

    result[row][col].isMine = true;
    minesPlaced++;
  }

  return result;
}

// Calculates and stores how many mines neighbour each non-mine cell.
function computeAdjacentMineCounts(
  grid: Grid,
  numberOfRows: number,
  numberOfColumns: number,
): Grid {
  const result: Grid = grid.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < numberOfColumns; col++) {
      if (result[row][col].isMine) continue;

      let adjacentMines = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const nr = row + dr;
          const nc = col + dc;

          if (nr >= 0 && nr < numberOfRows && nc >= 0 && nc < numberOfColumns) {
            if (result[nr][nc].isMine) adjacentMines++;
          }
        }
      }
      result[row][col].numberOfSurroundingMines = adjacentMines;
    }
  }

  return result;
}

export function buildGridWithMines(
  emptyGrid: Grid,
  numberOfRows: number,
  numberOfColumns: number,
  mineCount: number,
  safeRow: number,
  safeColumn: number,
): Grid {
  const withMines = placeMinesWithFirstClickSafeZone(
    emptyGrid, numberOfRows, numberOfColumns, mineCount, safeRow, safeColumn,
  );
  return computeAdjacentMineCounts(withMines, numberOfRows, numberOfColumns);
}

export function revealCellsByFloodFill(
  gridSnapshot: Grid,
  startRow: number,
  startColumn: number,
  numberOfRows: number,
  numberOfColumns: number,
): Grid {
  const grid: Grid = gridSnapshot.map(row => row.map(cell => ({ ...cell })));

  const stack: [number, number][] = [[startRow, startColumn]];
  const visited = new Set<string>();
  visited.add(`${startRow},${startColumn}`);

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const cell = grid[row][col];

    if (cell.isFlagged || cell.isRevealed || cell.isMine) continue;

    grid[row][col] = { ...cell, isRevealed: true };

    if (cell.numberOfSurroundingMines === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
          if (rowOffset === 0 && columnOffset === 0) continue;

          const neighborRow = row + rowOffset;
          const neighborColumn = col + columnOffset;

          if (neighborRow < 0 || neighborRow >= numberOfRows || neighborColumn < 0 || neighborColumn >= numberOfColumns) continue;

          const key = `${neighborRow},${neighborColumn}`;
          if (visited.has(key)) continue;

          const neighbor = grid[neighborRow][neighborColumn];
          if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
            stack.push([neighborRow, neighborColumn]);
            visited.add(key);
          }
        }
      }
    }
  }

  return grid;
}

export function hasPlayerWon(grid: Grid, totalMineCount: number): boolean {
  const totalCellCount = grid.length * grid[0].length;
  const revealedCellCount = grid.flat().filter(cell => cell.isRevealed).length;
  return revealedCellCount === totalCellCount - totalMineCount;
}

export function revealAllMines(gridSnapshot: Grid): Grid {
  return gridSnapshot.map(gridRow =>
    gridRow.map(cell => (cell.isMine ? { ...cell, isRevealed: true } : cell))
  );
}

export function markDeathMine(grid: Grid, deathRow: number, deathColumn: number): Grid {
  return grid.map((gridRow, rowIndex) =>
    gridRow.map((cell, colIndex) =>
      rowIndex === deathRow && colIndex === deathColumn
        ? { ...cell, didPlayerClickThisMine: true }
        : cell
    )
  );
}

export function markWrongFlags(grid: Grid): Grid {
  return grid.map(gridRow =>
    gridRow.map(cell =>
      cell.isFlagged && !cell.isMine ? { ...cell, isFlaggedWrong: true } : cell
    )
  );
}

export function toggleFlag(
  grid: Grid,
  row: number,
  col: number,
): { grid: Grid; flagDelta: number } {
  const cell = grid[row][col];
  const cellIsNowFlagged = !cell.isFlagged;
  const updatedGrid = grid.map((gridRow, rowIndex) =>
    gridRow.map((cellInRow, colIndex) =>
      rowIndex === row && colIndex === col
        ? { ...cellInRow, isFlagged: cellIsNowFlagged }
        : cellInRow
    )
  );
  return { grid: updatedGrid, flagDelta: cellIsNowFlagged ? 1 : -1 };
}