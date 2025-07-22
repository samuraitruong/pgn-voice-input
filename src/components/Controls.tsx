import React from 'react';
import { Download, Mic, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onDownload: () => void;
  onMicToggle: () => void;
  isListening: boolean;
  onClear: () => void;
}

export default function Controls({ onDownload, onMicToggle, isListening, onClear }: ControlsProps) {
  return (
    <div className="mt-4 flex space-x-2">
      <button
        onClick={onClear}
        className="p-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
      >
        <RotateCcw size={20} />
      </button>
      <button
        onClick={onDownload}
        className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        <Download size={20} />
      </button>
      <button
        onClick={onMicToggle}
        className={`p-2 rounded-md text-white ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
      >
        <Mic size={20} />
      </button>
    </div>
  );
}
