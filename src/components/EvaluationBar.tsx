import React from 'react';

interface EvaluationBarProps {
  evaluation: string;
  vertical?: boolean;
  bestMove?: string;
  style?: React.CSSProperties;
}

export default function EvaluationBar({ evaluation, vertical, bestMove, style }: EvaluationBarProps) {
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

  return (
    <div className="absolute bg-gray-700 rounded-md overflow-hidden w-full h-8" style={typeof style === 'object' ? style : {}}>
      <div
        className="h-full bg-white transition-all duration-300"
        style={getBarStyle()}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-semibold mix-blend-difference">{evaluation}</span>
      </div>
    </div>
  );
}