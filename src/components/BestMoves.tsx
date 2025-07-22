import React from 'react';

interface BestMovesProps {
  pvLines: Array<{ cp: number | null, mate: number | null, moves: string[], san: string }>;
}

export default function BestMoves({ pvLines }: BestMovesProps) {
  return (
    <div className="mt-4">
      <div className="mt-2 flex flex-col gap-1">
        {pvLines.map((line, idx) => (
          <span
            key={idx}
            className="font-mono text-xs text-black"
            style={{ letterSpacing: '0.5px' }}
          >
            <span className="font-bold">
              {line.mate !== null
                ? `#${Math.abs(line.mate)} `
                : line.cp !== null
                  ? `${(line.cp / 100).toFixed(2)} `
                  : ''}
            </span>
            {line.san}
          </span>
        ))}
      </div>
    </div>
  );
}