import React from 'react';
import { Trash2 } from 'lucide-react';

interface MoveListProps {
  moves: string[];
  selectedMove: number;
  onSelectMove: (moveIndex: number) => void;
  onDeleteMove: (moveIndex: number) => void;
}

export default function MoveList({ moves, selectedMove, onSelectMove, onDeleteMove }: MoveListProps) {
  const movePairs: [string, string | null][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1] || null]);
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold text-gray-900">Moves</h3>
      <div className="mt-2 h-64 overflow-y-auto border rounded-md p-2">
        <table className="w-full">
          <tbody>
            {movePairs.map((pair, index) => (
              <tr key={`move-${index}`}>
                <td className="w-8 pr-2 text-right text-gray-500">{index + 1}.</td>
                <td
                  className={`p-1 cursor-pointer rounded-md text-gray-900 ${selectedMove === index * 2 ? 'bg-blue-200' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectMove(index * 2);
                  }}
                >
                  {pair[0]}
                </td>
                <td
                  className={`p-1 cursor-pointer rounded-md text-gray-900 ${selectedMove === index * 2 + 1 ? 'bg-blue-200' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (pair[1]) onSelectMove(index * 2 + 1);
                  }}
                >
                  {pair[1]}
                </td>
                <td className="w-8 pl-2">
                  <button onClick={() => onDeleteMove(index * 2 + (pair[1] ? 1 : 0))} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
