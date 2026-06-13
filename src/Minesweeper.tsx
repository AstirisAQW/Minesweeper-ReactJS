import { useState } from 'react'
import './Minesweeper.css'

interface minesweeperCell {
  isThereMine: boolean;
  isRevealed: boolean;
  howManyAdjacentMines: number;
  optional?: string | number;
};

export default function Minesweeper() {
  const minsweeperGridSize = 9;
  const numberOfRows: number = minsweeperGridSize;
  const numberOfColumns: number = minsweeperGridSize;
  let mineCount: number = 20;
  const [grid, setGrid] = useState<minesweeperCell[][]>(() =>
      Array.from({ length: numberOfRows }, () =>
        Array.from({ length: numberOfColumns }, () => ({
            isThereMine: false,
            isRevealed: false,
            howManyAdjacentMines: 0,
        }))
      )
  );

  const [gameStarted, setGameStarted] = useState(false);

  const placeMines = (
    row_thereIsNoMineHere: number, 
    column_thereIsNoMineHere: number
  ) => {
    const gridWithMines = grid.map(
      row => row.map(
        cell => ({ ...cell })
      )
    );
    let minesPlaced = 0; //start with 0 mines
    while (minesPlaced < mineCount) {
      const row_placedMinePosition = Math.floor(Math.random() * numberOfRows);
      const column_placedMinePosition = Math.floor(Math.random() * numberOfColumns);
      // const = isSafeCell = (row_placedMinePosition === row_thereIsNoMineHere && column_placedMinePosition === column_thereIsNoMineHere);
      // const = alreadyHasMine = gridWithMines[row_placedMinePosition][column_placedMinePosition].isThereMine;
      // if (isSafeCell || alreadyHasMine) continue;
      if ((row_placedMinePosition === row_thereIsNoMineHere && column_placedMinePosition === column_thereIsNoMineHere) || gridWithMines[row_placedMinePosition][column_placedMinePosition].isThereMine) continue;
      gridWithMines[row_placedMinePosition][column_placedMinePosition].isThereMine = true;
      minesPlaced++;
    }
    // Calculate mines around each cell
    for (let currentRow = 0; currentRow < numberOfRows; currentRow++) {
      for (let currentColumn = 0; currentColumn < numberOfColumns; currentColumn++) {
        if (gridWithMines[currentRow][currentColumn].isThereMine) continue;
        let count_howManyMinesAroundThisCell = 0;
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
            const ifCellNotNeighbor = (rowOffset === 0 && columnOffset === 0);
            if (ifCellNotNeighbor) continue;
            const neighborRow = currentRow + rowOffset;
            const neighborColumn = currentColumn + columnOffset;
            const isInsideGrid =
              neighborRow >= 0 && neighborRow < numberOfRows &&
              neighborColumn >= 0 && neighborColumn < numberOfColumns;
            if (isInsideGrid && gridWithMines[neighborRow][neighborColumn].isThereMine){
              count_howManyMinesAroundThisCell++
            };
          }
        }
        gridWithMines[currentRow][currentColumn].howManyAdjacentMines = count_howManyMinesAroundThisCell;
      }
    }
    return gridWithMines;
  };

  const handleClick = (clickedRow: number, clickedColumn: number) => {
    const clickedCellAlreadyRevealed = grid[clickedRow][clickedColumn].isRevealed;
    if (clickedCellAlreadyRevealed) return;
    if (!gameStarted) {
      const gridAfterMinesPlaced= placeMines(clickedRow, clickedColumn);
      setGameStarted(true);
      const gridWithFirstCellRevealed = gridAfterMinesPlaced.map(
        (gridRow) => gridRow.map(
          (gridCell) => ({ ...gridCell })
        )
      )
      gridWithFirstCellRevealed[clickedRow][clickedColumn].isRevealed = true;
      setGrid(gridWithFirstCellRevealed);
      setGameStarted(true);
    } else {
      setGrid((previousGrid) => {
        const gridWithNewReveal = previousGrid.map(
          (gridRow) => gridRow.map(
            (gridCell) => ({ ...gridCell })
          )
        );
        gridWithNewReveal[clickedRow][clickedColumn].isRevealed = true;
        return gridWithNewReveal;
      });
    }
  };

  return (
    <div
      className="w-fit mx-auto mt-10 grid"
      style={{ gridTemplateColumns: `repeat(${numberOfColumns}, 2.5rem)` }}
    >
      {grid.map((gridRow, rowIndex) =>
        gridRow.map((gridCell, columnIndex) => (
          <button
            key={`${rowIndex}-${columnIndex}`}
            onClick={() => handleClick(rowIndex, columnIndex)}
            className={`
              w-10 h-10 border-2 border-gray-400
              text-base font-bold cursor-pointer
              ${gridCell.isRevealed ? "bg-gray-300" : "bg-gray-400 hover:bg-gray-500"}
            `}
          >
            {gridCell.isRevealed
              ? (gridCell.isThereMine ? "X" : gridCell.howManyAdjacentMines || "")
              : ""}
          </button>
        ))
      )}
    </div>
  );
}

