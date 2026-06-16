import type { GameDifficulty, GameStatus } from '../../domain/entities/Game';
import { SMILEY_SPRITES, DIGIT_SPRITES, spritesheet } from '../constants/sprites';
import type { SpriteFrame } from '../constants/sprites';

interface HudProps {
  remainingMineCount: number;
  displaySeconds: number;
  gameStatus: GameStatus;
  selectedDifficulty: GameDifficulty;
  onReset: () => void;
}

function getSmileyFrame(gameStatus: GameStatus): SpriteFrame {
  switch (gameStatus) {
    case 'won':
      return SMILEY_SPRITES.won;
    case 'lost':
      return SMILEY_SPRITES.lost;
    default:
      return SMILEY_SPRITES.normal;
  }
}

function SpriteDigit({ digit }: { digit: number }) {
  const key = `timerNumber${digit}` as keyof typeof DIGIT_SPRITES;
  const frame = DIGIT_SPRITES[key];
  return (
    <span
      style={{
        display: 'inline-block',
        width: `${frame.w}px`,
        height: `${frame.h}px`,
        backgroundImage: `url(${spritesheet})`,
        backgroundPosition: `-${frame.x_coordinate}px -${frame.y_coordinate}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}

function DigitDisplay({ value }: { value: number }) {
  const padded = String(value).padStart(3, '0');
  return (
    <div>
      {padded.split('').map((ch, i) => (
        <SpriteDigit key={i} digit={Number(ch)} />
      ))}
    </div>
  );
}

export default function MinesweeperHud({
  remainingMineCount,
  displaySeconds,
  gameStatus,
  onReset,
}: HudProps) {
  const smiley = getSmileyFrame(gameStatus);

  return (
    <div className="flex items-center justify-between mb-3 bg-gray-400 border-2 border-t-gray-500 border-l-gray-500 border-b-gray-100 border-r-gray-100 p-2">
      {/* Mine counter */}
      <DigitDisplay value={remainingMineCount} />

      {/* Smiley / Reset button */}
      <button
        onClick={onReset}
        style={{
          width: `${smiley.w}px`,
          height: `${smiley.h}px`,
          backgroundImage: `url(${spritesheet})`,
          backgroundPosition: `-${smiley.x_coordinate}px -${smiley.y_coordinate}px`,
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          imageRendering: 'pixelated',
        }}
        title="New game"
      />

      {/* Timer */}
      <DigitDisplay value={displaySeconds} />
    </div>
  );
}