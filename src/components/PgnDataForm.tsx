import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PgnDataFormProps {
  pgnHeaders: { [key: string]: string };
  setPgnHeaders: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export default function PgnDataForm({ pgnHeaders, setPgnHeaders }: PgnDataFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPgnHeaders({ ...pgnHeaders, [name]: value });
  };

  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-bold text-base flex items-center gap-2 text-gray-900 mb-1"
        type="button"
      >
        {isOpen ? <ChevronDown className="inline w-5 h-5 transition-transform" /> : <ChevronRight className="inline w-5 h-5 transition-transform" />}
        PGN Metadata
      </button>
      {isOpen && (
        <form className="space-y-2 mt-2">
          <div>
            <label htmlFor="Event" className="block text-xs font-bold text-gray-800">Event</label>
            <input type="text" name="Event" id="Event" value={pgnHeaders.Event || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="Round" className="block text-xs font-bold text-gray-800">Round</label>
              <input type="text" name="Round" id="Round" value={pgnHeaders.Round || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
            <div>
              <label htmlFor="Date" className="block text-xs font-bold text-gray-800">Date</label>
              <input type="text" name="Date" id="Date" value={pgnHeaders.Date || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
          </div>
          <div>
            <label htmlFor="Site" className="block text-xs font-bold text-gray-800">Site</label>
            <input type="text" name="Site" id="Site" value={pgnHeaders.Site || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="White" className="block text-xs font-bold text-gray-800">White</label>
              <input type="text" name="White" id="White" value={pgnHeaders.White || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
            <div>
              <label htmlFor="WhiteElo" className="block text-xs font-bold text-gray-800">White ELO</label>
              <input type="text" name="WhiteElo" id="WhiteElo" value={pgnHeaders.WhiteElo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="Black" className="block text-xs font-bold text-gray-800">Black</label>
              <input type="text" name="Black" id="Black" value={pgnHeaders.Black || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
            <div>
              <label htmlFor="BlackElo" className="block text-xs font-bold text-gray-800">Black ELO</label>
              <input type="text" name="BlackElo" id="BlackElo" value={pgnHeaders.BlackElo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2" />
            </div>
          </div>
          <div>
            <label htmlFor="Result" className="block text-xs font-bold text-gray-800">Result</label>
            <select name="Result" id="Result" value={pgnHeaders.Result || '*'} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 px-3 py-2">
              <option value="*">*</option>
              <option value="1-0">1-0</option>
              <option value="0-1">0-1</option>
              <option value="1/2-1/2">1/2-1/2</option>
            </select>
          </div>
        </form>
      )}
    </div>
  );
}
