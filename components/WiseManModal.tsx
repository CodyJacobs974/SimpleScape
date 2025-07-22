import React, { useState } from 'react';
import { getWiseManResponse } from '../services/geminiService';
import { GameAction } from '../types';

interface WiseManModalProps {
  onClose: () => void;
  isLoading: boolean;
  response: string;
  dispatch: React.Dispatch<GameAction>;
}

const WiseManModal: React.FC<WiseManModalProps> = ({ onClose, isLoading, response, dispatch }) => {
  const [prompt, setPrompt] = useState('');

  const handleAsk = async () => {
    if (!prompt.trim() || isLoading) return;
    dispatch({ type: 'SET_WISE_MAN_LOADING', payload: true });
    dispatch({ type: 'SET_WISE_MAN_RESPONSE', payload: '' });
    const res = await getWiseManResponse(prompt);
    dispatch({ type: 'SET_WISE_MAN_RESPONSE', payload: res });
    dispatch({ type: 'SET_WISE_MAN_LOADING', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2e2b23] border-2 border-[#1a1814] w-full max-w-lg p-6 relative text-orange-100">
        <button onClick={onClose} className="absolute top-2 right-3 text-3xl font-bold text-orange-400 hover:text-white">&times;</button>
        <h2 className="text-3xl font-bold text-center mb-4 text-orange-400" style={{ textShadow: '2px 2px 2px #000' }}>
          Wise Old Man
        </h2>
        <div className="bg-black/50 p-4 min-h-[100px] mb-4 border border-black">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
                </div>
            ) : (
                <p className="italic">{response || "Ask me a question, adventurer..."}</p>
            )}
        </div>
        <div className="flex gap-2">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="e.g., How do I get stronger?"
                className="flex-grow bg-[#3a352d] border-2 border-[#1a1814] p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
            />
            <button
                onClick={handleAsk}
                disabled={isLoading}
                className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 px-4 border-b-2 border-stone-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                Ask
            </button>
        </div>
      </div>
    </div>
  );
};

export default WiseManModal;
