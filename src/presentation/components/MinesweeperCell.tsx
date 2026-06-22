import type { Cell } from '../../domain/entities/Cell';
import { CELL_SPRITES, spritesheet } from '../constants/sprites';
import type { SpriteFrame } from '../constants/sprites';

interface CellProps {
  cell: Cell;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

function getCellSprite(cell: Cell): SpriteFrame {
  if (!cell.isRevealed) {
    if (cell.isFlagged) {
      return cell.isFlaggedWrong ? CELL_SPRITES.wrongFlag : CELL_SPRITES.flag;
    }
    return CELL_SPRITES.normalCell;
  }

  if (cell.isMine) {
    return cell.didPlayerClickThisMine ? CELL_SPRITES.explodedMine : CELL_SPRITES.mine;
  }

  if (cell.numberOfSurroundingMines === 0) {
    return CELL_SPRITES.emptyCell;
  }

  return CELL_SPRITES[`number${cell.numberOfSurroundingMines}` as keyof typeof CELL_SPRITES];
}

export default function MinesweeperCell({ cell, onClick, onContextMenu }: CellProps) {
  const frame = getCellSprite(cell);

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        width: `${frame.w}px`,
        height: `${frame.h}px`,
        backgroundImage: `url(${spritesheet})`,
        backgroundPosition: `-${frame.x_coordinate}px -${frame.y_coordinate}px`,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        imageRendering: 'pixelated',
      }}
    />
  );
}