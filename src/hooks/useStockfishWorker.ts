import { useEffect, useRef, useState, useCallback } from 'react';
import { StockfishWorker } from '../utils/stockfish-worker';

export function useStockfishWorker() {
  const workerRef = useRef<StockfishWorker | null>(null);
  const [evaluation, setEvaluation] = useState<string>('');
  const [pvLines, setPvLines] = useState<Array<{ cp: number | null, mate: number | null, moves: string[], san: string }>>([]);
  const [bestLine, setBestLine] = useState<{ cp: number | null, mate: number | null, moves: string[], san: string } | null>(null);

  useEffect(() => {
    workerRef.current = new StockfishWorker();
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const analyzeBoard = useCallback((fen: string) => {
    console.log("analyzeBoard", fen, workerRef.current);
    if (!workerRef.current) return;
    let pvMap: { [key: string]: { moves: string[], cp: number | null, mate: number | null } } = {};
    const turn = fen.split(' ')[1]; // 'w' or 'b'
    workerRef.current.analyze(
      fen,
      (info) => {
        // Debug log
        console.log('[useStockfishWorker] info:', info);
        // Parse evaluation
        let cp: number | null = null;
        let mate: number | null = null;
        const scoreMatch = info.match(/score (cp|mate) (-?\d+)/);
        if (scoreMatch) {
          const type = scoreMatch[1];
          let value = parseInt(scoreMatch[2], 10);
          // Always show evaluation from white's perspective
          if (type === 'cp' && turn === 'b') value = -value;
          if (type === 'cp') cp = value;
          if (type === 'mate') mate = value;
          const centipawns = type === 'cp' ? value : (value > 0 ? Infinity : -Infinity);
          setEvaluation(
            type === 'mate'
              ? `Mate in ${Math.abs(value)}`
              : `${(centipawns / 100).toFixed(2)}`
          );
        }
        // Parse PV lines
        const pvMatch = info.match(/multipv (\d+).* pv (.+)/);
        if (pvMatch) {
          const idx = parseInt(pvMatch[1], 10) - 1;
          const moves = pvMatch[2].trim().split(' ');
          // Convert moves to SAN using chess.js
          let sanMoves: string[] = [];
          let fenForLine = fen;
          try {
            const { Chess } = require('chess.js');
            const chess = new Chess(fenForLine);
            moves.forEach(m => {
              const moveObj = chess.move(m, { sloppy: true });
              if (moveObj) sanMoves.push(moveObj.san);
            });
          } catch (e) {}
          pvMap[idx] = { moves, cp, mate };
          // Update PV lines: keep only top 4 by score, and always from white's perspective
          const pvArray = Object.keys(pvMap)
            .map(k => {
              const pv = pvMap[parseInt(k)];
              let sanMoves: string[] = [];
              let fenForLine = fen;
              try {
                const { Chess } = require('chess.js');
                const chess = new Chess(fenForLine);
                pv.moves.forEach(m => {
                  const moveObj = chess.move(m, { sloppy: true });
                  if (moveObj) sanMoves.push(moveObj.san);
                });
              } catch (e) {}
              // Reverse cp for black to move
              let cpValue = pv.cp;
              if (cpValue !== null && turn === 'b') cpValue = -cpValue;
              return { cp: cpValue, mate: pv.mate, moves: pv.moves, san: sanMoves.join(' ') };
            })
            .filter(line => line.cp !== null || line.mate !== null)
            .sort((a, b) => {
              // Sort by best score (mate first, then cp descending)
              if (a.mate !== null && b.mate !== null) {
                return Math.abs(a.mate) - Math.abs(b.mate);
              } else if (a.mate !== null) {
                return -1;
              } else if (b.mate !== null) {
                return 1;
              } else {
                return (b.cp ?? 0) - (a.cp ?? 0);
              }
            })
            .slice(0, 4);
          setPvLines(pvArray);
          setBestLine(pvArray.length > 0 ? pvArray[0] : null);
        }
      },
      (bestmove) => {
        // Debug log
        console.log('[useStockfishWorker] bestmove:', bestmove);
      }
    );
  }, []);

  return { evaluation, pvLines, bestLine, analyzeBoard };
} 