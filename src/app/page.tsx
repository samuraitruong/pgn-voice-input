"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from 'lucide-react';

function EngineAnalysisPanel({ pvLines }: { pvLines: any }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-semibold text-base flex items-center gap-2 text-gray-800 py-1 px-2 select-none"
        type="button"
      >
        {isOpen ? <ChevronDown className="inline w-5 h-5 transition-transform" /> : <ChevronRight className="inline w-5 h-5 transition-transform" />}
        Engine analysis
      </button>
      {isOpen && (
        <div
          className="px-3 pb-2 pt-1"
          style={{ width: '100%', maxHeight: '120px', overflowY: 'auto' }}
        >
          <BestMoves pvLines={pvLines} />
        </div>
      )}
    </div>
  );
}
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import PgnDataForm from "../components/PgnDataForm";
import MoveList from "../components/MoveList";
import Controls from "../components/Controls";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useStockfishWorker } from '../hooks/useStockfishWorker';
import EvaluationBar from "../components/EvaluationBar";
import BestMoves from "../components/BestMoves";
import { translateSpokenMove } from "../utils/voice-parser";

export default function Home() {
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(400);

  useEffect(() => {
    function handleResize() {
      if (boardContainerRef.current) {
        const width = boardContainerRef.current.offsetWidth;
        setBoardWidth(Math.max(320, Math.min(width - 40, 700)));
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pgnHeaders, setPgnHeaders] = useState<{ [key: string]: string }>({
    Event: "Chess Game",
    Site: "Local",
    Date: new Date().toISOString().slice(0, 10),
    Round: "1",
    White: "White",
    Black: "Black",
    WhiteElo: "",
    BlackElo: "",
    Result: "*",
  });
  const [selectedMove, setSelectedMove] = useState(-1);
  const [translatedMove, setTranslatedMove] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const { evaluation, pvLines, bestLine, analyzeBoard } = useStockfishWorker();

  // const turn = game.turn(); // 'w' or 'b'

  useEffect(() => {
    analyzeBoard(game.fen());
  }, [game, analyzeBoard, resetTranscript]);

  useEffect(() => {
    if (transcript) {
      const move = translateSpokenMove(transcript);
      setTranslatedMove(move);
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());

      try {
        const result = gameCopy.move(move);
        if (result) {
          setGame(gameCopy);
          setFen(gameCopy.fen());
          setSelectedMove(gameCopy.history().length - 1);
          analyzeBoard(gameCopy.fen());
          resetTranscript();
        }
      } catch {
        // Ignore invalid moves
      }
    }
  }, [transcript, analyzeBoard, resetTranscript, game]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <span className="mb-4 animate-spin inline-block">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </span>
        <span className="text-lg font-semibold text-gray-700 text-center">Browser does not support speech recognition.</span>
      </div>
    );
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());

    try {
      const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      };

      const result = gameCopy.move(move);

      if (result) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setSelectedMove(gameCopy.history().length - 1);
        analyzeBoard(gameCopy.fen());
        return true;
      }
      return false; // move is illegal
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const handleClear = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setSelectedMove(-1);
    resetTranscript();
    analyzeBoard(newGame.fen());
    // Optionally, restart listening if it was active
    if (listening) {
      SpeechRecognition.stopListening();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleDownload = () => {
    // Create a new Chess instance and load all moves
    const newGame = new Chess();
    newGame.header(...Object.entries(pgnHeaders).flat());
    game.history().forEach(move => newGame.move(move));
    const pgn = newGame.pgn();
    const blob = new Blob([pgn], { type: "text/pgn" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pgnHeaders.Event || 'game'}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleMicToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  }

  const handleSelectMove = (moveIndex: number) => {
    // Only update FEN and selectedMove, do not mutate game state
    const moves = game.history();
    const tempGame = new Chess();
    moves.slice(0, moveIndex + 1).forEach(move => tempGame.move(move));
    setFen(tempGame.fen());
    setSelectedMove(moveIndex);
    analyzeBoard(tempGame.fen());
  };

  const handleDeleteMove = (moveIndex: number) => {
    const newGame = new Chess();
    const moves = game.history().slice(0, moveIndex);
    moves.forEach(move => newGame.move(move));
    setGame(newGame);
    setFen(newGame.fen());
    setSelectedMove(moves.length - 1);
    analyzeBoard(newGame.fen());
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="w-full md:w-2/3 p-4 relative">
        <div ref={boardContainerRef} className="w-full flex flex-row items-center gap-4" style={{ minHeight: '320px' }}>
          <div style={{ height: boardWidth + 'px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EvaluationBar
              evaluation={
                bestLine
                  ? (bestLine.mate !== null
                    ? `Mate in ${Math.abs(bestLine.mate)}`
                    : bestLine.cp !== null
                      ? (bestLine.cp / 100).toFixed(2)
                      : evaluation)
                  : evaluation
              }
              style={{ transform: 'rotate(-90deg)', width: boardWidth + 'px', height: '32px' }}
            />
          </div>
          <div style={{ height: boardWidth + 'px', width: boardWidth + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 bg-white p-4 border-l">
        <div className="space-y-4">
          <PgnDataForm pgnHeaders={pgnHeaders} setPgnHeaders={setPgnHeaders} />
          <div className="border rounded-md bg-gray-50">
            <EngineAnalysisPanel pvLines={pvLines} />
          </div>
          <MoveList
            moves={game.history()}
            selectedMove={selectedMove}
            onSelectMove={handleSelectMove}
            onDeleteMove={handleDeleteMove}
          />
          <Controls onDownload={handleDownload} onMicToggle={handleMicToggle} isListening={listening} onClear={handleClear} />
          <div className="mt-4 p-2 border rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">Transcript: {transcript || "..."}</p>
          </div>
          <div className="mt-4">
            <label htmlFor="translated-move" className="block text-xs font-bold text-gray-800">Translated Move</label>
            <input
              id="translated-move"
              type="text"
              readOnly
              value={translatedMove}
              className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 bg-gray-100 shadow-sm sm:text-sm h-9 px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
