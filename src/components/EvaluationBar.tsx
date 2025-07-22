import React from 'react';

interface EvaluationBarProps {
  evaluation: string;
  vertical?: boolean;
  // bestMove?: string;
  style?: React.CSSProperties;
}

export default function EvaluationBar({ evaluation, vertical, style, vertical: isVertical }: EvaluationBarProps) {
  const getBarStyle = () => {
    if (vertical) {
      // Vertical bar: height is percentage, width is fixed
      if (evaluation.startsWith('Mate')) {
        return { height: evaluation.includes('-') ? '0%' : '100%', width: '100%' };
      }
      const evalValue = parseFloat(evaluation);
      const percentage = 50 + evalValue * 10;
      return { height: `${Math.max(0, Math.min(100, percentage))}%`, width: '100%' };
    } else {
      // Horizontal bar: width is percentage, height is fixed
      if (evaluation.startsWith('Mate')) {
        return { width: evaluation.includes('-') ? '0%' : '100%', height: '100%' };
      }
      const evalValue = parseFloat(evaluation);
      const percentage = 50 + evalValue * 10;
      return { width: `${Math.max(0, Math.min(100, percentage))}%`, height: '100%' };
    }
  };

  // Determine position and rotation for evaluation number
  let evalValue = 0;
  if (evaluation.startsWith('Mate')) {
    evalValue = evaluation.includes('-') ? -1 : 1;
  } else {
    evalValue = parseFloat(evaluation);
  }
  const isWhiteWinning = evalValue >= 0;

  return (
    <div className="absolute bg-gray-700 rounded-md overflow-hidden w-full h-8" style={typeof style === 'object' ? style : {}}>
      <div
        className="h-full bg-white transition-all duration-300 relative"
        style={getBarStyle()}
      ></div>
      {/* Evaluation number at bottom or top, horizontal */}
      {isWhiteWinning ? (
        <div className="absolute bottom-0 left-0 p-2 w-full flex  items-end" style={{ height: '24px' }}>
          <span className="text-red-500 font-bold text-sm text-[8px]" style={{ transform: 'rotate(90deg)' }}>{evaluation}</span>
        </div>
      ) : (
        <div className="absolute top-0 left-0 w-full flex p-2 items-start" style={{ height: '24px' }}>
          <span className="text-red-500 font-bold text-[8px]" style={{ transform: 'rotate(90deg)' }}>{evaluation}</span>
        </div>
      )}
    </div>
  );
}