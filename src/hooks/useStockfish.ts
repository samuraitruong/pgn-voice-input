import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    Stockfish: () => Promise<StockfishInstance>;
  }
}

interface StockfishInstance {
  onmessage: (callback: (message: string) => void) => void;
  postMessage: (message: string) => void;
}

export function useStockfish() {
  const [engine, setEngine] = useState<StockfishInstance | null>(null);
  const [evaluation, setEvaluation] = useState<string>('');
  const [bestMoves, setBestMoves] = useState<string[]>([]);
  useEffect(() => {
    if (window.Stockfish) {
      window.Stockfish().then(sf => {
        sf.onmessage((message) => {
          if (typeof message !== 'string') return;

          if (message.startsWith('info depth')) {
            const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
            if (scoreMatch) {
              const type = scoreMatch[1];
              const value = parseInt(scoreMatch[2], 10);
              const centipawns = type === 'cp' ? value : (value > 0 ? Infinity : -Infinity);
              setEvaluation(
                type === 'mate'
                  ? `Mate in ${Math.abs(value)}`
                  : `${(centipawns / 100).toFixed(2)}`
              );
            }
          }

          if (message.startsWith('bestmove')) {
            const bestMove = message.split(' ')[1];
            if (bestMove) {
              setBestMoves(prev => [...prev, bestMove].slice(-4));
            }
          }
        });
        setEngine(sf);

        return () => {
          sf.postMessage('quit');
        };
      });
    }
  }, []);

  const analyzeBoard = useCallback((fen: string) => {
    if (engine) {
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage('go depth 15');
    }
  }, [engine]);

  return { evaluation, bestMoves, analyzeBoard, engine };
} 